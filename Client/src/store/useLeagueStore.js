import { create } from 'zustand';
import Instance from '../utils/axios.configuration';
export const useLeagueStore = create((set, get) => ({
  leagues: null,
  myleagues: [],
  myteam: null,
  leagueTeams: [],
  matchOfTheDay: [],
  myownleagues: [],


  joinleague: async (leagueId) => {
    try {
      const res = await Instance.post("/play/joinleague", {
        leagueId
      });
      set((state) => ({ myleagues: [...state.myleagues, res.data] }));
    } catch (error) {
      console.log("Error joining league", error);
    }
  },

  getmyleagues: async () => {
    try {
      const res = await Instance.get("/play/myleagues");
      set({ myleagues: res.data });
    } catch (error) {
      console.log("Error joining league", error);
    }
  },

  getmecreatedleagues: async () => {
    try {
      const res = await Instance.get("/play/myownleagues");
      set({ myownleagues: res.data });
    } catch (error) {
      console.log("Error while getting leagues", error);
    }
  },

  createmyownleague: async (data) => {
    try {
      const res = await Instance.post("/play/createleague", {
        joinfee: data.joinfee,
        name: data.name,
        end: data.end,
        start: data.start,
        type:data.type,
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
      const res = await Instance.get("/play/leagues");
      set({ leagues: res.data });
    } catch (error) {
      console.log("Error getting leagues", error);
    }
  },

  jointeam: async (leagueId, day, teamName, startTime) => {
    try {
      const res = await Instance.post("/play/jointeam", {
        leagueId,
        day,
        teamName,
        startTime
      });
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
      const res = await Instance.post("/play/myteam", { leagueId });
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
