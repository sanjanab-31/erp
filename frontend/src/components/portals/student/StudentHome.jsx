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
    libraryApi,
    assignmentApi,
    submissionApi
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
                    libraryUsageRes,
                    assignmentsRes,
                    submissionsRes
                ] = await Promise.all([
                    attendanceApi.getByStudent(student.id),
                    resultApi.getByStudent(student.id),
                    courseApi.getAll({ class: student.class }),
                    libraryApi.getAllIssues({ studentId: student.id }),
                    assignmentApi.getAll(),
                    submissionApi.getByStudent(student.id)
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
                const studentCourses = coursesRes.data?.data || [];
                const allAssignments = assignmentsRes.data?.data || [];
                const mySubmissions = submissionsRes.data?.data || [];

                // Filter assignments for student's courses
                const studentCourseIds = studentCourses.map(c => c.id);
                const relevantAssignments = allAssignments.filter(a => studentCourseIds.includes(a.courseId));

                let pendingSubmissions = 0;
                let upcomingAssignments = [];

                relevantAssignments.forEach(a => {
                    const isSubmitted = mySubmissions.some(s => s.assignmentId === a.id);
                    if (!isSubmitted) {
                        pendingSubmissions++;
                        const course = studentCourses.find(c => c.id === a.courseId);
                        upcomingAssignments.push({
                            id: a.id,
                            title: a.title,
                            description: course?.name || 'Course',
                            dueDate: a.dueDate,
                            status: new Date(a.dueDate) < new Date(Date.now() + 86400000) ? 'urgent' : 'normal'
                        });
                    }
                });

                const myIssues = libraryUsageRes.data?.data || [];
                const myIssuedBooks = myIssues.filter(i => i.status === 'Issued');

                setDashboardData({
                    attendance: attendancePct,
                    currentGrade: overallGrade,
                    gradePerformance: studentResults.length > 0 ? `Average: ${avgGrade.toFixed(1)}%` : 'No grades yet',
                    assignments: {
                        pending: pendingSubmissions,
                        total: relevantAssignments.length
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
                        <h3 className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Attendance</h3>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dashboardData.attendance}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${dashboardData.attendance}%` }}
                        ></div>
                    </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Grade</h3>
                        <GraduationCap className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dashboardData.currentGrade}</p>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{dashboardData.gradePerformance}</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Assignments</h3>
                        <BookOpenCheck className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dashboardData.assignments.pending}</p>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pending submissions</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Library Books</h3>
                        <Library className="w-5 h-5 text-orange-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dashboardData.libraryBooks.issued}</p>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Currently issued</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Upcoming Assignments</h3>
                    {dashboardData.upcomingAssignments.length > 0 ? (
                        <div className="space-y-3">
                            {dashboardData.upcomingAssignments.map((assignment) => (
                                <div
                                    key={assignment.id}
                                    className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{assignment.title}</h4>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{assignment.description}</p>
                                            <p className={`text-xs mt-1 ${assignment.status === 'urgent' ? 'text-red-500' : darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {assignment.status === 'urgent' && (
                                            <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded">
                                                Urgent
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No upcoming assignments</p>
                    )}
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Recent Grades</h3>
                    {dashboardData.recentGrades.length > 0 ? (
                        <div className="space-y-3">
                            {dashboardData.recentGrades.map((grade) => (
                                <div
                                    key={grade.id}
                                    className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{grade.subject}</h4>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{grade.assessment}</p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-lg font-semibold ${grade.color === 'green'
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
                    ) : (
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No grades available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentHome;
