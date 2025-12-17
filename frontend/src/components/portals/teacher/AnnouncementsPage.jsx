import React, { useState, useEffect } from 'react';
import {
    Megaphone,
    Search,
    Calendar,
    Users,
    Link as LinkIcon,
    Bell,
    Plus,
    Edit2,
    Trash2,
    X
} from 'lucide-react';
import * as announcementStore from '../../../utils/announcementStore';

const AnnouncementsPage = ({ darkMode }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [myAnnouncements, setMyAnnouncements] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // 'all' or 'my'
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    // In a real app, this would come from the teacher's profile
    const teacherClass = 'Grade 10-A'; // Example: teacher's assigned class
    const teacherName = localStorage.getItem('userName') || 'Teacher';
    const teacherEmail = localStorage.getItem('userEmail') || 'teacher@eshwar.com';

    const availableClasses = ['Grade 9-A', 'Grade 9-B', 'Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 11-B', 'Grade 12-A', 'Grade 12-B'];

    useEffect(() => {
        const loadData = () => {
            // Get all announcements for Teachers
            const teacherAnnouncements = announcementStore.getAnnouncementsForAudience('Teachers', teacherClass);
            const allAnnouncements = announcementStore.getAnnouncementsForAudience('All', teacherClass);

            // Combine and remove duplicates
            const combined = [...teacherAnnouncements, ...allAnnouncements];
            const unique = combined.filter((item, index, self) =>
                index === self.findIndex((t) => t.id === item.id)
            );

            setAnnouncements(unique);

            // Get announcements created by this teacher
            const allAnnouncementsData = announcementStore.getAllAnnouncements();
            const teacherCreated = allAnnouncementsData.filter(a =>
                a.createdBy === 'Teacher' && a.createdByName === teacherName
            );
            setMyAnnouncements(teacherCreated);
        };

        loadData();
        const unsubscribe = announcementStore.subscribeToUpdates(loadData);
        return () => unsubscribe();
    }, [teacherName]);

    const handleAdd = () => {
        setModalType('add');
        setSelectedAnnouncement(null);
        setShowModal(true);
    };

    const handleEdit = (announcement) => {
        setModalType('edit');
        setSelectedAnnouncement(announcement);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            announcementStore.deleteAnnouncement(id);
        }
    };

    const filteredAnnouncements = announcements.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredMyAnnouncements = myAnnouncements.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const Modal = () => {
        const [formData, setFormData] = useState(
            selectedAnnouncement || {
                title: '',
                description: '',
                targetAudience: 'Students', // Teachers can only create for Students
                classes: [teacherClass], // Default to teacher's class
                attachment: '',
                publishDate: new Date().toISOString().split('T')[0],
                createdBy: 'Teacher',
                createdByName: teacherName
            }
        );

        const handleSubmit = (e) => {
            e.preventDefault();
            try {
                if (modalType === 'add') {
                    announcementStore.addAnnouncement(formData);
                } else {
                    announcementStore.updateAnnouncement(selectedAnnouncement.id, formData);
                }
                setShowModal(false);
            } catch (error) {
                alert(error.message);
            }
        };

        const toggleClass = (className) => {
            setFormData(prev => ({
                ...prev,
                classes: prev.classes.includes(className)
                    ? prev.classes.filter(c => c !== className)
                    : [...prev.classes, className]
            }));
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto`}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {modalType === 'add' ? 'Create Announcement for Students' : 'Edit Announcement'}
                        </h2>
                        <button onClick={() => setShowModal(false)}>
                            <X className="text-gray-500 hover:text-gray-700" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                            <textarea
                                required
                                rows="4"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                value={formData.publishDate}
                                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Classes * (Students and their parents will see this)
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {availableClasses.map(className => (
                                    <label key={className} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.classes.includes(className)}
                                            onChange={() => toggleClass(className)}
                                            className="rounded text-green-600 focus:ring-green-500"
                                        />
                                        <span className="text-sm">{className}</span>
                                    </label>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Note: Parents of selected classes will also see this announcement
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Attachment Link (Optional)
                            </label>
                            <input
                                type="url"
                                placeholder="https://drive.google.com/..."
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                value={formData.attachment}
                                onChange={(e) => setFormData({ ...formData, attachment: e.target.value })}
                            />
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2 border text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg"
                            >
                                {modalType === 'add' ? 'Publish' : 'Update'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className={`space-y-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {/* Header */}
            <div className="flex justify-between items-center bg-green-50 p-4 rounded-xl border border-green-100">
                <div>
                    <h2 className="text-xl font-bold text-green-900">Announcements</h2>
                    <p className="text-sm text-green-700">View and create announcements for your students</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Megaphone className="w-8 h-8 text-green-600" />
                    <button
                        onClick={handleAdd}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Announcement</span>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-white shadow-sm text-green-600' : 'text-gray-600'}`}
                >
                    All Announcements ({announcements.length})
                </button>
                <button
                    onClick={() => setActiveTab('my')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'my' ? 'bg-white shadow-sm text-green-600' : 'text-gray-600'}`}
                >
                    My Announcements ({myAnnouncements.length})
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Search announcements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} focus:ring-2 focus:ring-green-500 outline-none`}
                />
            </div>

            {/* Announcements List */}
            <div className="space-y-4">
                {activeTab === 'all' && filteredAnnouncements.map(announcement => (
                    <div
                        key={announcement.id}
                        className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 hover:shadow-lg transition-shadow`}
                    >
                        <div className="flex items-start space-x-4">
                            <div className="p-3 bg-green-50 rounded-lg text-green-600 flex-shrink-0">
                                <Bell className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="text-lg font-bold">{announcement.title}</h3>
                                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
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

                {activeTab === 'my' && filteredMyAnnouncements.map(announcement => (
                    <div
                        key={announcement.id}
                        className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 hover:shadow-lg transition-shadow`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-4 flex-1">
                                <div className="p-3 bg-green-50 rounded-lg text-green-600 flex-shrink-0">
                                    <Bell className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-lg font-bold">{announcement.title}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${announcement.status === 'Published' ? 'bg-green-100 text-green-700' :
                                                announcement.status === 'Archived' ? 'bg-gray-100 text-gray-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {announcement.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">{announcement.description}</p>
                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                        <span className="flex items-center">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {new Date(announcement.publishDate).toLocaleDateString()}
                                        </span>
                                        {announcement.classes && announcement.classes.length > 0 && (
                                            <span className="text-green-600 font-medium">
                                                Classes: {announcement.classes.join(', ')}
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
                            <div className="flex space-x-2 ml-4">
                                <button
                                    onClick={() => handleEdit(announcement)}
                                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(announcement.id)}
                                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {activeTab === 'all' && filteredAnnouncements.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <Megaphone className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No announcements available at the moment.</p>
                    </div>
                )}

                {activeTab === 'my' && filteredMyAnnouncements.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <Megaphone className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>You haven't created any announcements yet.</p>
                        <button
                            onClick={handleAdd}
                            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Create Your First Announcement
                        </button>
                    </div>
                )}
            </div>

            {showModal && <Modal />}
        </div>
    );
};

export default AnnouncementsPage;
