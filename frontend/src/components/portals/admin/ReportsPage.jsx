import React, { useState, useEffect } from 'react';
import {
    FileText,
    Download,
    Users,
    BookOpen,
    TrendingUp,
    BarChart3,
    Award,
    Clock,
    CheckCircle,
    IndianRupee,
    Calendar
} from 'lucide-react';
import { getAllStudents } from '../../../utils/studentStore';
import { getAllTeachers } from '../../../utils/teacherStore';
import { calculateAttendancePercentage, getAttendanceByStudent, getOverallAttendanceStats } from '../../../utils/attendanceStore';
import { getStudentFinalMarks } from '../../../utils/academicStore';
import { getFeeStats, getAllFees } from '../../../utils/feeStore';

const ReportsPage = ({ darkMode }) => {
    const [selectedReportType, setSelectedReportType] = useState('overview');
    const [selectedClass, setSelectedClass] = useState('All Classes');
    const [dateRange, setDateRange] = useState('This Month');
    const [reportData, setReportData] = useState({
        overview: null,
        attendance: null,
        academic: null,
        financial: null
    });

    const classes = ['All Classes', 'Grade 9-A', 'Grade 9-B', 'Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 11-B', 'Grade 12-A', 'Grade 12-B'];
    const dateRanges = ['This Week', 'This Month', 'This Quarter', 'This Year', 'Custom'];

    const reportTypes = [
        { id: 'overview', name: 'System Overview', icon: BarChart3, color: 'purple' },
        { id: 'attendance', name: 'Attendance Report', icon: Users, color: 'blue' },
        { id: 'academic', name: 'Academic Report', icon: Award, color: 'green' },
        { id: 'financial', name: 'Financial Report', icon: IndianRupee, color: 'orange' }
    ];

    useEffect(() => {
        loadReportData();
    }, [selectedClass, dateRange]);

    const loadReportData = () => {
        const allStudents = getAllStudents();
        const allTeachers = getAllTeachers();
        const allFees = getAllFees();

        // Filter students by class if needed
        const filteredStudents = selectedClass === 'All Classes'
            ? allStudents
            : allStudents.filter(s => s.class === selectedClass);

        // Overview Data
        const attendanceStats = getOverallAttendanceStats();
        const feeStats = getFeeStats();
        const pendingFeesList = allFees.filter(f => f.status !== 'Paid');

        const overviewData = {
            totalStudents: allStudents.length,
            totalTeachers: allTeachers.length,
            averageAttendance: attendanceStats.averageAttendance || 0,
            totalRevenue: feeStats.totalCollected || 0,
            pendingFees: feeStats.totalPending || 0,
            activeClasses: classes.length - 1, // Exclude "All Classes"
            // Details for Print
            detailedStudents: allStudents,
            detailedTeachers: allTeachers,
            detailedPendingFees: pendingFeesList
        };

        // Attendance Data
        const attendanceStudents = filteredStudents.map(student => {
            const percentage = calculateAttendancePercentage(student.id);
            const attendanceRecords = getAttendanceByStudent(student.id);
            const present = attendanceRecords.filter(r => r.status === 'Present').length;
            const absent = attendanceRecords.filter(r => r.status === 'Absent').length;

            return {
                name: student.name,
                class: student.class,
                attendance: percentage,
                present,
                absent
            };
        }).sort((a, b) => b.attendance - a.attendance);

        const totalClasses = attendanceStudents.length > 0
            ? attendanceStudents[0].present + attendanceStudents[0].absent
            : 0;
        const avgAttendance = attendanceStudents.length > 0
            ? Math.round(attendanceStudents.reduce((sum, s) => sum + s.attendance, 0) / attendanceStudents.length)
            : 0;

        // Academic Data
        const academicStudents = filteredStudents.map(student => {
            const finalMarks = getStudentFinalMarks(student.id);
            const avgMarks = finalMarks.length > 0
                ? finalMarks.reduce((sum, m) => sum + m.finalTotal, 0) / finalMarks.length
                : 0;
            const grade = avgMarks >= 90 ? 'A+' : avgMarks >= 80 ? 'A' : avgMarks >= 70 ? 'B+' : avgMarks >= 60 ? 'B' : 'C';

            return {
                name: student.name,
                class: student.class,
                grade,
                marks: Math.round(avgMarks),
                rank: 0
            };
        }).sort((a, b) => b.marks - a.marks);

        // Assign ranks
        academicStudents.forEach((student, index) => {
            student.rank = index + 1;
        });

        const avgGrade = academicStudents.length > 0 ? academicStudents[0].grade : 'N/A';
        const passRate = academicStudents.length > 0
            ? Math.round((academicStudents.filter(s => s.marks >= 40).length / academicStudents.length) * 100)
            : 0;

        // Financial Data
        const filteredFees = selectedClass === 'All Classes'
            ? allFees
            : allFees.filter(f => f.studentClass === selectedClass);

        setReportData({
            overview: overviewData,
            attendance: {
                totalClasses,
                averageAttendance: avgAttendance,
                students: attendanceStudents // Full list
            },
            academic: {
                averageGrade: avgGrade,
                passRate,
                students: academicStudents // Full list
            },
            financial: {
                totalRevenue: feeStats.totalCollected || 0,
                pendingAmount: feeStats.totalPending || 0,
                collectionRate: feeStats.totalCollected > 0
                    ? Math.round((feeStats.totalCollected / (feeStats.totalCollected + feeStats.totalPending)) * 100)
                    : 0,
                detailedFees: filteredFees // Full list
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
            case 'overview':
                const overviewData = reportData.overview;
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-purple-50'} rounded-lg p-6`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Total Students</span>
                                    <Users className="w-5 h-5 text-purple-500" />
                                </div>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {overviewData.totalStudents}
                                </p>
                            </div>
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg p-6`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Total Teachers</span>
                                    <Users className="w-5 h-5 text-blue-500" />
                                </div>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {overviewData.totalTeachers}
                                </p>
                            </div>
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-green-50'} rounded-lg p-6`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Active Classes</span>
                                    <BookOpen className="w-5 h-5 text-green-500" />
                                </div>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {overviewData.activeClasses}
                                </p>
                            </div>
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-yellow-50'} rounded-lg p-6`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Avg. Attendance</span>
                                    <TrendingUp className="w-5 h-5 text-yellow-500" />
                                </div>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {overviewData.averageAttendance}%
                                </p>
                            </div>
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-green-50'} rounded-lg p-6`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Total Revenue</span>
                                    <IndianRupee className="w-5 h-5 text-green-500" />
                                </div>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    ₹{overviewData.totalRevenue.toLocaleString()}
                                </p>
                            </div>
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-red-50'} rounded-lg p-6`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Pending Fees</span>
                                    <Clock className="w-5 h-5 text-red-500" />
                                </div>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    ₹{overviewData.pendingFees.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 'attendance':
                const attendanceData = reportData.attendance;
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg p-4`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Total Classes Held</span>
                                    <BookOpen className="w-5 h-5 text-blue-500" />
                                </div>
                                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {attendanceData.totalClasses}
                                </p>
                            </div>
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-green-50'} rounded-lg p-4`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Average Attendance</span>
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                </div>
                                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {attendanceData.averageAttendance}%
                                </p>
                            </div>
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-purple-50'} rounded-lg p-4`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Total Students</span>
                                    <Users className="w-5 h-5 text-purple-500" />
                                </div>
                                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {attendanceData.students.length}
                                </p>
                            </div>
                        </div>

                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                                Student Attendance Details
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                                        <tr>
                                            <th className={`px-4 py-3 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                                Student Name
                                            </th>
                                            <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                                Class
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
                                        {attendanceData.students.slice(0, 15).map((student, index) => (
                                            <tr key={index}>
                                                <td className={`px-4 py-3 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                                    {student.name}
                                                </td>
                                                <td className={`px-4 py-3 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {student.class}
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
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );

            case 'academic':
                const academicData = reportData.academic;
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-green-50'} rounded-lg p-4`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Average Grade</span>
                                    <Award className="w-5 h-5 text-green-500" />
                                </div>
                                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {academicData.averageGrade}
                                </p>
                            </div>
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-purple-50'} rounded-lg p-4`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Pass Rate</span>
                                    <CheckCircle className="w-5 h-5 text-purple-500" />
                                </div>
                                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {academicData.passRate}%
                                </p>
                            </div>
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg p-4`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Total Students</span>
                                    <Users className="w-5 h-5 text-blue-500" />
                                </div>
                                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {academicData.students.length}
                                </p>
                            </div>
                        </div>

                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                                Top Performers
                            </h3>
                            <div className="overflow-x-auto">
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
                                                Class
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
                                        {academicData.students.slice(0, 15).map((student) => (
                                            <tr key={student.rank}>
                                                <td className={`px-4 py-3 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                                    #{student.rank}
                                                </td>
                                                <td className={`px-4 py-3 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                                    {student.name}
                                                </td>
                                                <td className={`px-4 py-3 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {student.class}
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
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );

            case 'financial':
                const financialData = reportData.financial;
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-green-50'} rounded-lg p-6`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Total Revenue</span>
                                    <IndianRupee className="w-5 h-5 text-green-500" />
                                </div>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    ₹{financialData.totalRevenue.toLocaleString()}
                                </p>
                            </div>
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-red-50'} rounded-lg p-6`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Pending Amount</span>
                                    <Clock className="w-5 h-5 text-red-500" />
                                </div>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    ₹{financialData.pendingAmount.toLocaleString()}
                                </p>
                            </div>
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg p-6`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Collection Rate</span>
                                    <TrendingUp className="w-5 h-5 text-blue-500" />
                                </div>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {financialData.collectionRate}%
                                </p>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const renderPrintContent = () => {
        if (!reportData[selectedReportType]) return null;

        const Header = () => (
            <div className="mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold mb-2 text-black">TechnoVanam School</h1>
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{reportTypes.find(t => t.id === selectedReportType)?.name}</h2>
                <div className="flex justify-between text-sm text-gray-600">
                    <p>Generated: {new Date().toLocaleString()}</p>
                    <p>Filter: {selectedClass} | {dateRange}</p>
                </div>
            </div>
        );

        const PrintTable = ({ headers, data, renderRow }) => (
            <table className="w-full text-sm border-collapse border border-gray-300 mb-6 text-black">
                <thead>
                    <tr className="bg-gray-100">
                        {headers.map((h, i) => <th key={i} className="border border-gray-300 p-2 text-left font-bold">{h}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? data.map((item, i) => renderRow(item, i)) : (
                        <tr><td colSpan={headers.length} className="border p-4 text-center">No data available</td></tr>
                    )}
                </tbody>
            </table>
        );

        if (selectedReportType === 'overview') {
            const { detailedStudents = [], detailedTeachers = [], detailedPendingFees = [] } = reportData.overview || {};
            return (
                <div className="print-only p-8 bg-white min-h-screen">
                    <Header />

                    <div className="grid grid-cols-4 gap-4 mb-8">
                        <div className="border p-4 rounded bg-gray-50">
                            <p className="text-gray-500 text-sm">Total Students</p>
                            <p className="text-2xl font-bold text-black">{reportData.overview.totalStudents}</p>
                        </div>
                        <div className="border p-4 rounded bg-gray-50">
                            <p className="text-gray-500 text-sm">Total Teachers</p>
                            <p className="text-2xl font-bold text-black">{reportData.overview.totalTeachers}</p>
                        </div>
                        <div className="border p-4 rounded bg-gray-50">
                            <p className="text-gray-500 text-sm">Total Revenue</p>
                            <p className="text-2xl font-bold text-green-700">₹{reportData.overview.totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="border p-4 rounded bg-gray-50">
                            <p className="text-gray-500 text-sm">Pending Fees</p>
                            <p className="text-2xl font-bold text-red-700">₹{reportData.overview.pendingFees.toLocaleString()}</p>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold mb-2 mt-6 uppercase text-gray-700">Student Directory</h3>
                    <PrintTable
                        headers={['Roll No', 'Name', 'Class', 'Guardian', 'Contact']}
                        data={detailedStudents}
                        renderRow={(s, i) => (
                            <tr key={i}>
                                <td className="border p-2">{s.rollNumber}</td>
                                <td className="border p-2">{s.name}</td>
                                <td className="border p-2">{s.class}</td>
                                <td className="border p-2">{s.guardianName}</td>
                                <td className="border p-2">{s.contactNumber}</td>
                            </tr>
                        )}
                    />

                    <h3 className="text-lg font-bold mb-2 mt-6 uppercase text-gray-700">Faculty Directory</h3>
                    <PrintTable
                        headers={['ID', 'Name', 'Subject', 'Email', 'Phone']}
                        data={detailedTeachers}
                        renderRow={(t, i) => (
                            <tr key={i}>
                                <td className="border p-2">{t.id}</td>
                                <td className="border p-2">{t.name}</td>
                                <td className="border p-2">{t.subject}</td>
                                <td className="border p-2">{t.email}</td>
                                <td className="border p-2">{t.phone}</td>
                            </tr>
                        )}
                    />

                    <h3 className="text-lg font-bold mb-2 mt-6 uppercase text-gray-700">Outstanding Fees</h3>
                    <PrintTable
                        headers={['Student', 'Class', 'Fee Type', 'Amount', 'Paid', 'Due', 'Status']}
                        data={detailedPendingFees}
                        renderRow={(f, i) => (
                            <tr key={i}>
                                <td className="border p-2">{f.studentName}</td>
                                <td className="border p-2">{f.studentClass}</td>
                                <td className="border p-2">{f.feeType}</td>
                                <td className="border p-2 text-red-600">₹{f.amount}</td>
                                <td className="border p-2">₹{f.paidAmount}</td>
                                <td className="border p-2 text-red-600">₹{f.remainingAmount}</td>
                                <td className="border p-2">{f.status}</td>
                            </tr>
                        )}
                    />
                </div>
            );
        }

        if (selectedReportType === 'attendance') {
            return (
                <div className="print-only p-8 bg-white min-h-screen">
                    <Header />
                    <h3 className="text-lg font-bold mb-2 mt-6 uppercase text-gray-700">Student Attendance Report</h3>
                    <PrintTable
                        headers={['Name', 'Class', 'Attendance %', 'Present Days', 'Absent Days']}
                        data={reportData.attendance.students}
                        renderRow={(s, i) => (
                            <tr key={i}>
                                <td className="border p-2">{s.name}</td>
                                <td className="border p-2">{s.class}</td>
                                <td className={`border p-2 font-bold ${s.attendance < 75 ? 'text-red-600' : 'text-green-600'}`}>{s.attendance}%</td>
                                <td className="border p-2">{s.present}</td>
                                <td className="border p-2">{s.absent}</td>
                            </tr>
                        )}
                    />
                </div>
            );
        }

        if (selectedReportType === 'academic') {
            return (
                <div className="print-only p-8 bg-white min-h-screen">
                    <Header />
                    <h3 className="text-lg font-bold mb-2 mt-6 uppercase text-gray-700">Academic Performance Report</h3>
                    <PrintTable
                        headers={['Rank', 'Name', 'Class', 'Avg Marks', 'Grade']}
                        data={reportData.academic.students}
                        renderRow={(s, i) => (
                            <tr key={i}>
                                <td className="border p-2">#{s.rank}</td>
                                <td className="border p-2">{s.name}</td>
                                <td className="border p-2">{s.class}</td>
                                <td className="border p-2">{s.marks}</td>
                                <td className={`border p-2 font-bold ${s.grade.startsWith('A') ? 'text-green-600' : 'text-blue-600'}`}>{s.grade}</td>
                            </tr>
                        )}
                    />
                </div>
            );
        }

        if (selectedReportType === 'financial') {
            return (
                <div className="print-only p-8 bg-white min-h-screen">
                    <Header />
                    <h3 className="text-lg font-bold mb-2 mt-6 uppercase text-gray-700">Detailed Financial Report</h3>
                    <PrintTable
                        headers={['Date', 'Student', 'Class', 'Fee Type', 'Amount (₹)', 'Paid (₹)', 'Due (₹)', 'Status']}
                        data={reportData.financial.detailedFees || []}
                        renderRow={(f, i) => (
                            <tr key={i}>
                                <td className="border p-2">{f.dueDate ? new Date(f.dueDate).toLocaleDateString() : '-'}</td>
                                <td className="border p-2">{f.studentName}</td>
                                <td className="border p-2">{f.studentClass}</td>
                                <td className="border p-2">{f.feeType}</td>
                                <td className="border p-2">₹{f.amount}</td>
                                <td className="border p-2 text-green-600">₹{f.paidAmount}</td>
                                <td className="border p-2 text-red-600">₹{f.remainingAmount}</td>
                                <td className="border p-2 font-bold">{f.status}</td>
                            </tr>
                        )}
                    />
                </div>
            );
        }

        return null;
    };

    return (
        <>
            <style>
                {`
                    @media print {
                        /* Global UI Elements */
                        .no-print, aside, header, nav { display: none !important; }
                        
                        /* Report Visibility */
                        .print-only { display: block !important; width: 100% !important; position: absolute; top: 0; left: 0; }
                        
                        /* Layout Overrides */
                        body { background: white; font-size: 12px; height: auto !important; overflow: visible !important; }
                        html { height: auto !important; overflow: visible !important; }
                        main { overflow: visible !important; height: auto !important; margin: 0 !important; padding: 0 !important; }
                        .flex-1 { overflow: visible !important; }
                        
                        @page { margin: 1cm; size: landscape; }
                    }
                    .print-only { display: none; }
                `}
            </style>

            {renderPrintContent()}

            <div className="flex-1 overflow-y-auto p-8 no-print">
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        Reports & Analytics
                    </h1>
                    <p className="text-sm text-gray-500">Comprehensive real-time system reports</p>
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
                                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
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
                                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        >
                            {dateRanges.map((range) => (
                                <option key={range} value={range}>{range}</option>
                            ))}
                        </select>

                        <button
                            onClick={() => window.print()}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                        >
                            <Download className="w-5 h-5" />
                            <span>Export PDF</span>
                        </button>
                    </div>
                </div>

                {/* Report Content */}
                {renderReportContent()}
            </div>
        </>
    );
};

export default ReportsPage;
