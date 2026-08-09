# Webhooks

Nexera Pay t'envoie un `POST` HTTPS vers ton URL webhook quand un événement se produit (paiement confirmé, échec, refund, settlement…).

## Configuration

Un webhook est configuré par Nexera team via l'admin API. Chaque webhook a :
- **URL** (HTTPS obligatoire en prod)
- **Secret** (`whsec_...`) — sert à vérifier la signature
- **Events subscrits** — glob : `payment.*`, `payment.succeeded`, `refund.*`, etc.
- **Environment** — `test` ou `live` (webhooks séparés)

## Événements

| Type | Quand |
|---|---|
| `payment.succeeded` | Paiement confirmé, marchand crédité |
| `payment.failed` | Paiement échoué (client refuse, wrong pin, insufficient funds, timeout) |
| `payment.cancelled` | Paiement annulé |
| `refund.succeeded` | Refund confirmé |
| `refund.failed` | Refund échoué |
| `payout.succeeded` | Payout B2C confirmé |
| `payout.failed` | Payout échoué |
| `settlement.completed` | Batch settlement quotidien créé |

## Format du body

```json
{
  "id": "evt_pay_xxx_1786200000",
  "type": "payment.succeeded",
  "created": 1786200000,
  "data": {
    "object": {
      "id": "pay_xxx",
      "object": "payment",
      "status": "succeeded",
      "method": "mobile_money",
      "environment": "live",
      "currency": "USD",
      "amount_charged": 10000,
      "amount_net": 9600,
      "fee": 400,
      "fee_bearer": "merchant",
      "reference": "INV-001",
      "provider": "moko",
      "provider_ref": "PDxxxx",
      "customer": {"msisdn": "243812345001", "operator": "mpesa", "email": null, "name": null},
      "metadata": {"invoice_id": "abc"},
      "completed_at": 1786200030
    }
  }
}
```

## Headers envoyés par Nexera

| Header | Description |
|---|---|
| `Content-Type: application/json` | |
| `User-Agent: Nexera-Pay-Webhook/1.0` | |
| `X-Nexera-Event: payment.succeeded` | Type d'événement (pour routing rapide) |
| `X-Nexera-Delivery-Id: whd_xxx` | ID unique de cette livraison (idempotency côté marchand) |
| `X-Nexera-Delivery-Attempt: 1` | Numéro de tentative (1-8) |
| `X-Nexera-Timestamp: 1786200000` | Unix timestamp de l'envoi |
| `X-Nexera-Signature: t=1786200000,v1=hex` | Signature HMAC-SHA256 |

## Vérifier la signature

**Format Stripe** : `t=<timestamp>,v1=<hex>`.

Payload signé = `"{timestamp}.{body}"`. Compare avec `hmac.compare_digest` (timing-safe).

Node.js avec `nexera-pay` :
```typescript
import { Webhooks } from "nexera-pay";

if (!Webhooks.verifySignature(process.env.NEXERA_WEBHOOK_SECRET, sig, bodyString)) {
  return res.status(401).send("invalid");
}
```

Python avec `nexera-pay` :
```python
from nexera_pay import verify_webhook_signature

if not verify_webhook_signature(WEBHOOK_SECRET, sig, body_str):
    return 401
```

PHP avec `nexera/pay` :
```php
if (!\Nexera\Pay\Webhooks::verifySignature($secret, $sig, $body)) {
    return response('invalid', 401);
}
```

Sans SDK :
```python
import hmac, hashlib, time
def verify(secret, sig_header, body, tolerance=300):
    parts = dict(p.split('=', 1) for p in sig_header.split(','))
    ts = int(parts['t'])
    if abs(int(time.time()) - ts) > tolerance:
        return False
    expected = hmac.new(secret.encode(), f"{ts}.{body}".encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, parts['v1'])
```

## Retry policy

Si ton endpoint ne répond pas `2xx`, Nexera retry avec un backoff exponentiel :

`1s → 5s → 30s → 5min → 30min → 2h → 6h → 24h`

Après 8 tentatives échouées : la livraison est marquée `dead` (DLQ). Après 20 échecs consécutifs sur le même webhook endpoint, un **circuit breaker** se déclenche pour 1h.

## Idempotency côté marchand

Nexera peut légitimement renvoyer plusieurs fois le même événement (retry après timeout réseau, replay manuel). Ton endpoint doit être **idempotent** :

```python
if db.query(WebhookProcessed).filter_by(delivery_id=req.headers["X-Nexera-Delivery-Id"]).first():
    return 200   # déjà traité, no-op
db.add(WebhookProcessed(delivery_id=..., processed_at=now()))
# ... traiter l'event ...
```

## Test d'un webhook

Via l'admin API (Nexera team) :

```bash
POST /admin/webhooks/{id}/test
```

Envoie un event `webhook.test` à ton URL pour valider connectivité + signature.
