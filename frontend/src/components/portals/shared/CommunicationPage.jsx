import React, { useState, useEffect } from 'react';
import {
    Mail,
    Send,
    Search,
    Bell,
    Megaphone,
    Plus,
    X,
    Users,
    User,
    Clock,
    CheckCheck,
    Paperclip,
    MoreVertical,
    Filter
} from 'lucide-react';
import {
    sendMessage,
    getUserConversations,
    getConversationMessages,
    markConversationAsRead,
    getUserAnnouncements,
    createAnnouncement,
    markAnnouncementAsRead,
    getUserNotifications,
    markNotificationAsRead,
    getUnreadCounts,
    subscribeToCommunicationUpdates
} from '../../../utils/communicationStore';

const CommunicationPage = ({ darkMode, portalType = 'student' }) => {
    const [activeTab, setActiveTab] = useState('messages');
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showNewMessageModal, setShowNewMessageModal] = useState(false);
    const [showNewAnnouncementModal, setShowNewAnnouncementModal] = useState(false);

    const [conversations, setConversations] = useState([]);
    const [currentMessages, setCurrentMessages] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [unreadCounts, setUnreadCounts] = useState({ messages: 0, announcements: 0, notifications: 0 });

    
    const [newMessage, setNewMessage] = useState({
        recipientId: '',
        recipientName: '',
        recipientRole: '',
        subject: '',
        text: ''
    });

    
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        content: '',
        recipients: 'all',
        priority: 'medium',
        category: 'General'
    });

    
    useEffect(() => {
        loadData();

        const unsubscribe = subscribeToCommunicationUpdates(() => {
            loadData();
        });

        return () => unsubscribe();
    }, []);

    
    useEffect(() => {
        if (selectedConversation) {
            const messages = getConversationMessages(selectedConversation.id);
            setCurrentMessages(messages);
            markConversationAsRead(selectedConversation.id);
        }
    }, [selectedConversation]);

    const loadData = () => {
        setConversations(getUserConversations());
        setAnnouncements(getUserAnnouncements());
        setNotifications(getUserNotifications());
        setUnreadCounts(getUnreadCounts());
    };

    const handleSendMessage = () => {
        if (messageText.trim() && selectedConversation) {
            sendMessage({
                conversationId: selectedConversation.id,
                recipientId: selectedConversation.otherParticipant.id,
                recipientName: selectedConversation.otherParticipant.name,
                recipientRole: selectedConversation.otherParticipant.role,
                text: messageText,
                type: 'direct'
            });
            setMessageText('');
        }
    };

    const handleNewMessage = () => {
        if (newMessage.text.trim() && newMessage.recipientId) {
            sendMessage({
                recipientId: newMessage.recipientId,
                recipientName: newMessage.recipientName,
                recipientRole: newMessage.recipientRole,
                subject: newMessage.subject,
                text: newMessage.text,
                type: 'direct'
            });
            setShowNewMessageModal(false);
            setNewMessage({ recipientId: '', recipientName: '', recipientRole: '', subject: '', text: '' });
        }
    };

    const handleCreateAnnouncement = () => {
        if (newAnnouncement.title.trim() && newAnnouncement.content.trim()) {
            createAnnouncement(newAnnouncement);
            setShowNewAnnouncementModal(false);
            setNewAnnouncement({ title: '', content: '', recipients: 'all', priority: 'medium', category: 'General' });
        }
    };

    const filteredConversations = conversations.filter(conv =>
        conv.otherParticipant?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??';
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const renderMessagesTab = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden`}>
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Messages
                        </h3>
                        <button
                            onClick={() => setShowNewMessageModal(true)}
                            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="text-sm font-medium">New</span>
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                    </div>
                </div>
                <div className="overflow-y-auto max-h-[600px]">
                    {filteredConversations.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => setSelectedConversation(conv)}
                            className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'} cursor-pointer transition-colors ${selectedConversation?.id === conv.id
                                    ? 'bg-blue-50'
                                    : darkMode
                                        ? 'hover:bg-gray-700'
                                        : 'hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                    {getInitials(conv.otherParticipant?.name)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                                            {conv.otherParticipant?.name || 'Unknown'}
                                        </h4>
                                        {conv.unreadCount > 0 && (
                                            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                                                {conv.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mb-1">{conv.otherParticipant?.role}</p>
                                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} truncate`}>
                                        {conv.lastMessage}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{formatTime(conv.lastMessageTime)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredConversations.length === 0 && (
                        <div className="p-8 text-center">
                            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500">No conversations yet</p>
                        </div>
                    )}
                </div>
            </div>

            {}
            <div className={`lg:col-span-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border flex flex-col`}>
                {selectedConversation ? (
                    <>
                        {}
                        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                    {getInitials(selectedConversation.otherParticipant?.name)}
                                </div>
                                <div>
                                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {selectedConversation.otherParticipant?.name}
                                    </h3>
                                    <p className="text-xs text-gray-500">{selectedConversation.otherParticipant?.role}</p>
                                </div>
                            </div>
                        </div>

                        {}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
                            {currentMessages.map((message) => {
                                const isSent = message.senderRole !== selectedConversation.otherParticipant?.role;
                                return (
                                    <div
                                        key={message.id}
                                        className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[70%] ${isSent
                                                ? 'bg-blue-600 text-white'
                                                : darkMode
                                                    ? 'bg-gray-700 text-white'
                                                    : 'bg-gray-100 text-gray-900'
                                            } rounded-lg p-3`}>
                                            {message.subject && (
                                                <p className="text-xs font-semibold mb-1 opacity-80">{message.subject}</p>
                                            )}
                                            <p className="text-sm">{message.text}</p>
                                            <div className="flex items-center justify-end space-x-1 mt-1">
                                                <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                                                {isSent && <CheckCheck className="w-3 h-3" />}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {}
                        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    className={`flex-1 px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-gray-50 border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Select a conversation to start messaging
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderAnnouncementsTab = () => (
        <div className="space-y-4">
            {(portalType === 'admin' || portalType === 'teacher') && (
                <div className="flex justify-end">
                    <button
                        onClick={() => setShowNewAnnouncementModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span>New Announcement</span>
                    </button>
                </div>
            )}
            {announcements.map((announcement) => (
                <div
                    key={announcement.id}
                    className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {announcement.title}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${announcement.priority === 'high'
                                        ? 'bg-red-100 text-red-600'
                                        : announcement.priority === 'medium'
                                            ? 'bg-yellow-100 text-yellow-600'
                                            : 'bg-blue-100 text-blue-600'
                                    }`}>
                                    {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                                    {announcement.category}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">
                                By {announcement.authorName} • {formatTime(announcement.timestamp)}
                            </p>
                        </div>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {announcement.content}
                    </p>
                </div>
            ))}
            {announcements.length === 0 && (
                <div className="text-center py-12">
                    <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No announcements yet</p>
                </div>
            )}
        </div>
    );

    const renderNotificationsTab = () => (
        <div className="space-y-4">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    onClick={() => markNotificationAsRead(notification.id)}
                    className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 ${notification.read ? '' : 'border-l-4 border-l-blue-600'
                        } cursor-pointer hover:shadow-md transition-shadow`}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {notification.title}
                                </h3>
                                {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                )}
                            </div>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                {notification.message}
                            </p>
                            <p className="text-xs text-gray-500">{formatTime(notification.timestamp)}</p>
                        </div>
                    </div>
                </div>
            ))}
            {notifications.length === 0 && (
                <div className="text-center py-12">
                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No notifications yet</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            {}
            <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Communication Center
                </h1>
                <p className="text-sm text-gray-500">Messages, announcements, and notifications</p>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Unread Messages</h3>
                        <Mail className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {unreadCounts.messages}
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Announcements</h3>
                        <Megaphone className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {announcements.length}
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Notifications</h3>
                        <Bell className="w-5 h-5 text-orange-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {unreadCounts.notifications}
                    </p>
                </div>
            </div>

            {}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="border-b border-gray-200">
                    <div className="flex space-x-8 px-6">
                        {['messages', 'announcements', 'notifications'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors capitalize relative ${activeTab === tab
                                        ? 'border-blue-600 text-blue-600'
                                        : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                                    }`}
                            >
                                {tab}
                                {tab === 'messages' && unreadCounts.messages > 0 && (
                                    <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                                        {unreadCounts.messages}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === 'messages' && renderMessagesTab()}
                    {activeTab === 'announcements' && renderAnnouncementsTab()}
                    {activeTab === 'notifications' && renderNotificationsTab()}
                </div>
            </div>

            {}
            {showNewMessageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 max-w-md w-full`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>New Message</h3>
                            <button onClick={() => setShowNewMessageModal(false)}>
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Recipient ID
                                </label>
                                <input
                                    type="text"
                                    value={newMessage.recipientId}
                                    onChange={(e) => setNewMessage({ ...newMessage, recipientId: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-gray-50 border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="e.g., teacher_1, student_1"
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={newMessage.subject}
                                    onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-gray-50 border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Message
                                </label>
                                <textarea
                                    value={newMessage.text}
                                    onChange={(e) => setNewMessage({ ...newMessage, text: e.target.value })}
                                    rows="4"
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-gray-50 border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <button
                                onClick={handleNewMessage}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Send Message
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {}
            {showNewAnnouncementModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 max-w-md w-full`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>New Announcement</h3>
                            <button onClick={() => setShowNewAnnouncementModal(false)}>
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={newAnnouncement.title}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-gray-50 border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Content
                                </label>
                                <textarea
                                    value={newAnnouncement.content}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                    rows="4"
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-gray-50 border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Priority
                                    </label>
                                    <select
                                        value={newAnnouncement.priority}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}
                                        className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-gray-50 border-gray-300 text-gray-900'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Recipients
                                    </label>
                                    <select
                                        value={newAnnouncement.recipients}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, recipients: e.target.value })}
                                        className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-gray-50 border-gray-300 text-gray-900'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    >
                                        <option value="all">All</option>
                                        <option value="students">Students</option>
                                        <option value="teachers">Teachers</option>
                                        <option value="parents">Parents</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                onClick={handleCreateAnnouncement}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Create Announcement
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunicationPage;
