import express from 'express';
import {
    getExamSchedules,
    createExamSchedule,
    deleteExamSchedule,
    getExamMarksByStudent,
    enterExamMarks,
    getStudentFinalMarks,
    getExamMarksByCourse
} from '../controllers/examController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

// Schedule Routes
router.get('/schedules', getExamSchedules);
router.post('/schedules', createExamSchedule);
router.delete('/schedules/:id', deleteExamSchedule);

// Marks Routes
router.get('/marks/course/:courseId', getExamMarksByCourse);
router.get('/marks/student/:studentId', getExamMarksByStudent);
router.get('/final-marks/student/:studentId', getStudentFinalMarks);
router.post('/marks', enterExamMarks);

export default router;
