import express from 'express';
import { getTeacherAttendance, markTeacherAttendanceBulk, getTeacherAttendanceStats } from '../controllers/teacherAttendanceController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

// GET attendance for a specific date (query param ?date=YYYY-MM-DD)
router.get('/', getTeacherAttendance);

// Bulk mark attendance
router.post('/bulk', markTeacherAttendanceBulk);

// Stats for a specific date
router.get('/stats', getTeacherAttendanceStats);

export default router;
