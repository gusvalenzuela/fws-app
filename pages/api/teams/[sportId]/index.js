import nextConnect from "next-connect";
import middleware from "../../../../middlewares/middleware";
import { getTeams } from "../../../../lib/db";
const handler = nextConnect();

handler.use(middleware);
// GET
handler.get(async (req, res) => {
  const teams = await getTeams(req, req.query.sportId);
  res.send({ teams });
});

//PATCH
handler.patch(async (req, res) => {
  if (!req.user && !req.user?.isAdmin) res.send(null);
  // console.log(req.query.sportId, req.body);

  var incomingTeams = req.body || [];
  var Teams = [];
  var otherTeams = [];
  if (req.body && incomingTeams.length > 0) {
    let { team_id, name, mascot, abbreviation } = req.body[0];
    if (!team_id && !name && !mascot && !abbreviation) {
      return res
        .status(400)
        .send("expecting a team id, name, mascot, and abbreviation for teams");
    }

    incomingTeams.forEach((team) => {
      if (!team.record) {
        otherTeams.push(team);
      } else {
        Teams.push(team);
      }
    });
  }

  const Ts = await req.db.collection("teams").updateOne(
    { sportId: Number(req.query.sportId) },
    {
      $set: {
        teams: Teams,
        teams_other: otherTeams,
      },
    },
    { upsert: true }
  );

  res.status(200).json(Ts);
});

export default handler;
