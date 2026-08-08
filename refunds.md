# Refunds

Rembourser un paiement — partiel ou total. **Scope requis** : `full`.

## Refund total

```typescript
await nexera.refunds.create("pay_xxx");
// Le montant total non déjà remboursé est renvoyé
```

## Refund partiel

```typescript
await nexera.refunds.create("pay_xxx", {
  amount: 5000,           // en cents
  reason: "Article manquant dans la commande",
});
```

Tu peux faire **plusieurs refunds partiels** sur une même tx tant que le cumul ≤ montant original. Après quoi la tx passe automatiquement en statut `refunded`.

## Contraintes

- La tx d'origine doit être `succeeded`
- `amount ≤ (amount_charged - refunded_amount)` sinon `422`
- MM refund : va sur le même numéro que le paiement d'origine
- **Carte** : refund carte pas supporté via API (Phase MVP). À traiter manuellement via portail Moko/FreshPay.

## Statuts

| Statut | Description |
|---|---|
| `pending` | Créé, envoyé provider — attente callback |
| `succeeded` | Client crédité (MM notification reçue) |
| `failed` | Provider a refusé (rare, ex : numéro client inactif) |

## Webhook

Un `refund.succeeded` (ou `.failed`) est envoyé à ton endpoint webhook.

```json
{
  "type": "refund.succeeded",
  "data": {
    "object": {
      "id": "re_xxx",
      "transaction_id": "pay_xxx",
      "amount": 5000,
      "currency": "USD",
      "reason": "Article manquant",
      "status": "succeeded",
      "created": 1786200000,
      "completed": 1786200030
    }
  }
}
```

## Impact balance

Le montant refund est **déduit** de `balance.available` immédiatement à la création (même si `status=pending`), pour éviter les cas de solde négatif si un autre payout part en parallèle. Si le refund échoue plus tard, le montant est recrédité.

## Liste des refunds d'un paiement

```typescript
const refunds = await nexera.refunds.list("pay_xxx");
// { object: "list", data: [{ id: "re_xxx", amount: 5000, ... }, ...] }
```
