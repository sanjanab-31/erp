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
import { announcementApi, studentApi, parentApi } from '../../../services/api';

const AnnouncementsPage = () => {
    const { darkMode } = useOutletContext();
    const [announcements, setAnnouncements] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    const parentEmail = localStorage.getItem('userEmail');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Fetch announcements, parents, and students in parallel
                const [annRes, parentsRes, studentsRes] = await Promise.all([
                    announcementApi.getAll(),
                    parentApi.getAll(),
                    studentApi.getAll()
                ]);

                const allAnnouncements = Array.isArray(annRes?.data?.data) ? annRes.data.data : [];

                const allParents = Array.isArray(parentsRes?.data?.data) ? parentsRes.data.data : [];
                const allStudents = Array.isArray(studentsRes?.data?.data) ? studentsRes.data.data : [];

                // Find current parent and their child's class
                let childClass = '';
                const currentParent = allParents.find(p => p.email?.toLowerCase() === parentEmail?.toLowerCase());

                if (currentParent) {
                    const child = allStudents.find(s =>
                        (s.id?.toString() === currentParent.studentId?.toString()) ||
                        (s.parentEmail?.toLowerCase() === currentParent.email?.toLowerCase())
                    );
                    if (child) {
                        childClass = child.class;
                    } else {
                        console.error('Child not found for parent:', parentEmail);
                    }
                } else {
                    console.error('Parent record not found for email:', parentEmail);
                }

                // Filter announcements for parents - show all that are for Parents or All
                const filtered = allAnnouncements.filter(a => {

                    // Show if targeted to Parents or All
                    const isTargetedToParents = a.targetAudience === 'Parents' || a.targetAudience === 'All';

                    // If no specific classes mentioned OR classes array is empty, show to all parents
                    // If classes are specified, only show if child's class matches
                    const isRelevantClass = !a.classes ||
                        a.classes.length === 0 ||
                        (childClass && a.classes.includes(childClass));

                    const shouldShow = isTargetedToParents && isRelevantClass;

                    return shouldShow;
                });

                // Sort by date (newest first)
                const sorted = filtered.sort((a, b) =>
                    new Date(b.publishDate || b.timestamp) - new Date(a.publishDate || a.timestamp)
                );

                setAnnouncements(sorted);
            } catch (error) {
                console.error('Error loading announcements:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [parentEmail]);

    const filteredAnnouncements = announcements.filter(a => {
        if (!searchQuery.trim()) return true;

        const query = searchQuery.toLowerCase();
        const title = (a.title || '').toLowerCase();
        const description = (a.description || '').toLowerCase();
        const category = (a.category || '').toLowerCase();

        return title.includes(query) ||
            description.includes(query) ||
            category.includes(query);
    });

    return (
        <div className={`space-y-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {/* Header */}
            <div className={`flex justify-between items-center ${darkMode ? 'bg-orange-900/20' : 'bg-orange-50'} p-6 rounded-xl`}>
                <div>
                    <h2 className={`text-xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-900'}`}>Announcements</h2>
                    <p className={`text-sm ${darkMode ? 'text-orange-300' : 'text-orange-700'} mt-1`}>Important updates about your child's education</p>
                </div>
                <Megaphone className={`w-8 h-8 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
            </div>

            {/* Search */}
            <div className="relative">
                <Search className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'} absolute left-4 top-1/2 transform -translate-y-1/2`} />
                <input
                    type="text"
                    placeholder="Search announcements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${darkMode
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-200 placeholder-gray-400'
                        } focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500`}
                />
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading announcements...</p>
                </div>
            ) : (
                <>
                    {/* Announcements List */}
                    <div className="space-y-4">
                        {filteredAnnouncements.length > 0 ? (
                            filteredAnnouncements.map(announcement => (
                                <div
                                    key={announcement.id}
                                    className={`${darkMode
                                        ? 'bg-gray-800 border-gray-700'
                                        : 'bg-white border-gray-200'
                                        } border rounded-xl p-6 shadow-sm`}
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className={`p-2.5 ${darkMode ? 'bg-orange-900/30' : 'bg-orange-50'
                                            } rounded-lg flex-shrink-0`}>
                                            <Bell className={`w-5 h-5 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {announcement.title}
                                                </h3>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${announcement.priority === 'high'
                                                    ? 'bg-red-100 text-red-700'
                                                    : announcement.priority === 'medium'
                                                        ? 'bg-orange-100 text-orange-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {announcement.targetAudience || 'All'}
                                                </span>
                                            </div>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                                                {announcement.description}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-3 text-xs">
                                                <span className={`flex items-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                    <Calendar className="w-3.5 h-3.5 mr-1" />
                                                    {new Date(announcement.publishDate || announcement.timestamp).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                                <span className={`flex items-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                    <Users className="w-3.5 h-3.5 mr-1" />
                                                    By {announcement.authorName || announcement.createdByName || 'Admin'}
                                                </span>
                                                {announcement.category && (
                                                    <span className={`px-2 py-0.5 rounded-md ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                                                        } font-medium`}>
                                                        {announcement.category}
                                                    </span>
                                                )}
                                                {announcement.classes && announcement.classes.length > 0 && (
                                                    <span className={`px-2 py-0.5 rounded-md ${darkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-700'
                                                        } font-medium`}>
                                                        {announcement.classes.join(', ')}
                                                    </span>
                                                )}
                                            </div>
                                            {announcement.attachment && (
                                                <a
                                                    href={announcement.attachment}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`inline-flex items-center mt-4 px-4 py-2 rounded-lg text-sm font-medium ${darkMode
                                                        ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                                                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                                        } transition-colors`}
                                                >
                                                    <LinkIcon className="w-4 h-4 mr-2" />
                                                    View Attachment
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={`text-center py-16 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                                } border rounded-xl`}>
                                <div className={`p-4 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'
                                    } w-20 h-20 mx-auto mb-4 flex items-center justify-center`}>
                                    <Megaphone className={`w-10 h-10 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                                </div>
                                <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                                    No announcements available
                                </p>
                                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Check back later for important updates
                                </p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default AnnouncementsPage;
