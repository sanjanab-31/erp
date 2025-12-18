import React, { useState, useEffect, useCallback } from 'react';
import {
    Megaphone,
    Plus,
    Search,
    Edit2,
    Trash2,
    Archive,
    X,
    Users,
    Calendar,
    Link as LinkIcon,
    Filter,
    RotateCcw
} from 'lucide-react';
import { announcementApi } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

const AnnouncementsPage = ({ darkMode }) => {
    const { showSuccess, showError } = useToast();
    const [announcements, setAnnouncements] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterAudience, setFilterAudience] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    const availableClasses = ['Grade 9-A', 'Grade 9-B', 'Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 11-B', 'Grade 12-A', 'Grade 12-B'];

    const loadAnnouncements = useCallback(async () => {
        try {
            const response = await announcementApi.getAll();
            setAnnouncements(response.data?.data || []);
        } catch (error) {
            console.error('Failed to load announcements:', error);

            setAnnouncements([]);
        }
    }, []);

    useEffect(() => {
        loadAnnouncements();
    }, [loadAnnouncements]);

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
        setModalType('delete');
        setSelectedAnnouncement({ id });
        setShowModal(true);
    };

    const handleArchive = async (id) => {
        try {
            await announcementApi.archive(id);
            showSuccess('Announcement archived successfully!');
            loadAnnouncements();
        } catch (error) {
            showError('Failed to archive: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleUnarchive = async (id) => {
        try {

            await announcementApi.update(id, { status: 'Published' });
            showSuccess('Announcement restored successfully!');
            loadAnnouncements();
        } catch (error) {
            showError('Failed to unarchive: ' + (error.response?.data?.message || error.message));
        }
    };

    const filteredAnnouncements = announcements.filter(a => {

        const title = a.title || '';
        const desc = a.description || '';

        const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            desc.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesAudience = filterAudience === 'All' || a.targetAudience === filterAudience;
        return matchesSearch && matchesAudience;
    });

    const Modal = () => {
        const [formData, setFormData] = useState(
            selectedAnnouncement || {
                title: '',
                description: '',
                targetAudience: 'All',
                classes: [],
                attachment: '',
                publishDate: new Date().toISOString().split('T')[0],
                createdBy: 'Admin',
                createdByName: localStorage.getItem('userName') || 'Admin'
            }
        );

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                if (modalType === 'delete') {
                    await announcementApi.delete(selectedAnnouncement.id);
                    showSuccess('Announcement deleted successfully!');
                } else if (modalType === 'add') {

                    const res = await announcementApi.create(formData);

                    try {
                        let announcementData = res.data || formData;
                        await announcementApi.sendNotification({

                            title: announcementData.title,
                            description: announcementData.description,
                            attachment: announcementData.attachment,
                            targetAudience: announcementData.targetAudience,
                            classes: announcementData.classes
                        });

                    } catch (notifyErr) {
                        console.warn('Notification trigger failed', notifyErr);
                    }

                    showSuccess('Announcement created successfully!');
                } else {
                    await announcementApi.update(selectedAnnouncement.id, formData);
                    showSuccess('Announcement updated successfully!');
                }
                setShowModal(false);
                loadAnnouncements();
            } catch (error) {
                showError(error.response?.data?.message || error.message);
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

        if (modalType === 'delete') {
            return (
                <div className="fixed inset-0  bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-md w-full p-6`}>
                        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Delete Announcement</h2>
                        <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Are you sure you want to delete this announcement? This action cannot be undone.</p>
                        <div className="flex space-x-3">
                            <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                            <button onClick={handleSubmit} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto`}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {modalType === 'add' ? 'Create New Announcement' : 'Edit Announcement'}
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
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                            <textarea
                                required
                                rows="4"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience *</label>
                                <select
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    value={formData.targetAudience}
                                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                >
                                    <option value="All">All</option>
                                    <option value="Teachers">Teachers</option>
                                    <option value="Students">Students</option>
                                    <option value="Parents">Parents</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    value={formData.publishDate}
                                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Class-wise Visibility (Optional - Leave empty for all classes)
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {availableClasses.map(className => (
                                    <label key={className} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.classes.includes(className)}
                                            onChange={() => toggleClass(className)}
                                            className="rounded text-purple-600 focus:ring-purple-500"
                                        />
                                        <span className="text-sm">{className}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Attachment Link (Optional)
                            </label>
                            <input
                                type="url"
                                placeholder="https://drive.google.com/..."
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
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
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:shadow-lg"
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
            { }
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Announcements Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Create and manage announcements for all portals</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Announcement</span>
                </button>
            </div>

            { }
            <div className="flex space-x-3">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search announcements..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-purple-500 outline-none`}
                    />
                </div>
                <select
                    value={filterAudience}
                    onChange={(e) => setFilterAudience(e.target.value)}
                    className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-purple-500 outline-none`}
                >
                    <option value="All">All Audiences</option>
                    <option value="Teachers">Teachers</option>
                    <option value="Students">Students</option>
                    <option value="Parents">Parents</option>
                </select>
            </div>

            { }
            <div className="space-y-4">
                {filteredAnnouncements.map(announcement => (
                    <div
                        key={announcement.id}
                        className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 hover:shadow-lg transition-shadow`}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="text-lg font-bold">{announcement.title}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${announcement.status === 'Published' ? 'bg-green-100 text-green-700' :
                                        announcement.status === 'Archived' ? 'bg-gray-100 text-gray-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {announcement.status}
                                    </span>
                                    <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
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
                                        <span className="text-purple-600">
                                            Classes: {announcement.classes.join(', ')}
                                        </span>
                                    )}
                                    {announcement.attachment && (
                                        <a
                                            href={announcement.attachment}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center text-blue-600 hover:text-blue-800"
                                        >
                                            <LinkIcon className="w-3 h-3 mr-1" />
                                            Attachment
                                        </a>
                                    )}
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(announcement)}
                                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                {announcement.status === 'Published' && (
                                    <button
                                        onClick={() => handleArchive(announcement.id)}
                                        className="p-2 hover:bg-yellow-50 text-yellow-600 rounded-lg transition-colors"
                                        title="Archive"
                                    >
                                        <Archive className="w-4 h-4" />
                                    </button>
                                )}
                                {announcement.status === 'Archived' && (
                                    <button
                                        onClick={() => handleUnarchive(announcement.id)}
                                        className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                                        title="Unarchive"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                )}
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

                {filteredAnnouncements.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <Megaphone className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No announcements found. Create your first announcement!</p>
                    </div>
                )}
            </div>

            {showModal && <Modal />}
        </div>
    );
};

export default AnnouncementsPage;
