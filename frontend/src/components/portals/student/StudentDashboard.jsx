import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AttendancePage from './AttendancePage';
import FeePage from './FeePage';
import ExamsAndGrades from './ExamsAndGrades';

import CoursesPage from './CoursesPage';
import TimetablePage from './TimetablePage';
import LibraryPage from './LibraryPage';
import SettingsPage from './SettingsPage';
import AnnouncementsPage from './AnnouncementsPage';
import ReportsPage from './ReportsPage';
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
    TrendingUp,
    BookOpenCheck,
    Library,
    Megaphone,
    FileText,
    LogOut
} from 'lucide-react';
import { calculateAttendancePercentage, subscribeToUpdates as subscribeToAttendance } from '../../../utils/attendanceStore';
import { getSubmissionsByStudent, getStudentFinalMarks, subscribeToAcademicUpdates } from '../../../utils/academicStore';
import { getAllStudents } from '../../../utils/studentStore';

const StudentPortal = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'Mike Wilson';
    const userRole = localStorage.getItem('userRole') || 'Student';
    const userEmail = localStorage.getItem('userEmail') || '';
    const userId = localStorage.getItem('userId') || '';

    
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    
    const [dashboardData, setDashboardData] = useState({
        attendance: 0,
        currentGrade: '-',
        gradePerformance: 'Loading...',
        assignments: {
            pending: 0,
            total: 0
        },
        libraryBooks: {
            issued: 0,
            total: 0
        },
        upcomingAssignments: [],
        recentGrades: []
    });

    
    const menuItems = [
        { icon: Home, label: 'Dashboard', active: true },
        { icon: Calendar, label: 'Attendance' },
        { icon: GraduationCap, label: 'Exams & Grade' },
        { icon: BookOpen, label: 'Courses' },
        { icon: DollarSign, label: 'Fees & Finance' },
        { icon: Clock, label: 'Timetable' },
        { icon: BookMarked, label: 'Library' },
        { icon: Megaphone, label: 'Announcements' },
        { icon: FileText, label: 'Reports' },
        { icon: Settings, label: 'Settings' },
        

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
        const fetchDashboardData = () => {
            
            const students = getAllStudents();
            const student = students.find(s => s.email === userEmail);

            if (!student) {
                console.log('Student not found for email:', userEmail);
                return;
            }

            const studentId = student.id;
            console.log('Dashboard loading for student:', student.name, 'ID:', studentId);

            
            const attendancePercentage = calculateAttendancePercentage(studentId);

            
            const submissions = getSubmissionsByStudent(studentId);
            const finalMarks = getStudentFinalMarks(studentId);

            console.log('Attendance:', attendancePercentage);
            console.log('Submissions:', submissions.length);
            console.log('Final Marks:', finalMarks.length);

            
            const pendingSubmissions = submissions.filter(s => s.status !== 'graded');

            
            const recentGrades = finalMarks.slice(0, 2).map((mark, idx) => ({
                id: idx + 1,
                subject: mark.courseName,
                assessment: 'Course Total',
                grade: mark.finalTotal >= 90 ? 'A' : mark.finalTotal >= 80 ? 'B+' : mark.finalTotal >= 70 ? 'B' : 'C',
                color: mark.finalTotal >= 90 ? 'green' : 'blue'
            }));

            
            const avgGrade = finalMarks.length > 0
                ? finalMarks.reduce((sum, m) => sum + m.finalTotal, 0) / finalMarks.length
                : 0;
            const overallGrade = avgGrade >= 90 ? 'A' : avgGrade >= 80 ? 'B+' : avgGrade >= 70 ? 'B' : avgGrade >= 60 ? 'C' : 'D';

            setDashboardData({
                attendance: attendancePercentage,
                currentGrade: overallGrade,
                gradePerformance: finalMarks.length > 0 ? `Average: ${avgGrade.toFixed(1)}%` : 'No grades yet',
                assignments: {
                    pending: pendingSubmissions.length,
                    total: submissions.length
                },
                libraryBooks: {
                    issued: 0, 
                    total: 0
                },
                upcomingAssignments: [], 
                recentGrades: recentGrades
            });
        };

        
        if (userEmail) {
            fetchDashboardData();
        }

        
        const unsubscribeAttendance = subscribeToAttendance(fetchDashboardData);
        const unsubscribeAcademic = subscribeToAcademicUpdates(fetchDashboardData);

        return () => {
            unsubscribeAttendance();
            unsubscribeAcademic();
        };
    }, [userEmail]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    
    const renderContent = () => {
        if (activeTab === 'Attendance') {
            return <AttendancePage />;
        }

        if (activeTab === 'Fees & Finance') {
            return <FeePage />;
        }

        if (activeTab === 'Exams & Grade') {
            return <ExamsAndGrades darkMode={darkMode} />;
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

        if (activeTab === 'Announcements') {
            return <AnnouncementsPage darkMode={darkMode} />;
        }

        if (activeTab === 'Reports') {
            return <ReportsPage darkMode={darkMode} />;
        }

        if (activeTab === 'Settings') {
            return <SettingsPage darkMode={darkMode} />;
        }
        
        
        
        
        return (
            <div className="flex-1 overflow-y-auto p-8">
                {}
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        {getGreeting()}, {userName.split(' ')[0]}!
                    </h1>
                    <p className="text-sm text-gray-500">Student Dashboard</p>
                </div>

                {}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {}
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

                    {}
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

                    {}
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

                    {}
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

                {}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {}
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

                    {}
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
            {}
            <aside className={`w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
                {}
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

                {}
                <nav className="flex-1 p-4 overflow-y-auto">
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
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 w-64`}
                                />
                            </div>

                            {}
                            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <Bell className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                                {notifications > 0 && (
                                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                                        {notifications}
                                    </span>
                                )}
                            </button>

                            {}
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

                            {}
                            <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                                <Settings className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                            </button>
                        </div>
                    </div>
                </header>

                {}
                {renderContent()}
            </main>
        </div>
    );
};

export default StudentPortal;
