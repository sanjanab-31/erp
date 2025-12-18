import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentsPage from './StudentsPage';
import AttendancePage from './AttendancePage';
import ExamsAndGradesPage from './ExamsAndGradesPage';
import CoursesPage from './CoursesPage';
import TimetablePage from './TimetablePage';
import LibraryPage from './LibraryPage';
import ReportsPage from './ReportsPage';
import SettingsPage from './SettingsPage';
import AnnouncementsPage from './AnnouncementsPage';
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
    Search,
    Moon,
    Sun,
    TrendingUp,
    ClipboardList,
    UserCheck,
    LogOut,
    Megaphone
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

    const [activeTab, setActiveTab] = useState('Dashboard');
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(3);
    const [searchQuery, setSearchQuery] = useState('');

    const [dashboardData, setDashboardData] = useState({
        totalClasses: 0,
        totalStudents: 0,
        pendingAssignments: 0,
        upcomingClasses: 0,
        todayClasses: [],
        recentSubmissions: []
    });

    const menuItems = [
        { icon: Home, label: 'Dashboard' },
        { icon: Users, label: 'Students' },
        { icon: UserCheck, label: 'Attendance' },
        { icon: GraduationCap, label: 'Exams & Grades' },
        { icon: BookOpen, label: 'Courses' },
        { icon: Clock, label: 'Timetable' },
        { icon: BookMarked, label: 'Library' },
        { icon: Megaphone, label: 'Announcements' },
        { icon: FileText, label: 'Reports' },
        { icon: Settings, label: 'Settings' }
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [studentsRes, teachersRes, coursesRes, timetablesRes] = await Promise.all([
                    studentApi.getAll(),
                    teacherApi.getAll(),
                    courseApi.getAll(),
                    timetableApi.getTeacherTimetables()
                ]);

                const allStudentsData = studentsRes.data?.data;
                const allTeachersData = teachersRes.data?.data;
                const allCoursesData = coursesRes.data?.data;
                const allTimetablesData = timetablesRes.data?.data;

                const allStudents = Array.isArray(allStudentsData) ? allStudentsData : [];
                const allTeachers = Array.isArray(allTeachersData) ? allTeachersData : [];
                const allCourses = Array.isArray(allCoursesData) ? allCoursesData : [];
                const allTimetables = Array.isArray(allTimetablesData) ? allTimetablesData : [];

                const teacherObj = allTeachers.find(t => t.email === userEmail);
                let teacherId = userEmail;
                if (teacherObj) {
                    teacherId = teacherObj.id;
                }

                const teacherCourses = allCourses.filter(c => c.teacherId === teacherId || c.teacher === teacherObj?.name);

                let todayClassesData = [];

                if (teacherObj) {
                    const teacherTimetable = allTimetables.find(t => t.teacherId === teacherObj.id || t.teacherName === teacherObj.name);

                    if (teacherTimetable && teacherTimetable.schedule) {
                        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        const currentDay = days[new Date().getDay()];

                        const scheduleArray = Array.isArray(teacherTimetable.schedule)
                            ? teacherTimetable.schedule
                            : Object.entries(teacherTimetable.schedule).flatMap(([day, classes]) => classes.map(c => ({ ...c, day })));

                        todayClassesData = scheduleArray
                            .filter(s => s.day === currentDay)
                            .sort((a, b) => {
                                const timeA = parseInt((a.time || '0:0').split('-')[0].replace(':', ''));
                                const timeB = parseInt((b.time || '0:0').split('-')[0].replace(':', ''));
                                return timeA - timeB;
                            })
                            .map((s, idx) => ({
                                id: idx,
                                subject: s.subject,
                                class: s.className || teacherObj.subject || 'Class',
                                time: s.time,
                                room: s.room
                            }));
                    }
                }

                const teacherClasses = [...new Set(teacherCourses.map(c => c.class))];
                const myStudents = allStudents.filter(s => teacherClasses.includes(s.class));

                let totalPendingSubmissions = 0;
                const recentSubs = [];

                teacherCourses.forEach(course => {
                    const assignments = course.assignments || [];
                    assignments.forEach(assignment => {
                        const submissions = assignment.submissions || [];

                        const pending = submissions.filter(s => s.status !== 'graded');
                        totalPendingSubmissions += pending.length;

                        submissions.forEach(sub => {
                            recentSubs.push({
                                id: sub.id,
                                student: sub.studentName,
                                assignment: assignment.title,
                                subject: course.courseName,
                                status: sub.status || 'pending',
                                date: new Date(sub.submittedAt || sub.createdAt)
                            });
                        });
                    });
                });

                recentSubs.sort((a, b) => b.date - a.date);

                setDashboardData({
                    totalClasses: teacherCourses.length,
                    totalStudents: myStudents.length > 0 ? myStudents.length : allStudents.length,
                    pendingAssignments: totalPendingSubmissions,
                    upcomingClasses: todayClassesData.length,
                    todayClasses: todayClassesData,
                    recentSubmissions: recentSubs.slice(0, 5)
                });
            } catch (error) {
                console.error("Failed to load teacher dashboard", error);
            }
        };

        fetchDashboardData();
    }, [userEmail]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

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

        if (activeTab === 'Library') {
            return <LibraryPage darkMode={darkMode} />;
        }

        if (activeTab === 'Reports') {
            return <ReportsPage darkMode={darkMode} />;
        }

        if (activeTab === 'Settings') {
            return <SettingsPage darkMode={darkMode} />;
        }

        if (activeTab === 'Announcements') {
            return <AnnouncementsPage darkMode={darkMode} />;
        }

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
                <div className="px-6 py-3 border-b border-gray-200">
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

                { }
                {renderContent()}
            </main>
        </div>
    );
};

export default TeacherDashboard;

