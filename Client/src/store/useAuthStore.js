import { create } from 'zustand';
import Instance from '../utils/axios.configuration';


export const useAuthStore= create((set)=>({
    isAuthUser:null,

    login:async(data)=>{
        try {
            console.log(data);
            const res= await Instance.post("/auth/login",data);
            // set({isAuthUser:res.data});
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    },

    signup:async(data)=>{
        try {
            const res= await Instance.post("/auth/signup",data);
            set({isAuthUser:res.data});
            console.log(res.data)
        } catch (error) {
            console.log(error);
        }
    },

    logout:async()=>{
        try {
            await Instance.get("/auth/logout");
            set({isAuthUser:null});
        } catch (error) {
            console.log(error);
        }
    },

    check:async()=>{
        try {
            const res= await Instance.get("/auth/check");
            set({isAuthUser:res.data});
        } catch (error) {
            console.log(error);
        }
    },

}))