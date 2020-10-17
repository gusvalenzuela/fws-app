import create from "zustand";

const FootballPoolStore = create((set, get) => ({
  week: undefined,
  currentWeek: undefined,
  season: 2020,
  selectedUser: undefined,
  lockDates: [],
  teams: undefined,
  schedule_alt: undefined,
}));

export default FootballPoolStore;
