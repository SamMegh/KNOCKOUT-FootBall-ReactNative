import express from 'express';
import { createleague, getleague, joinleague } from '../Controller/play.controller.js';

const router = express.Router();

router.get("/getleague",getleague);
router.get("/createleague",createleague);
router.get("/joinleague",joinleague);

export default router;