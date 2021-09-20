import create from 'zustand'

const FootballPoolStore = create(() => ({
  week: undefined,
  currentWeek: undefined,
  seasonYear: undefined,
  currentSeasonYear: undefined,
  seasonType: undefined,
  currentSeasonType: 'Regular Season',
  selectedUser: undefined,
  teams: undefined,
  Moment: undefined,
  schedule_alt: undefined,
  allUsers: [],
  darkMode: false,
  timeZone: 'America/Los_Angeles',
}))

export default FootballPoolStore
