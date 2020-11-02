import nextConnect from "next-connect";
import middleware from "../../../middlewares/middleware";

const handler = nextConnect();

handler.use(middleware);
handler.put(async (req, res) => {
  const pipeline = [
    {
      $group: {
        _id: "$event_id",
        picks: {
          $push: {
            // selectedTeamId: "$selected_team.team_id",
            // tiebreaker: "$tiebreaker",
            // user: "$userId",
            pickId: "$_id",
          },
        },
      },
    },
  ];

  const schedule = await req.db.collection("schedule").findOne({
    RundownSportId: Number(2),
  });

  const picksByEvent = await req.db
    .collection("pickz")
    .aggregate(pipeline)
    .toArray();

  const addedWinner = picksByEvent
    .map((matchup) => {
      var thisPicksEvent = schedule.events.find(
        (e) => e.event_id === matchup._id
      );
      return matchup.winner
        ? undefined
        : {
            ...matchup,
            winner: thisPicksEvent?.line_?.winner || undefined,
          };
    })
    .filter((item) => item);

  // start updating each pick (by its id)
  // and a winner to it

  await addedWinner?.forEach(async (e, indx) => {
    e.picks.forEach(async (pick) => {
      try {
        // query needs to find the correct sport and within it the correct event in its events Array
        const query = {
          _id: pick.pickId,
        };

        var updateDocument = {
          $set: {
            "matchup.winner": e.winner,
          },
        };

        const updateOptions = {
          upsert: false,
          returnOriginal: false,
        };

        // update the event found in the Schedule db
        const respons = await req.db
          .collection("pickz")
          .findOneAndUpdate(query, updateDocument, updateOptions);
        // .toArray();
        // results.push(lastErrorObject);
      } catch (error) {
        // results.push(error);
        console.log(error);
      }
    });
  });

  return res.status(200).json(addedWinner);
});
handler.get(async (req, res) => {
  // if (!req.user?.isAdmin) {
  //   return res.status(401).send("unauthenticated");
  // }
  // find events
  const schedule = await req.db.collection("schedule").findOne({
    RundownSportId: Number(2),
  });

  // filter only latest 2 weeks of games that've ended
  const eventsEnded = schedule.events
    .filter(
      (e) =>
        e.event_status === "STATUS_FINAL" &&
        Date.parse(e.event_date) >
          Date.now() -
            1000 * 60 * 60 * 24 * 14 /* only the previous rolling 2 weeks*/
    )
    .map((e) => {
      // if a winner has not been determined, determine
      if (!e.line_.winner || e.line_.winner === NaN) {
        // set a winner for the matchup adjusted with the point spread
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
        homeScore > awayScore
          ? (e.line_.winner = homeTeam)
          : (e.line_.winner = awayTeam);
      }

      return e;
    });

  res.status(200).json(eventsEnded);
});

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
        RundownSportId: Number(2),
        "events.event_id": e.event_id,
      };

      var updateDocument = {
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
        },
      };

      if (e.line_) {
        updateDocument.$set["events.$.line_"] = e.line_;
      }

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
