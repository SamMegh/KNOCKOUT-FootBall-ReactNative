import express from 'express';
import { paymentSheet } from '../Controller/paymentSetup.js';

const router = express.Router();
router.post("/payment-sheet",paymentSheet);
export default router;