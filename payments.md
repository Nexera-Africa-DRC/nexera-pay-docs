# Payments

Endpoint : `POST /v1/payments` — création d'un paiement C2B (client → marchand).

## Mobile Money

```typescript
const p = await nexera.payments.create({
  amount: 10000,          // int en cents
  currency: "USD",         // "USD" | "CDF"
  method: "mobile_money",
  operator: "mpesa",       // "mpesa" | "airtel" | "orange" | "africell"
  phone: "243812345001",
  reference: "INV-001",    // unique par marchand
  description: "Facture #INV-001",
  metadata: { invoice_id: "abc", customer_id: "def" },
});
```

Réponse :
```json
{
  "id": "pay_a1b2c3d4-...",
  "object": "payment",
  "status": "processing",
  "method": "mobile_money",
  "environment": "test",
  "currency": "USD",
  "amount_charged": 10000,
  "amount_net": 9600,
  "fee": 400,
  "fee_bearer": "merchant",
  "reference": "INV-001",
  "provider": "moko",
  "provider_ref": "PDxxxx",
  "created": 1786200000,
  "completed": null,
  "metadata": {"invoice_id": "abc", "customer_id": "def"}
}
```

Un STK Push est envoyé sur le téléphone du client. Il tape son PIN. Nexera Pay reçoit le callback Moko et t'envoie le webhook `payment.succeeded` (ou `payment.failed`).

## Carte (hosted checkout)

```typescript
const p = await nexera.payments.create({
  amount: 50000,
  currency: "USD",
  method: "card",
  reference: "INV-002",
  customer_email: "client@example.com",
  customer_name: "Jean Kabala",
  return_url: "https://ton-app.com/facture/002",   // client redirigé ici après paiement
});

// Rediriger le client vers le checkout hébergé
window.location.href = p.checkout_url;
```

La page checkout est hébergée par MokoAfrika (Cybersource + 3DS). Le client saisit sa carte, valide 3DS, puis revient sur ton `return_url`. Un webhook `payment.succeeded` te confirme.

## Fee bearer

Deux modes configurables au niveau marchand (default) ou par transaction (override) :

| Mode | Comportement | Client tape | Marchand reçoit |
|---|---|---|---|
| `fee_bearer=merchant` (défaut) | Commission déduite du montant | 100 USD | 96 USD |
| `fee_bearer=customer` | Commission ajoutée (surcharge) | 104 USD | 100 USD |

```typescript
// Le client absorbe le fee — marchand reçoit pile 10000 USD net
await nexera.payments.create({
  amount: 10000,   // ← montant NET souhaité par le marchand
  fee_bearer: "customer",
  ...
});
```

## Statuts

| Statut | Description |
|---|---|
| `pending` | Créé, en attente d'envoi provider |
| `processing` | Envoyé provider, en attente confirmation client (STK/3DS) |
| `succeeded` | Confirmé — marchand crédité |
| `failed` | Échec définitif (client refuse, solde insuffisant, timeout...) |
| `cancelled` | Annulé par le client ou timeout |
| `refunded` | Remboursé partiellement ou totalement |

## Consultation

```typescript
const p = await nexera.payments.get("pay_xxx");
```

## Liste

```typescript
const list = await nexera.payments.list({
  reference: "INV-001",   // filtre par reference marchand
  status: "succeeded",
  limit: 50,
  cursor: "1786200000",   // cursor de la page précédente
});
console.log(list.data, list.has_more, list.next_cursor);
```

Pagination cursor-based (pas offset). `next_cursor` = timestamp Unix pour continuer.

## Limites

- Body max : 100 KB
- `metadata` : max 20 clés, valeurs stringifiées max 500 chars
- Amount max par tx : configurable par marchand (`per_tx_limit_usd` / `per_tx_limit_cdf`)
- Rate limit : 100 req/min par API key
