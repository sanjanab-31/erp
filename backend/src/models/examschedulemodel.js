import mongoose from "mongoose";

const examScheduleSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    courseName: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    examName: {
        type: String,
        required: true
    },
    examDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    }
});

const ExamSchedule = mongoose.model('ExamSchedule', examScheduleSchema);
export default ExamSchedule;