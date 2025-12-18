import express from 'express';
import { login, register, logout, verifyToken, forgotPassword } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);

router.get('/verify', authenticateToken, verifyToken);
router.post('/change-password', authenticateToken, changePassword);

export default router;
