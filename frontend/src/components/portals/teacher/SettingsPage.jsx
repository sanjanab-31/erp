import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Settings as SettingsIcon,
    User,
    Bell,
    Lock,
    Globe,
    Palette,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Save,
    Camera,
    Eye,
    EyeOff,
    LogOut
} from 'lucide-react';
import { getSettings, updateSettingsSection, changePassword, subscribeToSettingsUpdates } from '../../../utils/settingsStore';

const SettingsPage = ({ darkMode }) => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('profile');
    const [showPassword, setShowPassword] = useState(false);
    const [saved, setSaved] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    const [profileData, setProfileData] = useState({
        name: 'Sarah Johnson',
        email: 'sarah.johnson@school.com',
        phone: '+1 234-567-8900',
        address: '123 Education Street, City, State 12345',
        dateOfBirth: '1985-05-15',
        employeeId: 'TCH-2024-001',
        department: 'Mathematics',
        qualification: 'M.Sc. Mathematics',
        experience: '10 years'
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        assignmentReminders: true,
        gradeUpdates: true,
        attendanceAlerts: true,
        parentMessages: true,
        systemUpdates: false
    });

    const [securitySettings, setSecuritySettings] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorAuth: false
    });

    const [preferenceSettings, setPreferenceSettings] = useState({
        language: 'English',
        timezone: 'UTC-5 (EST)',
        dateFormat: 'MM/DD/YYYY',
        theme: 'System Default'
    });

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // JWT token
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Load settings from store on component mount
    useEffect(() => {
        const settings = getSettings('teacher');
        if (settings.profile) setProfileData(settings.profile);
        if (settings.notifications) setNotificationSettings(settings.notifications);
        if (settings.preferences) setPreferenceSettings(settings.preferences);
        if (settings.security) setSecuritySettings(prev => ({ ...prev, twoFactorAuth: settings.security.twoFactorAuth || false }));

        // Subscribe to real-time updates
        const unsubscribe = subscribeToSettingsUpdates('teacher', (updatedSettings) => {
            if (updatedSettings.profile) setProfileData(updatedSettings.profile);
            if (updatedSettings.notifications) setNotificationSettings(updatedSettings.notifications);
            if (updatedSettings.preferences) setPreferenceSettings(updatedSettings.preferences);
            if (updatedSettings.security) setSecuritySettings(prev => ({ ...prev, twoFactorAuth: updatedSettings.security.twoFactorAuth || false }));
        });

        return () => unsubscribe();
    }, []);

    const handleSave = () => {
        updateSettingsSection('teacher', 'profile', profileData);
        updateSettingsSection('teacher', 'notifications', notificationSettings);
        updateSettingsSection('teacher', 'preferences', preferenceSettings);

        setSaved(true);
        setSaveMessage('Settings saved successfully!');
        setTimeout(() => {
            setSaved(false);
            setSaveMessage('');
        }, 3000);
    };

    const sections = [
        { id: 'profile', name: 'Profile', icon: User },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'security', name: 'Security', icon: Lock },
        { id: 'preferences', name: 'Preferences', icon: Palette }
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'profile':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-6 mb-8">
                            <div className="relative">
                                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                    SJ
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                            <div>
                                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {profileData.name}
                                </h3>
                                <p className="text-gray-500">{profileData.department} Teacher</p>
                                <p className="text-sm text-gray-500">Employee ID: {profileData.employeeId}</p>
                            </div>
                        </div>

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
                                        updateSettingsSection('teacher', 'profile', updated);
                                    }}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => {
                                        const updated = { ...profileData, email: e.target.value };
                                        setProfileData(updated);
                                        updateSettingsSection('teacher', 'profile', updated);
                                    }}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => {
                                        const updated = { ...profileData, phone: e.target.value };
                                        setProfileData(updated);
                                        updateSettingsSection('teacher', 'profile', updated);
                                    }}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    value={profileData.dateOfBirth}
                                    onChange={(e) => {
                                        const updated = { ...profileData, dateOfBirth: e.target.value };
                                        setProfileData(updated);
                                        updateSettingsSection('teacher', 'profile', updated);
                                    }}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Address
                                </label>
                                <input
                                    type="text"
                                    value={profileData.address}
                                    onChange={(e) => {
                                        const updated = { ...profileData, address: e.target.value };
                                        setProfileData(updated);
                                        updateSettingsSection('teacher', 'profile', updated);
                                    }}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Department
                                </label>
                                <input
                                    type="text"
                                    value={profileData.department}
                                    onChange={(e) => {
                                        const updated = { ...profileData, department: e.target.value };
                                        setProfileData(updated);
                                        updateSettingsSection('teacher', 'profile', updated);
                                    }}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Qualification
                                </label>
                                <input
                                    type="text"
                                    value={profileData.qualification}
                                    onChange={(e) => {
                                        const updated = { ...profileData, qualification: e.target.value };
                                        setProfileData(updated);
                                        updateSettingsSection('teacher', 'profile', updated);
                                    }}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="space-y-6">
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                            Notification Preferences
                        </h3>

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
                                        updateSettingsSection('teacher', 'notifications', updated);
                                    }}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-green-600' : 'bg-gray-300'
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
                );

            case 'security':
                return (
                    <div className="space-y-6">
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                            Change Password
                        </h3>

                        <div>
                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={securitySettings.currentPassword}
                                    onChange={(e) => setSecuritySettings({ ...securitySettings, currentPassword: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                />
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                                </button>
                            </div>
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
                                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
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
                                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                            />
                        </div>

                        <button
                            onClick={() => {
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
                                changePassword('teacher', securitySettings.currentPassword, securitySettings.newPassword);
                                setSecuritySettings({ currentPassword: '', newPassword: '', confirmPassword: '', twoFactorAuth: securitySettings.twoFactorAuth });
                                setSaveMessage('Password updated successfully!');
                                setTimeout(() => setSaveMessage(''), 3000);
                            }}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Update Password
                        </button>

                        <div className="flex items-center justify-between py-4 border-t border-gray-200 mt-6">
                            <div>
                                <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Two-Factor Authentication
                                </h4>
                                <p className="text-sm text-gray-500">
                                    Add an extra layer of security to your account
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    const updated = !securitySettings.twoFactorAuth;
                                    setSecuritySettings({ ...securitySettings, twoFactorAuth: updated });
                                    updateSettingsSection('teacher', 'security', { twoFactorAuth: updated });
                                }}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${securitySettings.twoFactorAuth ? 'bg-green-600' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                );

            case 'preferences':
                return (
                    <div className="space-y-6">
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                            Application Preferences
                        </h3>

                        <div>
                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                Language
                            </label>
                            <select
                                value={preferenceSettings.language}
                                onChange={(e) => {
                                    const updated = { ...preferenceSettings, language: e.target.value };
                                    setPreferenceSettings(updated);
                                    updateSettingsSection('teacher', 'preferences', updated);
                                }}
                                className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                            >
                                <option>English</option>
                                <option>Spanish</option>
                                <option>French</option>
                                <option>German</option>
                            </select>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                Timezone
                            </label>
                            <select
                                value={preferenceSettings.timezone}
                                onChange={(e) => {
                                    const updated = { ...preferenceSettings, timezone: e.target.value };
                                    setPreferenceSettings(updated);
                                    updateSettingsSection('teacher', 'preferences', updated);
                                }}
                                className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                            >
                                <option>UTC-5 (EST)</option>
                                <option>UTC-8 (PST)</option>
                                <option>UTC+0 (GMT)</option>
                                <option>UTC+5:30 (IST)</option>
                            </select>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                Date Format
                            </label>
                            <select
                                value={preferenceSettings.dateFormat}
                                onChange={(e) => {
                                    const updated = { ...preferenceSettings, dateFormat: e.target.value };
                                    setPreferenceSettings(updated);
                                    updateSettingsSection('teacher', 'preferences', updated);
                                }}
                                className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                            >
                                <option>MM/DD/YYYY</option>
                                <option>DD/MM/YYYY</option>
                                <option>YYYY-MM-DD</option>
                            </select>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                Theme
                            </label>
                            <select
                                value={preferenceSettings.theme}
                                onChange={(e) => {
                                    const updated = { ...preferenceSettings, theme: e.target.value };
                                    setPreferenceSettings(updated);
                                    updateSettingsSection('teacher', 'preferences', updated);
                                }}
                                className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                            >
                                <option>System Default</option>
                                <option>Light</option>
                                <option>Dark</option>
                            </select>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Settings
                </h1>
                <p className="text-sm text-gray-500">Manage your account settings and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} h-fit`}>
                    <nav className="space-y-2">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeSection === section.id
                                    ? 'bg-green-50 text-green-600'
                                    : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                                    }`}
                            >
                                <section.icon className="w-5 h-5" />
                                <span className="font-medium">{section.name}</span>
                            </button>
                        ))}

                        {/* Logout Button */}
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

                {/* Content */}
                <div className="lg:col-span-3">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        {renderContent()}

                        {/* Save Button */}
                        <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                            {(saved || saveMessage) && (
                                <span className={`text-sm font-medium ${saveMessage.includes('success') || saveMessage.includes('updated') || saved ? 'text-green-600' : 'text-red-600'}`}>
                                    {saveMessage || 'Settings saved successfully!'}
                                </span>
                            )}
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
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

