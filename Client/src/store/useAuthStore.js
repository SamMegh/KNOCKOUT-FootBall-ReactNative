import Toast from "react-native-toast-message";
import { create } from 'zustand';
import { removeItem, setItem } from '../utils/asyncstorage.js';
import Instance from '../utils/axios.configuration';
export const useAuthStore = create((set) => ({
    isAuthUser: null,
    login: async (data) => {
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

        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: error?.response?.data?.message || 'Something went wrong'
            });
        }
    },

    signup: async (data) => {
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
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'Signup Failed',
                text2: error?.response?.data?.message || 'Something went wrong'
            });
        }
    },

    logout: () => {
        set({ isAuthUser: null });
        removeItem();
        Toast.show({
            type: 'info',
            text1: 'Logged out successfully'
        });
    },

    check: async () => {
        try {
            const res = await Instance.get("/auth/check");
            set({ isAuthUser: res.data });
        } catch (error) {
            set({ isAuthUser: null });
            removeItem();
            Toast.show({
                type: 'error',
                text1: 'Session expired'
            });
        }
    }
}))