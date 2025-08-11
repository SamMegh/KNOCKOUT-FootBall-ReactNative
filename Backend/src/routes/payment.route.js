import express from 'express';
import { paymentSheet } from '../lib/paymentSetup.js';

const router = express.Router();
router.post("/payment-sheet",paymentSheet);
export default router;