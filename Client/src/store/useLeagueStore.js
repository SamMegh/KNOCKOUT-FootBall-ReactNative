import { create } from 'zustand';
import { useAuthStore } from '../store/useAuthStore';
import Instance from '../utils/axios.configuration';
import Toast from 'react-native-toast-message';
export const useLeagueStore = create((set, get) => ({
  leagues: null,
  myleagues: [],
  myteam: null,
  leagueTeams: [],
  matchOfTheDay: [],
  myownleagues: [],
  transactions: [],
  istransactionsloading: false,
  isSearching: false,
  leagueSearchResult: [],


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
        type: data.type,
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

  gettransaction: async () => {
    try {
      set({ istransactionsloading: true });
      const res = await Instance.get("/play/transaction");
      set({ transactions: res.data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ istransactionsloading: false });
    }
  },

  SearchByName: async (name) => {
    set({ isSearching: true });
    try {
      const response = await Instance.post("/play/leaguebyname", { name });
      set({ leagueSearchResult: response.data });
    } catch (error) {
      console.log(error.message)
    } finally {
      set({ isSearching: false });
    }
  },

  //socket for get fast result
  leaguebyname: () => {
    const { socket } = useAuthStore.getState();
    socket.off("leaguenameresult");
    socket.on("leaguenameresult", (data) => {
      set({ leagueSearchResult: data });
    })
  },

  sendRequest: async (leagueId) => {
    try {
      const res = await Instance.post("/joinrequest", { leagueId });
      if (res) {
        Toast.show({
          type: 'success',
          text1: `Request Sent`
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}));
