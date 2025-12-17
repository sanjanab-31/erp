
import mongoose from "mongoose";

const parentSchema = new mongoose.Schema({
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
    studentId: {
        type: Number,
        required: true
    },
    childName: {
        type: String,
        required: true
    },
    childClass: {
        type: String,
        required: true
    },
    relationship: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
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
    active: {
        type: Boolean,
        required: true
    }
});

const Parent = mongoose.model('Parent', parentSchema);
export default Parent;
