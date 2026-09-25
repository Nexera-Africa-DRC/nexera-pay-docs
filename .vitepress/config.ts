import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'fr-FR',
  title: 'Nexera Pay',
  description: 'Documentation Nexera Pay — API paiement RDC (Mobile Money + Carte)',
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['README.md'],

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#0f172a' }],
    ['meta', { property: 'og:title', content: 'Nexera Pay — Documentation' }],
    ['meta', { property: 'og:description', content: "API d'encaissement RDC — Mobile Money + Carte, une seule intégration REST" }],
    ['meta', { property: 'og:url', content: 'https://docs.nexera.africa' }],
    ['meta', { property: 'og:image', content: 'https://docs.nexera.africa/favicon.png' }],
  ],

  themeConfig: {
    siteTitle: 'Nexera Pay Docs',
    logo: '/nexera-logo.png',

    nav: [
      { text: 'Quickstart', link: '/quickstart' },
      { text: 'Guides', link: '/authentication' },
      { text: 'Sécurité', link: '/security' },
      { text: 'Status', link: 'https://status.nexera.africa' },
    ],

    sidebar: [
      {
        text: 'Prise en main',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Quickstart 5 min', link: '/quickstart' },
          { text: 'Authentication', link: '/authentication' },
          { text: 'Testing & Sandbox', link: '/testing-sandbox' },
        ],
      },
      {
        text: 'SDK officiels',
        items: [
          { text: 'JavaScript / TypeScript', link: '/sdks/javascript' },
          { text: 'Python', link: '/sdks/python' },
          { text: 'PHP', link: '/sdks/php' },
        ],
      },
      {
        text: 'Plugins e-commerce',
        items: [
          { text: 'WooCommerce', link: '/plugins/woocommerce' },
          { text: 'PrestaShop', link: '/plugins/prestashop' },
        ],
      },
      {
        text: 'Endpoints REST',
        items: [
          { text: 'Payments', link: '/payments' },
          { text: 'Payouts B2C', link: '/payouts' },
          { text: 'Refunds', link: '/refunds' },
          { text: 'Balance & Settlements', link: '/balance-settlements' },
          { text: 'Webhooks', link: '/webhooks' },
        ],
      },
      {
        text: 'Références',
        items: [
          { text: 'Erreurs (RFC 7807)', link: '/errors' },
          { text: 'Sécurité', link: '/security' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Nexera-Africa-DRC' },
    ],

    footer: {
      message: 'Nexera Pay · Fais-le tourner.',
      copyright: 'Nexera — SODOTECH SARL · RCCM CD/KNG/RCCM/24-B-00910',
    },

    editLink: {
      pattern: 'https://github.com/Nexera-Africa-DRC/nexera-pay-docs/edit/main/:path',
      text: 'Suggérer une modif',
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: 'Rechercher', buttonAriaLabel: 'Rechercher' },
          modal: {
            noResultsText: 'Aucun résultat pour',
            resetButtonTitle: 'Effacer',
            footer: {
              selectText: 'ouvrir',
              navigateText: 'naviguer',
              closeText: 'fermer',
            },
          },
        },
      },
    },

    outline: {
      label: 'Sur cette page',
    },

    docFooter: {
      prev: 'Précédent',
      next: 'Suivant',
    },

    darkModeSwitchLabel: 'Thème',
    sidebarMenuLabel: 'Menu',
    returnToTopLabel: 'Haut de page',
    lastUpdatedText: 'Dernière mise à jour',
  },
})
