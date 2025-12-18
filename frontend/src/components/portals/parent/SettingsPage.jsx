import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Settings as SettingsIcon,
    User,
    Bell,
    Lock,
    Save,
    Eye,
    EyeOff,
    Mail,
    Phone,
    LogOut
} from 'lucide-react';
import { studentApi, settingsApi } from '../../../services/api';

const SettingsPage = ({ darkMode }) => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('profile');
    const [showPassword, setShowPassword] = useState(false);
    const [saved, setSaved] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [children, setChildren] = useState([]);

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        relationship: ''
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        gradeUpdates: true,
        attendanceAlerts: true,
        feeReminders: true,
        eventNotifications: true
    });

    const [securitySettings, setSecuritySettings] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    useEffect(() => {
        const loadInitData = async () => {
            const parentEmail = localStorage.getItem('userEmail');
            if (parentEmail) {
                try {
                    const res = await studentApi.getAll();
                    const students = res.data || [];
                    const parentChildren = students.filter(s => s.parentEmail === parentEmail || s.guardianEmail === parentEmail || s.email === parentEmail);
                    setChildren(parentChildren);

                    if (parentChildren.length > 0) {
                        const child = parentChildren[0];
                        setProfileData({
                            name: child.parentName || localStorage.getItem('userName') || '',
                            email: child.parentEmail || parentEmail,
                            phone: child.parentPhone || '',
                            address: child.address || '',
                            relationship: 'Parent/Guardian'
                        });
                    } else {
                        setProfileData({
                            name: localStorage.getItem('userName') || '',
                            email: parentEmail,
                            phone: '',
                            address: '',
                            relationship: 'Parent/Guardian'
                        });
                    }

                    const settingsRes = await settingsApi.get('parent');
                    if (settingsRes.data && settingsRes.data.notifications) {
                        setNotificationSettings(settingsRes.data.notifications);
                    }
                } catch (error) {
                    console.error('Error loading settings data:', error);
                }
            }
            setLoading(false);
        };

        loadInitData();
    }, []);

    const handleSave = async () => {
        try {
            await Promise.all([
                settingsApi.update('parent', 'profile', profileData),
                settingsApi.update('parent', 'notifications', notificationSettings)
            ]);

            setSaved(true);
            setSaveMessage('Settings saved successfully!');
            setTimeout(() => {
                setSaved(false);
                setSaveMessage('');
            }, 3000);
        } catch (error) {
            setSaveMessage('Error saving settings: ' + error.message);
            setTimeout(() => setSaveMessage(''), 3000);
        }
    };

    const sections = [
        { id: 'profile', name: 'Profile', icon: User },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'security', name: 'Security', icon: Lock }
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'profile':
                return (
                    <div className="space-y-6">
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                            Personal Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => {
                                        const updated = { ...profileData, name: e.target.value };
                                        setProfileData(updated);
                                        updateSettingsSection('parent', 'profile', updated);
                                    }}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => {
                                        const updated = { ...profileData, email: e.target.value };
                                        setProfileData(updated);
                                        updateSettingsSection('parent', 'profile', updated);
                                    }}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => {
                                        const updated = { ...profileData, phone: e.target.value };
                                        setProfileData(updated);
                                        updateSettingsSection('parent', 'profile', updated);
                                    }}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Relationship
                                </label>
                                <select
                                    value={profileData.relationship}
                                    onChange={(e) => {
                                        const updated = { ...profileData, relationship: e.target.value };
                                        setProfileData(updated);
                                        updateSettingsSection('parent', 'profile', updated);
                                    }}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                >
                                    <option>Father</option>
                                    <option>Mother</option>
                                    <option>Guardian</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Address
                                </label>
                                <textarea
                                    value={profileData.address}
                                    onChange={(e) => {
                                        const updated = { ...profileData, address: e.target.value };
                                        setProfileData(updated);
                                        updateSettingsSection('parent', 'profile', updated);
                                    }}
                                    rows="3"
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                />
                            </div>
                        </div>

                        { }
                        {children && children.length > 0 && (
                            <div className="mt-8">
                                <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                                    Your Children
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {children.map((child, index) => (
                                        <div
                                            key={index}
                                            className={`p-4 rounded-lg border ${darkMode
                                                ? 'bg-gray-700 border-gray-600'
                                                : 'bg-gray-50 border-gray-200'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3 mb-2">
                                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                                    {child.name?.charAt(0) || 'S'}
                                                </div>
                                                <div>
                                                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        {child.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {child.class || 'Student'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-500 space-y-1">
                                                <p>Roll No: {child.rollNumber || 'N/A'}</p>
                                                <p>Email: {child.email || 'N/A'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'notifications':
                return (
                    <div className="space-y-6">
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                            Notification Preferences
                        </h3>

                        <div className="space-y-4">
                            {Object.entries(notificationSettings).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between py-4 border-b border-gray-200">
                                    <div>
                                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            Receive notifications for {key.toLowerCase()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const updated = { ...notificationSettings, [key]: !value };
                                            setNotificationSettings(updated);
                                            updateSettingsSection('parent', 'notifications', updated);
                                        }}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-orange-600' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-6">
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                            Change Password
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Current Password
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={securitySettings.currentPassword}
                                    onChange={(e) => setSecuritySettings({ ...securitySettings, currentPassword: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={securitySettings.newPassword}
                                    onChange={(e) => setSecuritySettings({ ...securitySettings, newPassword: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={securitySettings.confirmPassword}
                                    onChange={(e) => setSecuritySettings({ ...securitySettings, confirmPassword: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-orange-500`}
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
                                            role: 'parent',
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
                                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                            >
                                Update Password
                            </button>

                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            { }
            <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Settings
                </h1>
                <p className="text-sm text-gray-500">Manage your account settings and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                { }
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} h-fit`}>
                    <nav className="space-y-2">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeSection === section.id
                                    ? 'bg-orange-50 text-orange-600'
                                    : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                                    }`}
                            >
                                <section.icon className="w-5 h-5" />
                                <span className="font-medium">{section.name}</span>
                            </button>
                        ))}

                        { }
                        <div className="pt-4 mt-4 border-t border-gray-200">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all bg-red-50 text-red-600 hover:bg-red-100"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </nav>
                </div>

                { }
                <div className="lg:col-span-3">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        {renderContent()}

                        { }
                        <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                            {(saved || saveMessage) && (
                                <span className={`text-sm font-medium ${saveMessage.includes('success') || saveMessage.includes('updated') || saved ? 'text-green-600' : 'text-red-600'}`}>
                                    {saveMessage || 'Settings saved successfully!'}
                                </span>
                            )}
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                            >
                                <Save className="w-5 h-5" />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
