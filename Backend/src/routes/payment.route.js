import express from 'express';
import { getsession, verify } from '../Controller/payment.controller.js';

const router = express.Router();
router.get("/initiatesession",getsession);
router.post("/verify",verify);
export default router;