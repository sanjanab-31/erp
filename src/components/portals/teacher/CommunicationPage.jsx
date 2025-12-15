import React, { useState } from 'react';
import {
    MessageSquare,
    Send,
    Search,
    Filter,
    Users,
    User,
    Bell,
    Mail,
    Plus,
    Paperclip,
    MoreVertical,
    Clock,
    CheckCheck
} from 'lucide-react';

const CommunicationPage = ({ darkMode }) => {
    const [activeTab, setActiveTab] = useState('messages');
    const [selectedChat, setSelectedChat] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [chats, setChats] = useState([
        {
            id: 1,
            name: 'John Doe',
            role: 'Student',
            lastMessage: 'Thank you for the feedback on my assignment',
            time: '10:30 AM',
            unread: 2,
            online: true,
            messages: [
                { id: 1, sender: 'John Doe', text: 'Hello Sir, I have a question about the homework', time: '10:15 AM', sent: false },
                { id: 2, sender: 'Me', text: 'Sure, what would you like to know?', time: '10:20 AM', sent: true },
                { id: 3, sender: 'John Doe', text: 'Thank you for the feedback on my assignment', time: '10:30 AM', sent: false }
            ]
        },
        {
            id: 2,
            name: 'Grade 10-A Class',
            role: 'Group',
            lastMessage: 'Assignment deadline extended to Friday',
            time: 'Yesterday',
            unread: 0,
            online: false,
            messages: [
                { id: 1, sender: 'Me', text: 'Assignment deadline extended to Friday', time: 'Yesterday', sent: true },
                { id: 2, sender: 'Jane Smith', text: 'Thank you sir!', time: 'Yesterday', sent: false }
            ]
        },
        {
            id: 3,
            name: 'Sarah Johnson',
            role: 'Parent',
            lastMessage: 'Can we schedule a meeting to discuss progress?',
            time: '2 days ago',
            unread: 1,
            online: false,
            messages: [
                { id: 1, sender: 'Sarah Johnson', text: 'Can we schedule a meeting to discuss progress?', time: '2 days ago', sent: false }
            ]
        }
    ]);

    const [announcements, setAnnouncements] = useState([
        {
            id: 1,
            title: 'Mid-term Exam Schedule',
            content: 'Mid-term exams will be held from Dec 20-25. Please prepare accordingly.',
            date: '2 hours ago',
            recipients: 'All Classes',
            priority: 'high'
        },
        {
            id: 2,
            title: 'Assignment Submission Reminder',
            content: 'Please submit your pending assignments by Friday.',
            date: '1 day ago',
            recipients: 'Grade 10-A',
            priority: 'medium'
        }
    ]);

    const sendMessage = () => {
        if (messageText.trim() && selectedChat) {
            const newMessage = {
                id: selectedChat.messages.length + 1,
                sender: 'Me',
                text: messageText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sent: true
            };

            setChats(chats.map(chat =>
                chat.id === selectedChat.id
                    ? { ...chat, messages: [...chat.messages, newMessage], lastMessage: messageText }
                    : chat
            ));

            setMessageText('');
        }
    };

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex-1 overflow-y-auto p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Communication Center
                </h1>
                <p className="text-sm text-gray-500">Connect with students, parents, and staff</p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setActiveTab('messages')}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'messages'
                        ? 'bg-green-600 text-white'
                        : `${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'} hover:bg-green-50`
                        }`}
                >
                    <div className="flex items-center space-x-2">
                        <MessageSquare className="w-5 h-5" />
                        <span>Messages</span>
                        {chats.filter(c => c.unread > 0).length > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {chats.reduce((acc, c) => acc + c.unread, 0)}
                            </span>
                        )}
                    </div>
                </button>

                <button
                    onClick={() => setActiveTab('announcements')}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'announcements'
                        ? 'bg-green-600 text-white'
                        : `${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'} hover:bg-green-50`
                        }`}
                >
                    <div className="flex items-center space-x-2">
                        <Bell className="w-5 h-5" />
                        <span>Announcements</span>
                    </div>
                </button>
            </div>

            {/* Messages Tab */}
            {activeTab === 'messages' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Chat List */}
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                        <div className="p-4 border-b border-gray-200">
                            <div className="relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-gray-50 border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                />
                            </div>
                        </div>

                        <div className="overflow-y-auto max-h-[600px]">
                            {filteredChats.map((chat) => (
                                <div
                                    key={chat.id}
                                    onClick={() => setSelectedChat(chat)}
                                    className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} cursor-pointer transition-colors ${selectedChat?.id === chat.id
                                        ? 'bg-green-50'
                                        : `${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`
                                        }`}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="relative">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                {chat.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            {chat.online && (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                                                    {chat.name}
                                                </h4>
                                                <span className="text-xs text-gray-500">{chat.time}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                                            <span className="text-xs text-gray-400">{chat.role}</span>
                                        </div>
                                        {chat.unread > 0 && (
                                            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                                                {chat.unread}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className={`lg:col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden flex flex-col`}>
                        {selectedChat ? (
                            <>
                                {/* Chat Header */}
                                <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                            {selectedChat.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {selectedChat.name}
                                            </h3>
                                            <p className="text-xs text-gray-500">{selectedChat.role}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <MoreVertical className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
                                    {selectedChat.messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.sent ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[70%] ${message.sent
                                                ? 'bg-green-600 text-white'
                                                : `${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`
                                                } rounded-lg p-3`}>
                                                <p className="text-sm">{message.text}</p>
                                                <div className="flex items-center justify-end space-x-1 mt-1">
                                                    <span className="text-xs opacity-70">{message.time}</span>
                                                    {message.sent && <CheckCheck className="w-3 h-3" />}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Message Input */}
                                <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <div className="flex items-center space-x-2">
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                            <Paperclip className="w-5 h-5 text-gray-500" />
                                        </button>
                                        <input
                                            type="text"
                                            placeholder="Type a message..."
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                            className={`flex-1 px-4 py-2 rounded-lg border ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                : 'bg-gray-50 border-gray-300 text-gray-900'
                                                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                        />
                                        <button
                                            onClick={sendMessage}
                                            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Select a conversation to start messaging
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Announcements Tab */}
            {activeTab === 'announcements' && (
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                            <Plus className="w-5 h-5" />
                            <span>New Announcement</span>
                        </button>
                    </div>

                    {announcements.map((announcement) => (
                        <div
                            key={announcement.id}
                            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {announcement.title}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${announcement.priority === 'high'
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-yellow-100 text-yellow-600'
                                            }`}>
                                            {announcement.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                                        </span>
                                    </div>
                                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                                        {announcement.content}
                                    </p>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <div className="flex items-center space-x-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{announcement.date}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Users className="w-4 h-4" />
                                            <span>{announcement.recipients}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommunicationPage;
