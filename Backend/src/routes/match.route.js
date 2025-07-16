import express from 'express';
import { getmatch } from '../Controller/match.controller.js';
const router = express.Router();

router.get("/getmatch",getmatch);

export default router