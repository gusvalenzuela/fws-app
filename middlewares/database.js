import { MongoClient } from 'mongodb'
import SC from '@sanity/client'

const sanityClient = SC({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TEAMS_TOKEN, // we need this to get write access
  useCdn: false, // We can't use the CDN for writing
})

const client = new MongoClient(process.env.MONGODB_URX, {
  useUnifiedTopology: true,
  keepAlive: false,
  keepAliveInitialDelay: 1000 * 60 , // 1minDelay
})

export async function setUpDb(db) {
  db.collection('tokens').createIndex(
    { expireAt: -1 },
    { expireAfterSeconds: 0 }
  )
  db.collection('pickz').createIndex(
    { event_id: 1, userId: 1 },
    { unique: true }
  )
  db.collection('users').createIndex(
    { email: 1, username: 1 },
    { unique: true }
  )
}

export default async function database(req, res, next) {
  if (!client.isConnected()) await client.connect()
  req.dbClient = client
  req.db = client.db(process.env.DB_NAME)
  req.SanityClient = sanityClient
  // await setUpDb(req.db)

  return next()
}
