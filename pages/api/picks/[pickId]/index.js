import nextConnect from "next-connect";
import middleware from "../../../../middlewares/middleware";
import { getPick } from "../../../../lib/db";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  const pick = await getPick(req, req.query.eventId);
  res.send({ pick });
});

handler.patch(async (req, res) => {
  if (!req.user) {
    return res.status(401).send("unauthenticated");
  }
  // console.log(req.body, req.user);
  await req.db.collection("picks").updateOne(
    { $and: [{ event_id: req.body.event_id }, { userId: req.user._id }] },
    {
      $set: {
        ...req.body,
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
