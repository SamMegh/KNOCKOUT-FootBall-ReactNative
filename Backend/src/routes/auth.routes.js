import express from 'express';
import { check, checkusername, login, signup } from '../Controller/auth.controller.js';
import { protection } from '../midlayer/protect.midlayer.js';

const router= express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get("/check",protection,check)
router.post("/username",checkusername)

export default router;