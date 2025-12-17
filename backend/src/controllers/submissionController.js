import Submission from '../models/submissionmodel.js';

export const getSubmissionsByAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const submissions = await Submission.find({ assignmentId: Number(assignmentId) });
        res.json({ success: true, data: submissions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getSubmissionsByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const submissions = await Submission.find({ studentId: Number(studentId) });
        res.json({ success: true, data: submissions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createSubmission = async (req, res) => {
    try {
        const newSubmission = await Submission.create({
            id: Date.now(),
            ...req.body,
            submittedAt: new Date(),
            status: 'Submitted'
        });
        res.status(201).json({ success: true, data: newSubmission });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const gradeSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const { marks, feedback } = req.body;

        const submission = await Submission.findOneAndUpdate(
            { id },
            { marks, feedback, status: 'Graded' },
            { new: true }
        );

        if (!submission) {
            return res.status(404).json({ success: false, message: 'Submission not found' });
        }
        res.json({ success: true, data: submission });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
