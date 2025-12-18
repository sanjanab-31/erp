import express from 'express';
import {
    getTeacherAttendance,
    markTeacherAttendanceBulk,
    getTeacherAttendanceStats
} from '../controllers/teacherAttendanceController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getTeacherAttendance);
router.post('/bulk', markTeacherAttendanceBulk);
router.get('/stats', getTeacherAttendanceStats);

export default router;
