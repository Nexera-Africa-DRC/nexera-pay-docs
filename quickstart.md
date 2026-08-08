# Quickstart — 5 minutes

Ce guide t'apprend à encaisser un paiement Mobile Money via l'API Nexera Pay.

## 1. Récupérer tes credentials

Contacte-nous à `dev@nexera.africa` pour obtenir un compte marchand. Tu recevras :

- Une **API key publique** (préfixe `nex_test_` pour sandbox, `nex_live_` pour prod)
- Un **secret** (préfixe `sk_`) — visible **une seule fois** à la création, à sauvegarder immédiatement
- Un **webhook secret** (préfixe `whsec_`) — pour vérifier les callbacks

Les clés `nex_test_` fonctionnent en environnement sandbox, sans risque financier.

## 2. Ton premier paiement

Avec le SDK JS :

```typescript
import { NexeraPay } from "@nexera/pay";

const nexera = new NexeraPay({
  apiKey: "nex_test_...",
  secret: "sk_...",
});

const payment = await nexera.payments.create({
  amount: 10000,          // 100.00 USD en cents (int, jamais de float)
  currency: "USD",
  method: "mobile_money",
  operator: "mpesa",
  phone: "243812345001",   // MSISDN test → succès simulé en 3s
  reference: "INV-001",    // ta référence interne, unique par marchand
});

console.log(payment.id, payment.status);
// pay_a1b2c3d4-...  processing
```

Avec cURL :

```bash
TS=$(date +%s)
BODY='{"amount":10000,"currency":"USD","method":"mobile_money","operator":"mpesa","phone":"243812345001","reference":"INV-001"}'
SIG=$(python3 -c "import hmac,hashlib; print('sha256='+hmac.new(b'sk_...','$TS.POST./v1/payments.$BODY'.encode(),hashlib.sha256).hexdigest())")

curl -X POST https://pay.nexera.africa/v1/payments \
  -H "Authorization: Bearer nex_test_..." \
  -H "X-Timestamp: $TS" \
  -H "X-Signature: $SIG" \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d "$BODY"
```

## 3. Recevoir la confirmation (webhook)

Un STK est envoyé sur le téléphone du client. Il valide → Nexera Pay t'envoie un webhook sur l'URL que tu as configurée.

Exemple Node/Express :

```typescript
import express from "express";
import { Webhooks } from "@nexera/pay";

app.post("/webhooks/nexera",
  express.raw({ type: "application/json" }),   // brut pour vérif signature
  (req, res) => {
    const sig = req.header("X-Nexera-Signature");
    const body = req.body.toString();

    if (!Webhooks.verifySignature(process.env.NEXERA_WEBHOOK_SECRET, sig, body)) {
      return res.status(401).send("invalid");
    }

    const event = JSON.parse(body);
    if (event.type === "payment.succeeded") {
      const tx = event.data.object;
      // Marquer la facture tx.reference comme payée
      console.log(`Facture ${tx.reference} payée : ${tx.amount_net} ${tx.currency}`);
    }
    res.status(200).send("ok");
  }
);
```

## 4. Passer en production

Une fois ton flow validé en sandbox :

1. Contacte-nous pour créer une **live key** (`nex_live_...`)
2. Remplace tes env vars
3. Envoie de vrais paiements

C'est tout.

## Prochaines étapes

- [Authentication (HMAC signature)](./authentication.md)
- [Payments détaillé](./payments.md)
- [Webhooks](./webhooks.md)
- [Testing (sandbox patterns)](./testing-sandbox.md)
