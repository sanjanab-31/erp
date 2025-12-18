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

// api.js calls GET /assignments with params. 
// Existing controller gets by courseId. modifying to allow query param based fetching.
router.get('/', (req, res, next) => {
    if (req.query.courseId) return getAssignmentsByCourse(req, res);
    // Fallback or getAll logic 
    res.json({ success: true, data: [] });
});
router.get('/course/:courseId', getAssignmentsByCourse);
router.post('/', createAssignment);
router.put('/:id', updateAssignment);
router.delete('/:id', deleteAssignment);

export default router;
