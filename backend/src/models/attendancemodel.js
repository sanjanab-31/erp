import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    date: {
        type: String,
        required: true
    },
    studentId: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Present', 'Absent', 'Late', 'Excused']
    },
    markedBy: {
        type: String,
        required: true
    },
    markedAt: {
        type: Date,
        default: Date.now
    }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
