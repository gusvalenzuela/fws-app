import create from "zustand";

const FootballPoolStore = create((set, get) => ({
  week: 1,
  season: 2020,
  selectedUser: undefined,
}));

export default FootballPoolStore;