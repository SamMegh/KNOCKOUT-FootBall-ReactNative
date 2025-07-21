import express from 'express';
import { createleague, getleague, getMyCreatedLeagues, getmyleague, joinleague, jointeam, myteam, teams } from '../Controller/play.controller.js';
import { protection } from '../midlayer/protect.midlayer.js';

const router = express.Router();

router.post("/leagues", protection, getleague);
router.post("/myleagues", protection, getmyleague);
router.post("/createleague", protection, createleague);//let { name, joinfee, ownerId, end, start, maxTimeTeamSelect, type, lifelinePerUser, totalWeeks } = req.body;
router.get("/yourleagues", protection, getMyCreatedLeagues);//const {ownerId}= req.query;
router.post("/joinleague", protection, joinleague);
router.post("/jointeam", protection, jointeam);
router.post("/myteam", protection, myteam);
router.get("/leagueteams", protection, teams);

export default router;