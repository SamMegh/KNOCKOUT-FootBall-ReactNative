import express from 'express';
import { dataofapi, getmatch } from '../Controller/match.controller.js';
import { protection } from '../midlayer/protect.midlayer.js';
const router = express.Router();

router.get("/getmatch",protection, getmatch);
router.get("/data",protection, dataofapi);

export default router