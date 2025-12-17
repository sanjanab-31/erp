import express from 'express';
import {
    getAssignmentsByCourse,
    createAssignment,
    updateAssignment,
    deleteAssignment
} from '../controllers/assignmentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/course/:courseId', getAssignmentsByCourse);
router.post('/', createAssignment);
router.put('/:id', updateAssignment);
router.delete('/:id', deleteAssignment);

export default router;
