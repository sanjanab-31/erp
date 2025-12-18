import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true
    },
    theme: {
        type: String,
        default: 'light' // light, dark, system
    },
    language: {
        type: String,
        default: 'en'
    },
    notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: false }
    },
    dashboardLayout: {
        type: Object,
        default: {} // Store layout preferences
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
