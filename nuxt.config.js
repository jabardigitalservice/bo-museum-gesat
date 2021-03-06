export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Reservasi Digiteam',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  router: {
    middleware: ['auth']
  },

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '@/plugins/vClickOutside', ssr: false },
    { src: '@/plugins/vModal', ssr: false },
    { src: '@/plugins/vue-datepicker', ssr: false }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: [
    '~/components', // shortcut to { path: '~/components' }
    { path: '~/components/recurring' }
  ],

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/dotenv'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/toast',
    'nuxt-sweetalert2',
    '@nuxtjs/auth-next',
    '@nuxtjs/sentry',
    '@nuxtjs/google-analytics'
  ],

  sentry: {
    dsn: process.env.SENTRY_LARAVEL_DSN, // project's DSN here
    config: {
      environment: process.env.APP_ENV || 'localhost'
    }, // Additional config
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE) || 0.0,
    tracing: true
  },

  // Google Analytics Config
  googleAnalytics: {
    id: process.env.GOOGLE_ANALYTICS_ID // Use as fallback if no runtime config is provided
  },

  publicRuntimeConfig: {
    googleAnalytics: {
      id: process.env.GOOGLE_ANALYTICS_ID
    }
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: process.env.API_URL
  },

  auth: {
    redirect: {
      login: '/login',
      logout: '/logout',
      callback: '/callback',
      home: '/reservasi'
    },
    strategies: {
      keycloak: {
        scheme: 'oauth2',
        endpoints: {
          authorization: `${process.env.KEYCLOAK_AUTHSERVERURL}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/auth`,
          token: `${process.env.KEYCLOAK_AUTHSERVERURL}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
          logout: `${process.env.KEYCLOAK_AUTHSERVERURL}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/logout?redirect_uri=` + encodeURIComponent(String(process.env.KEYCLOAK_REDIRECTLOGOUTURI)),
          userInfo: `${process.env.KEYCLOAK_AUTHSERVERURL}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`
        },
        token: {
          property: 'access_token',
          type: 'Bearer',
          name: 'Authorization',
          maxAge: 1800 // Can be dynamic ?
        },
        refreshToken: {
          property: 'refresh_token',
          maxAge: 60 * 60 * 24 * 30 // Can be dynamic ?
        },
        responseType: 'code',
        grantType: 'authorization_code',
        accessType: 'offline',
        clientId: process.env.KEYCLOAK_CLIENTID,
        scope: ['openid', 'profile', 'email', 'roles'],
        codeChallengeMethod: 'S256'
      }
    }
  },

  css: [
    // CSS file in the project
    '~/assets/css/style.css',
    'boxicons/css/boxicons.min.css'
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extend (config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        })
      }
    }
  }
}
