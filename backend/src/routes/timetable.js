import express from 'express';
import {
    getTeacherTimetable,
    saveTeacherTimetable,
    getClassTimetable,
    saveClassTimetable
} from '../controllers/timetableController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/teacher/:teacherId', getTeacherTimetable);
router.post('/teacher/:teacherId', saveTeacherTimetable);

router.get('/class/:className', getClassTimetable);
router.post('/class/:className', saveClassTimetable);

export default router;
