import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Home,
    User,
    GraduationCap,
    DollarSign,
    Calendar,
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
    BookMarked,
    Megaphone,
    LogOut,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';

import AcademicProgressPage from './AcademicProgressPage';
import AttendancePage from './AttendancePage';
import FeeManagementPage from './FeeManagementPage';
import TimetablePage from './TimetablePage';
import SettingsPage from './SettingsPage';
import LibraryPage from './LibraryPage';
import AnnouncementsPage from './AnnouncementsPage';
import {
    studentApi,
    attendanceApi,
    resultApi,
    examApi,
    feeApi,
    courseApi,
    timetableApi,
    announcementApi
} from '../../../services/api';
import { getCheckoutSession } from '../../../utils/stripeConfig';
import { useToast } from '../../../context/ToastContext';

const ParentDashboard = () => {
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const userName = localStorage.getItem('userName') || 'Parent User';
    const userRole = localStorage.getItem('userRole') || 'Parent';
    const userEmail = localStorage.getItem('userEmail') || '';

    const [activeTab, setActiveTab] = useState('Dashboard');
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(2);
    const [searchQuery, setSearchQuery] = useState('');

    const [dashboardData, setDashboardData] = useState({
        children: [],
        feeStatus: {
            total: 0,
            paid: 0,
            pending: 0,
            nextDue: 'N/A'
        }
    });

    const menuItems = [
        { icon: Home, label: 'Dashboard', active: true },

        { icon: GraduationCap, label: 'Academic Progress' },
        { icon: Calendar, label: 'Attendance' },
        { icon: DollarSign, label: 'Fee Management' },
        { icon: Clock, label: 'Timetable' },
        { icon: BookMarked, label: 'Library' },
        { icon: Megaphone, label: 'Announcements' },
        { icon: Settings, label: 'Settings' }

    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!userEmail) return;

            try {

                const studentsRes = await studentApi.getAll();
                const allStudents = studentsRes.data || [];

                const myChildren = allStudents.filter(s => s.parentEmail === userEmail || s.email === userEmail);

                if (myChildren.length === 0) {
                    setDashboardData({
                        children: [],
                        feeStatus: { total: 0, paid: 0, pending: 0, nextDue: 'N/A' }
                    });
                    return;
                }

                const today = new Date().toISOString().split('T')[0];
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const currentDayName = days[new Date().getDay()];

                const [
                    attendanceRes,
                    examsRes,
                    feesRes,
                    coursesRes,
                    timetableRes,
                    announcementsRes,
                    resultsRes
                ] = await Promise.all([
                    attendanceApi.getAll(),
                    examApi.getAll(),
                    feeApi.getAll(),
                    courseApi.getAll(),
                    timetableApi.getClassTimetables(),
                    announcementApi.getAll(),
                    resultApi.getAll()
                ]);

                const allAttendance = attendanceRes.data || [];
                const allExams = examsRes.data || [];
                const allFees = feesRes.data || [];
                const allCourses = coursesRes.data || [];
                const allTimetables = timetableRes.data || [];
                const allAnnouncements = announcementsRes.data || [];
                const allResults = resultsRes.data || [];

                const childrenData = myChildren.map(student => {
                    const studentId = student.id;

                    const studentAttendance = allAttendance.filter(a => a.studentId === studentId);
                    const totalDays = studentAttendance.length;
                    const presentDays = studentAttendance.filter(a => a.status === 'Present').length;
                    const attendancePct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

                    const todaysAttendanceRecord = studentAttendance.find(a => a.date === today);
                    const attendanceStatus = todaysAttendanceRecord ? todaysAttendanceRecord.status : 'Not Marked';

                    const studentResults = allResults.filter(r => r.studentId === studentId);
                    const avgGradeValue = studentResults.length > 0
                        ? studentResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / studentResults.length
                        : 0;
                    const currentGrade = avgGradeValue >= 90 ? 'A' : avgGradeValue >= 80 ? 'B+' : avgGradeValue >= 70 ? 'B' : avgGradeValue >= 60 ? 'C' : 'D';

                    const upcomingExams = allExams.filter(e =>
                        e.class === student.class && new Date(e.examDate) >= new Date(today)
                    ).sort((a, b) => new Date(a.examDate) - new Date(b.examDate));

                    const studentFees = allFees.filter(f => f.studentId === studentId);
                    const pendingFeesAmount = studentFees.reduce((sum, f) =>
                        sum + (f.amount - (f.paidAmount || 0)), 0);
                    const feeStatus = pendingFeesAmount <= 0 ? 'Paid' : 'Due';

                    const studentCourses = allCourses.filter(c => c.class === student.class);
                    let assignmentsPending = 0;
                    let assignmentsSubmitted = 0;

                    studentCourses.forEach(course => {
                        const courseAssignments = course.assignments || [];
                        courseAssignments.forEach(assignment => {
                            const isSubmitted = assignment.submissions && assignment.submissions.some(sub => sub.studentId === studentId);
                            if (isSubmitted) assignmentsSubmitted++;
                            else assignmentsPending++;
                        });
                    });

                    const classTimetable = allTimetables.find(t => t.className === student.class);
                    const todaysSchedule = classTimetable && classTimetable.schedule ? (classTimetable.schedule[currentDayName] || []) : [];

                    const studentAnnouncements = allAnnouncements.filter(a =>
                        (a.targetAudience === 'Parents' || a.targetAudience === 'Students' || a.targetAudience === 'All') &&
                        (!a.classes || a.classes.length === 0 || a.classes.includes(student.class))
                    ).slice(0, 3);

                    return {
                        id: student.id,
                        name: student.name,
                        class: student.class,
                        attendancePct,
                        currentGrade,
                        pendingFees: pendingFeesAmount,
                        upcomingTestsCount: upcomingExams.length,
                        attendanceStatus,
                        todaysSchedule,
                        upcomingExamsList: upcomingExams.slice(0, 3),
                        assignmentsPending,
                        assignmentsSubmitted,
                        feeStatus,
                        announcements: studentAnnouncements
                    };
                });

                const myChildrenFees = allFees.filter(f => myChildren.some(c => c.id === f.studentId));
                const totalFees = myChildrenFees.reduce((sum, f) => sum + f.amount, 0);
                const paidFees = myChildrenFees.reduce((sum, f) => sum + (f.paidAmount || 0), 0);
                const pendingFees = myChildrenFees.reduce((sum, f) => sum + (f.amount - (f.paidAmount || 0)), 0);

                setDashboardData({
                    children: childrenData,
                    feeStatus: {
                        total: totalFees,
                        paid: paidFees,
                        pending: pendingFees,
                        nextDue: pendingFees > 0 ? 'Due Now' : 'N/A'
                    }
                });

            } catch (error) {
                console.error('Failed to load parent dashboard data', error);
                showError('Failed to load dashboard data');
            }
        };

        fetchDashboardData();
    }, [userEmail]);

    useEffect(() => {
        const handlePaymentReturn = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const paymentStatus = urlParams.get('payment');
            const sessionId = urlParams.get('session_id');

            if (paymentStatus === 'success' && sessionId) {
                const processedSessions = JSON.parse(sessionStorage.getItem('processedSessions') || '[]');
                if (processedSessions.includes(sessionId)) {
                    window.history.replaceState({}, document.title, window.location.pathname);
                    return;
                }

                const pendingPaymentStr = sessionStorage.getItem('pendingPayment');
                if (pendingPaymentStr) {
                    try {
                        const pendingPayment = JSON.parse(pendingPaymentStr);

                        const session = await getCheckoutSession(sessionId);

                        if (session.status === 'paid') {
                            await feeApi.update(pendingPayment.feeId, {
                                status: 'Paid',
                                paidAmount: pendingPayment.amount,
                                paymentMethod: 'Stripe (Card)',
                                transactionId: session.paymentIntentId || sessionId,
                                paidBy: 'Parent',
                                stripeSessionId: sessionId,
                            });

                            processedSessions.push(sessionId);
                            sessionStorage.setItem('processedSessions', JSON.stringify(processedSessions));
                            sessionStorage.removeItem('pendingPayment');
                            showSuccess('Payment successful! Your fee has been updated.');
                            setActiveTab('Fee Management');
                        }
                    } catch (err) {
                        console.error('Error processing payment return:', err);
                        showError('Error processing payment: ' + err.message);
                    }
                }
                window.history.replaceState({}, document.title, window.location.pathname);
            } else if (paymentStatus === 'cancelled') {
                sessionStorage.removeItem('pendingPayment');
                showError('Payment was cancelled.');
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        };

        handlePaymentReturn();
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const renderContent = () => {

        if (activeTab === 'Academic Progress') return <AcademicProgressPage darkMode={darkMode} />;
        if (activeTab === 'Attendance') return <AttendancePage darkMode={darkMode} />;
        if (activeTab === 'Fee Management') return <FeeManagementPage darkMode={darkMode} />;
        if (activeTab === 'Timetable') return <TimetablePage darkMode={darkMode} />;
        if (activeTab === 'Settings') return <SettingsPage darkMode={darkMode} />;
        if (activeTab === 'Library') return <LibraryPage darkMode={darkMode} />;
        if (activeTab === 'Announcements') return <AnnouncementsPage darkMode={darkMode} />;

        return (
            <>
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        {getGreeting()}, {userName.split(' ')[0]}!
                    </h1>
                    <p className="text-sm text-gray-500">Parent Dashboard - Live Updates</p>
                </div>

                {dashboardData.children.map((child) => (
                    <div key={child.id} className="mb-12 border-b pb-8 last:border-0">
                        {}
                        {dashboardData.children.length > 1 && (
                            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>{child.name}'s Dashboard</h2>
                        )}

                        {}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {}
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Attendance</h3>
                                    <TrendingUp className="w-5 h-5 text-gray-400" />
                                </div>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{child.attendancePct}%</p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full" style={{ width: `${child.attendancePct}%` }}></div>
                                </div>
                            </div>

                            {}
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Current Grade</h3>
                                    <Award className="w-5 h-5 text-gray-400" />
                                </div>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{child.currentGrade}</p>
                                <p className="text-sm text-green-500 mt-2">Excellent performance</p>
                            </div>

                            {}
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pending Fees</h3>
                                    <DollarSign className="w-5 h-5 text-gray-400" />
                                </div>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{child.pendingFees}</p>
                                <p className={`text-sm mt-2 ${child.pendingFees === 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {child.pendingFees === 0 ? 'All paid up!' : 'Dues Pending'}
                                </p>
                            </div>

                            {}
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Upcoming Tests</h3>
                                    <BookOpen className="w-5 h-5 text-gray-400" />
                                </div>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{child.upcomingTestsCount}</p>
                                <p className="text-sm text-gray-500 mt-2">This week</p>
                            </div>
                        </div>

                        {}
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                            <div className="p-6 border-b border-gray-200">
                                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Student Daily Status</h3>
                                <p className="text-sm text-gray-500">Real-time updates for {new Date().toLocaleDateString()}</p>
                            </div>
                            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {}
                                <div className="space-y-6">
                                    {}
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                                            {child.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{child.name}</h4>
                                            <p className="text-gray-500">{child.class}</p>
                                        </div>
                                    </div>

                                    {}
                                    <div className={`p-4 rounded-lg flex items-center justify-between ${child.attendanceStatus === 'Present' ? 'bg-green-50 border border-green-200' :
                                        child.attendanceStatus === 'Absent' ? 'bg-red-50 border border-red-200' :
                                            child.attendanceStatus === 'Late' ? 'bg-yellow-50 border border-yellow-200' :
                                                'bg-gray-50 border border-gray-200'
                                        }`}>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Today's Attendance</p>
                                            <p className={`text-lg font-bold ${child.attendanceStatus === 'Present' ? 'text-green-700' :
                                                child.attendanceStatus === 'Absent' ? 'text-red-700' :
                                                    child.attendanceStatus === 'Late' ? 'text-yellow-700' :
                                                        'text-gray-700'
                                                }`}>
                                                {child.attendanceStatus}
                                            </p>
                                        </div>
                                        {child.attendanceStatus === 'Present' && <CheckCircle className="w-8 h-8 text-green-500" />}
                                        {child.attendanceStatus === 'Absent' && <XCircle className="w-8 h-8 text-red-500" />}
                                        {child.attendanceStatus === 'Late' && <AlertCircle className="w-8 h-8 text-yellow-500" />}
                                        {child.attendanceStatus === 'Not Marked' && <Clock className="w-8 h-8 text-gray-400" />}
                                    </div>

                                    {}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                                            <p className="text-sm text-gray-600">Pending Assignments</p>
                                            <p className="text-2xl font-bold text-orange-600">{child.assignmentsPending}</p>
                                        </div>
                                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                            <p className="text-sm text-gray-600">Submitted Assignments</p>
                                            <p className="text-2xl font-bold text-blue-600">{child.assignmentsSubmitted}</p>
                                        </div>
                                    </div>

                                    {}
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <span className="text-gray-700 font-medium">Fee Status</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${child.feeStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {child.feeStatus}
                                        </span>
                                    </div>
                                </div>

                                {}
                                <div className="space-y-6">
                                    {}
                                    <div>
                                        <h4 className={`text-sm font-bold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Upcoming Exams</h4>
                                        {child.upcomingExamsList.length > 0 ? (
                                            <div className="space-y-3">
                                                {child.upcomingExamsList.map(exam => (
                                                    <div key={exam.id} className="flex items-center bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
                                                        <div className="w-12 h-12 bg-red-100 rounded-lg flex flex-col items-center justify-center text-red-600 mr-4">
                                                            <span className="text-xs font-bold">{new Date(exam.examDate).toLocaleDateString(undefined, { month: 'short' })}</span>
                                                            <span className="text-lg font-bold">{new Date(exam.examDate).getDate()}</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900">{exam.subject}</p>
                                                            <p className="text-xs text-gray-500">{exam.examName} • {exam.startTime}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 italic p-2">No upcoming exams this week.</p>
                                        )}
                                    </div>

                                    {}
                                    <div>
                                        <h4 className={`text-sm font-bold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Today's Schedule</h4>
                                        {child.todaysSchedule.length > 0 ? (
                                            <div className="space-y-2">
                                                {child.todaysSchedule.sort((a, b) => a.time.localeCompare(b.time)).map((slot, idx) => (
                                                    <div key={idx} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded">
                                                        <span className="font-medium text-gray-700 w-20">{slot.time}</span>
                                                        <span className="flex-1 font-semibold text-gray-900">{slot.subject}</span>
                                                        <span className="text-gray-500 text-xs">{slot.room}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 italic p-2">No classes scheduled for today.</p>
                                        )}
                                    </div>

                                    {}
                                    <div>
                                        <h4 className={`text-sm font-bold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Latest Announcements</h4>
                                        {child.announcements.length > 0 ? (
                                            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                                                <div className="flex items-start">
                                                    <Megaphone className="w-4 h-4 text-indigo-600 mt-1 mr-2 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-bold text-indigo-900">{child.announcements[0].title}</p>
                                                        <p className="text-xs text-indigo-700 mt-1 line-clamp-2">{child.announcements[0].description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">No new announcements.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
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

                {}
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
