import express from 'express';
import { checkToken, login, logout, signup } from '../Controller/auth.controller.js';
import { protect } from '../midlelayer/protecter.midlayer.js';

const router= express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get("/check",protect, checkToken );

export default router;