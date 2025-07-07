import express from 'express';

const router= express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.put("/update",protect, updateProfile );
router.get("/check",protect, checkToken );

export default router;