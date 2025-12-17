import { TeacherTimetable, ClassTimetable } from '../models/timetableModel.js';

// --- Teacher Timetable ---

export const getTeacherTimetable = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const timetable = await TeacherTimetable.findOne({ teacherId: Number(teacherId) });
        if (!timetable) return res.status(404).json({ success: false, message: 'Timetable not found' });
        res.json({ success: true, data: timetable });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const saveTeacherTimetable = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { schedule, teacherName } = req.body;

        let timetable = await TeacherTimetable.findOne({ teacherId: Number(teacherId) });

        if (timetable) {
            timetable.schedule = schedule;
            timetable.updatedAt = new Date();
            await timetable.save();
        } else {
            timetable = await TeacherTimetable.create({
                id: Date.now(),
                teacherId: Number(teacherId),
                teacherName,
                schedule
            });
        }

        res.json({ success: true, data: timetable });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Class Timetable ---

export const getClassTimetable = async (req, res) => {
    try {
        const { className } = req.params;
        const timetable = await ClassTimetable.findOne({ className });
        if (!timetable) return res.status(404).json({ success: false, message: 'Timetable not found' });
        res.json({ success: true, data: timetable });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const saveClassTimetable = async (req, res) => {
    try {
        const { className } = req.params;
        const { schedule } = req.body;

        let timetable = await ClassTimetable.findOne({ className });

        if (timetable) {
            timetable.schedule = schedule;
            timetable.updatedAt = new Date();
            await timetable.save();
        } else {
            timetable = await ClassTimetable.create({
                id: Date.now(),
                className,
                schedule
            });
        }

        res.json({ success: true, data: timetable });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
