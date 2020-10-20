export async function getUser(req, id) {
  const user = await req.db.collection("users").findOne({
    _id: id,
  });
  if (!user) return null;
  const { _id, name, email, bio, profilePicture, emailVerified } = user;

  const picks = await req.db
    .collection("pickz")
    .find({
      userId: user._id,
    })
    .toArray();
  const isAuth = _id === req.user?._id;
  return {
    _id,
    name,
    email: isAuth ? email : null,
    bio,
    profilePicture:
      profilePicture ||
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-user'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E",
    emailVerified: isAuth ? emailVerified : null,
    picks,
  };
}
export async function getPick(req, eventId) {
  const pick = await req.db.collection("picks").findOne({
    event_id: eventId,
  });
  if (!pick) return null;
  const { _id, event_id, team_selected, updatedAt, userId } = pick;
  return {
    _id,
    event_id,
    team_selected,
    updatedAt,
    userId,
  };
}
export async function getTeams(req, query) {
  let sport = query.split("&")[0];
  if (query.split("&").length > 1) {
    var season = query.split("&")[1];
  }
  const Teams = await req.db.collection("teams").findOne({
    sportId: Number(sport),
  });

  if (!Teams) return null;
  const { teams } = Teams;
  return teams;
}
export async function getSchedule(req, query) {
  let sport = query.split("&")[0];
  if (query.split("&").length > 1) {
    var season = query.split("&")[1];
  }
  const Schedule = await req.db.collection("schedule").findOne({
    RundownSportId: Number(sport),
    season: Number(season),
  });

  // // sort by event date
  Schedule.events.sort(
    (a, b) => new Date(a.event_date) - new Date(b.event_date)
  );

  // // print a message if no documents were found
  // if ((await Schedule.count()) === 0) {
  //   console.log("No documents found!");
  // }
  if (!Schedule) return null;

  return Schedule;
}
