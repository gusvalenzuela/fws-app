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
export async function getUserPicks({ db }, id, reqWeek = 1, yr = 2020) {
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
        'matchup.season_year': Number(yr),
        'matchup.week': Number(reqWeek),
        'matchup.season_type': 'Regular Season',
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
    .aggregate([
      { $match: { sportId: Number(sportID) } },
      { $unset: ['sportId', '_id'] },
      // { $project: { _id: 0 } },
    ])
    .toArray()
  if (!teams) return null

  return teams
}
// PATCH SINGLE MATCHUP
export async function updateSingleMatchup(db, data) {
  // create filter to update matchup by Id
  const filter = { matchupId: data.event_id }

  // (testing without) clean with helper function to remove unused fields
  const documentToUpdate = { $set: { ...filter, ...data } }

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

// GET LEADERBOARD
export async function getLeaderboard(db, sport, yr, week) {
  const sportID = convertToSportId(sport)

  // write initial "FIND WHERE" statement
  const matchFilter = {
    $match: {
      sportId: sportID,
      seasonYear: Number(yr),
    },
  }

  // week will be sent as null for standings for whole year
  if (week) {
    // if week given, filter out by week
    matchFilter.$match.week = Number(week)
  }

  // create an optional group stage
  // to group by userId when retrieving all weeks for a season
  const aggregateGroupStage = {
    $group: {
      _id: '$userId',
      wins: { $push: '$wins' },
      losses: { $push: '$losses' },
      seasonYear: { $first: '$seasonYear' },
      user: { $first: '$user' },
    },
  }

  // create an "ADD FIELDS" pipeline stage
  // to pop at end of aggregation
  const aggregateAddFieldsStage = {
    $addFields: {
      winPercent: {
        $divide: [
          {
            $cond: {
              if: { $isArray: '$wins' },
              then: { $size: '$wins' },
              else: 0,
            },
          },
          {
            $sum: [
              {
                $cond: {
                  if: { $isArray: '$wins' },
                  then: { $size: '$wins' },
                  else: 0,
                },
              },
              {
                $cond: {
                  if: { $isArray: '$losses' },
                  then: { $size: '$losses' },
                  else: 0,
                },
              },
            ],
          },
        ],
      },
    },
  }

  // create a Projection stage, to pop before addFields
  const aggregateProjectionStage = {
    $project: {
      userId: '$userId',
      user: { name: '$user.name' },
      wins: {
        $reduce: {
          input: '$wins',
          initialValue: [],
          in: {
            $concatArrays: ['$$value', '$$this'],
          },
        },
      },
      losses: {
        $reduce: {
          input: '$losses',
          initialValue: [],
          in: {
            $concatArrays: ['$$value', '$$this'],
          },
        },
      },
      seasonYear: '$seasonYear',
    },
  }

  const aggregatePipeline = [
    matchFilter,
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: { path: '$user' } },
  ]

  aggregatePipeline.push(aggregateGroupStage)
  aggregatePipeline.push(aggregateProjectionStage)
  // include "addFields" stage at end, sorts by this field
  aggregatePipeline.push(aggregateAddFieldsStage)

  const standings = await db
    .collection('standings')
    .aggregate(aggregatePipeline)
    .sort({ winPercent: -1, _id: 1 })
    .toArray()

  return { leaderboard: standings }
}
// GET INDIVIDUAL USER'S STANDINGS FOR YEAR
export async function getUserStandings(db, userID, year) {
  const matchFilter = {
    $match: {
      seasonYear: Number(year),
      userId: userID,
    },
  }
  const standings = await db
    .collection('standings')
    .aggregate([
      matchFilter,
      {
        $addFields: {
          winPercent: {
            $divide: [
              {
                $cond: {
                  if: { $isArray: '$wins' },
                  then: { $size: '$wins' },
                  else: 0,
                },
              },
              {
                $sum: [
                  {
                    $cond: {
                      if: { $isArray: '$wins' },
                      then: { $size: '$wins' },
                      else: 0,
                    },
                  },
                  {
                    $cond: {
                      if: { $isArray: '$losses' },
                      then: { $size: '$losses' },
                      else: 0,
                    },
                  },
                ],
              },
            ],
          },
        },
      },
    ])
    .sort({ seasonYear: -1, week: 1 })
    .toArray()

  return { standings }
}
