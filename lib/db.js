import { convertToSportId } from './api-helpers'

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
export async function getUserPicks({ db }, id, reqWeek = 1) {
  const userPicksPipeline = [
    {
      $match: {
        userId: id,
      },
    },
    {
      $lookup: {
        from: 'matchups',
        localField: 'matchupId',
        foreignField: 'event_id',
        as: 'matchup',
      },
    },
    {
      $unwind: {
        path: '$matchup',
      },
    },
    {
      $match: {
        'matchup.week': Number(reqWeek),
      },
    },
    {
      $lookup: {
        from: 'teamz',
        localField: 'selectedTeamId',
        foreignField: 'team_id',
        as: 'selectedTeam',
      },
    },
    {
      $unwind: {
        path: '$selectedTeam',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]
  const picksByUserId = await db
    .collection('picks')
    .aggregate(userPicksPipeline)
    .toArray()

  if (!picksByUserId) return null
  // console.log(`updatedPick`, updatedPick)
  return picksByUserId
}

// PATCH USER PICKS
export async function updateUserPicks(client, db, user, newDoc) {
  // set the filter to find the user + matchupId
  const filter = { userId: user._id, matchupId: newDoc.matchupId }
  const newPick = { $set: { ...newDoc, ...filter, updatedAt: Date.now() } }
  const session = client.startSession()
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  }

  try {
    let updatedPick
    const transactionResults = await session.withTransaction(async () => {
      const updateResults = await db
        .collection('picks')
        .findOneAndUpdate(filter, newPick, {
          upsert: true,
          session,
          returnDocument: 'after',
        })
      updatedPick = updateResults.value || {}
    }, transactionOptions)

    if (transactionResults) {
      return {
        message: 'Success',
        updatedPick,
      }
    }
    return {
      message: 'Transaction was intentionally aborted.',
    }
  } catch (err) {
    // console.log(`Transaction aborted due to an unexpected error: ${err}`)
    return { message: 'Transaction was aborted due to error.', err }
  } finally {
    await session.endSession()
  }
}

// GET TEAMS
export async function getTeams(req, sport) {
  const sportID = convertToSportId(sport)

  const teams = await req.db
    .collection('teamz')
    .aggregate({
      $match: { sportId: sportID },
      $unset: ['sportId'],
    })
    .toArray()

  if (!teams) return null
  return teams
}
// PATCH SINGLE MATCHUP
export async function updateSingleMatchup(db, data) {
  // create filter to update matchup by Id
  const filter = { matchupId: data.event_id }

  // (testing without) clean with helper function to remove unused fields
  const documentToUpdate = { ...filter, ...data }

  const updateOptions = {
    upsert: true,
    returnOriginal: false,
  }

  const updatedMatchup = await db
    .collection('matchups')
    .findOneAndUpdate(filter, documentToUpdate, updateOptions)

  if (!updatedMatchup) return null
  // console.log(`updatedMatchup`, updatedMatchup)
  return updatedMatchup
}
// PATCH MATCHUP(S)
export async function updateMatchups(db, data) {
  // iterate through each matchup
  // ...

  const promiseMatchupUpdates = data.map(async (matchup) =>
    updateSingleMatchup(db, matchup)
  )

  const allUpdatedPicks = await Promise.all(promiseMatchupUpdates)

  if (!allUpdatedPicks) return null
  // console.log(`updatedPick`, updatedPick)
  return allUpdatedPicks
}
// GET SCHEDULE
export async function getSchedule(
  req,
  sport,
  yr,
  reqWeek,
  seasonType = 'Regular Season'
) {
  const sportID = convertToSportId(sport)

  const matchups = await req.db
    .collection('matchups')
    .aggregate([
      {
        $match: {
          sport_id: Number(sportID),
          season_year: Number(yr),
          week: Number(reqWeek),
          season_type: seasonType,
        },
      },
      // remove the _id for serialization later
      { $project: { _id: 0, home_team: 0, away_team: 0 } },
      // fill in the teams using the "teams"_id
      {
        $lookup: {
          from: 'teamz',
          localField: 'home_team_id',
          foreignField: 'team_id',
          as: 'home_team',
        },
      },
      {
        $lookup: {
          from: 'teamz',
          localField: 'away_team_id',
          foreignField: 'team_id',
          as: 'away_team',
        },
      },
      { $unwind: { path: '$home_team' } },
      { $unwind: { path: '$away_team' } },
      // order by date
      {
        $sort: {
          event_date: 1,
        },
      },
    ])
    .toArray()

  // set lock date to start time of week's first Sunday matchup
  // here as it's retrieved from db
  // TODO: move logic to mongodb driver
  const firstSundayMatch = matchups.find(
    (m) => new Date(m.event_date).getDay() === 0
  )

  if (!matchups) return null

  // console.log(matchups)
  return {
    matchups,
    lockDate: firstSundayMatch && Date.parse(firstSundayMatch.event_date),
  }
}
