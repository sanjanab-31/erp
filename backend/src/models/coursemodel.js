import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    // code: {
    //     type: String,
    //     required: true
    // },
    class: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    teacherId: {
        type: Number,
        required: true
    },
    teacherName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    enrolledStudents: {
        type: [Number],
        default: []
    }
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
