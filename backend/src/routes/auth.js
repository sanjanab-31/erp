import express from 'express';
import { login, register, logout, verifyToken } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();


router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);


router.get('/verify', authenticateToken, verifyToken);

export default router;
