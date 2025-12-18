import express from 'express';
import { sendStudentCreds, sendTeacherCreds, sendAnnouncement } from '../controllers/emailController.js';

const router = express.Router();

router.post('/send-student-creds', sendStudentCreds);
router.post('/send-teacher-creds', sendTeacherCreds);
router.post('/send-announcement', sendAnnouncement);

export default router;
