import React, { useState, useEffect } from 'react';
import {
    Megaphone,
    Search,
    Calendar,
    Users,
    Link as LinkIcon,
    Bell
} from 'lucide-react';
import { announcementApi } from '../../../services/api';

const AnnouncementsPage = ({ darkMode }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const studentClass = 'Grade 10-A';

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const res = await announcementApi.getAll();
                const all = res.data || [];

                const filtered = all.filter(a => {
                    const audienceMatch = a.targetAudience === 'Students' || a.targetAudience === 'All';
                    const classMatch = !a.classes || a.classes.length === 0 || a.classes.includes(studentClass);
                    return audienceMatch && classMatch;
                });

                setAnnouncements(filtered);
            } catch (error) {
                console.error('Failed to load announcements:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const filteredAnnouncements = announcements.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`space-y-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            { }
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div>
                    <h2 className="text-xl font-bold text-blue-900">Announcements</h2>
                    <p className="text-sm text-blue-700">Stay informed with important updates</p>
                </div>
                <Megaphone className="w-8 h-8 text-blue-600" />
            </div>

            { }
            <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Search announcements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none`}
                />
            </div>

            { }
            <div className="space-y-4">
                {filteredAnnouncements.map(announcement => (
                    <div
                        key={announcement.id}
                        className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 hover:shadow-lg transition-shadow`}
                    >
                        <div className="flex items-start space-x-4">
                            <div className="p-3 bg-blue-50 rounded-lg text-blue-600 flex-shrink-0">
                                <Bell className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="text-lg font-bold">{announcement.title}</h3>
                                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
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
                                        <span className="text-blue-600 font-medium">
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
