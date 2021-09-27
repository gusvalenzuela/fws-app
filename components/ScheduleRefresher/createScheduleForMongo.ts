const weekDetails2021 = [
  'Sep 8-14',
  'Sep 15-21',
  'Sep 22-28',
  'Sep 29-Oct 5',
  'Oct 6-12',
  'Oct 13-19',
  'Oct 20-26',
  'Oct 27-Nov 2',
  'Nov 3-9',
  'Nov 10-16',
  'Nov 17-23',
  'Nov 24-30',
  'Dec 1-7',
  'Dec 8-14',
  'Dec 15-21',
  'Dec 22-28',
  'Dec 29-Jan 4',
  'Jan 5-11',
]
async function flattenGames(schedule: object) {
  // convert the ESPN schedule object into an array of games
  // first check that it is an object
  const allIncomingGamedays =
    typeof schedule === 'object' &&
    // Each object value is a game day (i.e. Thu, Sun, or Mon)
    Object.values(schedule)
      // map out the games from each game day and flatten to get
      // them all in one nice neat array
      ?.map((gameday) => gameday.games)
      .flat()

  if (!allIncomingGamedays) return null
  //   console.log(allIncomingGamedays[0])

  return allIncomingGamedays
}

export async function convertToNewSchema(
  schedule: object,
  incomingWeek: number
) {
  const allIncomingGamedays = await flattenGames(schedule)

  const games = allIncomingGamedays.map((game) => ({
    matchupId: game.uid,
    away_score:
      game.competitions[0].competitors[1]?.homeAway === 'away'
        ? Number(game.competitions[0].competitors[1]?.score)
        : Number(game.competitions[0].competitors[0]?.score),
    away_record:
      game.competitions[0].competitors[1]?.homeAway === 'away'
        ? game.competitions[0].competitors[1]?.records?.find(
            (p) => p.type === 'total'
          )?.summary
        : game.competitions[0].competitors[0]?.records?.find(
            (p) => p.type === 'total'
          )?.summary,
    broadcast:
      game.competitions[0].broadcasts.length &&
      game.competitions[0].broadcasts[0].names.length &&
      game.competitions[0].broadcasts[0].names[0],
    event_date: game.date,
    event_id: game.uid,
    event_location: game.competitions[0].venue.fullName,
    event_name: `${game.name} - ${game.date.split('T')[0]}`, // "Seattle at Atlanta - 2020-09-13"
    event_status: game.status.type.name,
    event_status_detail: game.status.type.detail,
    home_score:
      game.competitions[0].competitors[0]?.homeAway === 'home'
        ? Number(game.competitions[0].competitors[0]?.score)
        : Number(game.competitions[0].competitors[1]?.score),
    home_record:
      game.competitions[0].competitors[0]?.homeAway === 'home'
        ? game.competitions[0].competitors[0]?.records?.find(
            (p) => p.type === 'total'
          )?.summary
        : game.competitions[0].competitors[1]?.records?.find(
            (p) => p.type === 'total'
          )?.summary,
    week: Number(incomingWeek),
    week_detail: weekDetails2021[incomingWeek - 1],
    week_name: `Week ${incomingWeek}`,
  }))

  return games
}

export async function extractPointSpreads(schedule: [{ id: string }]) {
  const games = schedule.map((game) => ({
    oddsLinesId: game.id,
    line_: { point_spread: '-69', favorite: 69 },
  }))

  return games
}
