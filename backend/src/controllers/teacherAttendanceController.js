import Attendance from '../models/attendancemodel.js'; // Using same model or separate?
// Ideally separate model, but if not existing, create one.
// Let's assume we need a TeacherAttendance model.

import mongoose from 'mongoose';

const teacherAttendanceSchema = new mongoose.Schema({
    id: { type: Number, required: true }, // Using numeric ID to match other models
    teacherId: { type: Number, required: true },
    teacherName: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    status: { type: String, enum: ['Present', 'Absent', 'Leave', 'Late'], default: 'Present' },
    markedAt: { type: Date, default: Date.now }
});

const TeacherAttendance = mongoose.models.TeacherAttendance || mongoose.model('TeacherAttendance', teacherAttendanceSchema);

export const getTeacherAttendance = async (req, res) => {
    try {
        let { date } = req.query;
        // Fix for incorrect query param format from frontend
        if (typeof date === 'object' && date !== null && date.date) {
            date = date.date;
        }

        let query = {};
        if (date) {
            query.date = date;
        }
        const attendance = await TeacherAttendance.find(query);
        res.json({ success: true, data: attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const markTeacherAttendanceBulk = async (req, res) => {
    try {
        const attendanceData = req.body; // Array of { teacherId, name, status, date }

        if (!Array.isArray(attendanceData)) {
            return res.status(400).json({ success: false, message: 'Expected an array of attendance records' });
        }

        const records = attendanceData.map(record => ({
            id: Date.now() + Math.random(),
            ...record,
            markedAt: new Date()
        }));

        // Option: Delete existing for that date first to avoid duplicates?
        // keeping it simple for now, maybe client handles it.
        // Or check if date matches.

        const result = await TeacherAttendance.insertMany(records);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTeacherAttendanceStats = async (req, res) => {
    try {
        let { date } = req.query;
        // Fix for incorrect query param format from frontend
        if (typeof date === 'object' && date !== null && date.date) {
            date = date.date;
        }

        let matchStage = {};
        if (date) {
            matchStage.date = date;
        }

        const stats = await TeacherAttendance.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const formattedStats = stats.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, { Present: 0, Absent: 0, Leave: 0, Late: 0 });

        res.json({ success: true, data: formattedStats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
