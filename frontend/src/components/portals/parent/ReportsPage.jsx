import React, { useState, useEffect } from 'react';
import {
    Download,
    FileText,
    TrendingUp,
    Award,
    Calendar,
    BarChart3
} from 'lucide-react';
import { calculateAttendancePercentage, getAttendanceByStudent } from '../../../utils/attendanceStore';
import { getStudentFinalMarks } from '../../../utils/academicStore';
import { getFeesByStudent } from '../../../utils/feeStore';
import { getChildrenByParentEmail } from '../../../utils/userStore';

const ReportsPage = ({ darkMode }) => {
    const [selectedReport, setSelectedReport] = useState('Academic Performance');
    const [reportData, setReportData] = useState({
        'Academic Performance': { summary: '', data: [] },
        'Attendance Report': { summary: '', data: [] },
        'Progress Report': { summary: '', data: [] },
        'Fee Statement': { summary: '', data: [] }
    });

    // Get actual parent's email and fetch child info
    const parentEmail = localStorage.getItem('userEmail') || '';
    const [childId, setChildId] = useState('');
    const [childName, setChildName] = useState('Student');

    const reportTypes = [
        { name: 'Academic Performance', icon: Award, color: 'bg-blue-500' },
        { name: 'Attendance Report', icon: Calendar, color: 'bg-green-500' },
        { name: 'Progress Report', icon: TrendingUp, color: 'bg-purple-500' },
        { name: 'Fee Statement', icon: FileText, color: 'bg-orange-500' }
    ];

    useEffect(() => {
        // Get parent's children from userStore
        if (parentEmail) {
            const children = getChildrenByParentEmail(parentEmail);
            if (children && children.length > 0) {
                setChildId(children[0].id);
                setChildName(children[0].name);
            }
        }
    }, [parentEmail]);

    useEffect(() => {
        if (childId) {
            loadReportData();
        }
    }, [childId]);

    const loadReportData = () => {
        console.log('Loading report data for child ID:', childId);

        // Load Academic Performance
        const finalMarks = getStudentFinalMarks(childId);
        console.log('Final marks:', finalMarks);

        const academicData = finalMarks.map((mark, index) => {
            const percentage = mark.finalTotal;
            const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'A-' : percentage >= 60 ? 'B+' : 'B';

            return {
                subject: mark.courseName || `Subject ${index + 1}`,
                grade,
                percentage: Math.round(percentage),
                rank: Math.floor(Math.random() * 10) + 1 // In real app, this would come from rankings
            };
        });

        // Load Attendance Report - Use getAllAttendance and filter by childId
        const allAttendanceRecords = getAttendanceByStudent(childId);
        console.log('All attendance records:', allAttendanceRecords);

        // Filter for this child
        const attendanceRecords = allAttendanceRecords.filter(record =>
            record.studentId.toString() === childId.toString()
        );
        console.log('Filtered attendance records for child:', attendanceRecords);

        const monthlyAttendance = {};

        attendanceRecords.forEach(record => {
            const date = new Date(record.date);
            const monthKey = date.toLocaleString('default', { month: 'long' });

            if (!monthlyAttendance[monthKey]) {
                monthlyAttendance[monthKey] = { present: 0, absent: 0 };
            }

            if (record.status === 'Present') {
                monthlyAttendance[monthKey].present++;
            } else if (record.status === 'Absent') {
                monthlyAttendance[monthKey].absent++;
            }
        });

        const attendanceData = Object.entries(monthlyAttendance).map(([month, data]) => {
            const total = data.present + data.absent;
            const percentage = total > 0 ? Math.round((data.present / total) * 100) : 0;

            return {
                month,
                present: data.present,
                absent: data.absent,
                percentage
            };
        });

        console.log('Attendance data for report:', attendanceData);

        // Load Progress Report (term-wise)
        const progressData = [];
        if (finalMarks.length > 0) {
            const avgMarks = finalMarks.reduce((sum, m) => sum + m.finalTotal, 0) / finalMarks.length;
            const grade = avgMarks >= 90 ? 'A+' : avgMarks >= 80 ? 'A' : avgMarks >= 70 ? 'A-' : avgMarks >= 60 ? 'B+' : 'B';

            progressData.push({
                term: 'Current Term',
                overall: Math.round(avgMarks),
                rank: Math.floor(Math.random() * 10) + 1,
                grade
            });
        }

        // Load Fee Statement
        const feeRecords = getFeesByStudent(childId);
        const feeData = feeRecords.map(fee => ({
            term: fee.type || 'Fee Payment',
            amount: fee.amount,
            status: fee.status === 'paid' ? 'Paid' : 'Pending',
            date: fee.paidDate ? new Date(fee.paidDate).toLocaleDateString() : undefined,
            dueDate: fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : undefined
        }));

        setReportData({
            'Academic Performance': {
                summary: 'Overall academic performance for current term',
                data: academicData.length > 0 ? academicData : [
                    { subject: 'No data available', grade: 'N/A', percentage: 0, rank: 0 }
                ]
            },
            'Attendance Report': {
                summary: 'Monthly attendance summary',
                data: attendanceData.length > 0 ? attendanceData : [
                    { month: 'No data available', present: 0, absent: 0, percentage: 0 }
                ]
            },
            'Progress Report': {
                summary: 'Term-wise progress tracking',
                data: progressData.length > 0 ? progressData : [
                    { term: 'No data available', overall: 0, rank: 0, grade: 'N/A' }
                ]
            },
            'Fee Statement': {
                summary: 'Fee payment history',
                data: feeData.length > 0 ? feeData : [
                    { term: 'No data available', amount: 0, status: 'N/A', date: 'N/A' }
                ]
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        Reports - {childName}
                    </h1>
                    <p className="text-sm text-gray-500">View and download comprehensive real-time reports</p>
                </div>
                <button className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
                    <Download className="w-5 h-5" />
                    <span>Download PDF</span>
                </button>
            </div>

            {/* Report Type Selector */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {reportTypes.map((type) => (
                    <button
                        key={type.name}
                        onClick={() => setSelectedReport(type.name)}
                        className={`p-6 rounded-xl border-2 transition-all ${selectedReport === type.name
                            ? 'border-orange-600 bg-orange-50'
                            : `${darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300'}`
                            }`}
                    >
                        <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-lg ${type.color} bg-opacity-10`}>
                                <type.icon className={`w-6 h-6 ${type.color.replace('bg-', 'text-')}`} />
                            </div>
                            <span className={`font-semibold ${selectedReport === type.name ? 'text-orange-600' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {type.name}
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Report Content */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="mb-6">
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        {selectedReport}
                    </h2>
                    <p className="text-sm text-gray-500">{reportData[selectedReport].summary}</p>
                </div>

                {selectedReport === 'Academic Performance' && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                                <tr>
                                    <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                        Subject
                                    </th>
                                    <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                        Grade
                                    </th>
                                    <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                        Percentage
                                    </th>
                                    <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                        Rank
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                {reportData[selectedReport].data.map((item, index) => (
                                    <tr key={index}>
                                        <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {item.subject}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${item.grade.startsWith('A') ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {item.grade}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-center text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {item.percentage}%
                                        </td>
                                        <td className={`px-6 py-4 text-center text-sm font-semibold text-purple-600`}>
                                            #{item.rank}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {selectedReport === 'Attendance Report' && (
                    <div className="space-y-4">
                        {reportData[selectedReport].data.map((item, index) => (
                            <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {item.month}
                                    </span>
                                    <span className={`text-sm font-semibold ${item.percentage === 100 ? 'text-green-600' : item.percentage >= 75 ? 'text-orange-600' : 'text-red-600'}`}>
                                        {item.percentage}%
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Present: </span>
                                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.present} days</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Absent: </span>
                                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.absent} days</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedReport === 'Progress Report' && (
                    <div className="space-y-4">
                        {reportData[selectedReport].data.map((item, index) => (
                            <div key={index} className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {item.term}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">Overall Performance</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {item.overall}%
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">Grade: {item.grade} | Rank: #{item.rank}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedReport === 'Fee Statement' && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                                <tr>
                                    <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                        Term
                                    </th>
                                    <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                        Amount
                                    </th>
                                    <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                        Date
                                    </th>
                                    <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                {reportData[selectedReport].data.map((item, index) => (
                                    <tr key={index}>
                                        <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {item.term}
                                        </td>
                                        <td className={`px-6 py-4 text-center text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            ${item.amount.toLocaleString()}
                                        </td>
                                        <td className={`px-6 py-4 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {item.date || item.dueDate}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'Paid'
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-yellow-100 text-yellow-600'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportsPage;
