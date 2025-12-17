import mongoose from "mongoose";

const scheduleEntrySchema = new mongoose.Schema({
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    subject: { type: String, required: true },
    room: String,
    teacherId: Number,
    teacherName: String
});

const teacherTimetableSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    teacherId: { type: Number, required: true },
    teacherName: { type: String, required: true },
    schedule: [scheduleEntrySchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const classTimetableSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    className: { type: String, required: true },
    schedule: [scheduleEntrySchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const TeacherTimetable = mongoose.model('TeacherTimetable', teacherTimetableSchema);
export const ClassTimetable = mongoose.model('ClassTimetable', classTimetableSchema);
