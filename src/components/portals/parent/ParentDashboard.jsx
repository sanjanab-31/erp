import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Home,
    User,
    GraduationCap,
    DollarSign,
    Calendar,
    MessageSquare,
    FileText,
    Settings,
    Bell,
    Search,
    Moon,
    Sun,
    TrendingUp,
    BookOpen,
    Clock,
    Award,
    LogOut
} from 'lucide-react';
import MyChildrenPage from './MyChildrenPage';
import AcademicProgressPage from './AcademicProgressPage';
import AttendancePage from './AttendancePage';
import FeeManagementPage from './FeeManagementPage';
import TimetablePage from './TimetablePage';
import CommunicationPage from './CommunicationPage';
import ReportsPage from './ReportsPage';
import SettingsPage from './SettingsPage';

const ParentDashboard = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'Parent User';
    const userRole = localStorage.getItem('userRole') || 'Parent';

    const [activeTab, setActiveTab] = useState('Dashboard');
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(2);
    const [searchQuery, setSearchQuery] = useState('');

    const [dashboardData, setDashboardData] = useState({
        children: [
            {
                id: 1,
                name: 'Emma Wilson',
                class: 'Grade 10-A',
                attendance: 95,
                currentGrade: 'A',
                pendingFees: 0,
                upcomingTests: 2
            }
        ],
        recentActivities: [
            { id: 1, child: 'Emma Wilson', activity: 'Submitted Math Assignment', time: '2 hours ago', type: 'assignment' },
            { id: 2, child: 'Emma Wilson', activity: 'Attended Physics Class', time: '5 hours ago', type: 'attendance' },
            { id: 3, child: 'Emma Wilson', activity: 'Scored A in Chemistry Quiz', time: '1 day ago', type: 'grade' }
        ],
        upcomingEvents: [
            { id: 1, title: 'Parent-Teacher Meeting', date: 'Dec 20, 2025', time: '10:00 AM' },
            { id: 2, title: 'Mid-term Exams', date: 'Dec 25, 2025', time: 'All Day' }
        ],
        feeStatus: {
            total: 5000,
            paid: 5000,
            pending: 0,
            nextDue: 'Jan 15, 2026'
        }
    });

    const menuItems = [
        { icon: Home, label: 'Dashboard', active: true },
        { icon: User, label: 'My Children' },
        { icon: GraduationCap, label: 'Academic Progress' },
        { icon: Calendar, label: 'Attendance' },
        { icon: DollarSign, label: 'Fee Management' },
        { icon: Clock, label: 'Timetable' },
        { icon: MessageSquare, label: 'Communication' },
        { icon: FileText, label: 'Reports' },
        { icon: Settings, label: 'Settings' }
    ];

    const handleLogout = () => {
        localStorage.removeItem('authToken');
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

    const renderContent = () => {
        if (activeTab === 'My Children') return <MyChildrenPage darkMode={darkMode} />;
        if (activeTab === 'Academic Progress') return <AcademicProgressPage darkMode={darkMode} />;
        if (activeTab === 'Attendance') return <AttendancePage darkMode={darkMode} />;
        if (activeTab === 'Fee Management') return <FeeManagementPage darkMode={darkMode} />;
        if (activeTab === 'Timetable') return <TimetablePage darkMode={darkMode} />;
        if (activeTab === 'Communication') return <CommunicationPage darkMode={darkMode} />;
        if (activeTab === 'Reports') return <ReportsPage darkMode={darkMode} />;
        if (activeTab === 'Settings') return <SettingsPage darkMode={darkMode} />;

        // Default Dashboard
        return (
            <>
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        {getGreeting()}, {userName.split(' ')[0]}!
                    </h1>
                    <p className="text-sm text-gray-500">Parent Dashboard - Monitor Your Child's Progress</p>
                </div>
                {dashboardData.children.map((child) => (
                    <div key={child.id} className="mb-8">
                        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>{child.name}'s Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Attendance</h3>
                                    <TrendingUp className="w-5 h-5 text-gray-400" />
                                </div>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{child.attendance}%</p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full" style={{ width: `${child.attendance}%` }}></div>
                                </div>
                            </div>
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Current Grade</h3>
                                    <Award className="w-5 h-5 text-gray-400" />
                                </div>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{child.currentGrade}</p>
                                <p className="text-sm text-gray-500 mt-2">Excellent performance</p>
                            </div>
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pending Fees</h3>
                                    <DollarSign className="w-5 h-5 text-gray-400" />
                                </div>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>${child.pendingFees}</p>
                                <p className="text-sm text-green-500 mt-2">All paid up!</p>
                            </div>
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Upcoming Tests</h3>
                                    <BookOpen className="w-5 h-5 text-gray-400" />
                                </div>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{child.upcomingTests}</p>
                                <p className="text-sm text-gray-500 mt-2">This week</p>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Recent Activities</h3>
                        <div className="space-y-4">
                            {dashboardData.recentActivities.map((activity) => (
                                <div key={activity.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{activity.child}</h4>
                                            <p className="text-sm text-gray-500 mb-1">{activity.activity}</p>
                                            <p className="text-xs text-gray-500">{activity.time}</p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${activity.type === 'assignment' ? 'bg-blue-100 text-blue-600' : activity.type === 'attendance' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>
                                            {activity.type}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Upcoming Events</h3>
                        <div className="space-y-4">
                            {dashboardData.upcomingEvents.map((event) => (
                                <div key={event.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{event.title}</h4>
                                            <p className="text-sm text-gray-500 mb-1">{event.date}</p>
                                            <p className="text-xs text-gray-500">{event.time}</p>
                                        </div>
                                        <Calendar className="w-5 h-5 text-orange-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        );
    };


    return (
        <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <aside className={`w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
                <div className="px-6 py-3 border-b border-gray-200">
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

                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-1">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => setActiveTab(item.label)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === item.label
                                        ? 'bg-orange-50 text-orange-600'
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
                                        } focus:outline-none focus:ring-2 focus:ring-orange-500 w-64`}
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

                <div className="flex-1 overflow-y-auto p-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default ParentDashboard;
