import express from 'express';
import {
    getSettings,
    updateSettings,
    resetSettings
} from '../controllers/settingsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/:userId', getSettings);
router.put('/:userId', updateSettings);
router.delete('/:userId', resetSettings);

export default router;
