import { create } from 'zustand';
import { useAuthStore } from "../store/useAuthStore.js";
import Instance from '../utils/axios.configuration';

export const useLeagueStore = create((set, get) => ({
  leagues: null,
  myleagues: [],
  myteam: null,
  leagueTeams: [],

  createleague: async (data) => {
    try {
      const res = await Instance.post("/play/createleague", data);
      console.log("League created", res.data);
    } catch (error) {
      console.log("Error creating league", error);
    }
  },

  joinleague: async (leagueId) => {
    try {
      const { isAuthUser } = useAuthStore.getState();;

      const res = await Instance.post("/play/joinleague", {
        leagueId,
        userId: isAuthUser._id
      });
    } catch (error) {
      console.log("Error joining league", error);
    }
  },

  getmyleagues: async () => {
    try {
      const { isAuthUser } = useAuthStore.getState();
      if (!isAuthUser) return;
      const res = await Instance.post("/play/myleagues", { userId: isAuthUser._id });
      set({ myleagues: res.data });
    } catch (error) {
      console.log("Error joining league", error);
    }
  },

  getleague: async () => {
    try {
      const { isAuthUser } = useAuthStore.getState();
      const res = await Instance.post("/play/leagues", {
        userId: isAuthUser._id
      });
      set({ leagues: res.data });
    } catch (error) {
      console.log("Error getting leagues", error);
    }
  },

  jointeam: async (data) => {
    try {
      const res = await Instance.post("/play/jointeam", { data })
      console.log(res.message);
    } catch (error) {
      console.log("Error getting leagues", error);
    }
  },

  getmyteam: async (leagueId) => {
    try {
      const { isAuthUser } = useAuthStore.getState();
      const res = await Instance.post("/play/myteam", { userId: isAuthUser._id, leagueId });
      set({ myteam: res.data });
    } catch (error) {
      console.log("Error getting leagues", error);
    }
  },

  getDayData: async () => {
    try {
      const date = '2025-07-12';

      const res = Instance.get(`/data/getmatch`, {
        params: {
          date
        }
      });
    } catch (error) {
      console.log(error)
    }
  },

  getteams: async (leagueid) => {
    try {
      const res = await Instance.get("/play/teams", { params: { leagueid } })
      set({ leagueTeams: res.data });
    } catch (error) {
      console.log(error)
    }
  }
}));
