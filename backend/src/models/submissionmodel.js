import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    assignmentId: {
        type: Number,
        required: true
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
    driveLink: {
        type: String,
        required: true
    },
    submittedAt: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    marks: {
        type: Number,
        required: true
    },
    feedback: {
        type: String,
        required: true
    }
});

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;