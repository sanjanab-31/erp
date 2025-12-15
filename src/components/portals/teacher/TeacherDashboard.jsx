import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentsPage from './StudentsPage';
import AttendancePage from './AttendancePage';
import ExamsAndGradesPage from './ExamsAndGradesPage';
import CoursesPage from './CoursesPage';
import TimetablePage from './TimetablePage';
import CommunicationPage from './CommunicationPage';
import LibraryPage from './LibraryPage';
import ReportsPage from './ReportsPage';
import SettingsPage from './SettingsPage';
import {
    Home,
    Calendar,
    BookOpen,
    GraduationCap,
    Users,
    Clock,
    MessageSquare,
    BookMarked,
    FileText,
    Settings,
    Bell,
    Search,
    Moon,
    Sun,
    TrendingUp,
    ClipboardList,
    UserCheck
} from 'lucide-react';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'Sarah Johnson';
    const userRole = localStorage.getItem('userRole') || 'Teacher';

    const [activeTab, setActiveTab] = useState('Dashboard');
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(3);
    const [searchQuery, setSearchQuery] = useState('');

    const [dashboardData, setDashboardData] = useState({
        totalClasses: 5,
        totalStudents: 120,
        pendingAssignments: 8,
        upcomingClasses: 3,
        todayClasses: [
            { id: 1, subject: 'Mathematics', class: 'Grade 10-A', time: '09:00 AM', room: 'Room 201' },
            { id: 2, subject: 'Physics', class: 'Grade 11-B', time: '11:00 AM', room: 'Lab 3' },
            { id: 3, subject: 'Mathematics', class: 'Grade 10-B', time: '02:00 PM', room: 'Room 201' }
        ],
        recentSubmissions: [
            { id: 1, student: 'John Doe', assignment: 'Calculus Problems', subject: 'Math', status: 'pending' },
            { id: 2, student: 'Jane Smith', assignment: 'Physics Lab Report', subject: 'Physics', status: 'graded' }
        ]
    });

    const menuItems = [
        { icon: Home, label: 'Dashboard' },
        { icon: Users, label: 'Students' },
        { icon: UserCheck, label: 'Attendance' },
        { icon: GraduationCap, label: 'Exams & Grades' },
        { icon: BookOpen, label: 'Courses' },
        { icon: Clock, label: 'Timetable' },
        { icon: MessageSquare, label: 'Communication' },
        { icon: BookMarked, label: 'Library' },
        { icon: FileText, label: 'Reports' },
        { icon: Settings, label: 'Settings' }
    ];

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        navigate('/login');
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setDashboardData(prev => ({ ...prev }));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    // Render content based on active tab
    const renderContent = () => {
        if (activeTab === 'Students') {
            return <StudentsPage darkMode={darkMode} />;
        }

        if (activeTab === 'Attendance') {
            return <AttendancePage darkMode={darkMode} />;
        }

        if (activeTab === 'Exams & Grades') {
            return <ExamsAndGradesPage darkMode={darkMode} />;
        }

        if (activeTab === 'Courses') {
            return <CoursesPage darkMode={darkMode} />;
        }

        if (activeTab === 'Timetable') {
            return <TimetablePage darkMode={darkMode} />;
        }

        if (activeTab === 'Communication') {
            return <CommunicationPage darkMode={darkMode} />;
        }

        if (activeTab === 'Library') {
            return <LibraryPage darkMode={darkMode} />;
        }

        if (activeTab === 'Reports') {
            return <ReportsPage darkMode={darkMode} />;
        }

        if (activeTab === 'Settings') {
            return <SettingsPage darkMode={darkMode} />;
        }

        // Default Dashboard Content
        return (
            <div className="flex-1 overflow-y-auto p-8">
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        {getGreeting()}, {userName.split(' ')[0]}!
                    </h1>
                    <p className="text-sm text-gray-500">Teacher Dashboard</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Classes</h3>
                            <BookOpen className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dashboardData.totalClasses}</p>
                        <p className="text-sm text-gray-500 mt-2">Active courses</p>
                    </div>

                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Students</h3>
                            <Users className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dashboardData.totalStudents}</p>
                        <p className="text-sm text-gray-500 mt-2">Across all classes</p>
                    </div>

                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pending Grading</h3>
                            <ClipboardList className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dashboardData.pendingAssignments}</p>
                        <p className="text-sm text-gray-500 mt-2">Assignments to grade</p>
                    </div>

                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Today's Classes</h3>
                            <Calendar className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dashboardData.upcomingClasses}</p>
                        <p className="text-sm text-gray-500 mt-2">Scheduled classes</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Today's Schedule</h3>
                        <div className="space-y-4">
                            {dashboardData.todayClasses.map((classItem) => (
                                <div key={classItem.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{classItem.subject}</h4>
                                            <p className="text-sm text-gray-500 mb-1">{classItem.class}</p>
                                            <p className="text-xs text-gray-500">{classItem.room}</p>
                                        </div>
                                        <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
                                            {classItem.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Recent Submissions</h3>
                        <div className="space-y-4">
                            {dashboardData.recentSubmissions.map((submission) => (
                                <div key={submission.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{submission.student}</h4>
                                            <p className="text-sm text-gray-500 mb-1">{submission.assignment}</p>
                                            <p className="text-xs text-gray-500">{submission.subject}</p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${submission.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-600'
                                            : 'bg-green-100 text-green-600'
                                            }`}>
                                            {submission.status === 'pending' ? 'Pending' : 'Graded'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <aside className={`w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
                <div className="p-6 border-b border-gray-200">
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
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</p>
                    <ul className="space-y-1">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => setActiveTab(item.label)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === item.label
                                        ? 'bg-green-50 text-green-600'
                                        : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
                            SJ
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userName}</p>
                            <p className="text-xs text-gray-500 truncate">{userRole}</p>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-8 py-4`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Home className="w-4 h-4" />
                                <span>/</span>
                                <span className={darkMode ? 'text-white' : 'text-gray-900'}>{activeTab}</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
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
                                        } focus:outline-none focus:ring-2 focus:ring-green-500 w-64`}
                                />
                            </div>

                            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <Bell className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                                {notifications > 0 && (
                                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                                        {notifications}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                            >
                                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
                            </button>

                            <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                                <Settings className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                            </button>
                        </div>
                    </div>
                </header>


                {/* Dynamic Content */}
                {renderContent()}
            </main>
        </div>
    );
};

export default TeacherDashboard;
