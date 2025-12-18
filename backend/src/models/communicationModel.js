import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    conversationId: { type: String, required: true },
    senderId: { type: Number, required: true },
    senderName: { type: String, required: true },
    senderRole: { type: String, required: true },
    recipientId: { type: Number, required: true },
    recipientName: { type: String, required: true },
    recipientRole: { type: String, required: true },
    subject: String,
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    type: { type: String, default: 'direct' }
});

const announcementSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true }, // Changed from 'content' to matching frontend
    targetAudience: { type: String, required: true }, // Changed from 'recipients'
    classes: [{ type: String }], // Added classes support
    attachment: { type: String }, // Added attachment support
    status: { type: String, default: 'Published' }, // Added status
    publishDate: { type: Date, default: Date.now }, // Added publishDate
    authorId: { type: Number, required: true },
    authorName: { type: String, required: true },
    authorRole: { type: String, required: true },
    priority: { type: String, default: 'medium' },
    category: { type: String, default: 'General' },
    timestamp: { type: Date, default: Date.now },
    read: [{ type: Number }]
});

const notificationSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    userId: { type: Number, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, default: 'info' },
    link: String,
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

export const Message = mongoose.model('Message', messageSchema);
export const Announcement = mongoose.model('Announcement', announcementSchema);
export const Notification = mongoose.model('Notification', notificationSchema);
