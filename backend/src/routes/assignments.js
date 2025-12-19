import express from 'express';
import {
    getAllAssignments,
    getAssignmentsByCourse,
    createAssignment,
    updateAssignment,
    deleteAssignment
} from '../controllers/assignmentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

// GET /assignments - gets all or by courseId query
router.get('/', (req, res) => {
    if (req.query.courseId) {
        // We can reuse the controller if we modify it to check query too, 
        // but let's keep it simple here.
        req.params.courseId = req.query.courseId;
        return getAssignmentsByCourse(req, res);
    }
    return getAllAssignments(req, res);
});
router.get('/course/:courseId', getAssignmentsByCourse);
router.post('/', createAssignment);
router.put('/:id', updateAssignment);
router.delete('/:id', deleteAssignment);

export default router;
