/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Christian Taillon',
  author: 'Christian Taillon',
  headerTitle: 'Christian Taillon',
  description: 'Christian Taillon\'s cybersecurity and AI resource hub. Expert guides on Splunk, threat hunting, SOC operations, LLM security, and open-source intelligence. Comprehensive cheatsheets, tutorials, and tools for information security professionals and AI developers.',
  language: 'en-us',
  theme: 'system', // system, dark or light
  siteUrl: 'https://christiant.io/',
  siteRepo: 'https://github.com/christian-taillon/website',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,
  email: 'public@christiant.io',
  github: 'https://github.com/christian-taillon',
  x: 'https://twitter.com/christian_tail',
  linkedin: 'https://linkedin.com/in/christiantaillon',
  medium: 'https://medium.com/@christiantaillon',
  locale: 'en-US',
  // set to true if you want a navbar fixed to the top
  stickyNav: false,
  search: {
    provider: 'kbar', // kbar or algolia
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`, // path to load documents to search
    },
    // provider: 'algolia',
    // algoliaConfig: {
    //   // The application ID provided by Algolia
    //   appId: 'R2IYF7ETH7',
    //   // Public API key: it is safe to commit it
    //   apiKey: '599cec31baffa4868cae4e79f180729b',
    //   indexName: 'docsearch',
    // },
  },
}

module.exports = siteMetadata
