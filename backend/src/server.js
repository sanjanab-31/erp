import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

import authRoutes from './routes/auth.js';
import studentRoutes from './routes/studentRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import parentRoutes from './routes/parentRoutes.js';
import courseRoutes from './routes/courses.js';
import materialRoutes from './routes/materials.js';
import assignmentRoutes from './routes/assignments.js';
import submissionRoutes from './routes/submissions.js';
import examRoutes from './routes/exams.js';
import attendanceRoutes from './routes/attendance.js';
import feeRoutes from './routes/fees.js';
import communicationRoutes from './routes/communication.js';
import timetableRoutes from './routes/timetable.js';
import settingsRoutes from './routes/settings.js';
import emailRoutes from './routes/emailRoutes.js';
import teacherAttendanceRoutes from './routes/teacherAttendance.js';
import libraryRoutes from './routes/library.js';
import reportsRoutes from './routes/reports.js';

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration to support credentials from frontend dev server
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const corsOptions = {
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
// Explicitly handle preflight for all routes
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({
        message: 'ERP Backend API',
        status: 'Running',
        version: '1.0.0'
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/teacher-attendance', teacherAttendanceRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/reports', reportsRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 API URL: http://localhost:${PORT}`);
});
