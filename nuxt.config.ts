import { NuxtConfig } from '@nuxt/types'
import { config as dotenv } from 'dotenv'

dotenv()

const version = require('./package.json').version
const isDevelopment = (process.env.NODE_ENV === 'development')
const isCI = (process.env.CI === 'true')

let envPrefix: string
if (process.env.NODE_ENV === 'production') {
  envPrefix = 'PROD'
} else if (process.env.NODE_ENV === 'staging') {
  envPrefix = 'STAGE'
} else {
  envPrefix = 'DEV'
}

const META = {
  title: 'Welcome to WWDCScholars',
  description: 'Take a look at Apple WWDC Scholarship winners from all around the world as well as their winning submissions!',
  image: `${process.env.BASE_URL}/images/og-image.jpg`,
  url: `${process.env.BASE_URL}`
}

const config: NuxtConfig = {
  ssr: false,

  /*
   ** Headers of the page
   */
  head: {
    title: META.title,
    meta: [
      { name: 'Content-Type', content: 'text/html', charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: META.description, hid: 'description' },

      // App Store Banner
      { name: 'apple-itunes-app', content: 'app-id=1459158255' },

      // Social Cards
      { property: 'og:type', content: 'website', hid: 'og:type' },
      { property: 'og:title', content: META.title, hid: 'og:title' },
      { property: 'og:description', content: META.description, hid: 'og:description' },
      { property: 'og:image', content: META.image, hid: 'og:image' },
      { property: 'og:image:alt', content: META.title, hid: 'og:image:alt' },
      { property: 'og:url', content: META.url, hid: 'og:url' },
      { name: 'twitter:card', content: 'summary_large_image', hid: 'twitter:card' },
      { name: 'twitter:title', content: META.title, hid: 'twitter:title' },
      { name: 'twitter:description', content: META.description, hid: 'twitter:description' },
      { name: 'twitter:image', content: META.image, hid: 'twitter:image' },
      { name: 'twitter:image:alt', content: META.title, hid: 'twitter:image:alt' },
      { name: 'twitter:url', content: META.url, hid: 'twitter:url' },
      { name: 'twitter:site', content: '@WWDCScholars' }
    ],
    link: [
      { rel: 'canonical', href: META.url, hid: 'canonical' },
      { rel: 'icon', type: 'image/x-icon', href: '/icons/favicon.ico' },
      {
        rel: 'apple-touch-icon-precomposed',
        href: '/icons/favicon-180.png',
        sizes: '180x180'
      },
      {
        rel: 'apple-touch-icon-precomposed',
        href: '/icons/favicon-152.png',
        sizes: '152x152'
      },
      {
        rel: 'apple-touch-icon-precomposed',
        href: '/icons/favicon-120.png',
        sizes: '120x120'
      }
    ],
  },

  /*
   ** Environent variables
   */
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  },

  /*
   ** Runtime configuration
   */

  publicRuntimeConfig: {
    mapKitJwt: process.env[`${envPrefix}_MAPKIT_JWT`],
    colors: {
      purple: 'rgb(65, 53, 153)'
    }
  },
  privateRuntimeConfig: {},

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: 'rgb(65, 53, 153)',
    failedColor: '#D83946'
  },

  /*
   ** Global CSS
   */
  css: ['~assets/sass/app/_index.sass'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/globals',
    '~/plugins/filters',
    '~/plugins/vue-lazyload',
    '~/plugins/mapkit',
    '~/plugins/vee-validate',

    '~/plugins/auth'
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Load CloudKit
    '@wwdcscholars/cloudkit',

    // Load Plausible Analytics
    'vue-plausible',

    // Load sentry
    '@nuxtjs/sentry',

    // Load color-scheme / colorMode
    '@nuxtjs/color-mode'
  ],

  /*
   ** Global SASS variables and mixins
   */
  styleResources: {
    sass: ['~assets/sass/imports/_index.sass']
  },

  /*
   ** CloudKit configuration
   */
  cloudKit: {
    container: {
      containerIdentifier: process.env[`${envPrefix}_CLOUDKIT_CONTAINER_IDENTIFIER`],
      apiToken: process.env[`${envPrefix}_CLOUDKIT_API_TOKEN`],
      environment: process.env[`${envPrefix}_CLOUDKIT_ENVIRONMENT`]
    },
    authTokenStore: {
      secure: !isDevelopment // don't set `Secure` flag in development mode
    }
  },

  /*
   ** Plausible Analytics configuration
   */
  plausible: {
    domain: process.env[`${envPrefix}_PLAUSIBLE_DOMAIN`],
    apiHost: process.env[`${envPrefix}_PLAUSIBLE_API_HOST`]
  },

  /*
   ** Sentry configuration
   */
  sentry: {
    disabled: isDevelopment,
    dsn: process.env.SENTRY_DSN,
    publishRelease: isCI,
    sourceMapStyle: 'hidden-source-map',
    attachCommits: true,
    config: {
      environment: process.env[`${envPrefix}_SENTRY_ENVIRONMENT`],
      release: `app@v${version}`,
      beforeBreadcrumb(breadcrumb, hint) {
        if (breadcrumb.type === 'ui') return null
        return breadcrumb
      }
    }
  },

  /*
   ** Extend router configuration
   */
  router: {
    extendRoutes(routes: any[], resolve: Function) {
      // Add route for year selection
      routes.push({
        name: 'scholars-year',
        path: '/:year?',
        component: resolve(__dirname, 'pages/index.vue')
      })
    }
  },

  /*
   ** Build modules
   */
  buildModules: [
    // Transpile TypeScript
    '@nuxt/typescript-build',

    // Load global SASS variables and mixins
    '@nuxtjs/style-resources',

    // Load svg loader
    '@nuxtjs/svg',
  ],

  /*
   ** Build configuration
   */
  build: {
    transpile: [
      'vee-validate/dist/rules'
    ],
    /*
     ** You can extend webpack config here
     */
    extend(config: any/*, ctx*/) {
      config.node = {
        fs: 'empty',
        crypto: 'empty'
      }
    }
  },

  /*
   ** Generate a 404 page
   */
  generate: {
    fallback: '404.html'
  },

  /*
   ** Lifecycle hooks
   */
  hooks: {
    build: {
      done() {
        // misbehaving CloudKit import workaround
        if (!isDevelopment) {
          setTimeout(() => process.exit(0), 1000)
        }
      }
    }
  },


  /*
   ** Setup color-scheme
  */
  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '-mode',
    storageKey: 'nuxt-color-mode'
  }
}

export default config
