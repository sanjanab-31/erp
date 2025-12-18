import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { User, Bell, Lock, Palette, Settings as SettingsIcon, Camera, Mail, Phone, MapPin, FileText, LogOut } from 'lucide-react';
import { studentApi, settingsApi } from '../../../services/api';

const SettingsPage = () => {
    const { darkMode } = useOutletContext();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Profile');
    const [saveMessage, setSaveMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        phone: '',
        role: 'Student',
        address: '',
        bio: '',
        class: '',
        rollNumber: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        parentName: '',
        parentPhone: '',
        parentEmail: ''
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        assignmentReminders: true,
        gradeUpdates: true,
        attendanceAlerts: false,
        transportUpdates: true,
        libraryReminders: true,
        feeReminders: true
    });

    const [securitySettings, setSecuritySettings] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [appearanceSettings, setAppearanceSettings] = useState({
        theme: darkMode ? 'dark' : 'light',
        fontSize: 'medium',
        language: 'English'
    });

    const [preferences, setPreferences] = useState({
        defaultPage: 'Dashboard',
        itemsPerPage: 20,
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12-hour'
    });

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const updateSettingsSection = async (role, section, data) => {
        try {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            if (user && user.id) {
                await settingsApi.update(user.id, section, data);
            }
        } catch (error) {
            console.error('Error updating settings section:', error);
        }
    };

    useEffect(() => {
        const loadStudentData = async () => {
            const studentEmail = localStorage.getItem('userEmail');

            if (studentEmail) {
                try {
                    const studentRes = await studentApi.getAll();
                    const student = (studentRes.data || []).find(s => s.email === studentEmail);

                    console.log('Loading settings for student:', student);

                    if (student) {
                        setProfileData({
                            fullName: student.name || '',
                            email: student.email || '',
                            phone: student.phone || '',
                            role: 'Student',
                            address: student.address || '',
                            bio: student.bio || '',
                            class: student.class || '',
                            rollNumber: student.rollNumber || '',
                            dateOfBirth: student.dateOfBirth || '',
                            gender: student.gender || '',
                            bloodGroup: student.bloodGroup || '',
                            parentName: student.parentName || '',
                            parentPhone: student.parentPhone || '',
                            parentEmail: student.parentEmail || ''
                        });
                    }
                } catch (error) {
                    console.error('Error fetching student data:', error);
                }
            }

            try {
                const user = JSON.parse(localStorage.getItem('currentUser'));
                if (user && user.id) {
                    const settings = await settingsApi.get(user.id);
                    if (settings.data) {
                        if (settings.data.notifications) setNotificationSettings(settings.data.notifications);
                        if (settings.data.appearance) setAppearanceSettings(settings.data.appearance);
                        if (settings.data.preferences) setPreferences(settings.data.preferences);
                    }
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            }

            setLoading(false);
        };

        loadStudentData();
    }, []);

    const handleProfileUpdate = async (field, value) => {
        const updatedProfile = {
            ...profileData,
            [field]: value
        };
        setProfileData(updatedProfile);

        try {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            if (user && user.id) {
                await settingsApi.update(user.id, 'profile', updatedProfile);
            }
        } catch (error) {
            console.error('Error updating profile field:', error);
        }
    };

    const handleNotificationToggle = async (setting) => {
        const updatedNotifications = {
            ...notificationSettings,
            [setting]: !notificationSettings[setting]
        };
        setNotificationSettings(updatedNotifications);

        try {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            if (user && user.id) {
                await settingsApi.update(user.id, 'notifications', updatedNotifications);
            }
        } catch (error) {
            console.error('Error updating notification setting:', error);
        }
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            if (user && user.id) {
                await Promise.all([
                    settingsApi.update(user.id, 'profile', profileData),
                    settingsApi.update(user.id, 'notifications', notificationSettings),
                    settingsApi.update(user.id, 'appearance', appearanceSettings),
                    settingsApi.update(user.id, 'preferences', preferences)
                ]);
            }
            setSaveMessage('All changes saved successfully!');
        } catch (error) {
            setSaveMessage('Error saving changes');
        } finally {
            setLoading(false);
            setTimeout(() => setSaveMessage(''), 3000);
        }
    };

    const handleCancel = () => {

        const settings = getSettings('student');
        if (settings.profile) setProfileData(settings.profile);
        if (settings.notifications) setNotificationSettings(settings.notifications);
        if (settings.appearance) setAppearanceSettings(settings.appearance);
        if (settings.preferences) setPreferences(settings.preferences);

        setSaveMessage('Changes cancelled');
        setTimeout(() => setSaveMessage(''), 3000);
    };

    const renderProfileTab = () => (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Profile Information</h3>
            <p className="text-sm text-gray-500 mb-6">Update your personal information and profile details</p>

            { }
            <div className="mb-8">
                <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                        MW
                    </div>
                    <div>
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                            <Camera className="w-4 h-4" />
                            <span>Change Photo</span>
                        </button>
                        <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB</p>
                    </div>
                </div>
            </div>

            { }
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                { }
                <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => handleProfileUpdate('fullName', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                </div>

                { }
                <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Email
                    </label>
                    <div className="relative">
                        <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => handleProfileUpdate('email', e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                    </div>
                </div>

                { }
                <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Phone Number
                    </label>
                    <div className="relative">
                        <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                    </div>
                </div>

                { }
                <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Role
                    </label>
                    <input
                        type="text"
                        value={profileData.role}
                        disabled
                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-gray-400'
                            : 'bg-gray-100 border-gray-300 text-gray-500'
                            } cursor-not-allowed`}
                    />
                </div>

                { }
                <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Class
                    </label>
                    <input
                        type="text"
                        value={profileData.class}
                        disabled
                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-gray-400'
                            : 'bg-gray-100 border-gray-300 text-gray-500'
                            } cursor-not-allowed`}
                    />
                </div>

                { }
                <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Roll Number
                    </label>
                    <input
                        type="text"
                        value={profileData.rollNumber}
                        disabled
                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-gray-400'
                            : 'bg-gray-100 border-gray-300 text-gray-500'
                            } cursor-not-allowed`}
                    />
                </div>

                { }
                <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Date of Birth
                    </label>
                    <input
                        type="text"
                        value={profileData.dateOfBirth}
                        disabled
                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-gray-400'
                            : 'bg-gray-100 border-gray-300 text-gray-500'
                            } cursor-not-allowed`}
                    />
                </div>

                { }
                <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Gender
                    </label>
                    <input
                        type="text"
                        value={profileData.gender}
                        disabled
                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-gray-400'
                            : 'bg-gray-100 border-gray-300 text-gray-500'
                            } cursor-not-allowed`}
                    />
                </div>

                { }
                <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Blood Group
                    </label>
                    <input
                        type="text"
                        value={profileData.bloodGroup}
                        disabled
                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-gray-400'
                            : 'bg-gray-100 border-gray-300 text-gray-500'
                            } cursor-not-allowed`}
                    />
                </div>
            </div>

            { }
            <div className="mt-8 mb-6">
                <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Parent/Guardian Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    { }
                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Parent/Guardian Name
                        </label>
                        <input
                            type="text"
                            value={profileData.parentName}
                            disabled
                            className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-gray-400'
                                : 'bg-gray-100 border-gray-300 text-gray-500'
                                } cursor-not-allowed`}
                        />
                    </div>

                    { }
                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Parent/Guardian Phone
                        </label>
                        <input
                            type="text"
                            value={profileData.parentPhone}
                            disabled
                            className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-gray-400'
                                : 'bg-gray-100 border-gray-300 text-gray-500'
                                } cursor-not-allowed`}
                        />
                    </div>

                    { }
                    <div className="md:col-span-2">
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Parent/Guardian Email
                        </label>
                        <input
                            type="email"
                            value={profileData.parentEmail}
                            disabled
                            className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-gray-400'
                                : 'bg-gray-100 border-gray-300 text-gray-500'
                                } cursor-not-allowed`}
                        />
                    </div>
                </div>
            </div>

            { }
            <div className="mb-6">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Address
                </label>
                <input
                    type="text"
                    placeholder="Enter your address"
                    value={profileData.address}
                    onChange={(e) => handleProfileUpdate('address', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
            </div>

            { }
            <div className="mb-6">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Bio
                </label>
                <textarea
                    placeholder="Tell us about yourself..."
                    value={profileData.bio}
                    onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border ${darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                />
            </div>

            { }
            <div className="flex items-center justify-end space-x-4">
                {saveMessage && (
                    <span className={`text-sm font-medium ${saveMessage.includes('success') || saveMessage.includes('updated') ? 'text-green-600' : 'text-red-600'}`}>
                        {saveMessage}
                    </span>
                )}
                <button
                    onClick={handleCancel}
                    className={`px-6 py-3 rounded-lg border ${darkMode
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        } font-medium transition-colors`}
                >
                    Cancel
                </button>
                <button
                    onClick={handleSaveChanges}
                    className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-colors flex items-center space-x-2"
                >
                    <span>Save Changes</span>
                </button>
            </div>
        </div>
    );

    const renderNotificationsTab = () => (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Notification Preferences</h3>
            <p className="text-sm text-gray-500 mb-6">Manage how you receive notifications</p>

            <div className="space-y-6">
                { }
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Email Notifications</h4>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={notificationSettings.emailNotifications}
                            onChange={() => handleNotificationToggle('emailNotifications')}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                { }
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Push Notifications</h4>
                        <p className="text-sm text-gray-500">Receive push notifications on your device</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={notificationSettings.pushNotifications}
                            onChange={() => handleNotificationToggle('pushNotifications')}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <hr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />

                { }
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Assignment Reminders</h4>
                        <p className="text-sm text-gray-500">Get notified about upcoming assignments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={notificationSettings.assignmentReminders}
                            onChange={() => handleNotificationToggle('assignmentReminders')}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                { }
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Grade Updates</h4>
                        <p className="text-sm text-gray-500">Get notified when grades are posted</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={notificationSettings.gradeUpdates}
                            onChange={() => handleNotificationToggle('gradeUpdates')}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                { }
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Attendance Alerts</h4>
                        <p className="text-sm text-gray-500">Get notified about attendance issues</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={notificationSettings.attendanceAlerts}
                            onChange={() => handleNotificationToggle('attendanceAlerts')}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                { }
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Transport Updates</h4>
                        <p className="text-sm text-gray-500">Get notified about bus schedule changes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={notificationSettings.transportUpdates}
                            onChange={() => handleNotificationToggle('transportUpdates')}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                { }
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Library Reminders</h4>
                        <p className="text-sm text-gray-500">Get notified about book due dates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={notificationSettings.libraryReminders}
                            onChange={() => handleNotificationToggle('libraryReminders')}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                { }
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Fee Reminders</h4>
                        <p className="text-sm text-gray-500">Get notified about fee payments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={notificationSettings.feeReminders}
                            onChange={() => handleNotificationToggle('feeReminders')}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderSecurityTab = () => (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Security Settings</h3>
            <p className="text-sm text-gray-500 mb-6">Update your password and security preferences</p>

            <div className="space-y-6 max-w-2xl">
                { }
                <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Current Password
                    </label>
                    <input
                        type="password"
                        placeholder="Enter current password"
                        value={securitySettings.currentPassword}
                        onChange={(e) => setSecuritySettings(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                </div>

                { }
                <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        New Password
                    </label>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={securitySettings.newPassword}
                        onChange={(e) => setSecuritySettings(prev => ({ ...prev, newPassword: e.target.value }))}
                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                </div>

                { }
                <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={securitySettings.confirmPassword}
                        onChange={(e) => setSecuritySettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                </div>

                <button
                    onClick={async () => {
                        if (!securitySettings.currentPassword || !securitySettings.newPassword || !securitySettings.confirmPassword) {
                            setSaveMessage('Please fill all password fields');
                            setTimeout(() => setSaveMessage(''), 3000);
                            return;
                        }
                        if (securitySettings.newPassword !== securitySettings.confirmPassword) {
                            setSaveMessage('New passwords do not match');
                            setTimeout(() => setSaveMessage(''), 3000);
                            return;
                        }
                        try {
                            await settingsApi.forgotPassword({
                                role: 'student',
                                currentPassword: securitySettings.currentPassword,
                                newPassword: securitySettings.newPassword
                            });
                            setSecuritySettings({ currentPassword: '', newPassword: '', confirmPassword: '' });
                            setSaveMessage('Password updated successfully!');
                        } catch (err) {
                            setSaveMessage(err.response?.data?.message || 'Error updating password');
                        }
                        setTimeout(() => setSaveMessage(''), 3000);
                    }}

                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                    Update Password
                </button>
            </div>
        </div>
    );

    const renderAppearanceTab = () => (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Appearance Settings</h3>
            <p className="text-sm text-gray-500 mb-6">Customize how the portal looks</p>

            <div className="space-y-6 max-w-2xl">
                { }
                <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Theme
                    </label>
                    <select
                        value={appearanceSettings.theme}
                        onChange={(e) => {
                            const updated = { ...appearanceSettings, theme: e.target.value };
                            setAppearanceSettings(updated);
                            updateSettingsSection('student', 'appearance', updated);
                        }}
                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                    </select>
                </div>

                { }
                <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Font Size
                    </label>
                    <select
                        value={appearanceSettings.fontSize}
                        onChange={(e) => {
                            const updated = { ...appearanceSettings, fontSize: e.target.value };
                            setAppearanceSettings(updated);
                            updateSettingsSection('student', 'appearance', updated);
                        }}
                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>
                </div>

                { }
                <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Language
                    </label>
                    <select
                        value={appearanceSettings.language}
                        onChange={(e) => {
                            const updated = { ...appearanceSettings, language: e.target.value };
                            setAppearanceSettings(updated);
                            updateSettingsSection('student', 'appearance', updated);
                        }}
                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderPreferencesTab = () => (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Preferences</h3>
            <p className="text-sm text-gray-500 mb-6">Manage your portal preferences</p>

            <div className="space-y-6 max-w-2xl">
                { }
                <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Default Page
                    </label>
                    <select
                        value={preferences.defaultPage}
                        onChange={(e) => {
                            const updated = { ...preferences, defaultPage: e.target.value };
                            setPreferences(updated);
                            updateSettingsSection('student', 'preferences', updated);
                        }}
                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        <option value="Dashboard">Dashboard</option>
                        <option value="Courses">Courses</option>
                        <option value="Timetable">Timetable</option>
                    </select>
                </div>

                { }
                <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Items Per Page
                    </label>
                    <select
                        value={preferences.itemsPerPage}
                        onChange={(e) => {
                            const updated = { ...preferences, itemsPerPage: parseInt(e.target.value) };
                            setPreferences(updated);
                            updateSettingsSection('student', 'preferences', updated);
                        }}
                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>

                { }
                <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Date Format
                    </label>
                    <select
                        value={preferences.dateFormat}
                        onChange={(e) => {
                            const updated = { ...preferences, dateFormat: e.target.value };
                            setPreferences(updated);
                            updateSettingsSection('student', 'preferences', updated);
                        }}
                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                </div>

                { }
                <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Time Format
                    </label>
                    <select
                        value={preferences.timeFormat}
                        onChange={(e) => {
                            const updated = { ...preferences, timeFormat: e.target.value };
                            setPreferences(updated);
                            updateSettingsSection('student', 'preferences', updated);
                        }}
                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        <option value="12-hour">12-hour</option>
                        <option value="24-hour">24-hour</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const tabs = [
        { id: 'Profile', label: 'Profile', icon: User },
        { id: 'Notifications', label: 'Notifications', icon: Bell },
        { id: 'Security', label: 'Security', icon: Lock },
        { id: 'Appearance', label: 'Appearance', icon: Palette },
        { id: 'Preferences', label: 'Preferences', icon: SettingsIcon }
    ];

    return (
        <div className="flex-1 overflow-y-auto p-8">
            { }
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Settings
                </h1>
                <p className="text-sm text-gray-500">Manage your account settings and preferences</p>
            </div>

            { }
            <div className="mb-6">
                <div className="flex items-center justify-between border-b border-gray-200">
                    <div className="flex space-x-1 overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                    { }
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-6 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap ml-4"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            { }
            {activeTab === 'Profile' && renderProfileTab()}
            {activeTab === 'Notifications' && renderNotificationsTab()}
            {activeTab === 'Security' && renderSecurityTab()}
            {activeTab === 'Appearance' && renderAppearanceTab()}
            {activeTab === 'Preferences' && renderPreferencesTab()}
        </div>
    );
};

export default SettingsPage;
