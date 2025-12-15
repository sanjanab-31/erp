import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AttendancePage from './AttendancePage';
import FeePage from './FeePage';
import {
    Home,
    Calendar,
    BookOpen,
    GraduationCap,
    DollarSign,
    Clock,
    MessageSquare,
    BookMarked,
    Bus,
    Settings,
    Bell,
    Search,
    Moon,
    Sun,
    TrendingUp,
    BookOpenCheck,
    Library
} from 'lucide-react';

const StudentPortal = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'Mike Wilson';
    const userRole = localStorage.getItem('userRole') || 'Student';

    // State management
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    // Real-time dashboard data
    const [dashboardData, setDashboardData] = useState({
        attendance: 95,
        currentGrade: 'A',
        gradePerformance: 'Overall performance',
        assignments: {
            pending: 3,
            total: 3
        },
        libraryBooks: {
            issued: 2,
            total: 2
        },
        upcomingAssignments: [
            {
                id: 1,
                title: 'Math Assignment',
                description: 'Calculus problems',
                dueDate: 'Due tomorrow',
                status: 'urgent'
            },
            {
                id: 2,
                title: 'Physics Lab Report',
                description: 'Experiment analysis',
                dueDate: 'Due in 3 days',
                status: 'normal'
            }
        ],
        recentGrades: [
            {
                id: 1,
                subject: 'Mathematics',
                assessment: 'Mid-term exam',
                grade: 'A',
                color: 'green'
            },
            {
                id: 2,
                subject: 'Physics',
                assessment: 'Quiz 3',
                grade: 'B+',
                color: 'blue'
            }
        ]
    });

    // Sidebar menu items
    const menuItems = [
        { icon: Home, label: 'Dashboard', active: true },
        { icon: Calendar, label: 'Attendance' },
        { icon: GraduationCap, label: 'Exams & Grade' },
        { icon: BookOpen, label: 'Courses' },
        { icon: DollarSign, label: 'Fees & Finance' },
        { icon: Clock, label: 'Timetable' },
        { icon: MessageSquare, label: 'Communication' },
        { icon: BookMarked, label: 'Library' },
        { icon: Bus, label: 'Transport' },
        { icon: Settings, label: 'Settings' }
    ];

    const handleLogout = () => {
        // Import and use JWT logout
        import('../../../utils/jwt').then(({ logout }) => {
            logout();
            navigate('/login');
        });
    };

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setDashboardData(prev => ({
                ...prev,
            }));
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
        if (activeTab === 'Attendance') {
            return <AttendancePage />;
        }

        if (activeTab === 'Fees & Finance') {
            return <FeePage />;
        }

        // Default Dashboard Content
        return (
            <div className="flex-1 overflow-y-auto p-8">
                {/* Greeting */}
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        {getGreeting()}, {userName.split(' ')[0]}!
                    </h1>
                    <p className="text-sm text-gray-500">Student Dashboard</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Attendance Card */}
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Attendance</h3>
                            <TrendingUp className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="mb-3">
                            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dashboardData.attendance}%</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${dashboardData.attendance}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Current Grade Card */}
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Current Grade</h3>
                            <GraduationCap className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="mb-2">
                            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dashboardData.currentGrade}</p>
                        </div>
                        <p className="text-sm text-gray-500">{dashboardData.gradePerformance}</p>
                    </div>

                    {/* Assignments Card */}
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Assignments</h3>
                            <BookOpenCheck className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="mb-2">
                            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dashboardData.assignments.pending}</p>
                        </div>
                        <p className="text-sm text-gray-500">Pending submissions</p>
                    </div>

                    {/* Library Books Card */}
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Library Books</h3>
                            <Library className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="mb-2">
                            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dashboardData.libraryBooks.issued}</p>
                        </div>
                        <p className="text-sm text-gray-500">Currently issued</p>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Upcoming Assignments */}
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Upcoming Assignments</h3>
                        <div className="space-y-4">
                            {dashboardData.upcomingAssignments.map((assignment) => (
                                <div
                                    key={assignment.id}
                                    className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{assignment.title}</h4>
                                            <p className="text-sm text-gray-500 mb-2">{assignment.description}</p>
                                            <p className={`text-xs ${assignment.status === 'urgent' ? 'text-red-500' : 'text-gray-500'}`}>
                                                {assignment.dueDate}
                                            </p>
                                        </div>
                                        {assignment.status === 'urgent' && (
                                            <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                                                Due tomorrow
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Grades */}
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Recent Grades</h3>
                        <div className="space-y-4">
                            {dashboardData.recentGrades.map((grade) => (
                                <div
                                    key={grade.id}
                                    className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{grade.subject}</h4>
                                            <p className="text-sm text-gray-500">{grade.assessment}</p>
                                        </div>
                                        <span
                                            className={`px-4 py-2 rounded-lg font-bold text-lg ${grade.color === 'green'
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-blue-100 text-blue-600'
                                                }`}
                                        >
                                            {grade.grade}
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
            {/* Sidebar */}
            <aside className={`w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
                {/* Logo */}
                <div className="p-6 border-b border-gray-200">
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
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</p>
                    <ul className="space-y-1">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => setActiveTab(item.label)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === item.label
                                        ? 'bg-blue-50 text-blue-600'
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

                {/* User Profile */}
                <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                            MW
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userName}</p>
                            <p className="text-xs text-gray-500 truncate">{userRole}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
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

                {/* Dynamic Content */}
                {renderContent()}
            </main>
        </div>
    );
};

export default StudentPortal;
