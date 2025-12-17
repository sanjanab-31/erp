import Assignment from '../models/assignmentmodel.js';

export const getAssignmentsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const assignments = await Assignment.find({ courseId: Number(courseId) });
        res.json({ success: true, data: assignments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createAssignment = async (req, res) => {
    try {
        const newAssignment = await Assignment.create({
            id: Date.now(),
            ...req.body,
            createdAt: new Date()
        });
        res.status(201).json({ success: true, data: newAssignment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const assignment = await Assignment.findOneAndUpdate({ id }, req.body, { new: true });

        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }
        res.json({ success: true, data: assignment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const assignment = await Assignment.findOneAndDelete({ id });

        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }
        res.json({ success: true, message: 'Assignment deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
