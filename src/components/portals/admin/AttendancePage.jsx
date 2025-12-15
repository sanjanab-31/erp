import React, { useState, useEffect, useCallback } from 'react';
import {
    Calendar,
    Users,
    TrendingUp,
    Download,
    Filter,
    Search,
    CheckCircle,
    XCircle,
    Clock,
    BarChart3,
    Eye
} from 'lucide-react';
import { getAllStudents, subscribeToUpdates as subscribeToStudentUpdates } from '../../../utils/studentStore';
import {
    getAllAttendance,
    getAttendanceByDate,
    getAttendanceStats,
    calculateAttendancePercentage,
    subscribeToUpdates as subscribeToAttendanceUpdates
} from '../../../utils/attendanceStore';

const AttendancePage = ({ darkMode }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedClass, setSelectedClass] = useState('All Classes');
    const [allStudents, setAllStudents] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, late: 0 });

    const classes = ['All Classes', 'Grade 9-A', 'Grade 9-B', 'Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 11-B', 'Grade 12-A', 'Grade 12-B'];

    // Load data on mount and subscribe to updates
    useEffect(() => {
        loadStudents();
        loadAttendance();

        const unsubscribeStudents = subscribeToStudentUpdates(loadStudents);
        const unsubscribeAttendance = subscribeToAttendanceUpdates(loadAttendance);

        return () => {
            unsubscribeStudents();
            unsubscribeAttendance();
        };
    }, []);

    // Reload attendance when date changes
    useEffect(() => {
        loadAttendance();
    }, [selectedDate]);

    const loadStudents = useCallback(() => {
        const students = getAllStudents();
        setAllStudents(students);
    }, []);

    const loadAttendance = useCallback(() => {
        const todayAttendance = getAttendanceByDate(selectedDate);
        setAttendanceRecords(todayAttendance);

        // Update stats
        const statsData = getAttendanceStats(selectedDate);
        setStats(statsData);
    }, [selectedDate]);

    // Filter students by class
    const filteredStudents = allStudents.filter(student => {
        const matchesClass = selectedClass === 'All Classes' || student.class === selectedClass;
        return matchesClass;
    });

    // Create attendance map for quick lookup
    const attendanceMap = {};
    attendanceRecords.forEach(record => {
        attendanceMap[record.studentId] = record;
    });

    // Calculate class-wise statistics
    const classwiseStats = classes
        .filter(cls => cls !== 'All Classes')
        .map(className => {
            const classStudents = allStudents.filter(s => s.class === className);
            const classAttendance = attendanceRecords.filter(a => {
                const student = allStudents.find(s => s.id === a.studentId);
                return student && student.class === className;
            });

            const total = classStudents.length;
            const present = classAttendance.filter(a => a.status === 'Present').length;
            const absent = classAttendance.filter(a => a.status === 'Absent').length;
            const late = classAttendance.filter(a => a.status === 'Late').length;
            const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

            return {
                class: className,
                total,
                present,
                absent,
                late,
                percentage
            };
        });

    const getStatusColor = (percentage) => {
        if (percentage >= 95) return 'text-green-600 bg-green-100';
        if (percentage >= 85) return 'text-blue-600 bg-blue-100';
        if (percentage >= 75) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const overallPercentage = filteredStudents.length > 0
        ? Math.round((stats.present / filteredStudents.length) * 100)
        : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Attendance Management
                </h1>
                <p className="text-sm text-gray-500">Monitor and track student attendance marked by teachers (Real-time sync)</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Students</h3>
                        <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {filteredStudents.length}
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Present</h3>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold text-green-600`}>{stats.present}</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Absent</h3>
                        <XCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <p className={`text-3xl font-bold text-red-600`}>{stats.absent}</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Attendance Rate</h3>
                        <TrendingUp className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {overallPercentage}%
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Date
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                                } focus:outline-none`}
                        />
                    </div>

                    <div className="flex-1">
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Class
                        </label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                                } focus:outline-none`}
                        >
                            {classes.map((cls) => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Class-wise Attendance */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                <div className="p-6 border-b border-gray-200">
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Class-wise Attendance
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    {classwiseStats.length === 0 ? (
                        <div className="p-12 text-center">
                            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                No attendance data available
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Teachers will mark attendance which will appear here automatically
                            </p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                                <tr>
                                    <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                        Class
                                    </th>
                                    <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                        Total Students
                                    </th>
                                    <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                        Present
                                    </th>
                                    <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                        Absent
                                    </th>
                                    <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                        Late
                                    </th>
                                    <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                        Attendance %
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                {classwiseStats.map((classData, index) => (
                                    <tr key={index} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                                        <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {classData.class}
                                        </td>
                                        <td className={`px-6 py-4 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {classData.total}
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm font-medium text-green-600">
                                            {classData.present}
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm font-medium text-red-600">
                                            {classData.absent}
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm font-medium text-yellow-600">
                                            {classData.late}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(classData.percentage)}`}>
                                                {classData.percentage}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Student-wise Attendance Details */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                <div className="p-6 border-b border-gray-200">
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Student Attendance Details
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    {filteredStudents.length === 0 ? (
                        <div className="p-12 text-center">
                            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                No students found
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Add students to see their attendance records
                            </p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                                <tr>
                                    <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                        Roll No
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                        Student Name
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                        Class
                                    </th>
                                    <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                        Today's Status
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                        Marked By
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                        Overall Attendance
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                {filteredStudents.map((student) => {
                                    const todayRecord = attendanceMap[student.id];
                                    const overallAttendance = calculateAttendancePercentage(student.id);

                                    return (
                                        <tr key={student.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {student.rollNo}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {student.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            {student.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {student.class}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {todayRecord ? (
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${todayRecord.status === 'Present' ? 'bg-green-100 text-green-600' :
                                                            todayRecord.status === 'Late' ? 'bg-yellow-100 text-yellow-600' :
                                                                todayRecord.status === 'Absent' ? 'bg-red-100 text-red-600' :
                                                                    'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {todayRecord.status}
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-gray-400">Not marked</span>
                                                )}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {todayRecord ? todayRecord.markedBy : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        {overallAttendance}%
                                                    </span>
                                                    <div className="ml-2 w-20 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full ${overallAttendance >= 90 ? 'bg-green-500' :
                                                                overallAttendance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                                                                }`}
                                                            style={{ width: `${overallAttendance}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;
