import express from 'express';
import {
    getAllFees,
    getFeesByStudent,
    addFee,
    updateFee,
    makePayment,
    getFeeStats,
    deleteFee,
    getOverdueFees
} from '../controllers/feeController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllFees);
router.get('/stats', getFeeStats);
router.get('/overdue', getOverdueFees);
router.get('/student/:studentId', getFeesByStudent);
router.post('/', addFee);
router.put('/:id', updateFee);
router.post('/:id/pay', makePayment);
router.delete('/:id', deleteFee);

export default router;
