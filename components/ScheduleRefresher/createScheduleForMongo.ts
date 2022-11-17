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
export const weekdates2022 = [
  '20220908-20220914',
  '20220915-20220921',
  '20220922-20220928',
  '20220929-20221005',
  '20221006-20221012',
  '20221013-20221019',
  '20221020-20221026',
  '20221027-20221102',
  '20221103-20221109',
  '20221110-20221116',
  '20221117-20221123',
  '20221124-20221130',
  '20221201-20221207',
  '20221208-20221214',
  '20221215-20221221',
  '20221222-20221228',
  '20221229-20230104',
  '20230105-20230111',
]

export async function convertToNewSchema(
  schedule: any[],
  incomingWeek: number
) {
  // const allIncomingGamedays = await flattenGames(schedule)

  /*
  NFLTeams referenced below is only needed at the initial matchup entry
  uncomment as needed and provide array
  */

  const games = schedule.map((game) => ({
    sport_id: 2,
    season_year: game.season?.year,
    matchupId: game.uid,
    // away_team_id:
    //   game.competitions[0].competitors[1]?.homeAway === 'away'
    //     ? Number(
    //         NFLTeams.find(
    //           (g) =>
    //             g.mascot ===
    //             game.competitions[0].competitors[1]?.team.shortDisplayName
    //         )?.team_id
    //       )
    //     : Number(
    //         NFLTeams.find(
    //           (g) =>
    //             g.mascot ===
    //             game.competitions[0].competitors[0]?.team.shortDisplayName
    //         )?.team_id
    //       ),
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
    // home_team_id:
    //   game.competitions[0].competitors[0]?.homeAway === 'home'
    //     ? Number(
    //         NFLTeams.find(
    //           (g) =>
    //             g.mascot ===
    //             game.competitions[0].competitors[0]?.team.shortDisplayName
    //         )?.team_id
    //       )
    //     : Number(
    //         NFLTeams.find(
    //           (g) =>
    //             g.mascot ===
    //             game.competitions[0].competitors[1]?.team.shortDisplayName
    //         )?.team_id
    //       ),
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
    season_type: 'Regular Season',
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
