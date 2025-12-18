import express from 'express';
import {
    getTeacherTimetable,
    saveTeacherTimetable,
    getClassTimetable,
    saveClassTimetable,
    getAllTeacherTimetables,
    getAllClassTimetables
} from '../controllers/timetableController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/teachers', getAllTeacherTimetables);
router.get('/teacher/:teacherId', getTeacherTimetable);
router.post('/teachers', saveTeacherTimetable); // Matches api.js saveTeacherTimetable (plural)
router.post('/teacher/:teacherId', saveTeacherTimetable); // Keep existing
router.delete('/teachers/:id', (req, res) => res.json({ success: true, message: "Timetable deleted" })); // Stub TODO: implement controller

router.get('/classes', getAllClassTimetables);
router.get('/class/:className', getClassTimetable);
router.post('/classes', saveClassTimetable); // Matches api.js saveClassTimetable (plural)
router.post('/class/:className', saveClassTimetable); // Keep existing
router.delete('/classes/:id', (req, res) => res.json({ success: true, message: "Timetable deleted" })); // Stub TODO: implement controller

export default router;
