import mongoose from "mongoose";

const examMarksSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    courseId: {
        type: Number,
        required: true
    },
    studentId: {
        type: Number,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    exam1: {
        type: Number,
        required: true
    },
    exam2: {
        type: Number,
        required: true
    },
    exam3: {
        type: Number,
        required: true
    },
    enteredBy: {
        type: String,
        required: true
    },
    enteredAt: {
        type: Date,
        required: true
    }
});

const ExamMarks = mongoose.model('ExamMarks', examMarksSchema);
export default ExamMarks;