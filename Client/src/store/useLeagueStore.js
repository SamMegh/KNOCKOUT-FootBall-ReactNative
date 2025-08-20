import Toast from 'react-native-toast-message';
import { create } from 'zustand';
import { useAuthStore } from '../store/useAuthStore';
import Instance from '../utils/axios.configuration';

export const useLeagueStore = create((set, get) => ({
  leagues: null,
  myleagues: [],
  myteam: null,
  leagueTeams: [],
  matchOfTheDay: [],
  myownleagues: [],
  transactions: [],
  requests: [],

  // 🔄 loading flags
  istransactionsloading: false,
  isLoading: false,
  isLeaguesLoading: false,
  isMyLeaguesLoading: false,
  isMyOwnLeaguesLoading: false,
  isMyTeamLoading: false,
  isLeagueTeamsLoading: false,
  isDayDataLoading: false,
  isRequestsLoading: false,

  joinleague: async (leagueId) => {
    set({ isLoading: true });
    try {
      const res = await Instance.post("/play/joinleague", { leagueId });
      set((state) => ({ myleagues: [...state.myleagues, res.data] }));
      Toast.show({ type: 'success', text1: 'Joined league successfully' });
    } catch (error) {
      console.log("Error joining league", error);
      Toast.show({ type: 'error', text1: 'Failed to join league' });
    } finally {
      set({ isLoading: false });
    }
  },

  getmyleagues: async () => {
    set({ isMyLeaguesLoading: true });
    try {
      const res = await Instance.get("/play/myleagues");
      set({ myleagues: res.data });
    } catch (error) {
      console.log("Error getting my leagues", error.message);
      Toast.show({ type: 'error', text1: 'Failed to fetch my leagues' });
    } finally {
      set({ isMyLeaguesLoading: false });
    }
  },

  getmecreatedleagues: async () => {
    set({ isMyOwnLeaguesLoading: true });
    try {
      const res = await Instance.get("/play/myownleagues");
      set({ myownleagues: res.data });
    } catch (error) {
      console.log("Error while getting leagues", error);
      Toast.show({ type: 'error', text1: 'Failed to fetch created leagues' });
    } finally {
      set({ isMyOwnLeaguesLoading: false });
    }
  },

  createmyownleague: async (data) => {
    set({ isMyOwnLeaguesLoading: true });
    try {
      const res = await Instance.post("/play/createleague", {
        joinfee: data.joinfee,
        name: data.name,
        end: data.end,
        start: data.start,
        type: data.type,
        maxTimeTeamSelect: data.maxTimeTeamSelect,
        lifelinePerUser: data.lifelinePerUser
      });
      set({ myownleagues: [...get().myownleagues, res.data] });
      Toast.show({ type: 'success', text1: 'League created successfully' });
    } catch (error) {
      console.log("unable to create league ", error);
      Toast.show({ type: 'error', text1: 'Failed to create league' });
    } finally {
      set({ isMyOwnLeaguesLoading: false });
    }
  },

  getleague: async () => {
    set({ isLeaguesLoading: true });
    try {
      const res = await Instance.get("/play/leagues");
      set({ leagues: res.data });
    } catch (error) {
      console.log("Error getting leagues", error);
      Toast.show({ type: 'error', text1: 'Failed to fetch leagues' });
    } finally {
      set({ isLeaguesLoading: false });
    }
  },

  jointeam: async (leagueId, day, teamName, startTime) => {
    set({ isLoading: true });
    try {
      const res = await Instance.post("/play/jointeam", {
        leagueId,
        day,
        teamName,
        startTime
      });
      set({ myteam: res.data });
      Toast.show({ type: 'success', text1: 'Team joined successfully' });
    } catch (error) {
      console.log("Error joining team", error);
      Toast.show({ type: 'error', text1: 'Failed to join team' });
    } finally {
      set({ isLoading: false });
    }
  },

  getmyteam: async (leagueId) => {
    set({ myteam: null, isMyTeamLoading: true });
    try {
      const res = await Instance.post("/play/myteam", { leagueId });
      set({ myteam: res.data });
    } catch (error) {
      set({ myteam: null });
      Toast.show({ type: 'error', text1: 'Failed to fetch team' });
    } finally {
      set({ isMyTeamLoading: false });
    }
  },

  getDayData: async (day) => {
    set({ isDayDataLoading: true });
    try {
      const res = await Instance.get(`/data/getmatch`, { params: { date: day } });
      set({ matchOfTheDay: res.data });
    } catch (error) {
      console.log(error);
      Toast.show({ type: 'error', text1: 'Failed to fetch match data' });
    } finally {
      set({ isDayDataLoading: false });
    }
  },

  getleagueteams: async (leagueid) => {
    set({ isLeagueTeamsLoading: true });
    try {
      const res = await Instance.get("/play/leagueteams", { params: { leagueid } });
      set({ leagueTeams: res.data });
    } catch (error) {
      console.log(error);
      Toast.show({ type: 'error', text1: 'Failed to fetch league teams' });
    } finally {
      set({ isLeagueTeamsLoading: false });
    }
  },

  gettransaction: async () => {
    set({ istransactionsloading: true });
    try {
      const res = await Instance.get("/play/transaction");
      set({ transactions: res.data });
    } catch (error) {
      console.log(error);
      Toast.show({ type: 'error', text1: 'Failed to fetch transactions' });
    } finally {
      set({ istransactionsloading: false });
    }
  },

  SearchByName: async (name) => {
    set({ isLoading: true });
    try {
      const response = await Instance.post("/play/leaguebyname", { name });
      set({ leagueSearchResult: response.data });
    } catch (error) {
      console.log(error.message);
      Toast.show({ type: 'error', text1: 'No league found' });
    } finally {
      set({ isLoading: false });
    }
  },

  sendRequest: async (leagueId) => {
    set({ isLoading: true });
    try {
      const res = await Instance.post("/play/joinrequest", { leagueId });
      if (res) {
        Toast.show({ type: 'success', text1: `Request Sent` });
      }
    } catch (error) {
      console.log(error);
      Toast.show({ type: 'error', text1: 'Failed to send request' });
    } finally {
      set({ isLoading: false });
    }
  },

  getRequests: async (leagueId) => {
    set({ isRequestsLoading: true, requests: [] });
    try {
      const res = await Instance.post("/play/requests", { leagueId });
      set({ requests: res.data });
    } catch (error) {
      console.log(error);
      Toast.show({ type: 'error', text1: 'Failed to fetch requests' });
    } finally {
      set({ isRequestsLoading: false });
    }
  },

  rejectRequest: async (requestId) => {
    set({ isLoading: true });
    try {
      const res = await Instance.post("/play/rejectrequest", { requestId });
      set((state) => ({
        requests: state.requests.map((req) =>
          req._id === requestId ? { ...req, status: res.data.status } : req
        ),
      }));
      Toast.show({ type: 'success', text1: 'Request rejected' });
    } catch (error) {
      console.log(error);
      Toast.show({ type: 'error', text1: 'Failed to reject request' });
    } finally {
      set({ isLoading: false });
    }
  },

  acceptRequest: async (requestId) => {
    set({ isLoading: true });
    try {
      const res = await Instance.post("/play/acceptrequest", { requestId });
      set((state) => ({
        requests: state.requests.map((req) =>
          req._id === requestId ? { ...req, status: res.data.status } : req
        ),
      }));
      Toast.show({ type: 'success', text1: 'Request accepted' });
    } catch (error) {
      console.log(error);
      Toast.show({ type: 'error', text1: 'Failed to accept request' });
    } finally {
      set({ isLoading: false });
    }
  },

  // 🔌 socket for realtime league search
  leaguebyname: () => {
    const { socket } = useAuthStore.getState();
    socket.off("leaguenameresult");
    socket.on("leaguenameresult", (data) => {
      set({ leagueSearchResult: data });
    });
  },
}));
