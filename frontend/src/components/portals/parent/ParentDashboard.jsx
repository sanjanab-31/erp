import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import {
    Home,
    User,
    GraduationCap,
    DollarSign,
    Calendar,
    Settings,
    Bell,
    Moon,
    Sun,
    BookMarked,
    Megaphone,
    Clock,
    X,
    Info,
    LogOut
} from 'lucide-react';
import { announcementApi } from '../../../services/api';

const ParentDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userName = localStorage.getItem('userName') || 'Parent User';
    const userRole = localStorage.getItem('userRole') || 'Parent';

    const [darkMode, setDarkMode] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotificationPanel, setShowNotificationPanel] = useState(false);
    const [recentActivities, setRecentActivities] = useState([]);

    const menuItems = [
        { icon: Home, label: 'Dashboard', path: '/parent/dashboard' },
        { icon: GraduationCap, label: 'Academic Progress', path: '/parent/academic-progress' },
        { icon: Calendar, label: 'Attendance', path: '/parent/attendance' },
        { icon: DollarSign, label: 'Fee Management', path: '/parent/fees' },
        { icon: Clock, label: 'Timetable', path: '/parent/timetable' },
        { icon: BookMarked, label: 'Library', path: '/parent/library' },
        { icon: Megaphone, label: 'Announcements', path: '/parent/announcements' }
    ];

    useEffect(() => {
        const fetchRecentActivities = async () => {
            try {
                const announcementsRes = await announcementApi.getAll();
                const allAnnouncements = Array.isArray(announcementsRes?.data?.data) ? announcementsRes.data.data : [];

                const parentAnnouncements = allAnnouncements
                    .filter(a => a.targetAudience === 'Parents' || a.targetAudience === 'All')
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5)
                    .map(a => ({
                        id: a.id,
                        type: 'info',
                        title: a.title,
                        description: a.description || a.message || '',
                        time: new Date(a.createdAt).toLocaleDateString(),
                        icon: Info
                    }));

                setRecentActivities(parentAnnouncements);
                setUnreadCount(parentAnnouncements.length);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchRecentActivities();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    return (
        <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <aside className={`w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
                <div className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>School ERP</h1>
                            <p className="text-xs text-gray-500">{userRole} Portal</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-2 overflow-y-auto">
                    <ul className="space-y-1">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <Link
                                    to={item.path}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${location.pathname === item.path
                                        ? 'bg-orange-50 text-orange-600'
                                        : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-8 py-4`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                            </h2>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setShowNotificationPanel(!showNotificationPanel);
                                        if (!showNotificationPanel) {
                                            setUnreadCount(0);
                                        }
                                    }}
                                    className={`relative p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                                >
                                    <Bell className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {showNotificationPanel && (
                                    <div className={`absolute top-full right-0 mt-2 w-80 rounded-xl shadow-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} z-50 overflow-hidden`}>
                                        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                                            <div className="flex justify-between items-center">
                                                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Announcements</h3>
                                                <button onClick={() => setShowNotificationPanel(false)} className="text-gray-400 hover:text-gray-500">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {recentActivities.length > 0 ? (
                                                recentActivities.map((activity) => (
                                                    <div
                                                        key={activity.id}
                                                        className={`p-4 border-b last:border-0 ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'} cursor-pointer transition-colors`}
                                                    >
                                                        <div className="flex items-start space-x-3">
                                                            <activity.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${activity.type === 'error' ? 'text-red-500' :
                                                                activity.type === 'warning' ? 'text-orange-500' :
                                                                    activity.type === 'success' ? 'text-green-500' :
                                                                        'text-blue-500'
                                                                }`} />
                                                            <div className="flex-1 min-w-0">
                                                                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                                    {activity.title}
                                                                </p>
                                                                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                    {activity.description}
                                                                </p>
                                                                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center">
                                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        No new notifications
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                            >
                                {darkMode ? (
                                    <Sun className="w-5 h-5 text-yellow-400" />
                                ) : (
                                    <Moon className="w-5 h-5 text-gray-700" />
                                )}
                            </button>

                            <Link
                                to="/parent/settings"
                                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                            >
                                <Settings className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    <Outlet context={{ darkMode }} />
                </div>
            </main>
        </div>
    );
};

export default ParentDashboard;
