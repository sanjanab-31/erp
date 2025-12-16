// Centralized Communication Store
// Real-time messaging system for all portals (Student, Teacher, Parent, Admin)

const STORAGE_KEY = 'erp_communications';

// Get current user from auth (you can modify this based on your auth system)
const getCurrentUser = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return {
        id: user.id || 'user_1',
        name: user.name || 'Current User',
        email: user.email || 'user@school.com',
        role: user.role || 'student' // student, teacher, parent, admin
    };
};

// Initialize default data
const initializeDefaultData = () => {
    return {
        messages: [
            {
                id: 1,
                conversationId: 'conv_1',
                senderId: 'teacher_1',
                senderName: 'Sarah Johnson',
                senderRole: 'teacher',
                recipientId: 'student_1',
                recipientName: 'Mike Wilson',
                recipientRole: 'student',
                subject: 'Math Assignment Submission',
                text: 'Please submit your assignment by tomorrow',
                timestamp: new Date('2025-12-15T10:30:00').toISOString(),
                read: false,
                type: 'direct' // direct, group, announcement
            },
            {
                id: 2,
                conversationId: 'conv_2',
                senderId: 'parent_1',
                senderName: 'John Parent',
                senderRole: 'parent',
                recipientId: 'teacher_1',
                recipientName: 'Sarah Johnson',
                recipientRole: 'teacher',
                subject: 'Meeting Request',
                text: 'Can we schedule a meeting to discuss progress?',
                timestamp: new Date('2025-12-14T14:20:00').toISOString(),
                read: false,
                type: 'direct'
            }
        ],
        conversations: [
            {
                id: 'conv_1',
                participants: ['teacher_1', 'student_1'],
                lastMessage: 'Please submit your assignment by tomorrow',
                lastMessageTime: new Date('2025-12-15T10:30:00').toISOString(),
                unreadCount: { 'student_1': 1, 'teacher_1': 0 }
            },
            {
                id: 'conv_2',
                participants: ['parent_1', 'teacher_1'],
                lastMessage: 'Can we schedule a meeting to discuss progress?',
                lastMessageTime: new Date('2025-12-14T14:20:00').toISOString(),
                unreadCount: { 'parent_1': 0, 'teacher_1': 1 }
            }
        ],
        announcements: [
            {
                id: 1,
                title: 'Mid-term Exam Schedule',
                content: 'Mid-term exams will be held from Dec 20-25. Please prepare accordingly.',
                authorId: 'admin_1',
                authorName: 'Admin',
                authorRole: 'admin',
                recipients: 'all', // all, students, teachers, parents, specific IDs
                priority: 'high', // high, medium, low
                category: 'Academic',
                timestamp: new Date('2025-12-15T09:00:00').toISOString(),
                read: []
            },
            {
                id: 2,
                title: 'Parent-Teacher Meeting',
                content: 'Parent-teacher meeting scheduled for December 20th at 10:00 AM.',
                authorId: 'admin_1',
                authorName: 'Admin',
                authorRole: 'admin',
                recipients: 'parents',
                priority: 'medium',
                category: 'Event',
                timestamp: new Date('2025-12-14T11:00:00').toISOString(),
                read: []
            }
        ],
        notifications: [
            {
                id: 1,
                userId: 'student_1',
                title: 'Assignment Graded',
                message: 'Your Math assignment has been graded. Score: 92/100',
                type: 'grade',
                timestamp: new Date('2025-12-15T08:00:00').toISOString(),
                read: false,
                link: '/grades'
            },
            {
                id: 2,
                userId: 'parent_1',
                title: 'Fee Payment Reminder',
                message: 'Quarterly fee payment is due on January 20th',
                type: 'reminder',
                timestamp: new Date('2025-12-14T10:00:00').toISOString(),
                read: false,
                link: '/fees'
            }
        ]
    };
};

// Get all communication data
export const getAllCommunications = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            const defaultData = initializeDefaultData();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
            return defaultData;
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Error getting communications:', error);
        return initializeDefaultData();
    }
};

// Send a new message
export const sendMessage = (messageData) => {
    try {
        const communications = getAllCommunications();
        const currentUser = getCurrentUser();

        const newMessage = {
            id: Date.now(),
            conversationId: messageData.conversationId || `conv_${Date.now()}`,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderRole: currentUser.role,
            recipientId: messageData.recipientId,
            recipientName: messageData.recipientName,
            recipientRole: messageData.recipientRole,
            subject: messageData.subject || '',
            text: messageData.text,
            timestamp: new Date().toISOString(),
            read: false,
            type: messageData.type || 'direct'
        };

        communications.messages.push(newMessage);

        // Update or create conversation
        const convIndex = communications.conversations.findIndex(
            c => c.id === newMessage.conversationId
        );

        if (convIndex >= 0) {
            communications.conversations[convIndex].lastMessage = newMessage.text;
            communications.conversations[convIndex].lastMessageTime = newMessage.timestamp;
            communications.conversations[convIndex].unreadCount[messageData.recipientId] =
                (communications.conversations[convIndex].unreadCount[messageData.recipientId] || 0) + 1;
        } else {
            communications.conversations.push({
                id: newMessage.conversationId,
                participants: [currentUser.id, messageData.recipientId],
                lastMessage: newMessage.text,
                lastMessageTime: newMessage.timestamp,
                unreadCount: { [messageData.recipientId]: 1, [currentUser.id]: 0 }
            });
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(communications));
        window.dispatchEvent(new Event('communicationsUpdated'));

        return newMessage;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

// Get messages for a specific conversation
export const getConversationMessages = (conversationId) => {
    const communications = getAllCommunications();
    return communications.messages
        .filter(m => m.conversationId === conversationId)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};

// Get conversations for current user
export const getUserConversations = () => {
    const communications = getAllCommunications();
    const currentUser = getCurrentUser();

    return communications.conversations
        .filter(conv => conv.participants.includes(currentUser.id))
        .map(conv => {
            const messages = communications.messages.filter(m => m.conversationId === conv.id);
            const otherParticipantId = conv.participants.find(p => p !== currentUser.id);
            const lastMessage = messages[messages.length - 1];

            return {
                ...conv,
                otherParticipant: {
                    id: otherParticipantId,
                    name: lastMessage?.senderRole === currentUser.role ? lastMessage.recipientName : lastMessage?.senderName,
                    role: lastMessage?.senderRole === currentUser.role ? lastMessage.recipientRole : lastMessage?.senderRole
                },
                unreadCount: conv.unreadCount[currentUser.id] || 0
            };
        })
        .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
};

// Mark message as read
export const markMessageAsRead = (messageId) => {
    try {
        const communications = getAllCommunications();
        const messageIndex = communications.messages.findIndex(m => m.id === messageId);

        if (messageIndex >= 0) {
            communications.messages[messageIndex].read = true;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(communications));
            window.dispatchEvent(new Event('communicationsUpdated'));
        }
    } catch (error) {
        console.error('Error marking message as read:', error);
    }
};

// Mark conversation as read
export const markConversationAsRead = (conversationId) => {
    try {
        const communications = getAllCommunications();
        const currentUser = getCurrentUser();

        // Mark all messages in conversation as read
        communications.messages = communications.messages.map(m =>
            m.conversationId === conversationId && m.recipientId === currentUser.id
                ? { ...m, read: true }
                : m
        );

        // Reset unread count
        const convIndex = communications.conversations.findIndex(c => c.id === conversationId);
        if (convIndex >= 0) {
            communications.conversations[convIndex].unreadCount[currentUser.id] = 0;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(communications));
        window.dispatchEvent(new Event('communicationsUpdated'));
    } catch (error) {
        console.error('Error marking conversation as read:', error);
    }
};

// Create announcement
export const createAnnouncement = (announcementData) => {
    try {
        const communications = getAllCommunications();
        const currentUser = getCurrentUser();

        const newAnnouncement = {
            id: Date.now(),
            title: announcementData.title,
            content: announcementData.content,
            authorId: currentUser.id,
            authorName: currentUser.name,
            authorRole: currentUser.role,
            recipients: announcementData.recipients || 'all',
            priority: announcementData.priority || 'medium',
            category: announcementData.category || 'General',
            timestamp: new Date().toISOString(),
            read: []
        };

        communications.announcements.unshift(newAnnouncement);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(communications));
        window.dispatchEvent(new Event('communicationsUpdated'));

        return newAnnouncement;
    } catch (error) {
        console.error('Error creating announcement:', error);
        throw error;
    }
};

// Get announcements for current user
export const getUserAnnouncements = () => {
    const communications = getAllCommunications();
    const currentUser = getCurrentUser();

    return communications.announcements.filter(announcement => {
        if (announcement.recipients === 'all') return true;
        if (announcement.recipients === currentUser.role + 's') return true;
        if (Array.isArray(announcement.recipients) && announcement.recipients.includes(currentUser.id)) return true;
        return false;
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Mark announcement as read
export const markAnnouncementAsRead = (announcementId) => {
    try {
        const communications = getAllCommunications();
        const currentUser = getCurrentUser();
        const annIndex = communications.announcements.findIndex(a => a.id === announcementId);

        if (annIndex >= 0 && !communications.announcements[annIndex].read.includes(currentUser.id)) {
            communications.announcements[annIndex].read.push(currentUser.id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(communications));
            window.dispatchEvent(new Event('communicationsUpdated'));
        }
    } catch (error) {
        console.error('Error marking announcement as read:', error);
    }
};

// Get notifications for current user
export const getUserNotifications = () => {
    const communications = getAllCommunications();
    const currentUser = getCurrentUser();

    return communications.notifications
        .filter(n => n.userId === currentUser.id)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Create notification
export const createNotification = (notificationData) => {
    try {
        const communications = getAllCommunications();

        const newNotification = {
            id: Date.now(),
            userId: notificationData.userId,
            title: notificationData.title,
            message: notificationData.message,
            type: notificationData.type || 'info',
            timestamp: new Date().toISOString(),
            read: false,
            link: notificationData.link || ''
        };

        communications.notifications.unshift(newNotification);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(communications));
        window.dispatchEvent(new Event('communicationsUpdated'));

        return newNotification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

// Mark notification as read
export const markNotificationAsRead = (notificationId) => {
    try {
        const communications = getAllCommunications();
        const notifIndex = communications.notifications.findIndex(n => n.id === notificationId);

        if (notifIndex >= 0) {
            communications.notifications[notifIndex].read = true;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(communications));
            window.dispatchEvent(new Event('communicationsUpdated'));
        }
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
};

// Get unread counts
export const getUnreadCounts = () => {
    const communications = getAllCommunications();
    const currentUser = getCurrentUser();

    const unreadMessages = communications.conversations
        .filter(conv => conv.participants.includes(currentUser.id))
        .reduce((sum, conv) => sum + (conv.unreadCount[currentUser.id] || 0), 0);

    const unreadAnnouncements = communications.announcements
        .filter(a => {
            if (a.recipients === 'all') return !a.read.includes(currentUser.id);
            if (a.recipients === currentUser.role + 's') return !a.read.includes(currentUser.id);
            return false;
        }).length;

    const unreadNotifications = communications.notifications
        .filter(n => n.userId === currentUser.id && !n.read).length;

    return {
        messages: unreadMessages,
        announcements: unreadAnnouncements,
        notifications: unreadNotifications,
        total: unreadMessages + unreadAnnouncements + unreadNotifications
    };
};

// Search messages
export const searchMessages = (query) => {
    const communications = getAllCommunications();
    const currentUser = getCurrentUser();

    return communications.messages.filter(m =>
        (m.senderId === currentUser.id || m.recipientId === currentUser.id) &&
        (m.text.toLowerCase().includes(query.toLowerCase()) ||
            m.subject.toLowerCase().includes(query.toLowerCase()) ||
            m.senderName.toLowerCase().includes(query.toLowerCase()) ||
            m.recipientName.toLowerCase().includes(query.toLowerCase()))
    );
};

// Subscribe to real-time updates
export const subscribeToCommunicationUpdates = (callback) => {
    const handler = () => callback(getAllCommunications());
    window.addEventListener('communicationsUpdated', handler);

    // Return unsubscribe function
    return () => window.removeEventListener('communicationsUpdated', handler);
};

export default {
    getAllCommunications,
    sendMessage,
    getConversationMessages,
    getUserConversations,
    markMessageAsRead,
    markConversationAsRead,
    createAnnouncement,
    getUserAnnouncements,
    markAnnouncementAsRead,
    getUserNotifications,
    createNotification,
    markNotificationAsRead,
    getUnreadCounts,
    searchMessages,
    subscribeToCommunicationUpdates
};
