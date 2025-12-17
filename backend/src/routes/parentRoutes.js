import express from 'express';
import {
    getAllParents,
    getParentById,
    createParent,
    updateParent,
    deleteParent
} from '../controllers/parentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllParents);
router.get('/:id', getParentById);
router.post('/', createParent);
router.put('/:id', updateParent);
router.delete('/:id', deleteParent);

export default router;
