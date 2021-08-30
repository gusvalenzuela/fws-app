import session from 'express-session'
import MongoStore from 'connect-mongo'

export default function sessionMiddleware(req, res, next) {
  // const mongoClient = req.dbClient
  const mongoStore = MongoStore.create({
    mongoUrl: process.env.MONGODB_URX,
    mongoOptions: { keepAlive: false },
    // mongoClient,
    // stringify: false,
  })
  return session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    touchAfter: 8 * 3600 // time period in seconds
  })(req, res, next)
}
