import { Message, Announcement, Notification } from '../models/communicationModel.js';

// --- Messages ---

export const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const messages = await Message.find({
            $or: [{ senderId: userId }, { recipientId: userId }]
        }).sort({ timestamp: -1 });
        res.json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const newMessage = await Message.create({
            id: Date.now(),
            ...req.body,
            timestamp: new Date()
        });
        res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const markMessageRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findOneAndUpdate({ id }, { read: true });
        res.json({ success: true, message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getConversations = async (req, res) => {
    try {
        const { userId } = req.params;
        const uid = Number(userId);

        // Aggregate to group messages by conversationId
        // This effectively rebuilds the "conversation" view from messages
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [{ senderId: uid }, { recipientId: uid }]
                }
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: "$conversationId",
                    lastMessage: { $first: "$text" },
                    lastMessageTime: { $first: "$timestamp" },
                    participants: { $first: ["$senderId", "$recipientId"] }, // This is simplified
                    participantDetails: {
                        $first: {
                            senderId: "$senderId",
                            senderName: "$senderName",
                            senderRole: "$senderRole",
                            recipientId: "$recipientId",
                            recipientName: "$recipientName",
                            recipientRole: "$recipientRole"
                        }
                    },
                    messages: { $push: "$$ROOT" }
                }
            },
            {
                $project: {
                    id: "$_id",
                    lastMessage: 1,
                    lastMessageTime: 1,
                    // Calculate unread count for THIS user
                    unreadCount: {
                        $size: {
                            $filter: {
                                input: "$messages",
                                as: "msg",
                                cond: {
                                    $and: [
                                        { $eq: ["$$msg.recipientId", uid] },
                                        { $eq: ["$$msg.read", false] }
                                    ]
                                }
                            }
                        }
                    },
                    // Identify other participant
                    otherParticipant: {
                        $cond: {
                            if: { $eq: ["$participantDetails.senderId", uid] },
                            then: {
                                id: "$participantDetails.recipientId",
                                name: "$participantDetails.recipientName",
                                role: "$participantDetails.recipientRole"
                            },
                            else: {
                                id: "$participantDetails.senderId",
                                name: "$participantDetails.senderName",
                                role: "$participantDetails.senderRole"
                            }
                        }
                    }
                }
            },
            { $sort: { lastMessageTime: -1 } }
        ]);

        res.json({ success: true, data: conversations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Announcements ---

export const getAnnouncements = async (req, res) => {
    try {
        // In real app, filter based on user role/ID from req.user
        const announcements = await Announcement.find().sort({ timestamp: -1 });
        res.json({ success: true, data: announcements });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createAnnouncement = async (req, res) => {
    try {
        const newAnnouncement = await Announcement.create({
            id: Date.now(),
            ...req.body,
            timestamp: new Date()
        });
        res.status(201).json({ success: true, data: newAnnouncement });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Notifications ---

export const getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await Notification.find({ userId }).sort({ timestamp: -1 });
        res.json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createNotification = async (req, res) => {
    try {
        const newNotification = await Notification.create({
            id: Date.now(),
            ...req.body,
            timestamp: new Date()
        });
        res.status(201).json({ success: true, data: newNotification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUnreadCounts = async (req, res) => {
    try {
        const { userId } = req.params;
        // Simplified Logic: Just counting unread messages and notifications
        const unreadMessages = await Message.countDocuments({ recipientId: userId, read: false });
        const unreadNotifications = await Notification.countDocuments({ userId, read: false });

        res.json({
            success: true,
            data: {
                messages: unreadMessages,
                notifications: unreadNotifications,
                total: unreadMessages + unreadNotifications
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
