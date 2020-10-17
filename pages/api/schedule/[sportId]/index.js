import nextConnect from "next-connect";
import middleware from "../../../../middlewares/middleware";
import { getSchedule } from "../../../../lib/db";
// import NFLSchedule from "../../../../.local-planning/schedules/nfl/events.json";
// import UFCSchedule from "../../../../.local-planning/schedules/ufc/events.json";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  const schedule = await getSchedule(req, req.query.sportId);
  res.send({ schedule });
});
handler.patch(async (req, res) => {
  // if (!req.user) {
  //   return res.status(401).send("unauthenticated");
  // }

  // console.log(req.body, req.user);
  let slimSchedule = req.body.map((evt) => {
    if (evt.lines && evt.lines["2"]) {
      let desired = evt.lines["2"]; // affiliate Bovada
      evt.lines = desired;
    }

    if (evt.date_event) {
      evt.event_date = evt.date_event;
    }

    return evt;
  });

  const result = await req.db.collection("schedule").updateOne(
    { RundownSportId: Number(req.query.sportId) },
    {
      $set: {
        RundownSportId: Number(req.query.sportId),
        events: slimSchedule || [],
        updatedAt: Date.now(),
      },
    },
    { upsert: true }
  );

  return res.status(200).json(result);
});

export default handler;
