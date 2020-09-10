import nextConnect from "next-connect";
import middleware from "../../../middlewares/middleware";

const handler = nextConnect();

handler.use(middleware);

// handler.get(async (req, res) => {
//   const results = await getMatchupResults(req);
//   res.send({ results });
// });
handler.patch(async (req, res) => {
  // if (!req.user) {
  //   return res.status(401).send("unauthenticated");
  // }

  let slimSchedule = req.body.events.map((evt) => {
    let desired = evt.lines["2"]; // affiliate Bovada
    evt.lines = desired;

    return evt;
  });
  // console.log(req.body, req.user);
  const result = await req.db.collection("schedule").updateOne(
    { RundownSportId: Number(req.query.sportId) },
    {
      $set: {
        RundownSportId: Number(req.query.sportId),
        events: slimSchedule,
        updatedAt: Date.now(),
      },
    },
    { upsert: true }
  );

  return res.status(200).json(result);
});

export default handler;
