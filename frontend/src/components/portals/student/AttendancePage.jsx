import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Calendar, CheckCircle, XCircle, Clock, TrendingUp, AlertCircle, User } from 'lucide-react';
import { studentApi, attendanceApi } from '../../../services/api';

const AttendancePage = () => {
    const { darkMode, student } = useOutletContext();
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        if (student) {
            loadAttendance();
        }
    }, [student]);

    const loadAttendance = useCallback(async () => {
        if (!student) return;
        setLoading(true);

        try {
            const attendanceRes = await attendanceApi.getByStudent(student.id);
            const data = attendanceRes.data?.data;
            const studentRecords = Array.isArray(data) ? data : [];
            setAttendanceRecords(studentRecords);
        } catch (error) {
            console.error('Error loading attendance:', error);
        } finally {
            setLoading(false);
        }
    }, [student]);

    const calculateStats = () => {
        let totalDays = attendanceRecords.length;
        let presentDays = attendanceRecords.filter(r => r.status === 'Present').length;
        let absentDays = attendanceRecords.filter(r => r.status === 'Absent').length;
        let lateDays = attendanceRecords.filter(r => r.status === 'Late').length;

        const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

        return { totalDays, presentDays, absentDays, lateDays, attendanceRate };
    };

    const stats = calculateStats();

    const getAttendanceForDate = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        const record = attendanceRecords.find(r => r.date === dateStr);
        return record ? record.status : null;
    };

    const generateCalendarDays = () => {
        const firstDay = new Date(selectedYear, selectedMonth, 1);
        const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(selectedYear, selectedMonth, day);
            const status = getAttendanceForDate(date);
            days.push({ day, date, status });
        }

        return days;
    };

    const calendarDays = generateCalendarDays();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Present':
                return 'bg-green-500';
            case 'Absent':
                return 'bg-red-500';
            case 'Late':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-300';
        }
    };

    const getStatusIcon = (status, className = "w-4 h-4") => {
        switch (status) {
            case 'Present':
                return <CheckCircle className={`${className} text-white`} />;
            case 'Absent':
                return <XCircle className={`${className} text-white`} />;
            case 'Late':
                return <Clock className={`${className} text-white`} />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex-1 overflow-y-auto p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
                        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Loading attendance...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-8">
            { }
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    My Attendance
                </h1>
                <p className="text-sm text-gray-500">
                    {student ? `${student.name} - ${student.class} (Real-time sync with Teacher)` : 'Loading...'}
                </p>
            </div>

            { }
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Days</h3>
                        <Calendar className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.totalDays}</p>
                    <p className="text-sm text-gray-500 mt-1">Recorded</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Present</h3>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.presentDays}</p>
                    <p className="text-sm text-gray-500 mt-1">Days present</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Absent</h3>
                        <XCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.absentDays}</p>
                    <p className="text-sm text-gray-500 mt-1">Days absent</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Attendance Rate</h3>
                        <TrendingUp className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.attendanceRate}%</p>
                    <p className="text-sm text-gray-500 mt-1">Overall</p>
                </div>
            </div>

            { }
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-8`}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Attendance Progress
                    </h3>
                    <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {stats.attendanceRate}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                        className={`h-4 rounded-full transition-all duration-300 ${stats.attendanceRate >= 75 ? 'bg-green-500' : stats.attendanceRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                        style={{ width: `${stats.attendanceRate}%` }}
                    ></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>0%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                </div>
            </div>

            { }
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-3 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-8 max-w-2xl mx-auto`}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Attendance Calendar
                    </h3>
                    <div className="flex items-center space-x-2">
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                            className={`px-2 py-1 text-xs rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none`}
                        >
                            {monthNames.map((month, index) => (
                                <option key={index} value={index}>{month}</option>
                            ))}
                        </select>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className={`px-2 py-1 text-xs rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none`}
                        >
                            {[2024, 2025, 2026].map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>

                { }
                <div className="grid grid-cols-7 gap-0.5">
                    { }
                    {dayNames.map(day => (
                        <div key={day} className={`text-center text-[10px] font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} py-0.5`}>
                            {day}
                        </div>
                    ))}

                    { }
                    {calendarDays.map((dayData, index) => (
                        <div
                            key={index}
                            className={`h-10 w-full flex items-center justify-center rounded-sm text-[10px] ${dayData
                                ? dayData.status
                                    ? `${getStatusColor(dayData.status)} text-white`
                                    : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                                : ''
                                }`}
                        >
                            {dayData && (
                                <div className="flex flex-col items-center justify-center">
                                    <span className="text-[10px] font-medium">{dayData.day}</span>
                                    {dayData.status && (
                                        <div className="mt-0.5">
                                            {getStatusIcon(dayData.status, 'w-2.5 h-2.5')}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                { }
                <div className="flex items-center justify-center space-x-3 mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-1.5">
                        <div className="w-2.5 h-2.5 rounded bg-green-500"></div>
                        <span className={`text-[10px] ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Present</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                        <div className="w-2.5 h-2.5 rounded bg-red-500"></div>
                        <span className={`text-[10px] ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Absent</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                        <div className="w-2.5 h-2.5 rounded bg-yellow-500"></div>
                        <span className={`text-[10px] ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Late</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                        <div className={`w-2.5 h-2.5 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
                        <span className={`text-[10px] ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Not Marked</span>
                    </div>
                </div>
            </div>

            { }
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Recent Attendance
                </h3>

                {attendanceRecords.length === 0 ? (
                    <div className="text-center py-12">
                        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            No attendance records yet
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Your teacher will mark attendance soon
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {attendanceRecords.slice(0, 10).reverse().map((record) => (
                            <div key={record.id} className={`flex items-center justify-between p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center space-x-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(record.status)}`}>
                                        {getStatusIcon(record.status)}
                                    </div>
                                    <div>
                                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Marked by: {record.markedBy}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${record.status === 'Present' ? 'bg-green-100 text-green-800' :
                                        record.status === 'Absent' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {record.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default AttendancePage;
