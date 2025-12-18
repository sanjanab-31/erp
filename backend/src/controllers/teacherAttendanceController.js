import Attendance from '../models/attendancemodel.js'; // Using same model or separate?
// Ideally separate model, but if not existing, create one.
// Let's assume we need a TeacherAttendance model.

import mongoose from 'mongoose';

const teacherAttendanceSchema = new mongoose.Schema({
    id: { type: Number, required: true }, // Using numeric ID to match other models
    teacherId: { type: Number, required: true },
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

        const operations = attendanceData.map(record => ({
            updateOne: {
                filter: { teacherId: record.teacherId, date: record.date },
                update: {
                    $set: {
                        status: record.status,
                        markedAt: new Date(),
                        name: record.name,
                        teacherId: record.teacherId,
                        date: record.date
                    },
                    $setOnInsert: { id: Date.now() + Math.random() }
                },
                upsert: true
            }
        }));

        const result = await TeacherAttendance.bulkWrite(operations);
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

        const initialStats = { present: 0, absent: 0, leave: 0, late: 0, total: 0 };

        const formattedStats = stats.reduce((acc, curr) => {
            const key = curr._id.toLowerCase();
            // Map 'leave' to 'absent' effectively if frontend doesn't have a 'leave' card, 
            // OR keep it if we want to show it. The Frontend has 'present', 'absent', 'late'.
            // Actually the frontend expects 'present', 'absent', 'late'.
            // 'Leave' might be considered Absent or we should just pass it.
            // Let's coerce keys to lowercase.

            if (acc.hasOwnProperty(key)) {
                acc[key] = curr.count;
            }
            acc.total += curr.count;
            return acc;
        }, initialStats);

        res.json({ success: true, data: formattedStats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
