import express from 'express';
import { signup, login, refresh, logout, getAllUsers, googleLogin } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);

export default router;
