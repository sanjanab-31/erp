import React, { useState, useEffect } from 'react';
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
import { getAllStudents } from '../../../utils/studentStore';
import { calculateAttendancePercentage, getAttendanceByStudent } from '../../../utils/attendanceStore';
import { getStudentFinalMarks, getSubmissionsByStudent } from '../../../utils/academicStore';

const ReportsPage = ({ darkMode }) => {
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

    const loadReportData = () => {
        const allStudents = getAllStudents();

        // Filter students by class if needed
        const filteredStudents = selectedClass === 'All Classes'
            ? allStudents
            : allStudents.filter(s => s.class === selectedClass);

        // Calculate attendance data
        const attendanceStudents = filteredStudents.map(student => {
            const percentage = calculateAttendancePercentage(student.id);
            const attendanceRecords = getAttendanceByStudent(student.id);
            const present = attendanceRecords.filter(r => r.status === 'Present').length;
            const absent = attendanceRecords.filter(r => r.status === 'Absent').length;

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

        // Calculate grades data
        const gradesStudents = filteredStudents.map(student => {
            const finalMarks = getStudentFinalMarks(student.id);
            const avgMarks = finalMarks.length > 0
                ? finalMarks.reduce((sum, m) => sum + m.finalTotal, 0) / finalMarks.length
                : 0;
            const grade = avgMarks >= 90 ? 'A+' : avgMarks >= 80 ? 'A' : avgMarks >= 70 ? 'B+' : avgMarks >= 60 ? 'B' : 'C';

            return {
                name: student.name,
                grade,
                marks: Math.round(avgMarks),
                rank: 0 // Will be calculated after sorting
            };
        }).sort((a, b) => b.marks - a.marks);

        // Assign ranks
        gradesStudents.forEach((student, index) => {
            student.rank = index + 1;
        });

        const avgGrade = gradesStudents.length > 0 ? gradesStudents[0].grade : 'N/A';
        const passRate = gradesStudents.length > 0
            ? Math.round((gradesStudents.filter(s => s.marks >= 40).length / gradesStudents.length) * 100)
            : 0;

        // Calculate assignments data
        let totalAssignments = 0;
        let totalSubmitted = 0;
        let totalPending = 0;
        let totalScore = 0;
        let scoredCount = 0;

        filteredStudents.forEach(student => {
            const submissions = getSubmissionsByStudent(student.id);
            totalAssignments += submissions.length;
            totalSubmitted += submissions.filter(s => s.status === 'graded' || s.status === 'submitted').length;
            totalPending += submissions.filter(s => s.status === 'pending' || !s.marks).length;

            submissions.forEach(sub => {
                if (sub.marks) {
                    totalScore += sub.marks;
                    scoredCount++;
                }
            });
        });

        const avgScore = scoredCount > 0 ? Math.round(totalScore / scoredCount) : 0;

        // Performance data
        const topPerformer = gradesStudents.length > 0 ? gradesStudents[0].name : 'N/A';
        const needsAttention = gradesStudents.filter(s => s.marks < 60).length;
        const onTrack = gradesStudents.filter(s => s.marks >= 60).length;

        setReportData({
            attendance: {
                totalClasses,
                averageAttendance: avgAttendance,
                presentDays: Math.round(totalPresent / (filteredStudents.length || 1)),
                absentDays: Math.round(totalAbsent / (filteredStudents.length || 1)),
                students: attendanceStudents.slice(0, 10) // Top 10
            },
            grades: {
                averageGrade: avgGrade,
                totalAssessments: totalAssignments,
                passRate,
                students: gradesStudents.slice(0, 10) // Top 10
            },
            performance: {
                improvement: '+5%', // This would need historical data
                topPerformer,
                needsAttention,
                onTrack
            },
            assignments: {
                totalAssignments,
                submitted: totalSubmitted,
                pending: totalPending,
                averageScore: avgScore
            }
        });
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
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-green-50'} rounded-lg p-4`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Total Classes</span>
                                    <BookOpen className="w-5 h-5 text-green-500" />
                                </div>
                                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {attendanceData.totalClasses}
                                </p>
                            </div>
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-green-50'} rounded-lg p-4`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Avg. Attendance</span>
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                </div>
                                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {attendanceData.averageAttendance}%
                                </p>
                            </div>
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-purple-50'} rounded-lg p-4`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Avg. Present</span>
                                    <CheckCircle className="w-5 h-5 text-purple-500" />
                                </div>
                                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {attendanceData.presentDays}
                                </p>
                            </div>
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-red-50'} rounded-lg p-4`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Avg. Absent</span>
                                    <Clock className="w-5 h-5 text-red-500" />
                                </div>
                                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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
            {/* Header */}
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Reports & Analytics
                </h1>
                <p className="text-sm text-gray-500">Generate and view detailed real-time reports</p>
            </div>

            {/* Report Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {reportTypes.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => setSelectedReportType(type.id)}
                        className={`p-6 rounded-xl border-2 transition-all ${selectedReportType === type.id
                            ? `border-${type.color}-500 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`
                            : `${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} hover:border-${type.color}-300`
                            }`}
                    >
                        <type.icon className={`w-8 h-8 text-${type.color}-500 mb-3`} />
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {type.name}
                        </h3>
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6`}>
                <div className="flex flex-col md:flex-row gap-4">
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className={`flex-1 px-4 py-2 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-green-500`}
                    >
                        {classes.map((cls) => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>

                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className={`flex-1 px-4 py-2 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-green-500`}
                    >
                        {dateRanges.map((range) => (
                            <option key={range} value={range}>{range}</option>
                        ))}
                    </select>

                    <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                        <Download className="w-5 h-5" />
                        <span>Export PDF</span>
                    </button>

                    <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                        <Download className="w-5 h-5" />
                        <span>Export Excel</span>
                    </button>
                </div>
            </div>

            {/* Report Content */}
            {renderReportContent()}
        </div>
    );
};

export default ReportsPage;
