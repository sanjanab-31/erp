import React, { useState, useEffect } from 'react';
import {
    Calendar,
    TrendingUp,
    CheckCircle,
    XCircle,
    Clock,
    Download,
    Filter
} from 'lucide-react';

const AttendancePage = ({ darkMode }) => {
    const [selectedMonth, setSelectedMonth] = useState('December 2025');
    const [attendanceData, setAttendanceData] = useState({
        overall: {
            totalDays: 20,
            present: 19,
            absent: 1,
            late: 0,
            percentage: 95
        },
        monthlyData: [
            { date: '2025-12-01', status: 'present' },
            { date: '2025-12-02', status: 'present' },
            { date: '2025-12-03', status: 'present' },
            { date: '2025-12-04', status: 'absent' },
            { date: '2025-12-05', status: 'present' },
            { date: '2025-12-06', status: 'present' },
            { date: '2025-12-07', status: 'present' },
            { date: '2025-12-08', status: 'present' },
            { date: '2025-12-09', status: 'present' },
            { date: '2025-12-10', status: 'present' },
            { date: '2025-12-11', status: 'present' },
            { date: '2025-12-12', status: 'present' },
            { date: '2025-12-13', status: 'present' },
            { date: '2025-12-14', status: 'present' },
            { date: '2025-12-15', status: 'present' },
            { date: '2025-12-16', status: 'present' },
            { date: '2025-12-17', status: 'present' },
            { date: '2025-12-18', status: 'present' },
            { date: '2025-12-19', status: 'present' },
            { date: '2025-12-20', status: 'present' }
        ]
    });

    // Real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setAttendanceData(prev => ({
                ...prev,
                overall: {
                    ...prev.overall,
                    percentage: Math.min(100, prev.overall.percentage + (Math.random() > 0.8 ? 0.1 : 0))
                }
            }));
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'present':
                return 'bg-green-100 text-green-600 border-green-200';
            case 'absent':
                return 'bg-red-100 text-red-600 border-red-200';
            case 'late':
                return 'bg-yellow-100 text-yellow-600 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Attendance
                </h1>
                <p className="text-sm text-gray-500">Monitor your child's attendance record</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Days</h3>
                        <Calendar className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {attendanceData.overall.totalDays}
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Present</h3>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold text-green-600`}>
                        {attendanceData.overall.present}
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Absent</h3>
                        <XCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <p className={`text-3xl font-bold text-red-600`}>
                        {attendanceData.overall.absent}
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Attendance %</h3>
                        <TrendingUp className="w-5 h-5 text-orange-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {attendanceData.overall.percentage.toFixed(1)}%
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex gap-4">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className={`flex-1 px-4 py-2 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    >
                        <option>December 2025</option>
                        <option>November 2025</option>
                        <option>October 2025</option>
                    </select>
                    <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
                        <Download className="w-5 h-5" />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Attendance Calendar */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                    Monthly Attendance Record
                </h3>
                <div className="grid grid-cols-7 gap-4">
                    {attendanceData.monthlyData.map((day, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-lg border-2 ${getStatusColor(day.status)} text-center`}
                        >
                            <p className="text-xs font-medium mb-1">
                                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                            </p>
                            <p className="text-lg font-bold">
                                {new Date(day.date).getDate()}
                            </p>
                            <p className="text-xs mt-1 capitalize">{day.status}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;
