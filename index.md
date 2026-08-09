---
layout: home

hero:
  name: "Nexera Pay"
  text: "API paiement RDC"
  tagline: "Mobile Money + Carte, une seule intégration. Wrapper Moko/PayDRC + Cybersource."
  image:
    src: /hero.svg?v=3
    alt: Nexera Pay — API paiement RDC
  actions:
    - theme: brand
      text: Quickstart 5 min
      link: /quickstart
    - theme: alt
      text: API Reference (Swagger)
      link: https://pay.nexera.africa/docs
    - theme: alt
      text: GitHub SDKs
      link: https://github.com/nexera

features:
  - icon: 📱
    title: Mobile Money
    details: M-Pesa, Airtel Money, Orange Money, Afrimoney. Un endpoint, tous les opérateurs RDC.
    link: /payments
  - icon: 💳
    title: Carte
    details: Visa, Mastercard via Cybersource. 3D-Secure inclus. PCI DSS SAQ-A.
    link: /payments
  - icon: 💸
    title: Payouts B2C
    details: Envoie de l'argent depuis ton wallet vers tes clients (remboursement, prime, gagnant…).
    link: /payouts
  - icon: 🪝
    title: Webhooks signés
    details: Événements HTTPS temps réel, signature HMAC format Stripe (`t=ts,v1=hex`), retry exponentiel.
    link: /webhooks
  - icon: 🧾
    title: Balance & Settlements
    details: Solde marchand en temps réel + reversements automatiques (instant ou daily batch).
    link: /balance-settlements
  - icon: 🔐
    title: Sécurité
    details: HMAC + IP allowlist + Idempotency-Key. OWASP API Top 10 2023 aligné.
    link: /security
---

## Standards

- **REST** strict, verbes HTTP standards
- **OpenAPI 3.1** auto-généré · `/docs` (Swagger) + `/redoc`
- **RFC 7807** pour toutes les erreurs (`application/problem+json`)
- **Idempotency-Key** obligatoire sur `POST /payments` et `POST /payouts`
- **Montants** en cents (int) — jamais de float
- **Devises** ISO 4217 (`USD`, `CDF`)
- **Dates** ISO 8601 UTC
- **Webhooks** format signature Stripe

## SDKs officiels

| Langage | Package |
|---|---|
| JavaScript / TypeScript | `nexera-pay` (npm) |
| Python | `nexera-pay` (pypi) |
| PHP | `nexera/pay` (composer) |

## Contact

- Support : `support@nexera.africa`
- Dev relations : `dev@nexera.africa`
- Statut : [status.nexera.africa](https://status.nexera.africa)
