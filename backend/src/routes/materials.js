import express from 'express';
import {
    getMaterialsByCourse,
    createMaterial,
    deleteMaterial
} from '../controllers/materialController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/course/:courseId', getMaterialsByCourse);
router.post('/', createMaterial);
router.delete('/:id', deleteMaterial);

export default router;
