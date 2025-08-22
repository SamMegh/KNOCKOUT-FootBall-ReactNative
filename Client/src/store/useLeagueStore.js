import Toast from 'react-native-toast-message';
import { create } from 'zustand';
import { useAuthStore } from '../store/useAuthStore';
import Instance from '../utils/axios.configuration';

export const useLeagueStore = create((set, get) => ({
  leagues: [],
  myleagues: [],
  myteam: [],
  leagueTeams: [],
  matchOfTheDay: [],
  myownleagues: [],
  transactions: [],
  requests: [],
  leagueSearchResult: [],

  // 🔄 loading & error states
  isJoinLeagueLoading: false,
  joinLeagueError: null,

  isGetMyLeaguesLoading: false,
  getMyLeaguesError: null,

  isGetMyOwnLeaguesLoading: false,
  getMyOwnLeaguesError: null,

  isCreateMyOwnLeagueLoading: false,
  createMyOwnLeagueError: null,

  isGetLeaguesLoading: false,
  getLeaguesError: null,

  isJoinTeamLoading: false,
  joinTeamError: null,

  isGetMyTeamLoading: false,
  getMyTeamError: null,

  isGetDayDataLoading: false,
  getDayDataError: null,

  isGetLeagueTeamsLoading: false,
  getLeagueTeamsError: null,

  isGetTransactionLoading: false,
  getTransactionError: null,

  isSearchByNameLoading: false,
  searchByNameError: null,

  isSendRequestLoading: false,
  sendRequestError: null,

  isGetRequestsLoading: false,
  getRequestsError: null,

  isRejectRequestLoading: false,
  rejectRequestError: null,

  isAcceptRequestLoading: false,
  acceptRequestError: null,

  // ✅ join league
  joinleague: async (leagueId) => {
    set({ isJoinLeagueLoading: true, joinLeagueError: null });
    try {
      const res = await Instance.post("/play/joinleague", { leagueId });
      set((state) => ({ myleagues: [...state.myleagues, res.data] }));
      Toast.show({ type: 'success', text1: 'Joined league successfully' });
    } catch (error) {
      set({ joinLeagueError: error });
      console.log("Error joining league", error);
      Toast.show({ type: 'error', text1: 'Failed to join league' });
    } finally {
      set({ isJoinLeagueLoading: false });
    }
  },

  // ✅ get my leagues
  getmyleagues: async () => {
    set({ isGetMyLeaguesLoading: true, getMyLeaguesError: null, myleagues: [] });
    try {
      const res = await Instance.get("/play/myleagues");
      set({ myleagues: res.data });
    } catch (error) {
      set({ getMyLeaguesError: error });
      console.log("Error getting my leagues", error);
      Toast.show({ type: 'error', text1: 'Failed to fetch my leagues' });
    } finally {
      set({ isGetMyLeaguesLoading: false });
    }
  },

  // ✅ get my created leagues
  getmecreatedleagues: async () => {
    set({ isGetMyOwnLeaguesLoading: true, getMyOwnLeaguesError: null, myownleagues: [] });
    try {
      const res = await Instance.get("/play/myownleagues");
      set({ myownleagues: res.data });
    } catch (error) {
      set({ getMyOwnLeaguesError: error });
      console.log("Error while getting leagues", error);
      Toast.show({ type: 'error', text1: 'Failed to fetch created leagues' });
    } finally {
      set({ isGetMyOwnLeaguesLoading: false });
    }
  },

  // ✅ create my own league
  createmyownleague: async (data) => {
    set({ isCreateMyOwnLeagueLoading: true, createMyOwnLeagueError: null });
    try {
      const res = await Instance.post("/play/createleague", data);
      set({ myownleagues: [...get().myownleagues, res.data] });
      Toast.show({ type: 'success', text1: 'League created successfully' });
    } catch (error) {
      set({ createMyOwnLeagueError: error });
      console.log("unable to create league ", error);
      Toast.show({ type: 'error', text1: 'Failed to create league' });
    } finally {
      set({ isCreateMyOwnLeagueLoading: false });
    }
  },

  // ✅ remove league
  removeLeague: (id) => set((state) => ({
    leagues: state.leagues.filter((l) => l._id !== id)
  })),

  // ✅ get leagues
  getleague: async () => {
    set({ isGetLeaguesLoading: true, getLeaguesError: null, leagues: [] });
    try {
      const res = await Instance.get("/play/leagues");
      set({ leagues: res.data });
    } catch (error) {
      set({ getLeaguesError: error });
      console.log("Error getting leagues", error);
      Toast.show({ type: 'error', text1: 'Failed to fetch leagues' });
    } finally {
      set({ isGetLeaguesLoading: false });
    }
  },

  // ✅ join team
  jointeam: async (leagueId, day, teamName, startTime) => {
    set({ isJoinTeamLoading: true, joinTeamError: null, myteam: [] });
    try {
      const res = await Instance.post("/play/jointeam", { leagueId, day, teamName, startTime });
      set({ myteam: res.data });
      Toast.show({ type: 'success', text1: 'Team joined successfully' });
    } catch (error) {
      set({ joinTeamError: error });
      console.log("Error joining team", error);
      Toast.show({ type: 'error', text1: 'Failed to join team' });
    } finally {
      set({ isJoinTeamLoading: false });
    }
  },

  // ✅ get my team
  getmyteam: async (leagueId) => {
    set({ isGetMyTeamLoading: true, getMyTeamError: null, myteam: [] });
    try {
      const res = await Instance.post("/play/myteam", { leagueId });
      set({ myteam: res.data });
    } catch (error) {
      set({ getMyTeamError: error, myteam: null });
      Toast.show({ type: 'error', text1: 'Failed to fetch team' });
    } finally {
      set({ isGetMyTeamLoading: false });
    }
  },

  // ✅ get day data
  getDayData: async (day) => {
    set({ isGetDayDataLoading: true, getDayDataError: null, matchOfTheDay: [] });
    try {
      const res = await Instance.get(`/data/getmatch`, { params: { date: day } });
      set({ matchOfTheDay: res.data });
    } catch (error) {
      set({ getDayDataError: error });
      console.log(error);
      Toast.show({ type: 'error', text1: 'Failed to fetch match data' });
    } finally {
      set({ isGetDayDataLoading: false });
    }
  },

  // ✅ get league teams
  getleagueteams: async (leagueid) => {
    set({ isGetLeagueTeamsLoading: true, getLeagueTeamsError: null, leagueTeams: [] });
    try {
      const res = await Instance.get("/play/leagueteams", { params: { leagueid } });
      set({ leagueTeams: res.data });
    } catch (error) {
      set({ getLeagueTeamsError: error });
      console.log(error);
      Toast.show({ type: 'error', text1: 'Failed to fetch league teams' });
    } finally {
      set({ isGetLeagueTeamsLoading: false });
    }
  },

  // ✅ get transaction
  gettransaction: async () => {
    set({ isGetTransactionLoading: true, getTransactionError: null, transactions: [] });
    try {
      const res = await Instance.get("/play/transaction");
      set({ transactions: res.data });
    } catch (error) {
      set({ getTransactionError: error });
      console.log(error);
      Toast.show({ type: 'error', text1: 'Failed to fetch transactions' });
    } finally {
      set({ isGetTransactionLoading: false });
    }
  },

  // ✅ search by name
  SearchByName: async (name) => {
    set({ isSearchByNameLoading: true, searchByNameError: null, leagueSearchResult: [] });
    try {
      const response = await Instance.post("/play/leaguebyname", { name });
      set({ leagueSearchResult: response.data });
    } catch (error) {
      set({ searchByNameError: error });
      console.log(error.message);
      Toast.show({ type: 'error', text1: 'No league found' });
    } finally {
      set({ isSearchByNameLoading: false });
    }
  },

  // ✅ send request
  sendRequest: async (leagueId) => {
    set({ isSendRequestLoading: true, sendRequestError: null });
    try {
      const res = await Instance.post("/play/joinrequest", { leagueId });
      if (res) Toast.show({ type: 'success', text1: `Request Sent` });
    } catch (error) {
      set({ sendRequestError: error });
      console.log(error);
      Toast.show({ type: 'error', text1: 'Failed to send request' });
    } finally {
      set({ isSendRequestLoading: false });
    }
  },

  // ✅ get requests
  getRequests: async (leagueId, leagueType) => {
    set({ isGetRequestsLoading: true, getRequestsError: null, requests: [] });
    try {
      if (leagueType == "public") return;
      const res = await Instance.post("/play/requests", { leagueId });
      set({ requests: res.data });
    } catch (error) {
      set({ getRequestsError: error });
      console.log(error);
      Toast.show({ type: 'error', text1: 'Failed to fetch requests' });
    } finally {
      set({ isGetRequestsLoading: false });
    }
  },

  // ✅ reject request
  rejectRequest: async (requestId) => {
    set({ isRejectRequestLoading: true, rejectRequestError: null });
    try {
      const res = await Instance.post("/play/rejectrequest", { requestId });
      set((state) => ({
        requests: state.requests.map((req) =>
          req._id === requestId ? { ...req, status: res.data.status } : req
        ),
      }));
      Toast.show({ type: 'success', text1: 'Request rejected' });
    } catch (error) {
      set({ rejectRequestError: error });
      console.log(error);
      Toast.show({ type: 'error', text1: 'Failed to reject request' });
    } finally {
      set({ isRejectRequestLoading: false });
    }
  },

  // ✅ accept request
  acceptRequest: async (requestId) => {
    set({ isAcceptRequestLoading: true, acceptRequestError: null });
    try {
      const res = await Instance.post("/play/acceptrequest", { requestId });
      set((state) => ({
        requests: state.requests.map((req) =>
          req._id === requestId ? { ...req, status: res.data.status } : req
        ),
      }));
      Toast.show({ type: 'success', text1: 'Request accepted' });
    } catch (error) {
      set({ acceptRequestError: error });
      console.log(error);
      Toast.show({ type: 'error', text1: 'Failed to accept request' });
    } finally {
      set({ isAcceptRequestLoading: false });
    }
  },

  // 🔌 socket for realtime league search
  leaguebyname: () => {
    set({ leagueSearchResult: [] });
    const { socket } = useAuthStore.getState();
    socket.off("leaguenameresult");
    socket.on("leaguenameresult", (data) => {
      set({ leagueSearchResult: data });
    });
  },
}));
