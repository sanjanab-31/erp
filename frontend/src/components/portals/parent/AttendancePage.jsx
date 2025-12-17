import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, TrendingUp, AlertCircle, User } from 'lucide-react';
import { getAllStudents } from '../../../utils/studentStore';
import { getAllAttendance, subscribeToUpdates } from '../../../utils/attendanceStore';

const AttendancePage = ({ darkMode }) => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [childName, setChildName] = useState('');
    const [childClass, setChildClass] = useState('');
    const [childId, setChildId] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const parentEmail = localStorage.getItem('userEmail');

    useEffect(() => {
        loadAttendance();
        const unsubscribe = subscribeToUpdates(loadAttendance);
        return unsubscribe;
    }, []);

    const loadAttendance = useCallback(() => {
        setLoading(true);
        console.log('Loading attendance for parent email:', parentEmail);


        const students = getAllStudents();
        const child = students.find(s => s.parentEmail === parentEmail || s.guardianEmail === parentEmail);
        console.log('Child found:', child);

        if (child) {
            setChildName(child.name);
            setChildClass(child.class);
            setChildId(child.id);


            const allRecords = getAllAttendance();
            console.log('All attendance records:', allRecords);


            const childRecords = allRecords.filter(record =>
                record.studentId.toString() === child.id.toString()
            );
            console.log('Child attendance records:', childRecords);

            setAttendanceRecords(childRecords);
        }

        setLoading(false);
    }, [parentEmail]);


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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Present':
                return <CheckCircle className="w-4 h-4 text-white" />;
            case 'Absent':
                return <XCircle className="w-4 h-4 text-white" />;
            case 'Late':
                return <Clock className="w-4 h-4 text-white" />;
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
                    {childName ? `${childName}'s Attendance` : 'Child\'s Attendance'}
                </h1>
                <p className="text-sm text-gray-500">
                    {childClass} (Real-time sync with Teacher)
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
                {stats.attendanceRate < 75 && (
                    <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border`}>
                        <p className={`text-sm ${darkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                            ⚠️ Attendance is below 75%. Please ensure your child attends regularly.
                        </p>
                    </div>
                )}
            </div>

            { }
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-8`}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Attendance Calendar
                    </h3>
                    <div className="flex items-center space-x-4">
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                            className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none`}
                        >
                            {monthNames.map((month, index) => (
                                <option key={index} value={index}>{month}</option>
                            ))}
                        </select>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none`}
                        >
                            {[2024, 2025, 2026].map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>

                { }
                <div className="grid grid-cols-7 gap-2">
                    { }
                    {dayNames.map(day => (
                        <div key={day} className={`text-center text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} py-2`}>
                            {day}
                        </div>
                    ))}

                    { }
                    {calendarDays.map((dayData, index) => (
                        <div
                            key={index}
                            className={`aspect-square flex items-center justify-center rounded-lg ${dayData
                                ? dayData.status
                                    ? `${getStatusColor(dayData.status)} text-white`
                                    : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                                : ''
                                }`}
                        >
                            {dayData && (
                                <div className="flex flex-col items-center justify-center">
                                    <span className="text-sm font-medium">{dayData.day}</span>
                                    {dayData.status && (
                                        <div className="mt-1">
                                            {getStatusIcon(dayData.status)}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                { }
                <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-green-500"></div>
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Present</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-red-500"></div>
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Absent</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-yellow-500"></div>
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Late</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Not Marked</span>
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
                            Teachers will mark attendance soon
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

            { }
            <div className={`${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-xl p-4 mt-6`}>
                <div className="flex items-start space-x-3">
                    <AlertCircle className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mt-0.5`} />
                    <div>
                        <h4 className={`font-semibold text-sm ${darkMode ? 'text-blue-300' : 'text-blue-900'} mb-1`}>
                            Real-time Sync
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                            Your child's attendance is marked by teachers. Any changes made by teachers will appear here automatically without needing to refresh the page.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;
