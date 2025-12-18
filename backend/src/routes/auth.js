import express from 'express';
import { login, logout, verifyToken, forgotPassword } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);

router.get('/verify', authenticateToken, verifyToken);
router.get('/me', authenticateToken, verifyToken); // Alias for frontend compatibility

router.post('/change-password', authenticateToken, forgotPassword);

export default router;
