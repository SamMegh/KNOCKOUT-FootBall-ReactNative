import express from 'express';
import { createleague, getleague, getMyCreatedLeagues, getmyleague, joinleague, jointeam, myteam, teams } from '../Controller/play.controller.js';

const router = express.Router();

router.post("/leagues",getleague);
router.post("/myleagues",getmyleague);
router.post("/createleague",createleague);//let { name, joinfee, ownerId, end, start, maxTimeTeamSelect, type, lifelinePerUser, totalWeeks } = req.body;
router.get("/yourleagues",getMyCreatedLeagues);//const {ownerId}= req.query;
router.post("/joinleague",joinleague);
router.post("/jointeam",jointeam);
router.post("/myteam",myteam);
router.get("/leagueteams",teams);

export default router;