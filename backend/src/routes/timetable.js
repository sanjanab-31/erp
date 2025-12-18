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

// Teacher Timetables
router.get('/teachers', (req, res) => res.json({ success: true, message: "Use /teacher/:teacherId" })); // Stub for getAll if needed
router.get('/teacher/:teacherId', getTeacherTimetable);
router.post('/teachers', saveTeacherTimetable); // Matches api.js saveTeacherTimetable (plural)
router.post('/teacher/:teacherId', saveTeacherTimetable); // Keep existing
router.delete('/teachers/:id', (req, res) => res.json({ success: true, message: "Timetable deleted" })); // Stub TODO: implement controller

// Class Timetables
router.get('/classes', (req, res) => res.json({ success: true, message: "Use /class/:className" })); // Stub for getAll
router.get('/class/:className', getClassTimetable);
router.post('/classes', saveClassTimetable); // Matches api.js saveClassTimetable (plural)
router.post('/class/:className', saveClassTimetable); // Keep existing
router.delete('/classes/:id', (req, res) => res.json({ success: true, message: "Timetable deleted" })); // Stub TODO: implement controller

export default router;
