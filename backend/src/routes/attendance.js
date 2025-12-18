import express from 'express';
import {
    getAttendanceByDate,
    getAttendanceByStudent,
    markAttendance,
    deleteAttendance,
    getAttendanceStats
} from '../controllers/attendanceController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

// Handle generic query (e.g. ?date=...)
router.get('/', getAttendanceByDate);
router.get('/stats', getAttendanceStats);
router.get('/date/:date', getAttendanceByDate);
router.get('/student/:studentId', getAttendanceByStudent);
router.post('/', markAttendance); // Handles bulk or single
router.post('/bulk', markAttendance); // Alias for frontend compatibility
router.delete('/:id', deleteAttendance);

export default router;
