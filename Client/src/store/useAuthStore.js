import { create } from 'zustand';
import Instance from '../utils/axios.configuration';

export const useAuthStore= create((set)=>({
    isAuthUser:null,
    login:async(data)=>{
        try {
            const res= await Instance.post("/auth/login",data);
            set({isAuthUser:res.data.user});
        } catch (error) {
            console.log(error);
        }
    },

    signup:async(data)=>{
        try {
            const res= await Instance.post("/auth/signup",data);
            set({isAuthUser:res.data});
        } catch (error) {
            console.log(error);
        }
    },
    logout: ()=>{
        set({isAuthUser:null});
    },

}))