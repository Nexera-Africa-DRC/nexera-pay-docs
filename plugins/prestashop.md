# Plugin PrestaShop

Le module **Nexera Pay for PrestaShop** ajoute les paiements Mobile Money (M-Pesa, Airtel Money, Orange Money, Afrimoney) et carte bancaire (Visa / Mastercard 3-D Secure) sur votre boutique PrestaShop.

## Prérequis

- **PrestaShop** 1.7.6.0 → 8.x
- **PHP** 8.0+
- Extensions : `ext-curl`, `ext-json`
- Un **compte marchand Nexera Pay** activé (clés API + secret webhook)

## Installation depuis le ZIP officiel

1. Téléchargez la dernière release ZIP depuis [github.com/Nexera-Africa-DRC/nexera-pay-prestashop/releases](https://github.com/Nexera-Africa-DRC/nexera-pay-prestashop/releases).
2. Admin PrestaShop : **Modules → Gestionnaire de modules → Téléverser un module**.
3. Sélectionnez le ZIP puis cliquez **Téléverser ce module**.
4. Cliquez **Installer** puis **Configurer**.

## Installation depuis les sources

```bash
git clone https://github.com/Nexera-Africa-DRC/nexera-pay-prestashop.git nexerapay
cd nexerapay
composer install --no-dev
zip -r ../nexerapay.zip .
```

Puis téléverser `nexerapay.zip` via l'admin PrestaShop.

## Configuration

Depuis l'écran de configuration du module :

- **Environnement** : `Test` (sandbox) ou `Live` (production).
- **Clé API** : `nex_live_...` ou `nex_test_...`.
- **Secret API** : le secret HMAC.
- **Secret Webhook** : fourni par le dashboard Nexera Pay.
- **Devises acceptées** : USD, CDF, ou les deux.
- **Méthodes** : Mobile Money uniquement, Carte uniquement, ou les deux.
- **Ordre d'affichage** : place de la passerelle dans la liste des moyens de paiement au checkout.

Puis, dans votre [dashboard Nexera Pay](https://merchants.nexera.africa), configurez l'URL webhook :

```
https://<votre-boutique>.com/module/nexerapay/webhook
```

## Vérification

- La passerelle **Nexera Pay** doit apparaître au checkout front-office (méthodes de paiement).
- Testez une commande en mode `Test` avec un MSISDN sandbox (`243812345001` = succès).
- Vérifiez que la commande passe automatiquement à l'état **Paiement accepté** après la confirmation webhook.

## Français par défaut

L'interface admin et les libellés front-office sont **en français** par défaut (marché cible : RDC + Afrique francophone). Les chaînes sont traduisibles via le système de traduction standard PrestaShop pour l'anglais, le lingala ou toute autre langue installée sur votre boutique.

## Support

- **Code source** : [github.com/Nexera-Africa-DRC/nexera-pay-prestashop](https://github.com/Nexera-Africa-DRC/nexera-pay-prestashop)
- **Issues / bugs** : GitHub Issues sur le repo.
- **Contact équipe** : dev@nexera.africa
