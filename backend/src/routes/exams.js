import express from 'express';
import {
    getExamSchedules,
    createExamSchedule,
    deleteExamSchedule,
    getExamMarksByStudent,
    enterExamMarks,
    getStudentFinalMarks,
    getExamMarksByCourse,
    getExamStats
} from '../controllers/examController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

// Schedule Routes
router.get('/stats', getExamStats);
router.get('/', getExamSchedules); // Alias for /schedules as generic getter
router.get('/schedules', getExamSchedules);

router.post('/', createExamSchedule); // Alias /schedules POST to /
router.post('/schedules', createExamSchedule);

router.delete('/:id', deleteExamSchedule); // Alias /schedules/:id DELETE to /:id
router.delete('/schedules/:id', deleteExamSchedule);

// Stub for update if needed by api.js update
router.put('/:id', (req, res) => res.json({ success: true, message: "Update not implemented yet" }));

// Marks Routes
router.get('/stats', getExamStats);
router.get('/marks/course/:courseId', getExamMarksByCourse);
router.get('/marks/student/:studentId', getExamMarksByStudent);
router.get('/final-marks/student/:studentId', getStudentFinalMarks);
router.post('/marks', enterExamMarks);

export default router;
