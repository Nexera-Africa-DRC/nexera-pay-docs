# Authentication

Nexera Pay utilise **3 mécanismes cumulatifs** pour authentifier chaque requête :

1. **Bearer token** (`Authorization: Bearer <api_key>`)
2. **HMAC signature** (`X-Signature`) — obligatoire sur `POST`/`PATCH`/`DELETE`
3. **Timestamp anti-replay** (`X-Timestamp`) — tolerance ±5 min

Une clé volée seule ne suffit pas à faire une transaction : sans le secret HMAC, aucune signature valide n'est possible.

## Headers requis

| Header | Requis pour | Description |
|---|---|---|
| `Authorization: Bearer <api_key>` | Toutes | Clé API publique |
| `X-Timestamp` | POST/PATCH/DELETE | Unix timestamp (secondes) |
| `X-Signature` | POST/PATCH/DELETE | `sha256=<hex>` |
| `Idempotency-Key` | POST /payments et /payouts | UUID v4 unique, dédupe 24h |
| `Content-Type: application/json` | POST/PATCH/PUT | Toujours JSON |

## Calcul de la signature

La signature est un HMAC-SHA256 avec ton `secret` sur le payload :

```
payload = "{timestamp}.{METHOD}.{path}.{body}"
signature = "sha256=" + hex(hmac_sha256(secret, payload))
```

Exemple Python :

```python
import hmac, hashlib, time

secret = "sk_..."
timestamp = str(int(time.time()))
method = "POST"
path = "/v1/payments"
body = '{"amount":10000,"currency":"USD","method":"mobile_money",...}'

payload = f"{timestamp}.{method}.{path}.{body}"
signature = "sha256=" + hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
```

Exemple JavaScript :

```javascript
import { createHmac } from "node:crypto";

const secret = "sk_...";
const ts = Math.floor(Date.now() / 1000).toString();
const payload = `${ts}.POST./v1/payments.${JSON.stringify(body)}`;
const signature = "sha256=" + createHmac("sha256", secret).update(payload).digest("hex");
```

Exemple PHP :

```php
$payload = time() . '.POST./v1/payments.' . json_encode($body);
$signature = 'sha256=' . hash_hmac('sha256', $payload, $secret);
```

**⚠️ Important** : le `body` utilisé pour la signature doit être **exactement identique** à celui envoyé. Toute modification (espaces, ordre des clés) invalide la signature. Sérialise ton JSON une seule fois puis utilise la même chaîne pour body et signature.

## Idempotency

Sur `POST /v1/payments` et `POST /v1/payouts`, envoie toujours un header `Idempotency-Key: <uuid-v4>`. Si tu retry la même requête (même key + même body) dans les 24h, on te renvoie la réponse cachée sans réexécuter le paiement.

Si tu envoies la même key avec un **body différent**, tu reçois `409 Conflict`.

```typescript
// SDK JS génère un Idempotency-Key automatique
await nexera.payments.create({ amount: 10000, ... });
// Override si tu veux contrôler
await nexera.payments.create({ ... }, { idempotencyKey: "my-custom-key-123" });
```

## Scopes

Chaque API key a un scope :
- `read` : GET seulement
- `payments` : + POST/GET `/v1/payments`
- `full` : + POST `/v1/payouts`, `/v1/payments/{id}/refund`

Les payouts et refunds requièrent scope `full` — active-le uniquement pour les serveurs backend qui en ont besoin.

## IP allowlist (optionnelle)

Tu peux restreindre une API key à un ensemble d'IPs sources (celle de ton backend). Nexera refusera les requêtes venant d'autres IPs avec `403 ip-not-allowed`.

## Rate limits

100 requêtes/minute par API key. Au-delà : `429 rate-limit-exceeded` avec un `Retry-After` en secondes.
