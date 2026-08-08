# Erreurs

Nexera Pay retourne toutes ses erreurs au format **RFC 7807** (`application/problem+json`).

## Format

```json
{
  "type": "/errors/signature-invalid",
  "title": "Signature invalide",
  "status": 401,
  "detail": "Le HMAC calculé ne correspond pas — vérifie ton secret + timestamp.",
  "instance": "/v1/payments",
  "request_id": "abc-123-def-456"
}
```

Le `request_id` est aussi renvoyé en header `X-Request-Id`. Fournis-le en support pour investigation rapide.

## Codes HTTP

| Code | Signification |
|---|---|
| `400` | Body invalide, contrainte métier violée |
| `401` | Auth manquante / api_key invalide / signature invalide / timestamp expiré |
| `403` | Scope insuffisant / IP non allowlist / marchand suspendu |
| `404` | Resource introuvable |
| `409` | Idempotency conflict (même key, body différent) |
| `413` | Body > 100 KB |
| `422` | Validation Pydantic (types, formats) |
| `429` | Rate limit (100 req/min/api_key) |
| `500` | Bug côté Nexera — reporte le `request_id` |
| `502` | Provider (Moko/Cybersource) timeout ou erreur |
| `503` | Nexera en maintenance ou provider down (voir `Retry-After`) |

## Types d'erreurs standards

| `type` | Description |
|---|---|
| `/errors/auth-required` | Header `Authorization: Bearer` manquant |
| `/errors/api-key-invalid` | Clé API inconnue, révoquée, ou marchand désactivé |
| `/errors/signature-invalid` | HMAC ne matche pas (secret mauvais, body modifié, horloge décalée) |
| `/errors/timestamp-expired` | `X-Timestamp` ±5 min hors tolérance |
| `/errors/ip-not-allowed` | IP source hors allowlist de la clé |
| `/errors/scope-insufficient` | Scope de la clé ne permet pas cet endpoint |
| `/errors/merchant-suspended` | Compte marchand suspendu par Nexera |
| `/errors/idempotency-conflict` | Même Idempotency-Key avec body différent |
| `/errors/rate-limit-exceeded` | Trop de requêtes — attends `retry_after` secondes |
| `/errors/validation-failed` | Body invalide (voir `detail` pour les champs fautifs) |
| `/errors/insufficient-funds` | Solde marchand insuffisant pour ce payout/refund |
| `/errors/limit-exceeded` | Limite marchand (par tx ou quotidien) dépassée |
| `/errors/provider-unavailable` | Moko/Cybersource injoignable — retry plus tard |

## Bonnes pratiques

**Retry sur `429`** :
```typescript
try {
  await nexera.payments.create({...});
} catch (e) {
  if (e instanceof RateLimitError) {
    await sleep(e.retryAfter * 1000);
    return await nexera.payments.create({...});
  }
  throw e;
}
```

**Retry sur `503`** avec exponential backoff (respect `Retry-After` si fourni). Jamais de retry sur `4xx` (sauf `429`) — l'erreur est de ton côté.

**Ne retry JAMAIS les POST sans Idempotency-Key** : tu risques un double débit. Le SDK JS/Python génère l'idempotency-key automatiquement.

## Signaler un bug

`support@nexera.africa` avec :
- Le `request_id` de l'erreur
- Le timestamp UTC approximatif
- Ton `api_key` (public, pas le secret)
