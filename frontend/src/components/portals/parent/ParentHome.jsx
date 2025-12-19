import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import {
    GraduationCap,
    DollarSign,
    Calendar,
    Bell,
    TrendingUp,
    Award,
    CheckCircle,
    AlertCircle,
    Megaphone
} from 'lucide-react';
import {
    studentApi,
    attendanceApi,
    examApi,
    feeApi,
    announcementApi,
    parentApi
} from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

const ParentHome = () => {
    const { darkMode } = useOutletContext();
    const navigate = useNavigate();
    const location = useLocation();
    const { showSuccess, showError } = useToast();
    const userName = localStorage.getItem('userName') || 'Parent User';
    const userEmail = localStorage.getItem('userEmail') || '';

    const [parentData, setParentData] = useState(null);
    const [parentRecordExists, setParentRecordExists] = useState(true);

    const [dashboardData, setDashboardData] = useState({
        totalChildren: 0,
        averageAttendance: 0,
        pendingFees: 0,
        upcomingExams: 0,
        childrenDetails: [],
        recentActivities: [],
        upcomingEvents: []
    });

    const fetchDashboardData = async () => {
        try {
            const [parentsRes, studentsRes, attendanceRes, examsRes, feesRes, announcementsRes] = await Promise.all([
                parentApi.getAll(),
                studentApi.getAll(),
                attendanceApi.getAll(),
                examApi.getAll(),
                feeApi.getAll(),
                announcementApi.getAll()
            ]);

            const allParents = Array.isArray(parentsRes?.data?.data) ? parentsRes.data.data : [];
            const allStudents = Array.isArray(studentsRes?.data?.data) ? studentsRes.data.data : [];
            const allAttendance = Array.isArray(attendanceRes?.data?.data) ? attendanceRes.data.data : [];
            const allExams = Array.isArray(examsRes?.data?.data) ? examsRes.data.data : [];
            const allFees = Array.isArray(feesRes?.data?.data) ? feesRes.data.data : [];
            const allAnnouncements = Array.isArray(announcementsRes?.data?.data) ? announcementsRes.data.data : [];

            const currentParent = allParents.find(p => p.email?.toLowerCase() === userEmail?.toLowerCase());

            if (!currentParent) {
                setParentRecordExists(false);
                setDashboardData({
                    totalChildren: 0,
                    averageAttendance: 0,
                    pendingFees: 0,
                    upcomingExams: 0,
                    childrenDetails: [],
                    recentActivities: [],
                    upcomingEvents: []
                });
                return;
            }

            setParentRecordExists(true);
            setParentData(currentParent);

            const child = allStudents.find(s =>
                (s.id?.toString() === currentParent.studentId?.toString()) ||
                (s.parentEmail?.toLowerCase() === currentParent.email?.toLowerCase())
            );

            if (!child) {
                console.error('Student not found for studentId:', currentParent.studentId);
                setDashboardData({
                    totalChildren: 0,
                    averageAttendance: 0,
                    pendingFees: 0,
                    upcomingExams: 0,
                    childrenDetails: [],
                    recentActivities: [],
                    upcomingEvents: []
                });
                return;
            }

            const myChildren = [child];
            const today = new Date().toISOString().split('T')[0];

            let totalAttendance = 0;
            let totalPendingFees = 0;
            let upcomingExamsCount = 0;
            const childrenDetails = [];

            myChildren.forEach(student => {
                const studentAttendance = allAttendance.filter(a => a.studentId === student.id);
                const presentDays = studentAttendance.filter(a => a.status === 'Present').length;
                const totalDays = studentAttendance.length;
                const attendancePct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
                totalAttendance += attendancePct;

                const studentFees = allFees.filter(f => f.studentId === student.id);
                const pendingAmount = studentFees.reduce((sum, f) => sum + ((f.amount || 0) - (f.paidAmount || 0)), 0);
                totalPendingFees += pendingAmount;

                const upcomingExams = allExams.filter(e =>
                    e.class === student.class && new Date(e.examDate) >= new Date(today)
                );
                upcomingExamsCount += upcomingExams.length;

                const todayAttendance = studentAttendance.find(a => a.date === today);
                const attendanceStatus = todayAttendance ? todayAttendance.status : 'Not Marked';

                childrenDetails.push({
                    id: student.id,
                    name: student.name,
                    class: student.class,
                    attendancePct,
                    attendanceStatus,
                    pendingFees: pendingAmount,
                    upcomingExams: upcomingExams.slice(0, 3)
                });
            });

            const avgAttendance = myChildren.length > 0 ? Math.round(totalAttendance / myChildren.length) : 0;

            const recentActivities = allAnnouncements
                .filter(a =>
                    (a.targetAudience === 'Parents' || a.targetAudience === 'All') &&
                    new Date(a.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                )
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map(a => ({
                    id: a.id,
                    title: a.title,
                    description: a.description || a.message,
                    date: a.createdAt,
                    type: 'announcement'
                }));

            const upcomingEvents = allExams
                .filter(e =>
                    myChildren.some(c => c.class === e.class) &&
                    new Date(e.examDate) >= new Date(today)
                )
                .sort((a, b) => new Date(a.examDate) - new Date(b.examDate))
                .slice(0, 5)
                .map(e => ({
                    id: e.id,
                    title: e.examName,
                    subject: e.subject,
                    date: e.examDate,
                    class: e.class,
                    type: 'exam'
                }));

            setDashboardData({
                totalChildren: myChildren.length,
                averageAttendance: avgAttendance,
                pendingFees: totalPendingFees,
                upcomingExams: upcomingExamsCount,
                childrenDetails,
                recentActivities,
                upcomingEvents
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [userEmail]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const paymentStatus = params.get('payment');
        const feeId = params.get('feeId');

        if (paymentStatus === 'success' && feeId) {
            const processPayment = async () => {
                try {
                    const feesRes = await feeApi.getAll();
                    const allFees = Array.isArray(feesRes?.data?.data) ? feesRes.data.data : [];
                    const pending = allFees.find(f => f.id === feeId);

                    if (pending) {
                        await feeApi.update(feeId, {
                            paidAmount: pending.amount,
                            paymentDate: new Date().toISOString(),
                            status: 'paid'
                        });
                    }

                    showSuccess(`Payment of ₹${pending.amount.toLocaleString()} received successfully!`);
                    fetchDashboardData();
                } catch (err) {
                    console.error('Error updating payment record:', err);
                    showError('Payment successful but failed to update record. Please contact admin.');
                } finally {
                    navigate('/parent/dashboard', { replace: true });
                }
            };

            processPayment();
        } else if (paymentStatus === 'cancelled') {
            showError('Payment was cancelled.');
            navigate('/parent/dashboard', { replace: true });
        }
    }, [location.search, userEmail, navigate, showSuccess, showError]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {getGreeting()}, {userName.split(' ')[0]}!
                </h1>
            </div>

            {!parentRecordExists && (
                <div className={`mb-8 ${darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border rounded-xl p-6`}>
                    <div className="flex items-start space-x-4">
                        <AlertCircle className={`w-8 h-8 ${darkMode ? 'text-red-400' : 'text-red-600'} flex-shrink-0 mt-1`} />
                        <div className="flex-1">
                            <h3 className={`text-lg font-bold ${darkMode ? 'text-red-400' : 'text-red-900'} mb-2`}>
                                Parent Account Not Set Up
                            </h3>
                            <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-800'} mb-4`}>
                                Your account (<strong>{userEmail}</strong>) exists but is not linked to any student record.
                            </p>
                            <div className={`${darkMode ? 'bg-red-900/30' : 'bg-red-100'} rounded-lg p-4 mb-4`}>
                                <p className={`text-sm font-semibold ${darkMode ? 'text-red-300' : 'text-red-900'} mb-2`}>
                                    What you need to do:
                                </p>
                                <ol className={`list-decimal list-inside space-y-2 text-sm ${darkMode ? 'text-red-200' : 'text-red-800'}`}>
                                    <li>Contact your school administrator</li>
                                    <li>Ask them to create a <strong>Parent record</strong> for your email in the Admin Portal</li>
                                    <li>The admin needs to link your account to your child's student record</li>
                                    <li>Once linked, refresh this page to see your child's information</li>
                                </ol>
                            </div>
                            <div className={`text-xs ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                                <p className="font-semibold mb-1">For Administrator:</p>
                                <p>Go to Admin Portal → Parents → Add New Parent</p>
                                <p>Email: {userEmail}</p>
                                <p>Link to Student ID</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {dashboardData.childrenDetails.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Class</h3>
                            <GraduationCap className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dashboardData.childrenDetails[0].class}</p>
                        <p className="text-sm text-gray-500 mt-2">{dashboardData.childrenDetails[0].name}</p>
                    </div>

                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Attendance</h3>
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dashboardData.childrenDetails[0].attendancePct}%</p>
                        <p className={`text-sm mt-2 ${dashboardData.childrenDetails[0].attendanceStatus === 'Present' ? 'text-green-500' : dashboardData.childrenDetails[0].attendanceStatus === 'Absent' ? 'text-red-500' : 'text-gray-500'}`}>
                            Today: {dashboardData.childrenDetails[0].attendanceStatus}
                        </p>
                    </div>

                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pending Fees</h3>
                            <DollarSign className="w-5 h-5 text-orange-500" />
                        </div>
                        <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{dashboardData.childrenDetails[0].pendingFees}</p>
                        <p className={`text-sm mt-2 ${dashboardData.childrenDetails[0].pendingFees > 0 ? 'text-orange-500' : 'text-green-500'}`}>
                            {dashboardData.childrenDetails[0].pendingFees > 0 ? 'Due payment' : 'All clear'}
                        </p>
                    </div>

                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Upcoming Exams</h3>
                            <Award className="w-5 h-5 text-purple-500" />
                        </div>
                        <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dashboardData.childrenDetails[0].upcomingExams?.length || 0}</p>
                        <p className="text-sm text-gray-500 mt-2">This month</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Children Status</h2>
                        <GraduationCap className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="space-y-4">
                        {dashboardData.childrenDetails.length > 0 ? (
                            dashboardData.childrenDetails.map((child) => (
                                <div key={child.id} className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{child.name}</h3>
                                            <p className="text-sm text-gray-500">{child.class}</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${child.attendanceStatus === 'Present' ? 'bg-green-100 text-green-700' :
                                            child.attendanceStatus === 'Absent' ? 'bg-red-100 text-red-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {child.attendanceStatus}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="text-gray-500">Attendance:</span>
                                            <span className={`ml-2 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{child.attendancePct}%</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Pending Fees:</span>
                                            <span className={`ml-2 font-semibold ${child.pendingFees > 0 ? 'text-orange-600' : 'text-green-600'}`}>₹{child.pendingFees}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <AlertCircle className={`w-12 h-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mx-auto mb-3`} />
                                <p className="text-gray-500 text-sm">No student records found</p>
                                <p className="text-gray-400 text-xs mt-1">Please contact administration</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activities</h2>
                        <Bell className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="space-y-4">
                        {dashboardData.recentActivities.length > 0 ? (
                            dashboardData.recentActivities.map((activity) => (
                                <div key={activity.id} className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                                    <div className="flex items-start">
                                        <Megaphone className="w-4 h-4 text-purple-500 mt-1 mr-3 flex-shrink-0" />
                                        <div className="flex-1">
                                            <h3 className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{activity.title}</h3>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{activity.description}</p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                {new Date(activity.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-8 text-sm">No recent activities</p>
                        )}
                    </div>
                </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Upcoming Exams</h2>
                    <Calendar className="w-5 h-5 text-orange-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dashboardData.upcomingEvents.length > 0 ? (
                        dashboardData.upcomingEvents.map((event) => (
                            <div key={event.id} className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex flex-col items-center justify-center text-orange-600 mr-3">
                                        <span className="text-xs font-bold">{new Date(event.date).toLocaleDateString('en', { month: 'short' })}</span>
                                        <span className="text-lg font-bold">{new Date(event.date).getDate()}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{event.title}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{event.subject} • {event.class}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-8">
                            <CheckCircle className={`w-12 h-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mx-auto mb-3`} />
                            <p className="text-gray-500 text-sm">No upcoming exams scheduled</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParentHome;
