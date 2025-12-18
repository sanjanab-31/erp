import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Settings as SettingsIcon,
    User,
    Bell,
    Lock,
    Globe,
    Palette,
    Save,
    Camera,
    Eye,
    EyeOff,
    Shield,
    Database,
    LogOut
} from 'lucide-react';
import { settingsApi } from '../../../services/api';

const SettingsPage = ({ darkMode }) => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('general');
    const [showPassword, setShowPassword] = useState(false);
    const [saved, setSaved] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const [settings, setSettings] = useState({
        schoolName: 'ABC International School',
        email: 'admin@abcschool.com',
        phone: '+1 234-567-8900',
        address: '123 Education Street, City, State',
        timezone: 'UTC-5 (EST)',
        language: 'English',
        currency: 'USD',
        emailNotifications: true,
        smsNotifications: false,
        systemUpdates: true
    });

    const [securitySettings, setSecuritySettings] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const loadSettings = async () => {
            setLoading(true);
            try {
                const res = await settingsApi.get('admin');
                if (res.data) {
                    setSettings(prev => ({
                        ...prev,
                        ...(res.data.general || {}),
                        ...(res.data.notifications || {})
                    }));
                }
            } catch (error) {
                console.error('Error loading admin settings:', error);
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const generalData = {
                schoolName: settings.schoolName,
                email: settings.email,
                phone: settings.phone,
                address: settings.address,
                timezone: settings.timezone,
                language: settings.language,
                currency: settings.currency
            };

            const notifData = {
                emailNotifications: settings.emailNotifications,
                smsNotifications: settings.smsNotifications,
                systemUpdates: settings.systemUpdates
            };

            await Promise.all([
                settingsApi.update('admin', 'general', generalData),
                settingsApi.update('admin', 'notifications', notifData)
            ]);

            setSaved(true);
            setSaveMessage('Settings saved successfully!');
            setTimeout(() => {
                setSaved(false);
                setSaveMessage('');
            }, 3000);
        } catch (error) {
            setSaveMessage('Error saving settings');
            setTimeout(() => setSaveMessage(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const sections = [
        { id: 'general', name: 'General', icon: SettingsIcon },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'security', name: 'Security', icon: Lock },

    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'general':
                return (
                    <div className="space-y-6">
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                            School Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    School Name
                                </label>
                                <input
                                    type="text"
                                    value={settings.schoolName}
                                    onChange={(e) => {
                                        setSettings({ ...settings, schoolName: e.target.value });
                                    }}

                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={settings.email}
                                    onChange={(e) => {
                                        setSettings({ ...settings, email: e.target.value });
                                    }}

                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    value={settings.phone}
                                    onChange={(e) => {
                                        setSettings({ ...settings, phone: e.target.value });
                                    }}

                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Timezone
                                </label>
                                <select
                                    value={settings.timezone}
                                    onChange={(e) => {
                                        setSettings({ ...settings, timezone: e.target.value });
                                    }}

                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                >
                                    <option>UTC-5 (EST)</option>
                                    <option>UTC-8 (PST)</option>
                                    <option>UTC+0 (GMT)</option>
                                    <option>UTC+5:30 (IST)</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Address
                                </label>
                                <textarea
                                    value={settings.address}
                                    onChange={(e) => {
                                        setSettings({ ...settings, address: e.target.value });
                                    }}

                                    rows="3"
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-purple-500`}
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

                        <div className="space-y-4">
                            {Object.entries(settings).filter(([key]) => key.includes('Notifications') || key === 'systemUpdates').map(([key, value]) => (
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
                                            setSettings({ ...settings, [key]: !value });
                                        }}

                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-purple-600' : 'bg-gray-300'
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
                            Security Settings
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
                                        } focus:outline-none focus:ring-2 focus:ring-purple-500`}
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
                                        } focus:outline-none focus:ring-2 focus:ring-purple-500`}
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
                                        } focus:outline-none focus:ring-2 focus:ring-purple-500`}
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
                                            role: 'admin',
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
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
                <p className="text-sm text-gray-500">Manage system settings and preferences</p>
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
                                    ? 'bg-purple-50 text-purple-600'
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
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
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
