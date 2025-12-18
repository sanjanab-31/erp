import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    rollNumber: {
        type: String,
        required: true
    },
    parent: {
        type: String,
        required: false
    },
    parentEmail: {
        type: String,
        required: true
    },
    parentPhone: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Active'
    },
    active: {
        type: Boolean,
        required: true
    }
});

const Student = mongoose.model('Student', studentSchema);
export default Student;
