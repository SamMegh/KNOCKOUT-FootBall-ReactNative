import express from 'express';
import { paymentSheet } from '../Controller/paymentSetup.js';
import { protection } from '../midlayer/protect.midlayer.js';

const router = express.Router();
router.post("/payment-sheet",protection ,paymentSheet);
export default router;