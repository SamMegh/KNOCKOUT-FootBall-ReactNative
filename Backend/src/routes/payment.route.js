import express from 'express';
import { getsession } from '../Controller/payment.controller.js';

const router = express.Router();
router.get("/initiatesession",getsession)
export default router;