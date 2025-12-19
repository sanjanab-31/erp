import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    Megaphone,
    Search,
    Calendar,
    Users,
    Link as LinkIcon,
    Bell
} from 'lucide-react';
import { announcementApi } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

const AnnouncementsPage = () => {
    const { darkMode } = useOutletContext();
    const [announcements, setAnnouncements] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const teacherClass = 'Grade 10-A';
    const teacherName = localStorage.getItem('userName') || 'Teacher';

    const loadData = async () => {
        try {
            const res = await announcementApi.getAll();
            const allAnnouncements = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);

            const teacherAnnouncements = allAnnouncements.filter(a =>
                (a.targetAudience === 'Teachers' || a.targetAudience === 'All') &&
                (!a.classes || a.classes.length === 0 || a.classes.includes(teacherClass))
            );
            setAnnouncements(teacherAnnouncements);
        } catch (error) {
            console.error('Error loading announcements:', error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredAnnouncements = announcements.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex-1 overflow-y-auto p-8">
            <div className="flex justify-between items-center bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 mb-6 hover:shadow-lg transition-all duration-200 group">
                <div>
                    <h2 className="text-2xl font-bold text-green-900">Announcements</h2>
                    <p className="text-sm text-green-700 mt-1">Stay updated with important notifications</p>
                </div>
                <Megaphone className="w-10 h-10 text-green-600 group-hover:scale-110 transition-transform duration-200" />
            </div>

            {/* Search Bar */}
            <div className="space-y-6 mb-6">
                <div className="relative max-w-2xl">
                    <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search announcements..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-11 pr-4 py-3 text-sm rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 shadow-sm hover:shadow-md`}
                    />
                </div>
            </div>

            {/* Announcements List */}
            <div className="space-y-4">
                {filteredAnnouncements.map(announcement => (
                    <div
                        key={announcement.id}
                        className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 group`}
                    >
                        <div className="flex items-start space-x-4">
                            <div className="p-3 bg-green-50 rounded-lg text-green-600 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                                <Bell className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {announcement.title}
                                    </h3>
                                    <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                        {announcement.targetAudience}
                                    </span>
                                </div>
                                <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {announcement.description}
                                </p>
                                <div className={`flex items-center space-x-4 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    <span className="flex items-center">
                                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                        {new Date(announcement.publishDate).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center">
                                        <Users className="w-3.5 h-3.5 mr-1.5" />
                                        By {announcement.createdByName}
                                    </span>
                                    {announcement.classes && announcement.classes.length > 0 && (
                                        <span className="text-green-600 font-medium">
                                            {announcement.classes.join(', ')}
                                        </span>
                                    )}
                                </div>
                                {announcement.attachment && (
                                    <a
                                        href={announcement.attachment}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center mt-3 text-sm text-green-600 hover:text-green-800 hover:underline transition-all"
                                    >
                                        <LinkIcon className="w-4 h-4 mr-1.5" />
                                        View Attachment
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredAnnouncements.length === 0 && (
                    <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Megaphone className={`w-20 h-20 mx-auto mb-4 opacity-30 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                        <p className="text-lg font-medium">No announcements available</p>
                        <p className="text-sm mt-2 opacity-75">Check back later for updates</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnnouncementsPage;
