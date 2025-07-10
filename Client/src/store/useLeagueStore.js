import { create } from 'zustand';
import { useAuthStore } from "../store/useAuthStore.js";
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
      set({ myleagues: [...prev, res.data] });
    } catch (error) {
      console.log("Error joining league", error);
    }
  },
  
  getmyleagues: async () => {
    try {
      const {isAuthUser}= useAuthStore.getState();;
      if(!isAuthUser)return;
    const res = await Instance.post("/play/myleagues", {userId:isAuthUser._id});
      set({ myleagues: res.data });
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
