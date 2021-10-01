import PropTypes from 'prop-types'

const { string, number, shape } = PropTypes

export const MatchupShape = {
  //   event_date: PropTypes.string,
  matchupId: string.isRequired,
  event_id: string.isRequired,
  event_date: string.isRequired,
  away_team_id: number.isRequired,
  home_team_id: number.isRequired,
  away_score: number,
  broadcast: string,
  event_location: string,
  event_name: string,
  event_status: string,
  event_status_detail: string,
  home_score: number,
  line_: shape({ point_spread: number, favorite: number }),
  season_type: string,
  season_year: number,
  sport_id: number,
  week: number,
  week_detail: string,
  week_name: string,
  winner: number,
}

export const UserShape = { _id: string, email: string }

export const UserPickShape = {
  _id: string,
  matchupId: string,
  userId: string,
  selectedTeamId: number,
  tiebreaker: number,
  updatedAt: number,
}
