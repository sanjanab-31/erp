import React, { useState, useEffect } from 'react';
import {
    Download,
    FileText,
    TrendingUp,
    Award,
    Calendar,
    BarChart3
} from 'lucide-react';
import {
    attendanceApi,
    resultApi,
    feeApi,
    studentApi,
    courseApi
} from '../../../services/api';

const ReportsPage = ({ darkMode }) => {
    const [selectedReport, setSelectedReport] = useState('Academic Performance');
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState({
        'Academic Performance': { summary: '', data: [] },
        'Attendance Report': { summary: '', data: [] },
        'Progress Report': { summary: '', data: [] },
        'Fee Statement': { summary: '', data: [] }
    });

    const parentEmail = localStorage.getItem('userEmail') || '';
    const [child, setChild] = useState(null);

    useEffect(() => {
        const init = async () => {
            if (!parentEmail) return;
            setLoading(true);
            try {
                const studentsRes = await studentApi.getAll();
                const allStudents = studentsRes.data || [];
                const foundChild = allStudents.find(s => s.parentEmail === parentEmail || s.guardianEmail === parentEmail || s.email === parentEmail);

                if (foundChild) {
                    setChild(foundChild);
                    await loadReportData(foundChild);
                }
            } catch (error) {
                console.error('Error initializing reports:', error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [parentEmail]);

    const loadReportData = async (childInfo) => {
        try {
            const [resultsRes, attendanceRes, feesRes, coursesRes] = await Promise.all([
                resultApi.getAll({ studentId: childInfo.id }),
                attendanceApi.getAll({ studentId: childInfo.id }),
                feeApi.getAll({ studentId: childInfo.id }),
                courseApi.getAll()
            ]);

            const finalResults = resultsRes.data || [];
            const allAttendance = attendanceRes.data || [];
            const childAttendance = allAttendance.filter(r => r.studentId.toString() === childInfo.id.toString());
            const fees = feesRes.data || [];
            const courses = coursesRes.data || [];

            const academicData = finalResults.map(res => {
                const course = courses.find(c => c.id === res.courseId) || {};
                const percentage = res.percentage || 0;
                const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'A-' : percentage >= 60 ? 'B+' : 'B';
                return {
                    subject: course.name || 'Subject',
                    grade,
                    percentage: Math.round(percentage),
                    rank: '-'
                };
            });

            const monthlyAttendance = {};
            childAttendance.forEach(record => {
                const date = new Date(record.date);
                const monthKey = date.toLocaleString('default', { month: 'long' });
                if (!monthlyAttendance[monthKey]) monthlyAttendance[monthKey] = { present: 0, absent: 0 };
                if (record.status === 'Present') monthlyAttendance[monthKey].present++;
                else if (record.status === 'Absent') monthlyAttendance[monthKey].absent++;
            });

            const attendanceData = Object.entries(monthlyAttendance).map(([month, data]) => {
                const total = data.present + data.absent;
                return {
                    month,
                    present: data.present,
                    absent: data.absent,
                    percentage: total > 0 ? Math.round((data.present / total) * 100) : 0
                };
            });

            const overallAvg = finalResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / (finalResults.length || 1);
            const progressData = finalResults.length > 0 ? [{
                term: 'Current Term',
                overall: Math.round(overallAvg),
                rank: '-',
                grade: overallAvg >= 90 ? 'A+' : overallAvg >= 80 ? 'A' : overallAvg >= 70 ? 'A-' : 'B'
            }] : [];

            const feeData = fees.map(fee => ({
                term: fee.feeType || 'Fee Payment',
                amount: fee.amount,
                status: fee.status || 'Pending',
                date: fee.updatedAt ? new Date(fee.updatedAt).toLocaleDateString() : 'N/A',
                dueDate: fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : 'N/A'
            }));

            setReportData({
                'Academic Performance': {
                    summary: 'Overall academic performance for current term',
                    data: academicData
                },
                'Attendance Report': {
                    summary: 'Monthly attendance summary',
                    data: attendanceData
                },
                'Progress Report': {
                    summary: 'Term-wise progress tracking',
                    data: progressData
                },
                'Fee Statement': {
                    summary: 'Fee payment history',
                    data: feeData
                }
            });
        } catch (error) {
            console.error('Error loading report data:', error);
        }
    };

    if (!child && !loading) return <div className="p-8 text-center text-gray-500">No student profile found for this parent account.</div>;
    const childName = child?.name || 'Student';
    const childId = child?.id || '';

    const reportTypes = [
        { name: 'Academic Performance', icon: Award, color: 'bg-blue-500' },
        { name: 'Attendance Report', icon: Calendar, color: 'bg-green-500' },
        { name: 'Progress Report', icon: TrendingUp, color: 'bg-purple-500' },
        { name: 'Fee Statement', icon: FileText, color: 'bg-orange-500' }
    ];

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

            { }
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

            { }
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
