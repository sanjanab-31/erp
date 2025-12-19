import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    FileText,
    Download,
    Filter,
    Calendar,
    Users,
    BookOpen,
    TrendingUp,
    BarChart3,
    PieChart,
    Award,
    Clock,
    CheckCircle
} from 'lucide-react';
import {
    studentApi,
    attendanceApi,
    resultApi,
    assignmentApi
} from '../../../services/api';

const ReportsPage = () => {
    const { darkMode } = useOutletContext();
    const [selectedReportType, setSelectedReportType] = useState('attendance');
    const [selectedClass, setSelectedClass] = useState('All Classes');
    const [dateRange, setDateRange] = useState('This Month');
    const [reportData, setReportData] = useState({
        attendance: null,
        grades: null,
        performance: null,
        assignments: null
    });

    const classes = ['All Classes', 'Grade 9-A', 'Grade 9-B', 'Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 11-B', 'Grade 12-A', 'Grade 12-B'];
    const dateRanges = ['This Week', 'This Month', 'This Quarter', 'This Year', 'Custom'];

    const reportTypes = [
        { id: 'attendance', name: 'Attendance Report', icon: Users, color: 'blue' },
        { id: 'grades', name: 'Grades Report', icon: Award, color: 'green' },
        { id: 'performance', name: 'Performance Report', icon: TrendingUp, color: 'purple' },
        { id: 'assignments', name: 'Assignments Report', icon: FileText, color: 'yellow' }
    ];

    useEffect(() => {
        loadReportData();
    }, [selectedClass, dateRange]);

    const loadReportData = async () => {
        try {
            const [studentsRes, attendanceRes, assignmentsRes, resultsRes] = await Promise.all([
                studentApi.getAll(),
                attendanceApi.getAll(),
                assignmentApi.getAll(),
                resultApi.getAll()
            ]);

            const allStudentsData = studentsRes.data?.data || studentsRes.data;
            const allAttendanceData = attendanceRes.data?.data || attendanceRes.data;
            const allAssignmentsData = assignmentsRes.data?.data || assignmentsRes.data;
            const allResultsData = resultsRes.data?.data || resultsRes.data;

            const allStudents = Array.isArray(allStudentsData) ? allStudentsData : [];
            const allAttendance = Array.isArray(allAttendanceData) ? allAttendanceData : [];
            const allAssignments = Array.isArray(allAssignmentsData) ? allAssignmentsData : [];
            const allResults = Array.isArray(allResultsData) ? allResultsData : [];

            console.log('Reports API Data Loaded:');
            console.log('Students:', allStudents.length);
            console.log('Attendance Records:', allAttendance.length);
            console.log('Assignments:', allAssignments.length);
            console.log('Results:', allResults.length);

            const filteredStudents = selectedClass === 'All Classes'
                ? allStudents
                : allStudents.filter(s => s.class === selectedClass);

            const attendanceStudents = filteredStudents.map(student => {
                const studentAttendance = allAttendance.filter(r => r.studentId === student.id);
                const present = studentAttendance.filter(r => r.status === 'Present').length;
                const absent = studentAttendance.filter(r => r.status === 'Absent').length;
                const percentage = studentAttendance.length > 0
                    ? Math.round((present / studentAttendance.length) * 100)
                    : 0;

                return {
                    name: student.name,
                    attendance: percentage,
                    present,
                    absent
                };
            });

            const totalClasses = attendanceStudents.length > 0
                ? attendanceStudents[0].present + attendanceStudents[0].absent
                : 0;
            const avgAttendance = attendanceStudents.length > 0
                ? Math.round(attendanceStudents.reduce((sum, s) => sum + s.attendance, 0) / attendanceStudents.length)
                : 0;
            const totalPresent = attendanceStudents.reduce((sum, s) => sum + s.present, 0);
            const totalAbsent = attendanceStudents.reduce((sum, s) => sum + s.absent, 0);

            const gradesStudents = filteredStudents.map(student => {
                const studentResults = allResults.filter(r => r.studentId === student.id);
                const avgMarks = studentResults.length > 0
                    ? studentResults.reduce((sum, r) => sum + (r.marks || 0), 0) / studentResults.length
                    : 0;
                const grade = avgMarks >= 90 ? 'A+' : avgMarks >= 80 ? 'A' : avgMarks >= 70 ? 'B+' : avgMarks >= 60 ? 'B' : 'C';

                return {
                    name: student.name,
                    grade,
                    marks: Math.round(avgMarks),
                    rank: 0
                };
            }).sort((a, b) => b.marks - a.marks);

            gradesStudents.forEach((student, index) => {
                student.rank = index + 1;
            });

            const avgGrade = gradesStudents.length > 0 ? gradesStudents[0].grade : 'N/A';
            const passRate = gradesStudents.length > 0
                ? Math.round((gradesStudents.filter(s => s.marks >= 40).length / gradesStudents.length) * 100)
                : 0;

            let totalAssignmentsCount = 0;
            let totalSubmittedCount = 0;
            let totalPendingCount = 0;
            let totalScore = 0;
            let scoredCount = 0;

            filteredStudents.forEach(student => {
                const submissions = allAssignments.flatMap(a => (a.submissions || []).filter(s => s.studentId === student.id));
                totalAssignmentsCount += allAssignments.length;
                totalSubmittedCount += submissions.filter(s => s.status === 'graded' || s.status === 'submitted').length;
                totalPendingCount += allAssignments.length - (submissions.length);

                submissions.forEach(sub => {
                    if (sub.marks) {
                        totalScore += sub.marks;
                        scoredCount++;
                    }
                });
            });

            const avgScore = scoredCount > 0 ? Math.round(totalScore / scoredCount) : 0;

            const topPerformer = gradesStudents.length > 0 ? gradesStudents[0].name : 'N/A';
            const needsAttention = gradesStudents.filter(s => s.marks < 60).length;
            const onTrack = gradesStudents.filter(s => s.marks >= 60).length;

            setReportData({
                attendance: {
                    totalClasses,
                    averageAttendance: avgAttendance,
                    presentDays: Math.round(totalPresent / (filteredStudents.length || 1)),
                    absentDays: Math.round(totalAbsent / (filteredStudents.length || 1)),
                    students: attendanceStudents.slice(0, 10)
                },
                grades: {
                    averageGrade: avgGrade,
                    totalAssessments: allResults.length,
                    passRate,
                    students: gradesStudents.slice(0, 10)
                },
                performance: {
                    improvement: '+5%',
                    topPerformer,
                    needsAttention,
                    onTrack
                },
                assignments: {
                    totalAssignments: allAssignments.length * filteredStudents.length,
                    submitted: totalSubmittedCount,
                    pending: totalPendingCount,
                    averageScore: avgScore
                }
            });
        } catch (error) {
            console.error('Error loading report data:', error);
        }
    };

    const renderReportContent = () => {
        if (!reportData[selectedReportType]) {
            return (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 text-center border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Loading report data...
                    </p>
                </div>
            );
        }

        switch (selectedReportType) {
            case 'attendance':
                const attendanceData = reportData.attendance;
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className={`group ${darkMode ? 'bg-gray-700' : 'bg-green-50'} rounded-xl p-5 hover:shadow-md transition-all duration-200 hover:scale-105`}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Classes</span>
                                    <div className="p-2 bg-green-100 rounded-lg group-hover:scale-110 transition-transform duration-200">
                                        <BookOpen className="w-4 h-4 text-green-600" />
                                    </div>
                                </div>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {attendanceData.totalClasses}
                                </p>
                            </div>
                            <div className={`group ${darkMode ? 'bg-gray-700' : 'bg-green-50'} rounded-xl p-5 hover:shadow-md transition-all duration-200 hover:scale-105`}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg. Attendance</span>
                                    <div className="p-2 bg-green-100 rounded-lg group-hover:scale-110 transition-transform duration-200">
                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                    </div>
                                </div>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {attendanceData.averageAttendance}%
                                </p>
                            </div>
                            <div className={`group ${darkMode ? 'bg-gray-700' : 'bg-purple-50'} rounded-xl p-5 hover:shadow-md transition-all duration-200 hover:scale-105`}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg. Present</span>
                                    <div className="p-2 bg-purple-100 rounded-lg group-hover:scale-110 transition-transform duration-200">
                                        <CheckCircle className="w-4 h-4 text-purple-600" />
                                    </div>
                                </div>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {attendanceData.presentDays}
                                </p>
                            </div>
                            <div className={`group ${darkMode ? 'bg-gray-700' : 'bg-red-50'} rounded-xl p-5 hover:shadow-md transition-all duration-200 hover:scale-105`}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg. Absent</span>
                                    <div className="p-2 bg-red-100 rounded-lg group-hover:scale-110 transition-transform duration-200">
                                        <Clock className="w-4 h-4 text-red-600" />
                                    </div>
                                </div>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {attendanceData.absentDays}
                                </p>
                            </div>
                        </div>

                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                                Student-wise Attendance
                            </h3>
                            <table className="w-full">
                                <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                                    <tr>
                                        <th className={`px-4 py-3 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                            Student Name
                                        </th>
                                        <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                            Attendance %
                                        </th>
                                        <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                            Present
                                        </th>
                                        <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                            Absent
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                    {attendanceData.students.map((student, index) => (
                                        <tr key={index}>
                                            <td className={`px-4 py-3 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                                {student.name}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`font-semibold ${student.attendance >= 90 ? 'text-green-600' : student.attendance >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    {student.attendance}%
                                                </span>
                                            </td>
                                            <td className={`px-4 py-3 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {student.present}
                                            </td>
                                            <td className={`px-4 py-3 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {student.absent}
                                            </td>
                                        </tr>
                                    ))}
                                    {attendanceData.students.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                                                No attendance data available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'grades':
                const gradesData = reportData.grades;
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-green-50'} rounded-lg p-4`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Average Grade</span>
                                    <Award className="w-5 h-5 text-green-500" />
                                </div>
                                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {gradesData.averageGrade}
                                </p>
                            </div>
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-green-50'} rounded-lg p-4`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Total Students</span>
                                    <Users className="w-5 h-5 text-green-500" />
                                </div>
                                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {gradesData.students.length}
                                </p>
                            </div>
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-purple-50'} rounded-lg p-4`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Pass Rate</span>
                                    <CheckCircle className="w-5 h-5 text-purple-500" />
                                </div>
                                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {gradesData.passRate}%
                                </p>
                            </div>
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-yellow-50'} rounded-lg p-4`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Top Student</span>
                                    <TrendingUp className="w-5 h-5 text-yellow-500" />
                                </div>
                                <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {gradesData.students[0]?.name || 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                                Top Performers
                            </h3>
                            <table className="w-full">
                                <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                                    <tr>
                                        <th className={`px-4 py-3 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                            Rank
                                        </th>
                                        <th className={`px-4 py-3 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                            Student Name
                                        </th>
                                        <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                            Marks
                                        </th>
                                        <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                            Grade
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                    {gradesData.students.map((student) => (
                                        <tr key={student.rank}>
                                            <td className={`px-4 py-3 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                                #{student.rank}
                                            </td>
                                            <td className={`px-4 py-3 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                                {student.name}
                                            </td>
                                            <td className={`px-4 py-3 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {student.marks}/100
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${student.grade.startsWith('A') ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                    {student.grade}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {gradesData.students.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                                                No grades data available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 text-center border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Select a report type to view details
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-8">
            <div className="flex justify-between items-center bg-gradient-to-r from-green-50 to-green-50 p-6 rounded-xl border border-green-200 mb-6 hover:shadow-lg transition-all duration-200 group">
                <div>
                    <h2 className="text-2xl font-bold text-green-900">Reports & Analytics</h2>
                    <p className="text-sm text-green-900 mt-1">Generate and view detailed real-time reports</p>
                </div>
                <BarChart3 className="w-10 h-10 text-green-600 group-hover:scale-110 transition-transform duration-200" />
            </div>

            {/* Report Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {reportTypes.map((type) => {
                    const iconColors = {
                        blue: 'text-blue-500 bg-blue-50',
                        green: 'text-green-500 bg-green-50',
                        purple: 'text-purple-500 bg-purple-50',
                        yellow: 'text-yellow-500 bg-yellow-50'
                    };
                    const borderColors = {
                        blue: 'border-blue-500',
                        green: 'border-green-500',
                        purple: 'border-purple-500',
                        yellow: 'border-yellow-500'
                    };
                    return (
                        <button
                            key={type.id}
                            onClick={() => setSelectedReportType(type.id)}
                            className={`group p-6 rounded-xl border-2 transition-all duration-200 ${selectedReportType === type.id
                                ? `${borderColors[type.color]} ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg scale-105`
                                : `${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} hover:shadow-md hover:scale-[1.02]`
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-lg ${iconColors[type.color]} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                                <type.icon className="w-6 h-6" />
                            </div>
                            <h3 className={`font-semibold text-left ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {type.name}
                            </h3>
                        </button>
                    );
                })}
            </div>

            {/* Filters and Export */}
            <div className="space-y-6 mb-8">
                <div className="flex flex-wrap items-center gap-4">
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className={`px-4 py-2.5 rounded-lg border text-sm ${darkMode
                            ? 'bg-gray-800 border-gray-700 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md`}
                    >
                        {classes.map((cls) => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>

                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className={`px-4 py-2.5 rounded-lg border text-sm ${darkMode
                            ? 'bg-gray-800 border-gray-700 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md`}
                    >
                        {dateRanges.map((range) => (
                            <option key={range} value={range}>{range}</option>
                        ))}
                    </select>

                    <div className="flex gap-3 ml-auto">
                        <button className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:shadow-lg transition-all duration-200 flex items-center space-x-2 text-sm font-medium">
                            <Download className="w-4 h-4" />
                            <span>Export PDF</span>
                        </button>

                        <button className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:shadow-lg transition-all duration-200 flex items-center space-x-2 text-sm font-medium">
                            <Download className="w-4 h-4" />
                            <span>Export Excel</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Report Content */}
            {renderReportContent()}
        </div>
    );
};

export default ReportsPage;
