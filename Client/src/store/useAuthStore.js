import { create } from 'zustand';
import Instance from '../utils/axios.configuration';


export const useAuthStore= create((set, get)=>({
    isAuthUser:null,

    login:async(data)=>{
        try {
            const res= await Instance.post("/auth/login",data);
            set({isAuthUser:res.data});
            console.log(res.data)
        } catch (error) {
            console.log(error);
        }
    }

}))