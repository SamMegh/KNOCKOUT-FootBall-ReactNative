import { create } from 'zustand';
import { removeItem, setItem } from '../utils/asyncstorage.js';
import Instance from '../utils/axios.configuration';
export const useAuthStore= create((set)=>({
    isAuthUser:null,
    login:async(data)=>{
        try {
            const res= await Instance.post("/auth/login",{
                email:data.email.toLowerCase(),
                password: data.password
            });
            set({isAuthUser:res.data.user});
            await setItem(res.data.token);
            
        } catch (error) {
            console.log(error);
        }
    },

    signup:async(data)=>{
        try {
            const res= await Instance.post("/auth/signup",{
                email:data.email.toLowerCase(),
                password: data.password,
                name: data.name
            });
            set({isAuthUser:res.data});
        } catch (error) {
            console.log(error);
        }
    },

    logout: ()=>{
        set({isAuthUser:null});
        removeItem();
    },

    check:async()=>{
try {
    const res = await Instance.get("/auth/check");
    set({isAuthUser:res.data});
} catch (error) {
    set({isAuthUser:null});
        removeItem();
}
    }
}))