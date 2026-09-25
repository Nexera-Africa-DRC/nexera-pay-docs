# SDK JavaScript / TypeScript

Le SDK officiel `nexera-pay` couvre l'ensemble de l'API en TypeScript strict, avec support Node.js 18+ et navigateur (côté serveur uniquement — les clés secrètes ne doivent jamais tourner dans un bundle client).

[![npm](https://img.shields.io/npm/v/nexera-pay?style=flat-square&color=a78bfa&logo=npm)](https://www.npmjs.com/package/nexera-pay)
[![downloads](https://img.shields.io/npm/dm/nexera-pay?style=flat-square&color=67e8f9)](https://www.npmjs.com/package/nexera-pay)
[![bundle](https://img.shields.io/bundlephobia/minzip/nexera-pay?style=flat-square&label=bundle)](https://bundlephobia.com/package/nexera-pay)

## Installation

```bash
npm install nexera-pay
# ou
pnpm add nexera-pay
# ou
yarn add nexera-pay
```

## Initialisation

```typescript
import { NexeraPay } from "nexera-pay";

const nexera = new NexeraPay({
  apiKey: process.env.NEXERA_PAY_API_KEY!,   // nex_test_... ou nex_live_...
  secret: process.env.NEXERA_PAY_SECRET!,
});
```

Les clés sont disponibles dans votre dashboard marchand : [admin-pay.nexera.africa](https://admin-pay.nexera.africa).

## Paiement Mobile Money (STK Push)

```typescript
const payment = await nexera.payments.create({
  amount: 10000,           // 100.00 USD en cents
  currency: "USD",
  method: "mobile_money",
  operator: "mpesa",       // mpesa | airtel | orange | africell
  phone: "243812345001",
  reference: "INV-2026-0001",
  description: "Facture #INV-2026-0001",
});

console.log(payment.id, payment.status);
// → pay_xxxx  processing
```

Le client reçoit un push USSD sur son téléphone. Le statut final vous parvient via webhook (`payment.completed` ou `payment.failed`).

## Paiement carte (hosted checkout)

```typescript
const payment = await nexera.payments.create({
  amount: 50000,
  currency: "USD",
  method: "card",
  reference: "INV-002",
  customer_email: "client@example.com",
  customer_name: "Jean Kabala",
  return_url: "https://monsite.cd/facture/002",
});

// Rediriger le client :
window.location.href = payment.checkout_url!;
```

## Vérification de webhook

```typescript
import express from "express";

const app = express();

app.post("/webhooks/nexera",
  express.raw({ type: "application/json" }),
  (req, res) => {
    try {
      const event = nexera.webhooks.verify(
        req.body,                              // Buffer brut
        req.header("X-Nexera-Signature")!,
        process.env.NEXERA_WEBHOOK_SECRET!,
      );

      switch (event.type) {
        case "payment.completed":
          console.log("Paiement OK :", event.data.id);
          break;
        case "payment.failed":
          console.log("Échec :", event.data.failure_reason);
          break;
      }

      res.status(200).send("ok");
    } catch (err) {
      res.status(400).send("bad signature");
    }
  },
);
```

## TypeScript

Le SDK est écrit en TypeScript strict. Tous les types sont inclus, aucun `@types/*` supplémentaire n'est requis. Autocomplétion IDE complète sur les payloads, réponses, événements webhook et codes d'erreur RFC 7807.

```typescript
import type { Payment, WebhookEvent, PaymentMethod } from "nexera-pay";

function handleEvent(event: WebhookEvent) {
  if (event.type === "payment.completed") {
    const payment: Payment = event.data;
    // ...
  }
}
```

## Frameworks

Le SDK est agnostique : il fonctionne dans **Express**, **Fastify**, **Next.js (API routes + Server Actions)**, **Nuxt (server routes)**, **Remix**, **NestJS**, ou n'importe quel runtime Node.js 18+ / Bun / Deno (via l'entrée ESM).

Pour Next.js, un exemple d'API route est disponible dans le [README GitHub](https://github.com/Nexera-Africa-DRC/nexera-pay-js#nextjs).

## Ressources

- **Package npm** : [npmjs.com/package/nexera-pay](https://www.npmjs.com/package/nexera-pay)
- **Code source** : [github.com/Nexera-Africa-DRC/nexera-pay-js](https://github.com/Nexera-Africa-DRC/nexera-pay-js)
- **Changelog** : versions et notes de release sur GitHub Releases.
