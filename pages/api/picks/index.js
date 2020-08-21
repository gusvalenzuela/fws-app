import nextConnect from "next-connect";
import { nanoid } from "nanoid";
import middleware from "../../../middlewares/middleware";
const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  if (!req.user) {
    return res.status(401).send("unauthenticated");
  }
  // : Fetch picks
  const picks = await req.db
    .collection("picks")
    .find({
      userId: req.user._id,
    })
    .sort({ createdAt: -1 })
    .toArray();

  res.json({ picks });
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
  const { result } = await req.db.collection("picks").replaceOne(
    { event_id: req.body.event_id },
    {
      ...req.body,
      userId: req.user._id,
      updatedAt: Date.now(),
    },
    { upsert: true }
  );

  return res.send(result);
});

export default handler;
