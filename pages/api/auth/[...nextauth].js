import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { getUser } from '../../../lib/db'

const { DEMO_USER, NODE_ENV } = process.env
const isDev = NODE_ENV === 'development'

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function handler(req, res) {
  NextAuth(req, res, {
    // https://next-auth.js.org/configuration/providers
    providers: [
      Providers.Google({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
      }),
      Providers.Facebook({
        clientId: isDev
          ? process.env.FACEBOOK_ID_TEST
          : process.env.FACEBOOK_ID,
        clientSecret: isDev
          ? process.env.FACEBOOK_SECRET_TEST
          : process.env.FACEBOOK_SECRET,
      }),
      // Providers.Email({
      //   server: process.env.EMAIL_SERVER,
      //   from: process.env.EMAIL_FROM,
      // }),
      Providers.Credentials({
        id: 'demo',
        type: 'credentials',
        // THIS IS A DEMO PROVIDER
        // only job is to log in a demo
        // The name to display on the sign in form (e.g. 'Sign in with...')
        name: 'Demo',
        // The credentials is used to generate a suitable form on the sign in page.
        // You can specify whatever fields you are expecting to be submitted.
        // e.g. domain, username, password, 2FA token, etc.
        credentials: {
          email: {
            label: 'Email',
            type: 'text',
            placeholder: 'email@example.com',
          },
        },
        async authorize(credentials, request) {
          if (!DEMO_USER) return null
          if (credentials.email === 'demo@email.com') {
            const user = await getUser(request, DEMO_USER, 'demo')
            if (user) {
              return { id: DEMO_USER, ...user }
            }
          }
          // If you return null or false then the credentials will be rejected
          return null
          // You can also Reject this callback with an Error or with a URL:
          // throw new Error('error message') // Redirect to error page
          // throw '/path/to/redirect'        // Redirect to a URL
        },
      }),
      // Temporarily removing the Apple provider from the demo site as the
      // callback URL for it needs updating due to Vercel changing domains
      /*
      Providers.Apple({
        clientId: process.env.APPLE_ID,
        clientSecret: {
          appleId: process.env.APPLE_ID,
          teamId: process.env.APPLE_TEAM_ID,
          privateKey: process.env.APPLE_PRIVATE_KEY,
          keyId: process.env.APPLE_KEY_ID,
        },
      }),
      */
      // Providers.GitHub({
      //   clientId: process.env.GITHUB_ID,
      //   clientSecret: process.env.GITHUB_SECRET,
      //   // https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps
      //   scope: "read:user"
      // }),
      // Providers.Twitter({
      //   clientId: process.env.TWITTER_ID,
      //   clientSecret: process.env.TWITTER_SECRET,
      // }),
      // Providers.Auth0({
      //   clientId: process.env.AUTH0_ID,
      //   clientSecret: process.env.AUTH0_SECRET,
      //   domain: process.env.AUTH0_DOMAIN,
      // }),
    ],
    // Database optional. MySQL, Maria DB, Postgres and MongoDB are supported.
    // https://next-auth.js.org/configuration/databases
    //
    // Notes:
    // * You must install an appropriate node_module for your database
    // * The Email provider requires a database (OAuth providers do not)
    database: isDev ? process.env.MONGODB_LOCAL_URX : process.env.MONGODB_URX,

    // The secret should be set to a reasonably long random string.
    // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
    // a separate secret is defined explicitly for encrypting the JWT.
    secret: process.env.NEXTAUTH_SECRET,

    session: {
      // Use JSON Web Tokens for session instead of database sessions.
      // This option can be used with or without a database for users/accounts.
      // Note: `jwt` is automatically set to `true` if no database is specified.
      jwt: false,

      // Seconds - How long until an idle session expires and is no longer valid.
      // maxAge: 1 * 24 * 60 * 60, // 1 day

      // Seconds - Throttle how frequently to write to database to extend a session.
      // Use it to limit write operations. Set to 0 to always update the database.
      // Note: This option is ignored if using JSON Web Tokens
      // updateAge: 24 * 60 * 60, // 24 hours
    },

    // JSON Web tokens are only used for sessions if the `jwt: true` session
    // option is set - or by default if no database is specified.
    // https://next-auth.js.org/configuration/options#jwt
    jwt: {
      // A secret to use for key generation (you should set this explicitly)
      secret: process.env.JWT_SECRET,
      // Set to true to use encryption (default: false)
      encryption: true,
      signingKey: process.env.JWT_SIGNING_KEY,
      // You can define your own encode/decode functions for signing and encryption
      // if you want to override the default behaviour.
      // encode: async ({ secret, token, maxAge }) => {},
      // decode: async ({ secret, token, maxAge }) => {},
    },

    // You can define custom pages to override the built-in ones. These will be regular Next.js pages
    // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
    // The routes shown here are the default URLs that will be used when a custom
    // pages is not specified for that route.
    // https://next-auth.js.org/configuration/pages
    pages: {
      // signIn: '/auth/signin',  // Displays signin buttons
      // signOut: '/auth/signout', // Displays form with sign out button
      // error: '/auth/error', // Error code passed in query string as ?error=
      // verifyRequest: '/auth/verify-request', // Used for check email page
      // newUser: null // If set, new users will be directed here on first sign in
    },

    // Callbacks are asynchronous functions you can use to control what happens
    // when an action is performed.
    // https://next-auth.js.org/configuration/callbacks
    callbacks: {
      // async signIn(user, account, profile) { return true },
      // async redirect(url, baseUrl) { return baseUrl },
      /**
       * @param  {object} session      Session object
       * @param  {object} token        User object    (if using database sessions)
       *                               JSON Web Token (if not using database sessions)
       * @return {object}              Session that will be returned to the client
       */
      async session(session, token) {
        const reshapedSession = { ...session }
        // console.log(session, token)
        // Add property to session, like an access_token from a provider.
        // session.accessToken = token.accessToken
        if (session?.user) {
          reshapedSession.user.id = token.id
        }
        return reshapedSession
      },
      // /**
      //  * @param  {object}  token     Decrypted JSON Web Token
      //  * @param  {object}  user      User object      (only available on sign in)
      //  * @param  {object}  account   Provider account (only available on sign in)
      //  * @param  {object}  profile   Provider profile (only available on sign in)
      //  * @param  {boolean} isNewUser True if new user (only available on sign in)
      //  * @return {object}            JSON Web Token that will be saved
      //  */
      // async jwt(token) {return token},
    },

    // Events are useful for logging
    // https://next-auth.js.org/configuration/events
    events: {},

    // You can set the theme to 'light', 'dark' or use 'auto' to default to the
    // whatever prefers-color-scheme is set to in the browser. Default is 'auto'
    theme: 'light',

    // Enable debug messages in the console if you are having problems
    debug: false,
  })
}
