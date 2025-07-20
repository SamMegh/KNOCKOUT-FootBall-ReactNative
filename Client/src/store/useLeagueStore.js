import { create } from 'zustand';
import { useAuthStore } from "../store/useAuthStore.js";
import Instance from '../utils/axios.configuration';

export const useLeagueStore = create((set, get) => ({
  leagues: null,
  myleagues: [],
  myteam: null,
  leagueTeams: [],
  matchOfTheDay: [],
  myownleagues: [],

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
      set((state) => ({ myleagues: [...state.myleagues, res.data] }));
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

  getmecreatedleagues: async () => {
    try {
      const { isAuthUser } = useAuthStore.getState();
      const res = await Instance.get("/play/yourleagues", { params: { ownerId: isAuthUser._id } });
      set({ myownleagues: res.data });
    } catch (error) {
      console.log("Error while getting leagues", error);
    }
  },

  createmyownleague: async (data) => {
    try {
      const { isAuthUser } = useAuthStore.getState();
      const res = await Instance.post("/play/createleague", {
        ownerId: isAuthUser._id,
        joinfee: data.joinfee,
        name: data.name,
        end: data.end,
        start: data.start,
        maxTimeTeamSelect: data.maxTimeTeamSelect,
        lifelinePerUser: data.lifelinePerUser
      })
      set({ myownleagues: [...get().myownleagues, res.data] })

    } catch (error) {
      console.log("unable to create league ", error);
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

  jointeam: async (leagueId, day, teamName) => {
    try {
      const { isAuthUser } = useAuthStore.getState();
      const res = await Instance.post("/play/jointeam", {
        userId: (isAuthUser._id),
        leagueId,
        day,
        teamName
      })
      set({ myteam: res.data });
    } catch (error) {
      console.log("Error getting leagues", error);
    }
  },

  removeLeague: (id) => set((state) => ({
    leagues: state.leagues.filter((l) => l._id !== id)
  })),

  getmyteam: async (leagueId) => {
    set({ myteam: null })
    try {
      const { isAuthUser } = useAuthStore.getState();
      const res = await Instance.post("/play/myteam", { userId: isAuthUser._id, leagueId });
      set({ myteam: res.data });
    } catch (error) {
      set({ myteam: null });
    }
  },

  getDayData: async (day) => {
    try {
      const res = await Instance.get(`/data/getmatch`, {
        params: {
          date: day
        }
      });
      set({ matchOfTheDay: res.data })
    } catch (error) {
      console.log(error)
    }
  },

  getleagueteams: async (leagueid) => {
    try {
      const res = await Instance.get("/play/leagueteams", { params: { leagueid } })
      set({ leagueTeams: res.data });
    } catch (error) {
      console.log(error)
    }
  },

}));
