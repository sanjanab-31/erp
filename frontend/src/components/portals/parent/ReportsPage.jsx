import React, { useState } from 'react';
import {
    Download,
    FileText,
    TrendingUp,
    Award,
    Calendar,
    BarChart3
} from 'lucide-react';

const ReportsPage = ({ darkMode }) => {
    const [selectedReport, setSelectedReport] = useState('Academic Performance');

    const reportTypes = [
        { name: 'Academic Performance', icon: Award, color: 'bg-blue-500' },
        { name: 'Attendance Report', icon: Calendar, color: 'bg-green-500' },
        { name: 'Progress Report', icon: TrendingUp, color: 'bg-purple-500' },
        { name: 'Fee Statement', icon: FileText, color: 'bg-orange-500' }
    ];

    const reports = {
        'Academic Performance': {
            summary: 'Overall academic performance for current term',
            data: [
                { subject: 'Mathematics', grade: 'A+', percentage: 98, rank: 2 },
                { subject: 'Physics', grade: 'A', percentage: 92, rank: 5 },
                { subject: 'Chemistry', grade: 'A', percentage: 94, rank: 3 },
                { subject: 'English', grade: 'A-', percentage: 88, rank: 8 },
                { subject: 'Computer Science', grade: 'A+', percentage: 96, rank: 1 }
            ]
        },
        'Attendance Report': {
            summary: 'Monthly attendance summary',
            data: [
                { month: 'September', present: 22, absent: 0, percentage: 100 },
                { month: 'October', present: 21, absent: 1, percentage: 95.5 },
                { month: 'November', present: 20, absent: 0, percentage: 100 },
                { month: 'December', present: 19, absent: 1, percentage: 95 }
            ]
        },
        'Progress Report': {
            summary: 'Term-wise progress tracking',
            data: [
                { term: 'Term 1', overall: 89, rank: 5, grade: 'A' },
                { term: 'Term 2', overall: 92, rank: 3, grade: 'A+' },
                { term: 'Term 3', overall: 93.5, rank: 3, grade: 'A+' }
            ]
        },
        'Fee Statement': {
            summary: 'Fee payment history',
            data: [
                { term: 'Q1 2025', amount: 5000, status: 'Paid', date: '2025-04-15' },
                { term: 'Q2 2025', amount: 5000, status: 'Paid', date: '2025-07-15' },
                { term: 'Q3 2025', amount: 5000, status: 'Pending', dueDate: '2026-01-20' }
            ]
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        Reports
                    </h1>
                    <p className="text-sm text-gray-500">View and download comprehensive reports</p>
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
                    <p className="text-sm text-gray-500">{reports[selectedReport].summary}</p>
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
                                {reports[selectedReport].data.map((item, index) => (
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
                        {reports[selectedReport].data.map((item, index) => (
                            <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {item.month}
                                    </span>
                                    <span className={`text-sm font-semibold ${item.percentage === 100 ? 'text-green-600' : 'text-orange-600'}`}>
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
                        {reports[selectedReport].data.map((item, index) => (
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
                                {reports[selectedReport].data.map((item, index) => (
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
