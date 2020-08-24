import create from "zustand";

const PickStore = create((set, get) => ({
  picks: {},
  
  // removeAllBears: () => set({ bears: 0 })
}));

export default PickStore;
