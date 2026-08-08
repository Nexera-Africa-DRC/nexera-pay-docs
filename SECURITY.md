# Sécurité Nexera Pay

## Modèle de menaces adressé

| Menace | Mitigation |
|---|---|
| Vol de clé API | Bearer + HMAC signature obligatoire — clé seule ne suffit pas |
| Replay attack | `X-Timestamp` ±5 min + signature liée au timestamp |
| Double débit (double clic marchand) | `Idempotency-Key` obligatoire sur POST /payments, dédupe 24h |
| Brute-force signature | Rate limit 100 req/min/api_key, alerte >10 sig invalides/min |
| Man-in-the-middle | TLS 1.3 + HSTS preload + certificate pinning côté SDK |
| Injection SQL | Pydantic strict + SQLAlchemy paramétré, jamais de raw SQL avec user input |
| Injection JSON (bomb) | Body max 100 KB, max 20 clés metadata, valeurs max 500 chars |
| CSRF | Pas de cookies sur l'API publique. Dashboard admin séparé avec token CSRF |
| Enumeration IDs | UUID v4 partout, jamais séquentiels |
| Timing attack sur secrets | `hmac.compare_digest`, réponses 401 uniformes |
| DDoS | Cloudflare WAF + rate limit L7 nginx + rate limit L7 app |
| PAN carte volé | Jamais stocké (tokenization Cybersource, PCI DSS SAQ-A) |
| Master key compromise | Fernet key isolée dans secret manager, rotation prévue |
| DB dump compromise | Secrets marchands chiffrés (Fernet), séparés dans table dédiée |
| Webhook replay chez marchand | Signature Stripe-style (t=ts,v1=sig), marchand vérifie timestamp |
| Provider down cascade | Circuit breaker 30s après 50% erreurs 1min, fail-fast |
| Marchand webhook down | Retry exponentiel 8 attempts, DLQ, circuit breaker 1h après 20 échecs |

## Auth marchand — flow détaillé

```
POST /v1/payments HTTP/1.1
Host: pay.nexera.africa
Authorization: Bearer nex_live_a1b2c3d4...
X-Signature: sha256=e7f8...
X-Timestamp: 1786200000
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json
Content-Length: 234

{ "amount": 10000, ... }
```

Serveur exécute dans l'ordre :

1. `Content-Length > 100 KB` → 413 immédiat (avant lire body)
2. `Bearer` présent → sinon 401 auth-required
3. Lookup credential par `api_key` (index unique) → sinon 401 api-key-invalid
4. IP client dans allowlist si configurée → sinon 403 ip-not-allowed
5. Merchant status = ACTIVE → sinon 403 merchant-suspended
6. Rate limit (INCR Redis clé bucket minute) → sinon 429 rate-limit-exceeded
7. `X-Timestamp` présent et |now-ts| < 5min → sinon 401 timestamp-expired
8. Signature = `sha256=HMAC(secret, ts.method.path.body)` (constant-time compare) → sinon 401 signature-invalid
9. Idempotency (POST /payments|/payouts) : si `Idempotency-Key` déjà vu → check request_hash match, sinon 409 idempotency-conflict, si match → return cached response
10. Traitement route

## Chiffrement du secret marchand

Le secret doit être re-comparé au runtime avec HMAC (bcrypt one-way ne permet pas la vérif signature). Solution :

- Table `credential_encrypted_secrets` séparée (principe de moindre privilège au niveau DB row)
- Chiffrement **Fernet** (AES-128-CBC + HMAC-SHA256) avec clé maîtresse dans env `FERNET_MASTER_KEY`
- En prod : clé maîtresse dans secret manager (Vault, AWS Secrets Manager, GCP Secret Manager)
- Rotation : dual-key support planifié (Phase 4)
- Cache mémoire process (invalidé à chaque restart) pour éviter round-trip DB par requête

Un attaquant a besoin de **3 choses** pour usurper une identité marchand :
- Dump de `merchant_credentials`
- Dump de `credential_encrypted_secrets`
- Accès au `FERNET_MASTER_KEY`

## Logs

- JSON structured (Loki-compatible)
- Redaction automatique : PAN → `123456******1234`, MSISDN → `243***45678`, email → `x***@x.xx`
- Aucun secret / API key / body jamais loggé
- Correlation ID (`X-Request-Id`) propagé partout
- Rétention : 90 jours logs, 10 ans transactions (obligation légale)

## Headers HTTP sécurité (defense-in-depth)

App + Nginx :
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: no-referrer`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`
- `Server: Nexera` (masquage version uvicorn)

## Container

- Non-root user (`uid=10001`)
- `read_only: true` filesystem (sauf `/tmp` en tmpfs)
- `no-new-privileges: true`
- Réseau Docker interne (pas d'exposition directe, Nginx en front)

## Réponse incident

- **Compromission suspectée api_key** : révocation immédiate via admin `POST /admin/credentials/{id}/revoke`, grace period 7 jours nouvelle clé
- **Compromission secret marchand** : rotation Fernet master key (dual-key), re-chiffrement batch
- **Attaque DDoS** : Cloudflare "Under Attack" mode activable en 1 clic
- **Bug critique** : Feature flag global `MAINTENANCE_MODE` → renvoie 503 avec `Retry-After`
