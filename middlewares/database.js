import { MongoClient } from "mongodb";
// import Mongoose from "mongoose";
// import { scheduleSchema } from "./schemas/index";

const client = new MongoClient(process.env.MONGODB_URX, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  keepAlive: false,
  keepAliveInitialDelay: 1000,
});

// const gooseClient = Mongoose.connect("mongodb://localhost:3000/fwsDBTest", {
//   useNewUrlParser: true,
// });

export async function setUpDb(db) {
  db.collection("tokens").createIndex(
    { expireAt: -1 },
    { expireAfterSeconds: 0 }
  );
  db.collection("pickz").createIndex(
    { event_id: 1, userId: 1 },
    { unique: true }
  );
  db.collection("users").createIndex(
    { email: 1, username: 1 },
    { unique: true }
  );
}
// export async function setUpMongooseDb(db) {
//   const Kitten = mongoose.model('Kitten', kittySchema);
// }

export default async function database(req, res, next) {
  if (!client.isConnected()) await client.connect();
  req.dbClient = client;
  req.db = client.db(process.env.DB_NAME);
  await setUpDb(req.db);

  return next();
}
