import express from 'express';
import { dataofdaywinner, getmatch } from '../Controller/data.controller.js';
import { protection } from '../midlayer/protect.midlayer.js';
const router = express.Router();

router.get("/getmatch",protection, getmatch);
router.get("/data",protection, dataofdaywinner);

export default router