import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    BookOpen,
    Users,
    Clock,
    FileText,
    TrendingUp,
    Calendar
} from 'lucide-react';
import {
    studentApi,
    teacherApi,
    courseApi,
    timetableApi,
    assignmentApi
} from '../../../services/api';

const TeacherHome = () => {
    const { darkMode } = useOutletContext();
    const userName = localStorage.getItem('userName') || 'Sarah Johnson';

    const [dashboardData, setDashboardData] = useState({
        totalClasses: 0,
        totalStudents: 0,
        pendingAssignments: 0,
        upcomingClasses: 0,
        todayClasses: [],
        recentSubmissions: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const userEmail = localStorage.getItem('userEmail');
                const [studentsRes, teachersRes, coursesRes, timetablesRes, assignmentsRes] = await Promise.all([
                    studentApi.getAll(),
                    teacherApi.getAll(),
                    courseApi.getAll(),
                    timetableApi.getTeacherTimetables(),
                    assignmentApi.getAll()
                ]);
                
                console.log('Dashboard API Status:');
                console.log('Students loaded:', studentsRes?.data?.data?.length || 0);
                console.log('Teachers loaded:', teachersRes?.data?.data?.length || 0);
                console.log('Courses loaded:', coursesRes?.data?.data?.length || 0);
                console.log('Timetables loaded:', timetablesRes?.data?.data?.length || 0);
                console.log('Assignments loaded:', assignmentsRes?.data?.data?.length || 0);

                const totalStudents = studentsRes?.data?.data?.length || 0;
                const totalCourses = coursesRes?.data?.data?.length || 0;

                // Get today's day name
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const today = days[new Date().getDay()];

                // Find teacher's timetable
                const allTimetables = Array.isArray(timetablesRes?.data?.data) 
                    ? timetablesRes.data.data 
                    : (Array.isArray(timetablesRes?.data) ? timetablesRes.data : []);
                
                const allTeachers = Array.isArray(teachersRes?.data?.data) 
                    ? teachersRes.data.data 
                    : (Array.isArray(teachersRes?.data) ? teachersRes.data : []);
                
                const teacherData = allTeachers.find(t => t.email === userEmail);
                const teacherTimetable = allTimetables.find(t => 
                    t.teacherId === teacherData?.id || t.teacherName === teacherData?.name
                );

                // Extract today's classes
                let todayClasses = [];
                if (teacherTimetable && teacherTimetable.schedule) {
                    const schedule = teacherTimetable.schedule;
                    
                    if (Array.isArray(schedule)) {
                        todayClasses = schedule
                            .filter(s => s.day === today)
                            .map((s, idx) => ({
                                id: idx,
                                subject: s.subject || 'Class',
                                class: s.className || s.class || 'Class',
                                time: s.time || '',
                                room: s.room || s.venue || 'TBA'
                            }));
                    } else if (typeof schedule === 'object') {
                        const daySchedule = schedule[today] || [];
                        todayClasses = daySchedule.map((s, idx) => ({
                            id: idx,
                            subject: s.subject || 'Class',
                            class: s.className || s.class || 'Class',
                            time: s.time || '',
                            room: s.room || s.venue || 'TBA'
                        }));
                    }
                }

                // Sort by time
                todayClasses.sort((a, b) => {
                    const timeA = a.time.split('-')[0].replace(':', '');
                    const timeB = b.time.split('-')[0].replace(':', '');
                    return parseInt(timeA) - parseInt(timeB);
                });

                // Get recent submissions
                const allAssignments = Array.isArray(assignmentsRes?.data?.data) 
                    ? assignmentsRes.data.data 
                    : (Array.isArray(assignmentsRes?.data) ? assignmentsRes.data : []);

                const allStudents = Array.isArray(studentsRes?.data?.data) 
                    ? studentsRes.data.data 
                    : (Array.isArray(studentsRes?.data) ? studentsRes.data : []);

                // Collect all recent submissions
                let recentSubmissions = [];
                allAssignments.forEach(assignment => {
                    if (assignment.submissions && Array.isArray(assignment.submissions)) {
                        assignment.submissions.forEach(submission => {
                            const student = allStudents.find(s => s.id === submission.studentId);
                            recentSubmissions.push({
                                id: submission.id || submission._id,
                                student: student?.name || submission.studentName || 'Unknown Student',
                                assignment: assignment.title || 'Assignment',
                                subject: assignment.subject || assignment.course || 'Subject',
                                status: submission.status || 'pending',
                                submittedAt: submission.submittedAt || submission.createdAt || new Date(),
                                marks: submission.marks
                            });
                        });
                    }
                });

                // Sort by submission date (most recent first) and take top 5
                recentSubmissions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
                recentSubmissions = recentSubmissions.slice(0, 5);

                setDashboardData(prevData => ({
                    ...prevData,
                    totalClasses: totalCourses,
                    totalStudents: totalStudents,
                    pendingAssignments: allAssignments.reduce((count, assignment) => {
                        const pending = (assignment.submissions || []).filter(s => s.status !== 'graded').length;
                        return count + pending;
                    }, 0),
                    upcomingClasses: todayClasses.length,
                    todayClasses: todayClasses,
                    recentSubmissions: recentSubmissions
                }));
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="flex-1 overflow-y-auto p-8">
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {getGreeting()}, {userName.split(' ')[0]}!
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className={`group ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:scale-[1.02] hover:shadow-lg transition-all duration-200`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Classes</h3>
                        <BookOpen className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dashboardData.totalClasses}</p>
                    <p className="text-sm text-gray-500 mt-2">Active courses</p>
                </div>

                <div className={`group ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:scale-[1.02] hover:shadow-lg transition-all duration-200`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Students</h3>
                        <Users className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dashboardData.totalStudents}</p>
                    <p className="text-sm text-gray-500 mt-2">Across all classes</p>
                </div>

                <div className={`group ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:scale-[1.02] hover:shadow-lg transition-all duration-200`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pending Assignments</h3>
                        <FileText className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dashboardData.pendingAssignments}</p>
                    <p className="text-sm text-gray-500 mt-2">To be reviewed</p>
                </div>

                <div className={`group ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:scale-[1.02] hover:shadow-lg transition-all duration-200`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Upcoming Classes</h3>
                        <Clock className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dashboardData.upcomingClasses}</p>
                    <p className="text-sm text-gray-500 mt-2">This week</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-md transition-shadow duration-200`}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Today's Classes</h2>
                        <Calendar className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="space-y-4">
                        {dashboardData.todayClasses.length > 0 ? (
                            dashboardData.todayClasses.map((classItem, index) => (
                                <div key={index} className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {classItem.subject}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {classItem.class} • {classItem.time}
                                            </p>
                                            {classItem.room && (
                                                <p className="text-xs text-gray-400 mt-1">📍 {classItem.room}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-8">No classes scheduled for today</p>
                        )}
                    </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-md transition-shadow duration-200`}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Submissions</h2>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="space-y-4">
                        {dashboardData.recentSubmissions.length > 0 ? (
                            dashboardData.recentSubmissions.map((submission) => (
                                <div key={submission.id} className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{submission.student}</h4>
                                            <p className="text-sm text-gray-500 mb-1">{submission.assignment}</p>
                                            <p className="text-xs text-gray-500">{submission.subject}</p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                            submission.status === 'pending' 
                                                ? 'bg-yellow-100 text-yellow-600' 
                                                : submission.status === 'graded'
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-blue-100 text-blue-600'
                                        }`}>
                                            {submission.status === 'pending' ? 'Pending' : submission.status === 'graded' ? 'Graded' : 'Submitted'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-8">No recent submissions</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherHome;
