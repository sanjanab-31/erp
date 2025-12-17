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

router.get('/stats', getAttendanceStats);
router.get('/date/:date', getAttendanceByDate);
router.get('/student/:studentId', getAttendanceByStudent);
router.post('/', markAttendance); // Handles bulk or single
router.delete('/:id', deleteAttendance);

export default router;
