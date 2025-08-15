import express from 'express';
import { paymentSheet, stripeWebhook } from '../Controller/paymentSetup.js';
import { protection } from '../midlayer/protect.midlayer.js';

const router = express.Router();
router.post("/payment-sheet",protection ,paymentSheet);
router.post('/webhook', express.raw({type: 'application/json'}), stripeWebhook);
export default router;