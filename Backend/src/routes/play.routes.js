import express from 'express';
import { createleague, getleague, joinleague } from '../Controller/play.controller';

const router = express.Router();

router.get("/getleague",getleague);
router.get("/createleague",createleague);
router.get("/joinleague",joinleague);