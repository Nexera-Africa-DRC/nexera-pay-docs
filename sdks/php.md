# SDK PHP

Le SDK officiel `nexera/pay` supporte PHP 7.4+ et couvre l'ensemble de l'API. Compatible **Laravel**, **Symfony**, **WordPress**, et scripts standalone.

[![Packagist](https://img.shields.io/packagist/v/nexera/pay?style=flat-square&color=a78bfa&logo=packagist&logoColor=white)](https://packagist.org/packages/nexera/pay)
[![downloads](https://img.shields.io/packagist/dm/nexera/pay?style=flat-square&color=67e8f9)](https://packagist.org/packages/nexera/pay)
[![php](https://img.shields.io/packagist/php-v/nexera/pay?style=flat-square)](https://packagist.org/packages/nexera/pay)

## Installation

```bash
composer require nexera/pay
```

Extensions requises : `ext-curl`, `ext-json` (installées par défaut sur la plupart des hébergeurs PHP).

## Initialisation

```php
<?php
require 'vendor/autoload.php';

$nexera = new \Nexera\Pay\NexeraPay(
    getenv('NEXERA_PAY_API_KEY'),   // nex_test_... ou nex_live_...
    getenv('NEXERA_PAY_SECRET'),
);
```

Clés disponibles dans [admin-pay.nexera.africa](https://admin-pay.nexera.africa).

## Paiement Mobile Money (STK Push)

```php
$payment = $nexera->payments->create([
    'amount'      => 10000,          // 100.00 USD en cents
    'currency'    => 'USD',
    'method'      => 'mobile_money',
    'operator'    => 'mpesa',         // mpesa | airtel | orange | africell
    'phone'       => '243812345001',
    'reference'   => 'INV-2026-0001',
    'description' => 'Facture #INV-2026-0001',
]);

echo $payment['id'] . ' — ' . $payment['status'];
// → pay_xxxx — processing
```

## Paiement carte (hosted checkout)

```php
$payment = $nexera->payments->create([
    'amount'         => 50000,
    'currency'       => 'USD',
    'method'         => 'card',
    'reference'      => 'INV-002',
    'customer_email' => 'client@example.com',
    'customer_name'  => 'Jean Kabala',
    'return_url'     => 'https://monsite.cd/facture/002',
]);

// Rediriger vers le checkout hosted CyberSource :
header('Location: ' . $payment['checkout_url']);
exit;
```

## Vérification de webhook (Laravel)

```php
// routes/api.php
Route::post('/webhooks/nexera', [WebhookController::class, 'nexera']);

// app/Http/Controllers/WebhookController.php
public function nexera(Request $request)
{
    $payload   = $request->getContent();
    $signature = $request->header('X-Nexera-Signature');

    try {
        $event = $this->nexera->webhooks->verify(
            $payload,
            $signature,
            env('NEXERA_WEBHOOK_SECRET'),
        );
    } catch (\Nexera\Pay\Exception\SignatureException $e) {
        return response('bad signature', 400);
    }

    if ($event['type'] === 'payment.completed') {
        $order = Order::where('reference', $event['data']['reference'])->first();
        $order?->markAsPaid();
    }

    return response('ok', 200);
}
```

Version Symfony / WordPress dans le [README GitHub](https://github.com/Nexera-Africa-DRC/nexera-pay-php).

## Intégration WordPress

Le SDK est utilisable dans un thème ou un plugin custom. Pour une intégration clé-en-main dans WooCommerce, préférez le plugin officiel [Nexera Pay for WooCommerce](/plugins/woocommerce) — il embarque le SDK et gère l'écran de config admin.

## Ressources

- **Package Packagist** : [packagist.org/packages/nexera/pay](https://packagist.org/packages/nexera/pay)
- **Code source** : [github.com/Nexera-Africa-DRC/nexera-pay-php](https://github.com/Nexera-Africa-DRC/nexera-pay-php)
- **Changelog** : GitHub Releases.
