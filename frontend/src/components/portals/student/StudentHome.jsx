import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    TrendingUp,
    GraduationCap,
    BookOpenCheck,
    Library
} from 'lucide-react';
import {
    studentApi,
    attendanceApi,
    resultApi,
    courseApi,
    libraryApi
} from '../../../services/api';

const StudentHome = () => {
    const { darkMode, userName, student } = useOutletContext();

    // Fallback if context is missing (though it shouldn't be)
    const displayUserName = userName || 'Student';

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
            total: 0 // Static data issue mentioned by user - we can fix this dynamically later or fetch limit
        },
        upcomingAssignments: [],
        recentGrades: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!student) return;

            try {
                const [
                    attendanceRes,
                    resultsRes,
                    coursesRes,
                    libraryUsageRes
                ] = await Promise.all([
                    attendanceApi.getByStudent(student.id),
                    resultApi.getAll({ studentId: student.id }),
                    courseApi.getAll({ class: student.class }),
                    libraryApi.getAllIssues({ studentId: student.id })
                ]);

                // Attendance Calculation
                const allAttendance = attendanceRes.data?.data || [];
                const totalDays = allAttendance.length;
                const presentDays = allAttendance.filter(a => a.status === 'Present').length;
                const attendancePct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

                // Results Calculation
                const studentResults = resultsRes.data?.data || [];

                const calculatePercentage = (res) => {
                    const scores = res.examScores || {};
                    const total = (scores.exam1 || 0) + (scores.exam2 || 0) + (scores.exam3 || 0);
                    return Math.round(total / 3);
                };

                const avgGrade = studentResults.length > 0
                    ? studentResults.reduce((sum, r) => sum + calculatePercentage(r), 0) / studentResults.length
                    : 0;

                const overallGrade = avgGrade >= 90 ? 'A' : avgGrade >= 80 ? 'B+' : avgGrade >= 70 ? 'B' : avgGrade >= 60 ? 'C' : 'D';

                const recentGrades = studentResults.slice(0, 2).map((r, idx) => {
                    const pct = calculatePercentage(r);
                    return {
                        id: idx + 1,
                        subject: r.courseName || 'Subject',
                        assessment: 'Final Exam',
                        grade: pct >= 90 ? 'A' : pct >= 80 ? 'B+' : 'B',
                        color: pct >= 90 ? 'green' : 'blue'
                    };
                });

                // Assignments
                // Need to filter assignments for courses.
                const studentCourses = coursesRes.data?.data || [];

                let pendingSubmissions = 0;
                let totalAssignments = 0;
                let upcomingAssignments = [];

                studentCourses.forEach(c => {
                    const assigns = c.assignments || [];
                    totalAssignments += assigns.length;
                    assigns.forEach(a => {
                        const isSubmitted = a.submissions && a.submissions.some(s => s.studentId === student.id);
                        if (!isSubmitted) {
                            pendingSubmissions++;
                            upcomingAssignments.push({
                                id: a.id,
                                title: a.title,
                                description: c.name,
                                dueDate: a.dueDate,
                                status: new Date(a.dueDate) < new Date(Date.now() + 86400000) ? 'urgent' : 'normal'
                            });
                        }
                    });
                });

                const myIssues = libraryUsageRes.data?.data || [];
                const myIssuedBooks = myIssues.filter(i => i.status === 'Issued');

                setDashboardData({
                    attendance: attendancePct,
                    currentGrade: overallGrade,
                    gradePerformance: studentResults.length > 0 ? `Average: ${avgGrade.toFixed(1)}%` : 'No grades yet',
                    assignments: {
                        pending: pendingSubmissions,
                        total: totalAssignments
                    },
                    libraryBooks: {
                        issued: myIssuedBooks.length,
                        total: 5
                    },
                    upcomingAssignments: upcomingAssignments.slice(0, 3),
                    recentGrades: recentGrades
                });

            } catch (error) {
                console.error("Failed to load student dashboard", error);
            }
        };

        fetchDashboardData();
    }, [student]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="flex-1 overflow-y-auto p-8">
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    {getGreeting()}, {displayUserName.split(' ')[0]}!
                </h1>
                <p className="text-sm text-gray-500">Student Dashboard</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

export default StudentHome;
