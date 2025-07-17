import { io } from 'socket.io-client';
import { create } from 'zustand';
import Instance from '../utils/axios.configuration';

const MAINURL='http://localhost:8080/'
export const useAuthStore= create((set,get)=>({
    isAuthUser:null,
    socket:null,
    login:async(data)=>{
        try {
            const res= await Instance.post("/auth/login",data);
            set({isAuthUser:res.data.user});
            get().connectSocket();
        } catch (error) {
            get().disconnectSocket();
            console.log(error);
        }
    },

    signup:async(data)=>{
        try {
            const res= await Instance.post("/auth/signup",data);
            set({isAuthUser:res.data});
            get().connectSocket();
        } catch (error) {
            get().disconnectSocket();
            console.log(error);
        }
    },
    logout: ()=>{
        get().disconnectSocket();
        set({isAuthUser:null});
    },

    connectSocket:()=>{
        const {isAuthUser} = get();
        if (!isAuthUser || get().socket?.connected) return;
        const socket = io(MAINURL,{
            query:{
                userId:isAuthUser._id
            }
        });
        set({socket});
    },
    disconnectSocket: () => {
    if(get().socket?.connected) get().socket.disconnect();
  },
}))