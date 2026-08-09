import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'fr-FR',
  title: 'Nexera Pay',
  description: 'Documentation Nexera Pay — API paiement RDC (Mobile Money + Carte)',
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['README.md'],

  head: [
    ['link', { rel: 'icon', href: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\'%3E%3Ctext y=\'26\' font-size=\'26\'%3E💎%3C/text%3E%3C/svg%3E' }],
    ['meta', { name: 'theme-color', content: '#0f172a' }],
    ['meta', { property: 'og:title', content: 'Nexera Pay — Documentation' }],
    ['meta', { property: 'og:description', content: 'API paiement Payment Facilitator RDC — Mobile Money + Carte' }],
    ['meta', { property: 'og:url', content: 'https://docs.nexera.africa' }],
  ],

  themeConfig: {
    siteTitle: 'Nexera Pay Docs',

    nav: [
      { text: 'Quickstart', link: '/quickstart' },
      { text: 'Guides', link: '/authentication' },
      { text: 'Sécurité', link: '/security' },
      { text: 'API Live', link: 'https://pay.nexera.africa/docs' },
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
        text: 'Endpoints',
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
      { icon: 'github', link: 'https://github.com/nexera' },
    ],

    footer: {
      message: 'Nexera · Fais-le tourner.',
      copyright: 'Nexera — SODOTECH SARL · RCCM CD/KNG/RCCM/24-B-00910',
    },

    editLink: {
      pattern: 'https://github.com/nexera/nexera-pay-docs/edit/main/:path',
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
