import ExamSchedule from '../models/examschedulemodel.js';
import ExamMarks from '../models/exammarksmodel.js';
import Assignment from '../models/assignmentmodel.js';
import Submission from '../models/submissionmodel.js';

// --- Exam Schedules ---

export const getExamSchedules = async (req, res) => {
    try {
        const schedules = await ExamSchedule.find();
        res.json({ success: true, data: schedules });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createExamSchedule = async (req, res) => {
    try {
        const newSchedule = await ExamSchedule.create({
            id: Date.now(),
            ...req.body,
            createdAt: new Date()
        });
        res.status(201).json({ success: true, data: newSchedule });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteExamSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        await ExamSchedule.findOneAndDelete({ id });
        res.json({ success: true, message: 'Exam Schedule deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Exam Marks ---

export const getExamMarksByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const marks = await ExamMarks.find({ courseId: Number(courseId) });
        res.json({ success: true, data: marks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getExamMarksByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const marks = await ExamMarks.find({ studentId: Number(studentId) });
        res.json({ success: true, data: marks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const enterExamMarks = async (req, res) => {
    try {
        const newMarks = await ExamMarks.create({
            id: Date.now(),
            ...req.body,
            enteredAt: new Date()
        });
        res.status(201).json({ success: true, data: newMarks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Final Marks Calculation ---

export const getStudentFinalMarks = async (req, res) => {
    try {
        const { studentId } = req.params;
        const sid = Number(studentId);

        // Get all marks and submissions for this student
        const examMarks = await ExamMarks.find({ studentId: sid });
        const submissions = await Submission.find({ studentId: sid, status: 'Graded' });

        // Group by course
        const courseIds = new Set([
            ...examMarks.map(m => m.courseId),
            ...submissions.map(s => s.courseId)
        ]);

        const finalResults = [];

        for (const courseId of courseIds) {
            // Calculate Exam Total (out of 75)
            const courseExamMarks = examMarks.find(m => m.courseId === courseId);
            let examTotal = 0;
            if (courseExamMarks) {
                const total = (courseExamMarks.exam1 || 0) + (courseExamMarks.exam2 || 0) + (courseExamMarks.exam3 || 0);
                examTotal = (total / 300) * 75; // Scale to 75
            }

            // Calculate Assignment Total (out of 25)
            const courseSubmissions = submissions.filter(s => s.courseId === courseId);
            let assignmentTotal = 0;
            if (courseSubmissions.length > 0) {
                const sum = courseSubmissions.reduce((acc, s) => acc + (Number(s.marks) || 0), 0);
                // Assuming average of assignments scaled to 25, or logic from frontend:
                // Frontend: (sum / count) * 0.25 ?? No, Frontend: (avg) * 0.25 was weird.
                // Frontend logic: (assignmentTotal / assignmentCount) * 0.25? No, logic was:
                // const assignmentMarks = assignmentCount > 0 ? (assignmentTotal / assignmentCount) * 0.25 : 0; -> This means 0.25 marks total?
                // Wait, frontend logic: `(assignmentTotal / assignmentCount) * 0.25`. If avg is 100, result is 25. Correct.
                const avg = sum / courseSubmissions.length; // e.g., 90
                assignmentTotal = (avg / 100) * 25; // Scale to 25. Assuming max marks is 100.
            }

            finalResults.push({
                courseId,
                examMarks: Math.round(examTotal * 100) / 100,
                assignmentMarks: Math.round(assignmentTotal * 100) / 100,
                finalTotal: Math.round((examTotal + assignmentTotal) * 100) / 100
            });
        }

        res.json({ success: true, data: finalResults });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
