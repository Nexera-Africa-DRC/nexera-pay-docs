# Testing & Sandbox

Les clés `nex_test_...` fonctionnent dans un environnement **isolé** :
- Aucun appel réel aux providers Moko/Cybersource
- Aucun argent réel manipulé
- Callbacks simulés en 3-60s selon scenario
- Balance test rechargée à 10 000 USD / 25M CDF par défaut

## Patterns MSISDN Mobile Money

Le suffixe des 3 derniers chiffres du numéro détermine le comportement :

| MSISDN (suffixe) | Résultat |
|---|---|
| `...001` | `processing` → `succeeded` en **3s** |
| `...002` | `failed` immédiat (insufficient_funds) |
| `...003` | `processing` → `failed` après **60s** (timeout) |
| `...004` | `failed` immédiat (wrong_pin) |
| `...005` | `processing` → `succeeded` en **10s** |
| autre | `processing` (statut final indéterminé — utile pour tester le polling) |

Exemples :
- `243812345001` → succès simulé 3s
- `243811222002` → failed immédiat
- `243888999005` → succès 10s

## Patterns cartes (Phase 2)

Sandbox card : redirect vers une page mock locale avec 3 boutons **Succès / Échec / 3DS challenge**. Aucun numéro de carte réel demandé.

## Environnement `live` vs `test`

Toutes les APIs acceptent les deux — le préfixe de ta clé détermine le comportement.

Les tx `live` et `test` sont **isolées** : elles ne se mélangent jamais en balance, settlements, listes.

Un webhook configuré pour `environment=test` ne reçoit que les events des tx test. Prévois deux webhooks séparés en général : un pour ton env test/dev, un pour ta prod.

## Balance de test

Chaque nouveau marchand test démarre avec un solde virtuel :
- **10 000 USD** disponible
- **25 000 000 CDF** disponible

Pour recharger : contacte le support (via API admin).

## Cartes bancaires de test (Cybersource sandbox — Phase 2)

| Numéro | Résultat |
|---|---|
| `4111 1111 1111 1111` | Succès (Visa) |
| `5555 5555 5555 4444` | Succès (Mastercard) |
| `4000 0000 0000 0002` | Declined |
| `4000 0000 0000 0069` | Insufficient funds |
| `4000 0000 0000 0127` | CVV check failed |

Toute date d'expiration future, CVV `123`.

## Passer en production

1. Contacte-nous pour créer une **live key** (`nex_live_...`)
2. Change juste ton env var — même code, mêmes SDK, mêmes endpoints
3. Fais un premier test avec un vrai numéro et un petit montant (ex : 100 CDF)
4. Vérifie que le callback arrive bien sur ton webhook prod
5. Passe en production

Nexera team surveille toutes les tx en temps réel et peut désactiver ta clé en cas de problème.
