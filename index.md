---
layout: home

hero:
  name: "Nexera Pay"
  text: "API paiement RDC"
  tagline: "Mobile Money (M-Pesa, Airtel, Orange, Africell) + Carte (Visa/Mastercard 3-D Secure). Une seule intégration REST, tous les rails RDC."
  image:
    src: /hero.svg?v=3
    alt: Nexera Pay — API paiement RDC
  actions:
    - theme: brand
      text: Quickstart 5 min
      link: /quickstart
    - theme: alt
      text: SDK officiels
      link: /sdks/javascript
    - theme: alt
      text: GitHub
      link: https://github.com/Nexera-Africa-DRC

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
- **OpenAPI 3.1** — schéma disponible sur demande à `dev@nexera.africa` (spec fermée au public en prod)
- **RFC 7807** pour toutes les erreurs (`application/problem+json`)
- **Idempotency-Key** obligatoire sur `POST /payments` et `POST /payouts`
- **Montants** en cents (int) — jamais de float
- **Devises** ISO 4217 (`USD`, `CDF`)
- **Dates** ISO 8601 UTC
- **Webhooks** format signature Stripe

## SDK officiels

| Langage | Installation | Doc |
|---|---|---|
| JavaScript / TypeScript | `npm install nexera-pay` | [/sdks/javascript](/sdks/javascript) |
| Python | `pip install nexera-pay` | [/sdks/python](/sdks/python) |
| PHP | `composer require nexera/pay` | [/sdks/php](/sdks/php) |

## Plugins e-commerce

| Plateforme | Installation | Doc |
|---|---|---|
| WooCommerce | ZIP officiel → Extensions | [/plugins/woocommerce](/plugins/woocommerce) |
| PrestaShop | ZIP officiel → Modules | [/plugins/prestashop](/plugins/prestashop) |

## Contact

- Support : `support@nexera.africa`
- Dev relations : `dev@nexera.africa`
- Statut : [status.nexera.africa](https://status.nexera.africa)
