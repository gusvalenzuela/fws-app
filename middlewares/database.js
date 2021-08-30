import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URX)

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
  await client.connect()
  req.dbClient = client
  req.db = client.db(process.env.DB_NAME)
  await setUpDb(req.db)

  return next()
}
