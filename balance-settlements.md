# Balance & Settlements

## Balance — solde marchand en temps réel

```typescript
const bal = await nexera.balance.get();
// {
//   object: "balance",
//   environment: "live",
//   available: { USD: 45230, CDF: 1250000 },   // cents
//   pending:   { USD: 5000, CDF: 0 },
//   settled:   { USD: 0, CDF: 0 }
// }
```

**Calcul** :
```
available = SUM(payments succeeded amount_net) - refunds - payouts (pending+succeeded)
pending   = SUM(payments pending/processing amount_net)
settled   = SUM(payments succeeded déjà virées, mode daily_batch uniquement)
```

## Modes de settlement

Chaque marchand a un `settlement_mode` :

### `instant` (défaut)

Le wallet marchand est crédité immédiatement à chaque paiement `succeeded`. Le marchand voit son solde grossir en temps réel. Il peut faire des payouts / refunds à tout moment tant que balance > 0.

Pas d'agrégation, pas de settlements créées.

### `daily_batch`

Un cron nocturne (02:00 UTC) agrège tous les paiements `succeeded` de la journée écoulée, par devise. Crée une `Settlement` qui devient l'ordre de virement Nexera → compte marchand (bancaire ou Moko).

Tant que la settlement n'est pas `completed` (virée), les tx sont marquées `settled: false` mais visibles dans `balance.available` (le marchand attend juste le virement).

## Consultation settlements

```typescript
const list = await nexera.settlements.list({ limit: 30 });
// {
//   object: "list",
//   data: [
//     {
//       id: "settle_xxx",
//       currency: "USD",
//       amount: 45230,        // à virer au marchand
//       gross: 47110,          // brut encaissé
//       fees: 1880,             // commission Nexera
//       refunds: 0,
//       transaction_count: 12,
//       period_start: "2026-08-07",
//       period_end: "2026-08-07",
//       status: "completed",
//       external_ref: "VIR-20260808-001",
//       created: 1786176000,
//       completed: 1786232400
//     },
//     ...
//   ]
// }
```

## Statuts settlement

| Statut | Description |
|---|---|
| `pending` | Créée, en attente d'ordre de virement Nexera → marchand |
| `in_progress` | Ordre de virement lancé (bancaire/Moko) |
| `completed` | Marchand crédité — `external_ref` renseigne la ref virement |
| `failed` | Échec virement — retry manuel Nexera team |

## Fréquence

`daily_batch` : 1 settlement/jour/devise. Marchand USD+CDF actif = 2 settlements/jour max.
