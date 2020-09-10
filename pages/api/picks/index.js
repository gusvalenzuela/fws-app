import nextConnect from "next-connect";
import { nanoid } from "nanoid";
import middleware from "../../../middlewares/middleware";
const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  if (!req.user) res.send(null);
  const picks = await req.db
    .collection("picks")
    .find({ userId: req.user._id })
    .toArray();
  res.status(200).json({ picks: picks });
});

handler.post(async (req, res) => {
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
  await req.db.collection("picks").updateOne(
    { $and: [{ event_id: req.body.event_id }, { userId: req.user._id }] },
    {
      $set: {
        ...req.body,
        userId: req.user._id,
        updatedAt: Date.now(),
      },
    },
    { upsert: true }
  );

  const teamPick = await req.db
    .collection("picks")
    .find({ $and: [{ event_id: req.body.event_id }, { userId: req.user._id }] })
    .toArray();
  return res.status(200).json(teamPick[0]);
});

export default handler;
