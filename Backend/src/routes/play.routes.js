import express from 'express';
import { createleague, getleague, getmyleague, joinleague, jointeam } from '../Controller/play.controller.js';

const router = express.Router();

router.get("/leagues",getleague);
router.post("/myleagues",getmyleague);
router.post("/createleague",createleague);
router.post("/joinleague",joinleague);
router.post("/jointeam",jointeam);

export default router;