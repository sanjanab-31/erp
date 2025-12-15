import React, { useState, useEffect } from 'react';
import {
    Mail,
    Send,
    Search,
    Bell,
    Megaphone
} from 'lucide-react';

const CommunicationPage = ({ darkMode }) => {
    const [activeTab, setActiveTab] = useState('Messages');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [communicationData, setCommunicationData] = useState({
        messages: [
            {
                id: 1,
                from: 'Dr. Sarah Johnson',
                role: 'Math Teacher',
                subject: 'Regarding Emma\'s Performance',
                date: '2025-12-14',
                preview: 'Emma is doing excellent in mathematics...',
                unread: true,
                fullMessage: 'Dear Parent,\\n\\nI wanted to inform you that Emma is doing excellent in mathematics. She has shown great improvement in problem-solving skills. Keep encouraging her!\\n\\nBest regards,\\nDr. Sarah Johnson'
            },
            {
                id: 2,
                from: 'Prof. Michael Chen',
                role: 'Physics Teacher',
                subject: 'Lab Assignment',
                date: '2025-12-13',
                preview: 'Please ensure Emma completes the lab report...',
                unread: false,
                fullMessage: 'Dear Parent,\\n\\nPlease ensure Emma completes the lab report by next week. The experiment was conducted successfully.\\n\\nBest regards,\\nProf. Michael Chen'
            }
        ],
        announcements: [
            {
                id: 1,
                title: 'Parent-Teacher Meeting',
                date: '2025-12-20',
                content: 'Parent-teacher meeting scheduled for December 20th at 10:00 AM. Please confirm your attendance.',
                category: 'Event'
            },
            {
                id: 2,
                title: 'Mid-term Exam Schedule',
                date: '2025-12-15',
                content: 'Mid-term exams will begin from January 5th. Detailed schedule has been sent via email.',
                category: 'Academic'
            }
        ],
        notifications: [
            {
                id: 1,
                title: 'Fee Payment Reminder',
                message: 'Quarterly fee payment is due on January 20th',
                time: '1 day ago',
                unread: true
            },
            {
                id: 2,
                title: 'Assignment Submitted',
                message: 'Emma has submitted Math assignment',
                time: '2 days ago',
                unread: false
            }
        ]
    });

    // Real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setCommunicationData(prev => ({ ...prev }));
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const filteredMessages = communicationData.messages.filter(msg =>
        msg.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Communication
                </h1>
                <p className="text-sm text-gray-500">Messages, announcements, and notifications</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Unread Messages</h3>
                        <Mail className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {communicationData.messages.filter(m => m.unread).length}
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Announcements</h3>
                        <Megaphone className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {communicationData.announcements.length}
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Notifications</h3>
                        <Bell className="w-5 h-5 text-orange-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {communicationData.notifications.filter(n => n.unread).length}
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="border-b border-gray-200">
                    <div className="flex space-x-8 px-6">
                        {['Messages', 'Announcements', 'Notifications'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === tab
                                    ? 'border-orange-600 text-orange-600'
                                    : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === 'Messages' && (
                        <div className="space-y-4">
                            <div className="relative mb-4">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search messages..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-gray-50 border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                />
                            </div>
                            {filteredMessages.map((message) => (
                                <div
                                    key={message.id}
                                    onClick={() => setSelectedMessage(message)}
                                    className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} cursor-pointer hover:shadow-md transition-shadow`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {message.from}
                                                </h4>
                                                {message.unread && (
                                                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mb-1">{message.role}</p>
                                            <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                                {message.subject}
                                            </p>
                                            <p className="text-xs text-gray-500">{message.date}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'Announcements' && (
                        <div className="space-y-4">
                            {communicationData.announcements.map((announcement) => (
                                <div
                                    key={announcement.id}
                                    className={`p-6 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {announcement.title}
                                        </h3>
                                        <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full">
                                            {announcement.category}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">{announcement.date}</p>
                                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {announcement.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'Notifications' && (
                        <div className="space-y-4">
                            {communicationData.notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-6 rounded-lg border ${notification.unread ? 'border-l-4 border-l-orange-600' : ''} ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                                >
                                    <div className="flex items-center space-x-2 mb-2">
                                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {notification.title}
                                        </h3>
                                        {notification.unread && (
                                            <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                                        )}
                                    </div>
                                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500">{notification.time}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommunicationPage;
