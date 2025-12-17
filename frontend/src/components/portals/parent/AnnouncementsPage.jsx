import React, { useState, useEffect } from 'react';
import {
    Megaphone,
    Search,
    Calendar,
    Users,
    Link as LinkIcon,
    Bell
} from 'lucide-react';
import * as announcementStore from '../../../utils/announcementStore';

const AnnouncementsPage = ({ darkMode }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // In a real app, this would come from the parent's child profile
    const childClass = 'Grade 10-A'; // Example: child's class

    useEffect(() => {
        const loadData = () => {
            // Get announcements for Parents and their child's class
            const parentAnnouncements = announcementStore.getAnnouncementsForAudience('Parents', childClass);
            const allAnnouncements = announcementStore.getAnnouncementsForAudience('All', childClass);

            // Combine and remove duplicates
            const combined = [...parentAnnouncements, ...allAnnouncements];
            const unique = combined.filter((item, index, self) =>
                index === self.findIndex((t) => t.id === item.id)
            );

            setAnnouncements(unique);
        };

        loadData();
        const unsubscribe = announcementStore.subscribeToUpdates(loadData);
        return () => unsubscribe();
    }, []);

    const filteredAnnouncements = announcements.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`space-y-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {/* Header */}
            <div className="flex justify-between items-center bg-orange-50 p-4 rounded-xl border border-orange-100">
                <div>
                    <h2 className="text-xl font-bold text-orange-900">Announcements</h2>
                    <p className="text-sm text-orange-700">Important updates about your child's education</p>
                </div>
                <Megaphone className="w-8 h-8 text-orange-600" />
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Search announcements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} focus:ring-2 focus:ring-orange-500 outline-none`}
                />
            </div>

            {/* Announcements List */}
            <div className="space-y-4">
                {filteredAnnouncements.map(announcement => (
                    <div
                        key={announcement.id}
                        className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 hover:shadow-lg transition-shadow`}
                    >
                        <div className="flex items-start space-x-4">
                            <div className="p-3 bg-orange-50 rounded-lg text-orange-600 flex-shrink-0">
                                <Bell className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="text-lg font-bold">{announcement.title}</h3>
                                    <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700">
                                        {announcement.targetAudience}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{announcement.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    <span className="flex items-center">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {new Date(announcement.publishDate).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center">
                                        <Users className="w-3 h-3 mr-1" />
                                        By {announcement.createdByName}
                                    </span>
                                    {announcement.classes && announcement.classes.length > 0 && (
                                        <span className="text-orange-600 font-medium">
                                            {announcement.classes.join(', ')}
                                        </span>
                                    )}
                                </div>
                                {announcement.attachment && (
                                    <a
                                        href={announcement.attachment}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center mt-3 text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        <LinkIcon className="w-4 h-4 mr-1" />
                                        View Attachment
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredAnnouncements.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <Megaphone className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No announcements available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnnouncementsPage;
