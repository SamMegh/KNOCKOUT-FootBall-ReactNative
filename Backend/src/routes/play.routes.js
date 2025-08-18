import express from 'express';
import { acceptRequest, createleague, dailyCoin, getleague, getMyCreatedLeagues, getmyleague, joinleague, joinrequest, jointeam, leaguebyname, myteam, rejectRequest, requests, teams, tranxtxtion } from '../Controller/play.controller.js';
import { protection } from '../midlayer/protect.midlayer.js';

const router = express.Router();

router.get("/leagues", protection, getleague);
router.get("/myleagues", protection, getmyleague);
router.post("/createleague", protection, createleague);
router.get("/myownleagues", protection, getMyCreatedLeagues);
router.post("/joinleague", protection, joinleague);
router.post("/jointeam", protection, jointeam);
router.post("/myteam", protection, myteam);
router.get("/leagueteams", protection, teams);
router.post("/leaguebyname", protection, leaguebyname);
router.get("/dailyreward", protection, dailyCoin)
router.get("/transaction", protection, tranxtxtion)
router.post("/joinrequest", protection, joinrequest);
router.post("/acceptrequest", protection, acceptRequest);
router.post("/rejectrequest", protection, rejectRequest);
router.post("/requests", protection, requests);
export default router;