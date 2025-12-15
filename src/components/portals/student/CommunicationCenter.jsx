import React, { useState, useEffect } from 'react';
import {
    Mail,
    Bell,
    Megaphone,
    Send,
    Search,
    Plus
} from 'lucide-react';

const CommunicationCenter = ({ darkMode }) => {
    const [activeTab, setActiveTab] = useState('Messages');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Real-time communication data
    const [communicationData, setCommunicationData] = useState({
        unreadMessages: 1,
        unreadMessagesText: 'New messages',
        announcements: 4,
        announcementsText: 'Active announcements',
        notifications: 3,
        notificationsText: 'Unread notifications',
        messages: [
            {
                id: 1,
                sender: 'Sarah Johnson',
                role: 'Teacher',
                subject: 'Math Assignment Submission',
                date: '1/14/2025',
                preview: 'Please submit your assignment by tomorrow...',
                unread: true,
                avatar: 'SJ',
                fullMessage: 'Dear Student,\n\nPlease submit your Math assignment by tomorrow. Make sure to include all the required calculations and show your work.\n\nBest regards,\nSarah Johnson'
            },
            {
                id: 2,
                sender: 'David Brown',
                role: 'Teacher',
                subject: 'Physics Lab Schedule',
                date: '1/13/2025',
                preview: 'The physics lab has been rescheduled...',
                unread: false,
                avatar: 'DB',
                fullMessage: 'Dear Student,\n\nThe physics lab has been rescheduled to next week. Please check the updated timetable.\n\nBest regards,\nDavid Brown'
            },
            {
                id: 3,
                sender: 'Lisa Anderson',
                role: 'Teacher',
                subject: 'Literature Essay Feedback',
                date: '1/12/2025',
                preview: 'Great work on your latest essay...',
                unread: false,
                avatar: 'LA',
                fullMessage: 'Dear Student,\n\nGreat work on your latest essay. Your analysis was thorough and well-structured. Keep up the good work!\n\nBest regards,\nLisa Anderson'
            }
        ],
        announcements: [
            {
                id: 1,
                title: 'School Annual Day',
                date: '1/15/2025',
                content: 'Annual day celebration will be held on January 20th. All students are requested to attend.',
                category: 'Event'
            },
            {
                id: 2,
                title: 'Mid-term Exam Schedule',
                date: '1/14/2025',
                content: 'Mid-term exams will begin from February 1st. Please check the detailed schedule on the portal.',
                category: 'Academic'
            },
            {
                id: 3,
                title: 'Library Timings Update',
                date: '1/13/2025',
                content: 'Library will now be open from 8 AM to 6 PM on weekdays.',
                category: 'General'
            },
            {
                id: 4,
                title: 'Sports Day Registration',
                date: '1/12/2025',
                content: 'Register for sports day events by January 18th. Visit the sports department for more details.',
                category: 'Event'
            }
        ],
        notifications: [
            {
                id: 1,
                title: 'Assignment Graded',
                message: 'Your Math assignment has been graded. Score: 92/100',
                time: '2 hours ago',
                type: 'grade',
                unread: true
            },
            {
                id: 2,
                title: 'New Course Material',
                message: 'New study material uploaded for Physics chapter 5',
                time: '5 hours ago',
                type: 'material',
                unread: true
            },
            {
                id: 3,
                title: 'Fee Payment Reminder',
                message: 'Your quarterly fee payment is due on January 20th',
                time: '1 day ago',
                type: 'reminder',
                unread: true
            }
        ]
    });

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setCommunicationData(prev => ({
                ...prev,
                // Update any real-time fields
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const filteredMessages = communicationData.messages.filter(msg =>
        msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderMessagesTab = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Messages List */}
            <div className={`lg:col-span-1 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden`}>
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Messages
                        </h3>
                        <button className="flex items-center space-x-2 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                            <Plus className="w-4 h-4" />
                            <span className="text-sm font-medium">New</span>
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                    </div>
                </div>
                <div className="overflow-y-auto h-[calc(100%-140px)]">
                    {filteredMessages.map((message) => (
                        <div
                            key={message.id}
                            onClick={() => setSelectedMessage(message)}
                            className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'} cursor-pointer transition-colors ${selectedMessage?.id === message.id
                                ? 'bg-blue-50'
                                : darkMode
                                    ? 'hover:bg-gray-700'
                                    : 'hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                    {message.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                                            {message.sender}
                                        </h4>
                                        {message.unread && (
                                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mb-1">{message.role}</p>
                                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 truncate`}>
                                        {message.subject}
                                    </p>
                                    <p className="text-xs text-gray-500">{message.date}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Message Content */}
            <div className={`lg:col-span-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border flex items-center justify-center`}>
                {selectedMessage ? (
                    <div className="w-full h-full flex flex-col">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                                    {selectedMessage.avatar}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                                        {selectedMessage.sender}
                                    </h3>
                                    <p className="text-sm text-gray-500">{selectedMessage.role}</p>
                                </div>
                                <span className="text-sm text-gray-500">{selectedMessage.date}</span>
                            </div>
                            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-4`}>
                                {selectedMessage.subject}
                            </h2>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto">
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-line`}>
                                {selectedMessage.fullMessage}
                            </p>
                        </div>
                        <div className="p-4 border-t border-gray-200">
                            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                                <Send className="w-4 h-4" />
                                <span className="text-sm font-medium">Reply</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Select a message to read</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderAnnouncementsTab = () => (
        <div className="space-y-4">
            {communicationData.announcements.map((announcement) => (
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
                                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
                                    {announcement.category}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">{announcement.date}</p>
                        </div>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {announcement.content}
                    </p>
                </div>
            ))}
        </div>
    );

    const renderNotificationsTab = () => (
        <div className="space-y-4">
            {communicationData.notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 ${notification.unread ? 'border-l-4 border-l-blue-600' : ''
                        }`}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {notification.title}
                                </h3>
                                {notification.unread && (
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                )}
                            </div>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                {notification.message}
                            </p>
                            <p className="text-xs text-gray-500">{notification.time}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="flex-1 overflow-y-auto p-8">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Communication Center
                </h1>
                <p className="text-sm text-gray-500">Messages, announcements, and notifications</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {/* Unread Messages Card */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Unread Messages
                        </h3>
                        <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="mb-2">
                        <p className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {communicationData.unreadMessages}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500">{communicationData.unreadMessagesText}</p>
                </div>

                {/* Announcements Card */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Announcements
                        </h3>
                        <Megaphone className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="mb-2">
                        <p className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {communicationData.announcements.length}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500">{communicationData.announcementsText}</p>
                </div>

                {/* Notifications Card */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Notifications
                        </h3>
                        <Bell className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="mb-2">
                        <p className={`text-4xl font-bold text-orange-600`}>
                            {communicationData.notifications.length}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500">{communicationData.notificationsText}</p>
                </div>

                {/* Quick Actions Card */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border flex items-center justify-center`}>
                    <button className="flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors w-full justify-center">
                        <Send className="w-5 h-5" />
                        <span className="text-sm font-semibold">Send Message</span>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border`}>
                <div className="border-b border-gray-200">
                    <div className="flex space-x-8 px-6">
                        <button
                            onClick={() => setActiveTab('Messages')}
                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors relative ${activeTab === 'Messages'
                                ? 'border-blue-600 text-blue-600'
                                : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                                }`}
                        >
                            Messages
                            {communicationData.unreadMessages > 0 && (
                                <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                                    {communicationData.unreadMessages}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('Announcements')}
                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'Announcements'
                                ? 'border-blue-600 text-blue-600'
                                : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                                }`}
                        >
                            Announcements
                        </button>
                        <button
                            onClick={() => setActiveTab('Notifications')}
                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'Notifications'
                                ? 'border-blue-600 text-blue-600'
                                : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                                }`}
                        >
                            Notifications
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'Messages' && renderMessagesTab()}
                    {activeTab === 'Announcements' && renderAnnouncementsTab()}
                    {activeTab === 'Notifications' && renderNotificationsTab()}
                </div>
            </div>
        </div>
    );
};

export default CommunicationCenter;
