/* eslint-disable import/no-mutable-exports */
/* eslint-disable no-underscore-dangle */
import { MongoClient } from 'mongodb'

let client
let clientPromise

const isDev = process.env.NODE_ENV === 'development'
const uri = isDev ? process.env.MONGODB_LOCAL_URX : process.env.MONGODB_URX
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  keepAlive: false,
}

if (isDev) {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function setUpDb(db) {
  db.collection('tokens').createIndex(
    { expireAt: -1 },
    { expireAfterSeconds: 0 }
  )
  db.collection('picks').createIndex(
    { matchupId: 1, userId: 1, seasonYear: 1, week: 1 },
    { unique: true }
  )
  db.collection('users').createIndex(
    { email: 1, username: 1 },
    { unique: true }
  )
}

export default async function database(req, _res, next) {
  // await client.connect()
  req.dbClient = client
  req.db = (await clientPromise).db(process.env.DB_NAME)
  await setUpDb(req.db)

  return next()
}

export { client, clientPromise }
// // Export a module-scoped MongoClient promise. By doing this in a
// // separate module, the client can be shared across functions.
// export default clientPromise
