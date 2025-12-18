import express from 'express';
import { getAllResults, createResult } from '../controllers/resultController.js';

const router = express.Router();

router.get('/', getAllResults);
router.post('/', createResult);

export default router;
