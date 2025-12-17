import express from 'express';
import {
    getAllStudents,
    getStudentStats,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
} from '../controllers/studentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes (if any) - none for now, but createStudent usually requires admin auth
// Protected routes
router.use(authenticateToken); // Apply auth middleware to all routes below

router.get('/', getAllStudents);
router.get('/stats', getStudentStats); // Stats endpoint must be before /:id
router.get('/:id', getStudentById);
router.post('/', createStudent); // Should strictly be Admin only in real app
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

export default router;
