import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Home,
    Users,
    GraduationCap,
    UserCheck,
    IndianRupee,
    Calendar,
    BookMarked,
    BarChart3,
    Settings,
    Bell,
    Search,
    Moon,
    Sun,
    TrendingUp,
    UserPlus,
    FileText,
    ChevronDown,
    LogOut,
    CheckCircle,
    AlertCircle,
    Info,
    Megaphone,
    X
} from 'lucide-react';
import Students from './Students';
import Teachers from './Teachers';
import AttendancePage from './AttendancePage';
import CoursesPage from './CoursesPage';
import FeesAndFinancePage from './FeesAndFinancePage';
import TimetablePage from './TimetablePage';
import SettingsPage from './SettingsPage';
import AdminExamSchedules from './AdminExamSchedules';
import LibraryPage from './LibraryPage';
import AnnouncementsPage from './AnnouncementsPage';
import ReportsPage from './ReportsPage';
import { getStudentStats, subscribeToUpdates as subscribeToStudents } from '../../../utils/studentStore';
import { getTeacherStats, subscribeToUpdates as subscribeToTeachers } from '../../../utils/teacherStore';
import { getFeeStats, subscribeToUpdates as subscribeToFees } from '../../../utils/feeStore';
import { getOverallAttendanceStats, subscribeToUpdates as subscribeToAttendance } from '../../../utils/attendanceStore';
import { logAdminActivity, initializeActivityLog } from '../../../utils/activityLogger';
import { getLatestAnnouncements, subscribeToUpdates as subscribeToAnnouncements } from '../../../utils/announcementStore';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const userName = localStorage.getItem('userName') || 'John Admin';
    const userRole = localStorage.getItem('userRole') || 'Admin';

    const [activeTab, setActiveTab] = useState('Dashboard');
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [showNotificationPanel, setShowNotificationPanel] = useState(false);

    
    const [dashboardData, setDashboardData] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        revenue: 0,
        attendanceRate: 0,
        studentsChange: 'Loading...',
        teachersChange: 'Loading...',
        revenueChange: 'Loading...',
        attendanceChange: 'Loading...'
    });

    const [recentActivities, setRecentActivities] = useState([
        {
            id: 1,
            type: 'success',
            title: 'New student registered',
            description: 'Emma Davis - Class 10A',
            time: '2 mins ago',
            icon: CheckCircle
        },
        {
            id: 2,
            type: 'warning',
            title: 'Fee payment overdue',
            description: '5 students pending',
            time: '1 hour ago',
            icon: AlertCircle
        },
        {
            id: 3,
            type: 'info',
            title: 'Exam results published',
            description: 'Mid-term results available',
            time: '3 hours ago',
            icon: Info
        }
    ]);

    const menuItems = [
        { icon: Home, label: 'Dashboard' },
        { icon: Users, label: 'Students' },
        { icon: GraduationCap, label: 'Teachers' },
        { icon: UserCheck, label: 'Attendance' },
        { icon: BookMarked, label: 'Courses' },
        { icon: IndianRupee, label: 'Fees & Finance' },
        { icon: Calendar, label: 'Timetable' },
        { icon: Calendar, label: 'Exam Schedules' },
        { icon: BookMarked, label: 'Library' },
        { icon: Megaphone, label: 'Announcements' },
        { icon: BarChart3, label: 'Reports' },
        { icon: Settings, label: 'Settings' }
    ];

    
    const [recentAnnouncements, setRecentAnnouncements] = useState([]);

    
    useEffect(() => {
        const fetchDashboardData = () => {
            
            const studentStats = getStudentStats();

            
            const teacherStats = getTeacherStats();

            
            const feeStats = getFeeStats();

            
            const attendanceStats = getOverallAttendanceStats();

            
            const attendanceRate = attendanceStats.totalRecords > 0
                ? Math.round(((attendanceStats.present + attendanceStats.late) / attendanceStats.totalRecords) * 100)
                : 0;

            setDashboardData({
                totalStudents: studentStats.total,
                totalTeachers: teacherStats.total,
                revenue: feeStats.paidAmount || 0,
                attendanceRate: attendanceRate,
                studentsChange: `${studentStats.active} active students`,
                teachersChange: `${teacherStats.active} active staff members`,
                revenueChange: `${feeStats.collectionRate}% collection rate`,
                attendanceChange: 'Overall attendance rate'
            });
        };

        
        fetchDashboardData();

        
        const unsubscribeStudents = subscribeToStudents(fetchDashboardData);
        const unsubscribeTeachers = subscribeToTeachers(fetchDashboardData);
        const unsubscribeFees = subscribeToFees(fetchDashboardData);
        const unsubscribeAttendance = subscribeToAttendance(fetchDashboardData);

        
        return () => {
            unsubscribeStudents();
            unsubscribeTeachers();
            unsubscribeFees();
            unsubscribeAttendance();
        };
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    
    useEffect(() => {
        
        initializeActivityLog();

        const fetchRecentActivities = () => {
            try {
                const activityLog = JSON.parse(localStorage.getItem('adminActivityLog') || '[]');

                
                const recentActivitiesData = activityLog.slice(0, 3).map(activity => ({
                    id: activity.id || Date.now(),
                    type: activity.type || 'info',
                    title: activity.title || 'Activity',
                    description: activity.description || '',
                    time: activity.time || 'Recently',
                    icon: activity.type === 'success' ? CheckCircle :
                        activity.type === 'warning' ? AlertCircle : Info
                }));

                if (recentActivitiesData.length > 0) {
                    setRecentActivities(recentActivitiesData);
                }
            } catch (error) {
                console.error('Error fetching recent activities:', error);
            }
        };

        fetchRecentActivities();

        
        const handleNewActivity = () => {
            fetchRecentActivities();
        };

        window.addEventListener('adminActivityAdded', handleNewActivity);

        
        const interval = setInterval(fetchRecentActivities, 30000);

        return () => {
            window.removeEventListener('adminActivityAdded', handleNewActivity);
            clearInterval(interval);
        };
    }, []);

    
    useEffect(() => {
        const fetchAnnouncements = () => {
            const announcements = getLatestAnnouncements('All', null, 3);
            setRecentAnnouncements(announcements);
        };

        fetchAnnouncements();

        
        const unsubscribe = subscribeToAnnouncements(fetchAnnouncements);

        return unsubscribe;
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'success':
                return 'text-green-500 bg-green-50';
            case 'warning':
                return 'text-yellow-500 bg-yellow-50';
            case 'info':
                return 'text-blue-500 bg-blue-50';
            default:
                return 'text-gray-500 bg-gray-50';
        }
    };

    const Modal = ({ type, onClose }) => {
        const [formData, setFormData] = useState({});

        const handleSubmit = (e) => {
            e.preventDefault();
            
            console.log('Form submitted:', type, formData);

            
            const newActivity = {
                id: Date.now(),
                type: 'success',
                title: `${type === 'addStudent' ? 'Student' : type === 'addTeacher' ? 'Teacher' : type === 'scheduleEvent' ? 'Event' : 'Report'} ${type === 'generateReport' ? 'generated' : 'added'}`,
                description: formData.name || 'Successfully completed',
                time: 'Just now',
                icon: CheckCircle
            };

            setRecentActivities(prev => [newActivity, ...prev.slice(0, 2)]);

            onClose();
        };

        const renderFormFields = () => {
            switch (type) {
                case 'addStudent':
                    return (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Student Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Enter student name"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                    <option>Select Class</option>
                                    <option>Class 10A</option>
                                    <option>Class 10B</option>
                                    <option>Class 11A</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="student@example.com"
                                />
                            </div>
                        </>
                    );
                case 'addTeacher':
                    return (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Teacher Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Enter teacher name"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Enter subject"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="teacher@example.com"
                                />
                            </div>
                        </>
                    );
                case 'scheduleEvent':
                    return (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Enter event name"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    rows="3"
                                    placeholder="Event description"
                                ></textarea>
                            </div>
                        </>
                    );
                case 'generateReport':
                    return (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                    <option>Student Performance</option>
                                    <option>Attendance Report</option>
                                    <option>Financial Report</option>
                                    <option>Teacher Performance</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="date"
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    <input
                                        type="date"
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </>
                    );
                default:
                    return null;
            }
        };

        const getModalTitle = () => {
            switch (type) {
                case 'addStudent':
                    return 'Add New Student';
                case 'addTeacher':
                    return 'Add New Teacher';
                case 'scheduleEvent':
                    return 'Schedule Event';
                case 'generateReport':
                    return 'Generate Report';
                default:
                    return '';
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{getModalTitle()}</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {renderFormFields()}

                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-medium shadow-lg"
                            >
                                {type === 'generateReport' ? 'Generate' : 'Add'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Students':
                return <Students darkMode={darkMode} />;
            case 'Teachers':
                return <Teachers darkMode={darkMode} />;
            case 'Attendance':
                return <AttendancePage darkMode={darkMode} />;
            case 'Exam Schedules':
                return <AdminExamSchedules darkMode={darkMode} />;
            case 'Courses':
                return <CoursesPage darkMode={darkMode} />;
            case 'Fees & Finance':
                return <FeesAndFinancePage darkMode={darkMode} />;
            case 'Timetable':
                return <TimetablePage darkMode={darkMode} />;
            case 'Settings':
                return <SettingsPage darkMode={darkMode} />;
            case 'Library':
                return <LibraryPage darkMode={darkMode} />;
            case 'Announcements':
                return <AnnouncementsPage darkMode={darkMode} />;
            case 'Reports':
                return <ReportsPage darkMode={darkMode} />;
            case 'Dashboard':
            default:
                return (
                    <>
                        <div className="mb-8">
                            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                                {getGreeting()}, {userName.split(' ')[0]} Admin!
                            </h1>
                            <p className="text-sm text-gray-500 flex items-center">
                                <span className="mr-2">Admin Dashboard</span>
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-shadow`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Students</h3>
                                    <Users className="w-5 h-5 text-purple-500" />
                                </div>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                                    {dashboardData.totalStudents}
                                </p>
                                <p className="text-sm text-gray-500">{dashboardData.studentsChange}</p>
                            </div>

                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-shadow`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Teachers</h3>
                                    <GraduationCap className="w-5 h-5 text-green-500" />
                                </div>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                                    {dashboardData.totalTeachers}
                                </p>
                                <p className="text-sm text-gray-500">{dashboardData.teachersChange}</p>
                            </div>

                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-shadow`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Revenue</h3>
                                    <IndianRupee className="w-5 h-5 text-blue-500" />
                                </div>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                                    ₹{dashboardData.revenue.toLocaleString('en-IN')}
                                </p>
                                <p className="text-sm text-green-500">{dashboardData.revenueChange}</p>
                            </div>

                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-shadow`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Attendance</h3>
                                    <TrendingUp className="w-5 h-5 text-orange-500" />
                                </div>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                                    {dashboardData.attendanceRate.toFixed(0)}%
                                </p>
                                <p className="text-sm text-gray-500">{dashboardData.attendanceChange}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className={`lg:col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                                    Recent Activities
                                </h3>
                                <div className="space-y-4">
                                    {recentActivities.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} hover:shadow-md transition-shadow`}
                                        >
                                            <div className="flex items-start space-x-4">
                                                <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                                                    <activity.icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        {activity.title}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                                                    <p className="text-xs text-gray-400 mt-2">{activity.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Recent Announcements
                                    </h3>
                                    <button
                                        onClick={() => setActiveTab('Announcements')}
                                        className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                                    >
                                        View All
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {recentAnnouncements.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">No announcements yet</p>
                                        </div>
                                    ) : (
                                        recentAnnouncements.map((announcement) => (
                                            <div
                                                key={announcement.id}
                                                className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} hover:shadow-md transition-shadow cursor-pointer`}
                                                onClick={() => setActiveTab('Announcements')}
                                            >
                                                <div className="flex items-start space-x-3">
                                                    <div className="p-2 rounded-lg bg-orange-100">
                                                        <Megaphone className="w-5 h-5 text-orange-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                                                            {announcement.title}
                                                        </p>
                                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                            {announcement.description}
                                                        </p>
                                                        <div className="flex items-center space-x-3 mt-2">
                                                            <span className="text-xs text-gray-400">
                                                                {new Date(announcement.publishDate).toLocaleDateString()}
                                                            </span>
                                                            <span className={`text-xs px-2 py-1 rounded-full ${announcement.targetAudience === 'All'
                                                                ? 'bg-blue-100 text-blue-600'
                                                                : announcement.targetAudience === 'Teachers'
                                                                    ? 'bg-green-100 text-green-600'
                                                                    : announcement.targetAudience === 'Students'
                                                                        ? 'bg-purple-100 text-purple-600'
                                                                        : 'bg-pink-100 text-pink-600'
                                                                }`}>
                                                                {announcement.targetAudience}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {}
            <aside className={`w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
                {}
                <div className={`px-6 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>School ERP</h1>
                            <p className="text-xs text-gray-500">Admin Portal</p>
                        </div>
                    </div>
                </div>

                {}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-1">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => setActiveTab(item.label)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === item.label
                                        ? 'bg-purple-50 text-purple-600'
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

            {}
            <main className="flex-1 flex flex-col overflow-hidden">
                {}
                <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-8 py-4`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Home className="w-4 h-4" />
                                <span>/</span>
                                <span className={darkMode ? 'text-white' : 'text-gray-900'}>{activeTab}</span>
                                <span>/</span>
                                <span className="text-purple-600">Admin</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {}
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
                                        } focus:outline-none focus:ring-2 focus:ring-purple-500 w-64`}
                                />
                            </div>

                            {}
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                                    className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <Bell className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                                    {notifications > 0 && (
                                        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                                            {notifications}
                                        </span>
                                    )}
                                </button>

                                {}
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
                                            <button onClick={() => { setActiveTab('Reports'); setShowNotificationPanel(false); }} className="text-xs text-purple-600 hover:text-purple-700 font-medium">
                                                View All Activity
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {}
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                            >
                                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
                            </button>

                            {}
                            <button
                                onClick={() => setActiveTab('Settings')}
                                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                            >
                                <Settings className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                            </button>
                        </div>
                    </div>
                </header>

                {}
                <div className="flex-1 overflow-y-auto p-8">
                    {renderContent()}
                </div>
            </main>

            {}
            {showModal && <Modal type={modalType} onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default AdminDashboard;
