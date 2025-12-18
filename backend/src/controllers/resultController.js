import ExamMarks from '../models/exammarksmodel.js';

export const getAllResults = async (req, res) => {
    try {
        const { studentId } = req.query;
        let query = {};
        if (studentId) {
            query.studentId = studentId;
        }

        const results = await ExamMarks.find(query);

        const formattedResults = results.map(r => ({
            id: r.id,
            courseId: r.courseId,
            studentId: r.studentId,
            studentName: r.studentName,
            examScores: {
                exam1: r.exam1,
                exam2: r.exam2,
                exam3: r.exam3
            },
            enteredBy: r.enteredBy,
            enteredAt: r.enteredAt
        }));

        res.json({ success: true, data: formattedResults });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createResult = async (req, res) => {
    try {
        const { examScores, ...rest } = req.body;
        const newResult = await ExamMarks.create({
            id: Date.now(),
            ...rest,
            exam1: examScores?.exam1 || 0,
            exam2: examScores?.exam2 || 0,
            exam3: examScores?.exam3 || 0,
            enteredAt: new Date()
        });
        res.status(201).json({ success: true, data: newResult });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
