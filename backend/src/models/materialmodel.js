import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
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
    link: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        required: true
    }
});

const Material = mongoose.model('Material', materialSchema);
export default Material;