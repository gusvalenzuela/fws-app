import nextConnect from "next-connect";
import middleware from "../../../middlewares/middleware";

const handler = nextConnect();

handler.use(middleware);

handler.patch(async (req, res) => {
  if (!req.user?.isAdmin) {
    return res.status(401).send("unauthenticated");
  }
  // req.body = JSON.parse(req.body); // body is Stringified on the PATCH request
  // console.log(req.body);
  let events = req.body;
  let results = [];
  await events.forEach(async (e) => {
    try {
      // query needs to find the correct sport and within it the correct event in its events Array
      const query = {
        RundownSportId: Number(22),
        "events.event_id": e.event_id,
      };

      const updateDocument = {
        $set: {
          "events.$.event_date": e.date_event,
          "events.$.schedule.week": e.week,
        },
      };
      const updateOptions = {
        upsert: true,
        returnOriginal: false,
      };

      // update the event found in the Schedule db
      const { lastErrorObject } = await req.db
        .collection("schedule")
        .findOneAndUpdate(query, updateDocument, updateOptions);

      results.push(lastErrorObject);
    } catch (error) {
      results.push(error);
      console.log(error);
    }
  });

  // respond with the promise returned from Mongo
  return res.status(200).json(results);
});

export const config = {
  api: {
    bodyParser: true,
  },
};

export default handler;
