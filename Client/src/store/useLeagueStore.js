import {create} from 'zustand';
import Instance from '../utils/axios.configuration';

export const useLeagueStore = create((set)=>{
    leagues=null,
    myleagues=null,

    createleague=async(data)=>{
        try {
            const res = await Instance.post("/play/createleague",data);
            if(res){
                console.log("league created sussfully " + res);
            }
        } catch (error) {
            console.log("unable to create League "+ error);
        }
    },

    joinleague=async(data)=>{
        try {
            const res = await Instance.post("/play/joinleague",data);
            set({myleagues:[...myleagues,res.data]});
        } catch (error) {
            console.log("unable to create League "+ error);
        }
    },

    getleague= async()=>{
        try {
            const res = await Instance.get("/play/leagues");
            set({leagues:res.data});
        } catch (error) {
            console.log("unable to create League "+ error);
        }
    }
})