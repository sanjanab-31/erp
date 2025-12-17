import express from 'express';
import { sendStudentCreds, sendTeacherCreds } from '../controllers/emailController.js';

const router = express.Router();

router.post('/send-student-creds', sendStudentCreds);
router.post('/send-teacher-creds', sendTeacherCreds);

export default router;
