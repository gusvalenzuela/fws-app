import session from 'express-session'
import MongoStore from 'connect-mongo'

const isDev = process.env.NODE_ENV !== 'production'

export default function sessionMiddleware(req, res, next) {
  // const mongoClient = req.dbClient
  const mongoStore = MongoStore.create({
    mongoUrl: isDev ? process.env.MONGODB_LOCAL_URX : process.env.MONGODB_URX,
    mongoOptions: {
      keepAlive: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
    // mongoClient,
    // stringify: false,
  })
  return session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    touchAfter: 8 * 3600, // time period in seconds
    // maxAge: 
  })(req, res, next)
}
