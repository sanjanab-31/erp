import express from 'express';
import {
    getMessages,
    sendMessage,
    markMessageRead,
    getAnnouncements,
    createAnnouncement,
    getUserNotifications,
    createNotification,
    getUnreadCounts,
    getConversations
} from '../controllers/communicationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

// Messages
router.get('/messages/:userId', getMessages);
router.get('/conversations/:userId', getConversations);
router.post('/messages', sendMessage);
router.put('/messages/:id/read', markMessageRead);

// Announcements
router.get('/announcements', getAnnouncements);
router.post('/announcements', createAnnouncement);

// Notifications
router.get('/notifications/:userId', getUserNotifications);
router.post('/notifications', createNotification);

// Stats
router.get('/unread/:userId', getUnreadCounts);

export default router;
