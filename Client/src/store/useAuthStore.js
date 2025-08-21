import Toast from "react-native-toast-message";
import { io } from 'socket.io-client';
import { create } from 'zustand';
import { removeItem, setItem } from '../utils/asyncstorage.js';
import Instance from '../utils/axios.configuration';

const MAINURL = process.env.EXPO_PUBLIC_API_URL;

export const useAuthStore = create((set, get) => ({
    isAuthUser: null,
    socket: null,
    loading: false, // ✅ global loading state

    login: async (data) => {
        set({ loading: true });
        try {
            const res = await Instance.post("/auth/login", {
                email: data.email.toLowerCase(),
                password: data.password
            });
            set({ isAuthUser: res.data.user });
            await setItem(res.data.token);

            Toast.show({
                type: 'success',
                text1: `Welcome Back!`,
                text2: res.data.user.name
            });

            await get().dailyreward();
            get().connectSocket();
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: error?.response?.data?.message || 'Something went wrong'
            });
            get().disconnectSocket();
        } finally {
            set({ loading: false });
        }
    },

    signup: async (data) => {
        set({ loading: true });
        try {
            const res = await Instance.post("/auth/signup", {
                email: data.email.toLowerCase(),
                password: data.password,
                name: data.name
            });
            set({ isAuthUser: res.data });

            Toast.show({
                type: 'success',
                text1: 'Signup Successful',
                text2: `Welcome, ${res.data.user.name}`
            });

            await get().dailyreward();
            get().connectSocket();
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'Signup Failed',
                text2: error?.response?.data?.message || 'Something went wrong'
            });
            get().disconnectSocket();
        } finally {
            set({ loading: false });
        }
    },

    logout: () => {
        set({ isAuthUser: null });
        removeItem();
        Toast.show({
            type: 'info',
            text1: 'Logged out successfully'
        });
        get().disconnectSocket();
    },

    dailyreward: async () => {
        set({ loading: true });
        try {
            await Instance.get("/play/dailyreward");
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'Daily reward fetch failed'
            });
            get().disconnectSocket();
        } finally {
            set({ loading: false });
        }
    },

    check: async () => {
        set({ loading: true });
        try {
            const res = await Instance.get("/auth/check");
            set({ isAuthUser: res.data });
            await get().dailyreward();
            get().connectSocket();
        } catch (error) {
            set({ isAuthUser: null });
            removeItem();
            Toast.show({
                type: 'error',
                text1: 'Session expired'
            });
            get().disconnectSocket();
        } finally {
            set({ loading: false });
        }
    },

    connectSocket: () => {
        const { isAuthUser } = get();
        if (!isAuthUser || get().socket?.connected) return;
        const socket = io(MAINURL, {
            query: { userId: isAuthUser._id }
        });
        set({ socket });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },

    coinUpdates: () => {
        try {
            const { socket } = get();
            if (!socket) return;
            socket.off("coinsUpdated");
            socket.on("coinsUpdated", (data) => {
                set((state) => ({
                    isAuthUser: { ...state.isAuthUser, ...data }
                }));
                Toast.show({
                    type: 'info',
                    text1: 'Coins Updated',
                    text2: `New balance: ${data.gcoin ?? data.scoin ?? ''}`
                });
            });
        } catch (error) {
            console.error("❌ coinUpdates listener error:", error);
        }
    }
}));
