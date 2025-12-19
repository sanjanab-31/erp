import React, { useState } from 'react';
import { useNavigate, Outlet, NavLink, useLocation } from 'react-router-dom';
import {
    Home,
    Calendar,
    BookOpen,
    GraduationCap,
    Users,
    Clock,
    BookMarked,
    FileText,
    Settings,
    Bell,
    Moon,
    Sun,
    TrendingUp,
    ClipboardList,
    UserCheck,
    LogOut,
    Megaphone,
    X,
    User,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import {
    studentApi,
    teacherApi,
    courseApi,
    timetableApi
} from '../../../services/api';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'Sarah Johnson';
    const userRole = localStorage.getItem('userRole') || 'Teacher';
    const userEmail = localStorage.getItem('userEmail') || '';

    const location = useLocation();
    const [darkMode, setDarkMode] = useState(false);
    const [showNotificationPanel, setShowNotificationPanel] = useState(false);
    const [unreadCount, setUnreadCount] = useState(3);

    const recentActivities = [
        {
            id: 1,
            type: 'assignment',
            title: 'New Assignment Submission',
            description: '5 students submitted Math Assignment 3',
            time: '10 mins ago',
            icon: ClipboardList
        },
        {
            id: 2,
            type: 'attendance',
            title: 'Attendance Marked',
            description: 'Grade 10-A attendance completed',
            time: '1 hour ago',
            icon: CheckCircle
        },
        {
            id: 3,
            type: 'announcement',
            title: 'New Announcement',
            description: 'School meeting tomorrow at 10 AM',
            time: '2 hours ago',
            icon: Megaphone
        }
    ];

    const getActivityColor = (type) => {
        switch (type) {
            case 'assignment': return 'text-blue-600';
            case 'attendance': return 'text-green-600';
            case 'announcement': return 'text-purple-600';
            default: return 'text-gray-600';
        }
    };

    const menuItems = [
        { icon: Home, label: 'Dashboard', path: '/teacher/dashboard' },
        { icon: Users, label: 'Students', path: '/teacher/students' },
        { icon: UserCheck, label: 'Attendance', path: '/teacher/attendance' },
        { icon: GraduationCap, label: 'Exams & Grades', path: '/teacher/exams' },
        { icon: BookOpen, label: 'Courses', path: '/teacher/courses' },
        { icon: Clock, label: 'Timetable', path: '/teacher/timetable' },
        { icon: BookMarked, label: 'Library', path: '/teacher/library' },
        { icon: Megaphone, label: 'Announcements', path: '/teacher/announcements' },
        { icon: FileText, label: 'Reports', path: '/teacher/reports' }
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const getCurrentPageName = () => {
        const path = location.pathname;
        const menuItem = menuItems.find(item => item.path === path);
        return menuItem ? menuItem.label : 'Dashboard';
    };

    return (
        <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <aside className={`w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
                <div className="px-6 py-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>School ERP</h1>
                            <p className="text-xs text-gray-500">{userRole} Portal</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-1">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                        isActive
                                            ? 'bg-green-50 text-green-600'
                                            : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </NavLink>
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
                                {getCurrentPageName()}
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
                                    className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
                                                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activities</h3>
                                                <button onClick={() => setShowNotificationPanel(false)} className="text-gray-400 hover:text-gray-500">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {recentActivities.length === 0 ? (
                                                <div className="p-4 text-center text-gray-500 text-sm">No recent activities</div>
                                            ) : (
                                                recentActivities.map((activity) => (
                                                    <div key={activity.id} className={`p-3 border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-50 hover:bg-gray-50'} transition-colors flex items-start space-x-3`}>
                                                        <div className={`p-2 rounded-full ${getActivityColor(activity.type)} bg-opacity-20`}>
                                                            <activity.icon className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} truncate`}>{activity.title}</p>
                                                            <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
                                                            <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <div className={`p-2 text-center border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}>
                                            <button onClick={() => { setShowNotificationPanel(false); }} className="text-xs text-green-600 hover:text-green-700 font-medium">
                                                View All Activity
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                            >
                                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
                            </button>

                            <button
                                onClick={() => navigate('/teacher/settings')}
                                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                            >
                                <Settings className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                            </button>
                        </div>
                    </div>
                </header>

                <Outlet context={{ darkMode }} />
            </main>
        </div>
    );
};

export default TeacherDashboard;

