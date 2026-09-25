# SDK Python

Le SDK officiel `nexera-pay` supporte Python 3.9+ avec un client synchrone et un client asynchrone (asyncio). Type hints complets, compatible mypy strict.

[![PyPI](https://img.shields.io/pypi/v/nexera-pay?style=flat-square&color=a78bfa&logo=pypi&logoColor=white)](https://pypi.org/project/nexera-pay/)
[![downloads](https://img.shields.io/pypi/dm/nexera-pay?style=flat-square&color=67e8f9)](https://pypi.org/project/nexera-pay/)
[![python](https://img.shields.io/pypi/pyversions/nexera-pay?style=flat-square)](https://pypi.org/project/nexera-pay/)

## Installation

```bash
pip install nexera-pay
# ou
poetry add nexera-pay
# ou
uv add nexera-pay
```

## Initialisation

```python
from nexera_pay import NexeraPay
import os

nexera = NexeraPay(
    api_key=os.environ["NEXERA_PAY_API_KEY"],   # nex_test_... ou nex_live_...
    secret=os.environ["NEXERA_PAY_SECRET"],
)
```

Clés API disponibles dans [admin-pay.nexera.africa](https://admin-pay.nexera.africa) → onglet Credentials.

## Paiement Mobile Money (STK Push)

```python
payment = nexera.payments.create(
    amount=10000,          # 100.00 USD en cents
    currency="USD",
    method="mobile_money",
    operator="mpesa",       # mpesa | airtel | orange | africell
    phone="243812345001",
    reference="INV-2026-0001",
    description="Facture #INV-2026-0001",
)

print(payment["id"], payment["status"])
# → pay_xxxx  processing
```

## Paiement carte (hosted checkout)

```python
payment = nexera.payments.create(
    amount=50000,
    currency="USD",
    method="card",
    reference="INV-002",
    customer_email="client@example.com",
    customer_name="Jean Kabala",
    return_url="https://monsite.cd/facture/002",
)

# Rediriger le client vers le checkout hosted :
return redirect(payment["checkout_url"])
```

## Client asynchrone

```python
from nexera_pay import NexeraPayAsync
import asyncio

async def main():
    nexera = NexeraPayAsync(
        api_key=os.environ["NEXERA_PAY_API_KEY"],
        secret=os.environ["NEXERA_PAY_SECRET"],
    )
    payment = await nexera.payments.create(
        amount=100, currency="CDF",
        method="mobile_money", operator="mpesa",
        phone="243828584688", reference="TEST-1",
    )
    print(payment)

asyncio.run(main())
```

Idéal pour FastAPI, aiohttp, Starlette ou tout backend Python asynchrone.

## Vérification de webhook (Flask)

```python
from flask import Flask, request, abort
from nexera_pay import NexeraPay
import os

app = Flask(__name__)
nexera = NexeraPay(api_key="...", secret="...")

@app.post("/webhooks/nexera")
def nexera_webhook():
    payload = request.get_data()   # bytes bruts, PAS request.json
    signature = request.headers.get("X-Nexera-Signature")

    try:
        event = nexera.webhooks.verify(
            payload, signature,
            secret=os.environ["NEXERA_WEBHOOK_SECRET"],
        )
    except ValueError:
        abort(400, "bad signature")

    if event["type"] == "payment.completed":
        # Marquer la commande comme payée
        order_id = event["data"]["reference"]
        # ...
    return "ok", 200
```

Version FastAPI équivalente et Django dans le [README GitHub](https://github.com/Nexera-Africa-DRC/nexera-pay-python#django).

## Type hints

Tous les payloads / responses / événements webhook sont typés (`TypedDict` + literals). Mypy et Pyright fonctionnent en mode strict.

```python
from nexera_pay import PaymentCreatePayload, WebhookEvent

def handle(event: WebhookEvent) -> None:
    if event["type"] == "payment.completed":
        amount_cents: int = event["data"]["amount"]
        # ...
```

## Ressources

- **Package PyPI** : [pypi.org/project/nexera-pay](https://pypi.org/project/nexera-pay/)
- **Code source** : [github.com/Nexera-Africa-DRC/nexera-pay-python](https://github.com/Nexera-Africa-DRC/nexera-pay-python)
- **Changelog** : GitHub Releases.
