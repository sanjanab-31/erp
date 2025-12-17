import express from 'express';
import {
    getSubmissionsByAssignment,
    getSubmissionsByStudent,
    createSubmission,
    gradeSubmission
} from '../controllers/submissionController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/assignment/:assignmentId', getSubmissionsByAssignment);
router.get('/student/:studentId', getSubmissionsByStudent); // Students viewing their own submissions
router.post('/', createSubmission);
router.put('/:id/grade', gradeSubmission);

export default router;
