import express from 'express';
import { check, login, signup } from '../Controller/auth.controller.js';
import { protection } from '../midlayer/protect.midlayer.js';

const router= express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get("/check",protection,check)

export default router;