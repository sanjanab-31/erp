import express from 'express';
import {
    getOverviewReport,
    getAcademicReport,
    getFinancialReport,
    getAttendanceReport
} from '../controllers/reportsController.js';

const router = express.Router();

router.get('/overview', getOverviewReport);
router.get('/academic', getAcademicReport);
router.get('/financial', getFinancialReport);
router.get('/attendance', getAttendanceReport);

export default router;
