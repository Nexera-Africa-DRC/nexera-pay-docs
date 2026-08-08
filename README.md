# Nexera Pay — Documentation

API paiement Payment Facilitator RDC (Mobile Money + Carte). Wrapper Moko/PayDRC + MokoAfrika/Cybersource.

**URL API** : `https://pay.nexera.africa`
**Docs live** : `https://pay.nexera.africa/docs` (Swagger UI auto-généré) + `/redoc`

## Guides

- [Quickstart 5 min](./quickstart.md) — encaisser ton premier paiement
- [Authentication (HMAC signature)](./authentication.md)
- [Payments](./payments.md) — MM + Carte
- [Payouts](./payouts.md) — B2C Mobile Money (marchand → client)
- [Refunds](./refunds.md) — partiel ou total
- [Balance & Settlements](./balance-settlements.md)
- [Webhooks](./webhooks.md) — verify signature + retry policy
- [Testing (sandbox patterns)](./testing-sandbox.md)
- [Erreurs (RFC 7807)](./errors.md)

## SDKs officiels

| Langage | Package | README |
|---|---|---|
| JavaScript/TypeScript | `@nexera/pay` (npm) | [sdks/js](../sdks/js/README.md) |
| Python | `nexera-pay` (pypi) | [sdks/python](../sdks/python/README.md) |
| PHP | `nexera/pay` (composer) | [sdks/php](../sdks/php/README.md) |

## Standards respectés

- **REST** strict avec verbes HTTP standards
- **OpenAPI 3.1** auto-généré : `/docs` (Swagger) + `/redoc`
- **Codes HTTP** conformes (200/201/204/400/401/403/404/409/422/429/5xx)
- **Erreurs** format RFC 7807 (`application/problem+json`)
- **Pagination** cursor-based (pas offset)
- **Dates** ISO 8601 UTC
- **Montants** en cents (int) — jamais de float
- **Devises** ISO 4217 (`USD`, `CDF`)
- **Webhooks** signature format Stripe (`t=ts,v1=hex`)
- **Idempotency-Key** obligatoire sur POST /payments et /payouts
- **PCI DSS SAQ-A** compliant (jamais de PAN stocké)
- **OWASP API Security Top 10** 2023 aligned

## Contact

- Support : `support@nexera.africa`
- Dev relations : `dev@nexera.africa`
- Statut : `https://status.nexera.africa`
