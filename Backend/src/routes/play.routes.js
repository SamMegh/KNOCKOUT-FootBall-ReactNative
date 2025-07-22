import express from 'express';
import { createleague, getleague, getMyCreatedLeagues, getmyleague, joinleague, jointeam, leaguebyname, myteam, teams } from '../Controller/play.controller.js';
import { protection } from '../midlayer/protect.midlayer.js';

const router = express.Router();

router.get("/leagues", protection, getleague);
router.get("/myleagues", protection, getmyleague);
router.post("/createleague", protection, createleague); //let { name, joinfee, end, start, maxTimeTeamSelect, type, lifelinePerUser, totalWeeks } = req.body;
router.get("/myownleagues", protection, getMyCreatedLeagues);
router.post("/joinleague", protection, joinleague);
router.post("/jointeam", protection, jointeam);
router.post("/myteam", protection, myteam);
router.get("/leagueteams", protection, teams);
router.post("/leaguebyname", protection, leaguebyname);

export default router;