import nextConnect from "next-connect";
import { nanoid } from "nanoid";
import middleware from "../../../middlewares/middleware";
const handler = nextConnect();

handler.use(middleware);

handler.get(async ({ user, db }, res) => {
  if (!user) res.send(null);
  // const options = {
  //   // Include only the `_id`, `name`, and `emailverified` fields in each returned document
  //   projection: {
  //     _id: 1,
  //     email: 0,
  //     password: 0,
  //     name: 1,
  //     emailVerified: 1,
  //     bio: 0,
  //     profilePicture: 0,
  //   },
  // };
  const picks = await db
    .collection("picks")
    .find({ userId: user._id })
    .toArray();
  res.status(200).json({ picks: picks });
});

handler.post(async (req, res) => {
  // console.log(req.user);
  if (!req.user) {
    return res.status(401).send("unauthenticated");
  }

  // const { selection } = req.body;

  // if (!selection) return res.status(400).send("You must write something");

  const pick = {
    _id: nanoid(),
    createdAt: new Date(),
    userId: req.user._id,
    ...req.body,
  };

  await req.db.collection("picks").insertOne(pick);
  return res.send(pick);
});

handler.patch(async (req, res) => {
  if (!req.user) {
    return res.status(401).send("unauthenticated");
  }

  // console.log(req.body);
  const { ops } = await req.db.collection("picks").replaceOne(
    { event_id: req.body.event_id },
    {
      ...req.body,
      userId: req.user._id,
      updatedAt: Date.now(),
    },
    { upsert: true }
  );

  return res.send(ops[0]);
});

export default handler;
