import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { studentApi } from '../../../services/api';
import {
    Home,
    Calendar,
    BookOpen,
    GraduationCap,
    DollarSign,
    Clock,
    BookMarked,
    Settings,
    Bell,
    Search,
    Moon,
    Sun,
    Megaphone,
    FileText
} from 'lucide-react';

const StudentPortal = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const userName = localStorage.getItem('userName') || 'Mike Wilson';
    const userRole = localStorage.getItem('userRole') || 'Student';
    const userEmail = localStorage.getItem('userEmail') || '';

    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [student, setStudent] = useState(null);

    useEffect(() => {
        const fetchStudentData = async () => {
            if (userEmail) {
                try {
                    const response = await studentApi.getByEmail(userEmail);
                    if (response.data && response.data.success) {
                        setStudent(response.data.data);
                    }
                } catch (error) {
                    console.error('Failed to fetch student profile:', error);
                }
            }
        };
        fetchStudentData();
    }, [userEmail]);

    const menuItems = [
        { icon: Home, label: 'Dashboard', path: '' },
        { icon: Calendar, label: 'Attendance', path: 'attendance' },
        { icon: GraduationCap, label: 'Exams & Grade', path: 'exams' },
        { icon: BookOpen, label: 'Courses', path: 'courses' },
        { icon: DollarSign, label: 'Fees & Finance', path: 'fees' },
        { icon: Clock, label: 'Timetable', path: 'timetable' },
        { icon: BookMarked, label: 'Library', path: 'library' },
        { icon: Megaphone, label: 'Announcements', path: 'announcements' },
        { icon: FileText, label: 'Reports', path: 'reports' },
        { icon: Settings, label: 'Settings', path: 'settings' },
    ];

    const currentPath = location.pathname.split('/').pop();
    const activeLabel = menuItems.find(item => {
        if (item.path === '' && (location.pathname.endsWith('/student') || location.pathname.endsWith('/student/'))) return true;
        return item.path === currentPath;
    })?.label || 'Dashboard';

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Sidebar */}
            <aside className={`w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
                {/* Logo Area */}
                <div className="px-6 py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>School ERP</h1>
                            <p className="text-xs text-gray-500">{userRole} Portal</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-1">
                        {menuItems.map((item, index) => {
                            const isActive = activeLabel === item.label;
                            return (
                                <li key={index}>
                                    <button
                                        onClick={() => handleNavigation(item.path)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                            ? 'bg-blue-50 text-blue-600'
                                            : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-8 py-4`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Home className="w-4 h-4" />
                                <span>/</span>
                                <span className={darkMode ? 'text-white' : 'text-gray-900'}>{activeLabel}</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`pl-10 pr-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-gray-50 border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 w-64`}
                                />
                            </div>

                            {/* Notifications */}
                            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <Bell className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                                {notifications > 0 && (
                                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                                        {notifications}
                                    </span>
                                )}
                            </button>

                            {/* Dark Mode Toggle */}
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

                            {/* Settings */}
                            <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                                <Settings className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <Outlet context={{ darkMode, userName, userEmail, student }} />
            </main>
        </div>
    );
};

export default StudentPortal;
