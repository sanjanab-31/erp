import express from 'express';
import {
    getAllTeachers,
    getTeacherStats,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher
} from '../controllers/teacherController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllTeachers);
router.get('/stats', getTeacherStats); // Stats endpoint must be before /:id
router.get('/:id', getTeacherById);
router.post('/', createTeacher);
router.put('/:id', updateTeacher);
router.delete('/:id', deleteTeacher);

export default router;
