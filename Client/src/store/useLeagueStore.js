import { create } from 'zustand';
import Instance from '../utils/axios.configuration';

export const useLeagueStore = create((set, get) => ({
  leagues: null,
  myleagues: [],

  createleague: async (data) => {
    try {
      const res = await Instance.post("/play/createleague", data);
      console.log("League created", res.data);
    } catch (error) {
      console.log("Error creating league", error);
    }
  },

  joinleague: async (data) => {
    try {
      const res = await Instance.post("/play/joinleague", data);
      const prev = get().myleagues || [];
      set({ myleagues: [...prev, res.data] });
    } catch (error) {
      console.log("Error joining league", error);
    }
  },

  getleague: async () => {
    try {
      const res = await Instance.get("/play/leagues");
      set({ leagues: res.data });
    } catch (error) {
      console.log("Error getting leagues", error);
    }
  }
}));
