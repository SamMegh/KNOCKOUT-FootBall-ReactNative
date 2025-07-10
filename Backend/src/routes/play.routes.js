import express from 'express';
import { createleague, getleague, joinleague } from '../Controller/play.controller.js';

const router = express.Router();

router.get("/leagues",getleague);
router.post("/createleague",createleague);
router.post("/joinleague",joinleague);

export default router;