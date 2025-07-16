import express from 'express';
import { createleague, getleague, getmyleague, joinleague, jointeam, myteam, teams } from '../Controller/play.controller.js';

const router = express.Router();

router.post("/leagues",getleague);
router.post("/myleagues",getmyleague);
router.post("/createleague",createleague);
router.post("/joinleague",joinleague);
router.post("/jointeam",jointeam);
router.post("/myteam",myteam);
router.get("/leagueteams",teams);

export default router;