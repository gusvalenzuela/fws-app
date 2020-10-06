import nextConnect from "next-connect";
import middleware from "../../../middlewares/middleware";

const handler = nextConnect();

handler.use(middleware);

handler.patch(async (req, res) => {
  if (!req.user?.isAdmin) {
    return res.status(401).send("unauthenticated");
  }
  req.body = JSON.parse(req.body); // body is Stringified on the PATCH request

  // extract necessary properties needed from the request's body
  const { home_team_score, away_team_score, final } = req.body;
  // set the scores obj which will be pushed into the event's record
  const scores = {
    home_team: Number(home_team_score),
    away_team: Number(away_team_score),
    final: final,
    total: Number(home_team_score) + Number(away_team_score),
  };

  // query needs to find the correct sport and within it the correct event in its events Array
  const query = {
    RundownSportId: Number(req.body.sport_id),
    "events.event_id": req.body.event_id,
  };
  const updateDocument = {
    $set: { "events.$.scores": scores },
  };
  const updateOptions = {
    upsert: false,
    returnOriginal: false,
  };

  // update the event found in the Schedule db
  const { lastErrorObject } = await req.db
    .collection("schedule")
    .findOneAndUpdate(query, updateDocument, updateOptions);

  // respond with the promise returned from Mongo
  return res.status(200).json(lastErrorObject);
});

export const config = {
  api: {
    bodyParser: true,
  },
};

export default handler;
