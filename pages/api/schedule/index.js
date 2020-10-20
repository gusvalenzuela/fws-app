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
    // set a winner for the matchup adjusted with the point spread
    if (e.event_status === "STATUS_FINAL" && !e.line_?.winner) {
      var homeScore = e.home_score;
      var awayScore = e.away_score;
      var homeTeam = e.home_team_id;
      var awayTeam = e.away_team_id;
      if (e.line_?.favorite === homeTeam) {
        // if the home team is the favorite
        // add the point spread (negative num) to the away_team (underdog)
        awayScore = awayScore - e.line_?.point_spread;
      } else {
        // the away team is the favorite
        // add the point spread (negative num) to the home_team (underdog)
        homeScore = homeScore - e.line_?.point_spread;
      }
      // determine who won
      homeScore > awayScore ? (e.winner = homeTeam) : (e.winner = awayTeam);
    }

    try {
      // query needs to find the correct sport and within it the correct event in its events Array
      const query = {
        RundownSportId: Number(2),
        "events.event_id": e.event_id,
      };

      const updateDocument = {
        $set: {
          "events.$.event_date": e.date_event,
          "events.$.week": e.week,
          "events.$.week_name": e.week_name,
          "events.$.event_name": e.event_name,
          "events.$.week_detail": e.week_detail,
          "events.$.away_score": e.away_score,
          "events.$.home_score": e.home_score,
          "events.$.event_status": e.event_status,
          "events.$.event_status_detail": e.event_status_detail,
          "events.$.line_.winner": e.winner || undefined,
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
