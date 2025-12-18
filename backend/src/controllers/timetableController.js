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
        const { schedule, teacherName } = req.body;
        const teacherId = req.params.teacherId || req.body.teacherId;

        if (!teacherId || isNaN(Number(teacherId))) {
            return res.status(400).json({ success: false, message: 'Invalid or missing teacherId' });
        }

        // Log for debugging
        console.log('Saving Teacher Timetable:', { teacherId, teacherName, scheduleLength: schedule?.length });

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
        console.error('Save Teacher Timetable Error:', error);
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
        const { schedule } = req.body;
        const className = req.params.className || req.body.className;

        if (!className) {
            return res.status(400).json({ success: false, message: 'Invalid or missing className' });
        }

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

export const getAllTeacherTimetables = async (req, res) => {
    try {
        const timetables = await TeacherTimetable.find();
        res.json({ success: true, data: timetables });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllClassTimetables = async (req, res) => {
    try {
        const timetables = await ClassTimetable.find();
        res.json({ success: true, data: timetables });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
