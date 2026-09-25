# Plugin WooCommerce

Le plugin **Nexera Pay for WooCommerce** ajoute une passerelle de paiement WooCommerce qui accepte le Mobile Money (M-Pesa, Airtel Money, Orange Money, Afrimoney) et la carte bancaire (Visa / Mastercard 3-D Secure) en USD et CDF — sans écrire une ligne de code.

## Prérequis

- **WordPress** 6.0+
- **WooCommerce** 6.0+
- **PHP** 8.0+
- Un **compte marchand Nexera Pay** activé (avec vos clés API)

## Installation

### Depuis le ZIP officiel

1. Téléchargez la dernière release ZIP depuis [github.com/Nexera-Africa-DRC/nexera-pay-woocommerce/releases](https://github.com/Nexera-Africa-DRC/nexera-pay-woocommerce/releases).
2. Dans l'admin WordPress : **Extensions → Ajouter → Téléverser une extension**.
3. Sélectionnez le ZIP puis cliquez **Installer maintenant**.
4. Cliquez **Activer**.

### Depuis wordpress.org (bientôt)

Une fois publié sur le répertoire officiel, l'installation se fera en un clic depuis WordPress. Voir les [releases GitHub](https://github.com/Nexera-Africa-DRC/nexera-pay-woocommerce/releases) pour l'état actuel.

### Depuis les sources (développeurs)

```bash
git clone https://github.com/Nexera-Africa-DRC/nexera-pay-woocommerce.git
cd nexera-pay-woocommerce
composer install --no-dev
```

Symlink ou copie du dossier dans `wp-content/plugins/nexera-pay/`.

## Configuration

1. **WooCommerce → Réglages → Paiements** — la passerelle **Nexera Pay** apparaît dans la liste.
2. Cliquez **Gérer** et renseignez :
   - **Mode** : `Test` pour la sandbox, `Live` pour la production.
   - **Clé API** : votre `nex_live_...` (ou `nex_test_...`).
   - **Secret API** : votre secret HMAC.
   - **Secret Webhook** : le secret webhook fourni dans votre dashboard Nexera Pay.
   - **Devises acceptées** : USD, CDF ou les deux.
   - **Méthodes acceptées** : Mobile Money, Carte, ou les deux.
3. **Enregistrer les modifications**.
4. Configurez l'URL webhook dans votre [dashboard Nexera Pay](https://admin-pay.nexera.africa) :
   ```
   https://<votre-site>.com/wp-json/nexera-pay/v1/webhook
   ```

## Test

Passez une commande de test en mode `Test` avec ces MSISDN sandbox :

- **M-Pesa Vodacom** : `243812345001` — succès garanti
- **Airtel Money** : `243971069967` — succès garanti

La commande passe en statut **Terminée** dès la confirmation webhook.

## Cas d'usage typiques

- **Boutique WooCommerce classique** — la passerelle apparaît sur la page checkout à côté des autres modes de paiement.
- **Multi-devises USD + CDF** — activez les deux ; le client paie dans la devise du produit.
- **Boutique 100% mobile** — le Mobile Money couvre plus de 80 % de la population RDC bancarisée par téléphone.

## Support

- **Code source** : [github.com/Nexera-Africa-DRC/nexera-pay-woocommerce](https://github.com/Nexera-Africa-DRC/nexera-pay-woocommerce)
- **Issues / bugs** : GitHub Issues sur le repo.
- **Contact équipe** : dev@nexera.africa
