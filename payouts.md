# Payouts B2C

Envoyer de l'argent depuis le wallet marchand vers un client par Mobile Money. Use-cases : remboursement, prime salariale, gagnant de tombola, etc.

**Scope requis** : `full`.

## Créer un payout

```typescript
const payout = await nexera.payouts.create({
  amount: 100,               // 100 CDF (petit test)
  currency: "CDF",
  method: "mobile_money",
  operator: "mpesa",
  phone: "243828584688",
  reference: "REMB-001",
  description: "Remboursement produit défectueux",
  metadata: { order_id: "abc" },
});
// { id: "po_xxx", status: "processing", ... }
```

## Prérequis

- **Balance suffisante** : `bal.available.CDF >= amount` sinon `400 insufficient-funds`.
- **Limites marchand** : `per_tx_limit_cdf` respectée sinon `400 limit-exceeded`.
- **Scope `full`** sur l'API key sinon `403 scope-insufficient`.

Pour créditer ton wallet en test, contacte-nous. En prod, il se crédite automatiquement à chaque paiement `succeeded`.

## Callback

Comme pour les payments : STK Push envoyé au bénéficiaire → il valide (accepte le crédit) → callback `payout.succeeded` ou `payout.failed`.

## Card payouts

**Non supportés** — les schemes Visa/Mastercard n'autorisent pas les push de manière fiable en RDC. Utilise Mobile Money.

## Refund vs Payout

- **Refund** = rembourser un paiement passé (avec lien vers la tx d'origine, comptable propre)
- **Payout** = envoyer de l'argent quelconque (pas de lien avec une tx entrante)

Utilise refund quand possible, payout pour les cas hors tx.

## Exemple concret : rembourser 30% d'une facture

```typescript
const payment = await nexera.payments.get("pay_xxx");
const refundAmount = Math.round(payment.amount_charged * 0.3);
await nexera.refunds.create("pay_xxx", { amount: refundAmount, reason: "Livraison partielle" });
```

Le refund passe par le circuit MM refund (`action=refund` chez PayDRC) — le client reçoit une notif de crédit sur son numéro MM.
