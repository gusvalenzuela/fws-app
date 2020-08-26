import nextConnect from "next-connect";
import middleware from "../../../../middlewares/middleware";
import { getSchedule } from "../../../../lib/db";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  const schedule = await getSchedule(req, req.query.sport);
  res.send({schedule});
});
handler.patch(async (req, res) => {
  // if (!req.user) {
  //   return res.status(401).send("unauthenticated");
  // }
  console.log(req.body, req.user);
  // const result = await req.db.collection("schedule").updateOne(
  //   { RundownSportId: req.query.sport },
  //   {
  //     $set: {
  //       ...req.body,
  //       updatedAt: Date.now(),
  //     },
  //   },
  //   { upsert: true }
  // );

  return res.status(200).json({});
});

export default handler;
