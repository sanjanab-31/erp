import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    courseId: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    maxMarks: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;