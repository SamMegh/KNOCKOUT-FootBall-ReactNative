import express from 'express';
import { getmatch } from '../Controller/match.controller.js';
import { protection } from '../midlayer/protect.midlayer.js';
const router = express.Router();

router.get("/getmatch",protection, getmatch);

export default router