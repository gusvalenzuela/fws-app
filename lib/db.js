function convertToSportId(sport) {
  let id
  switch (sport) {
    case 'ufc':
      id = 7
      break
    default:
      // nfl
      id = 2
      break
  }
  return id
}
// GET USER
export async function getUser(req, id) {
  const user = await req.db.collection('users').findOne({
    _id: id || req.user?._id,
  })
  if (!user) return null
  const { _id, name, email, bio, profilePicture, emailVerified } = user

  const isAuth = _id === req.user?._id
  return {
    _id,
    name,
    email: isAuth ? email : null,
    bio,
    profilePicture:
      profilePicture ||
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-user'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E",
    emailVerified: isAuth ? emailVerified : null,
  }
}
// GET ALL USERS
export async function getAllUsers(req) {
  const dbUsers = await req.db
    .collection('users')
    .aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
        },
      },
    ])
    .toArray()
  if (!dbUsers) return null

  return {
    users: dbUsers,
  }
}
// USER PICKS
export async function getUserPicks(req, id) {
  const query = `*[ _type == 'pick' && userId == $reqUserId] {..., selectedTeam->, matchup->{ date, _id }}`
  const params = { reqUserId: id }
  const picks = await req.SanityClient.fetch(query, params)

  return { picks }
}
// GET TEAMS
export async function getTeams(req, sport, yr) {
  const sportID = convertToSportId(sport)
  const Teams = await req.db.collection('teams').findOne({
    sportId: Number(sportID),
  })

  if (!Teams) return null
  const { teams } = Teams
  return teams
}
// GET SCHEDULE
export async function getSchedule(req, sport, yr) {
  const sportID = convertToSportId(sport)

  const Schedule = await req.db
    .collection('schedule')
    .aggregate([
      {
        $match: {
          RundownSportId: Number(sportID),
          season: Number(yr),
        },
      },
      {
        $sort: {
          event_date: 1,
        },
      },
      {
        $lookup: {
          from: 'teams',
          localField: 'RundownSportId',
          foreignField: 'sportId',
          as: 'teams',
        },
      },
    ])
    .toArray()

  if (!Schedule[0]) return null

  return {
    events: Schedule[0].events,
    teams: Schedule[0].teams[0].teams,
  }
}
