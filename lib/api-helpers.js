/* eslint-disable camelcase */
// take only needed user fields to avoid sensitive ones (such as password)
export function extractUser(req) {
  if (!req.user) return null
  const {
    _id,
    name,
    email,
    bio,
    profilePicture,
    emailVerified,
    isAdmin,
    isDemo,
    prefersModernLayout,
  } = req.user
  return {
    _id,
    name,
    email,
    bio,
    profilePicture,
    emailVerified,
    isAdmin,
    isDemo,
    prefersModernLayout,
  }
}

// convert sport in string format to number ID
export function convertToSportId(sport) {
  let id
  switch (sport) {
    case 'mma':
      id = 7
      break
    default:
      // football
      id = 2
      break
  }
  return id
}

// grab only needed fields from 3rd Party API
// used to update/insert matchup docs to DB
export function createMatchupDocToUpdate(data) {
  const {
    matchupId,
    line_,
    home_score,
    home_team_id,
    event_date,
    away_team_id,
    away_score,
    week,
    week_name,
    week_detail,
    date_event,
    event_id,
    event_name,
    event_status,
    event_location,
    event_status_detail,
    broadcast,
    attendance,
    conference_competition,
    neutral_site,
    season_type,
    season_year,
    sport_id,
  } = data
  const docToUpdate = {
    $set: { matchupId, event_date, event_id, updatedAt: Date.now() },
  }
  // to avoid zero-ing out a field already present
  // we will check to confirm the new data coming in has
  // data for the field
  if (date_event) {
    docToUpdate.$set.date_event = date_event
  }
  if (line_) {
    docToUpdate.$set.line_ = {
      point_spread: line_.point_spread,
      favorite: line_.favorite,
    }
  }
  if (home_team_id) {
    docToUpdate.$set.home_team_id = home_team_id
  }
  if (home_score) {
    docToUpdate.$set.home_score = home_score
  }
  if (away_team_id) {
    docToUpdate.$set.away_team_id = away_team_id
  }
  if (away_score) {
    docToUpdate.$set.away_score = away_score
  }
  if (week) {
    docToUpdate.$set.week = week
  }
  if (week_name) {
    docToUpdate.$set.week_name = week_name
  }
  if (week_detail) {
    docToUpdate.$set.week_detail = week_detail
  }
  if (event_name) {
    docToUpdate.$set.event_name = event_name
  }
  if (event_location) {
    docToUpdate.$set.event_location = event_location
  }
  if (event_status) {
    docToUpdate.$set.event_status = event_status
  }
  if (event_status_detail) {
    docToUpdate.$set.event_status_detail = event_status_detail
  }
  if (broadcast) {
    docToUpdate.$set.broadcast = broadcast
  }
  if (conference_competition) {
    docToUpdate.$set.conference_competition = conference_competition
  }
  if (attendance) {
    docToUpdate.$set.attendance = attendance
  }
  if (neutral_site) {
    docToUpdate.$set.neutral_site = neutral_site
  }
  if (season_type) {
    docToUpdate.$set.season_type = season_type
  }
  if (season_year) {
    docToUpdate.$set.season_year = season_year
  }
  if (sport_id) {
    docToUpdate.$set.sport_id = sport_id
  }

  return docToUpdate
}
