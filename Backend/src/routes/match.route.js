import express from 'express';
import { getmatches } from '../Controller/match.controller.js';
const router = express.Router();

router.get("/getmatches",getmatches);

export default router