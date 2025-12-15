import React, { useState, useEffect, useCallback } from 'react';
import {
    Calendar,
    Users,
    CheckCircle,
    XCircle,
    Clock,
    Download,
    Filter,
    Search,
    Save,
    AlertCircle,
    TrendingUp,
    UserCheck,
    UserX
} from 'lucide-react';
import { getAllStudents, subscribeToUpdates as subscribeToStudentUpdates } from '../../../utils/studentStore';
import {
    markAttendance,
    bulkMarkAttendance,
    getAttendanceByDate,
    getAttendanceStats,
    calculateAttendancePercentage,
    subscribeToUpdates as subscribeToAttendanceUpdates
} from '../../../utils/attendanceStore';

const AttendancePage = ({ darkMode }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedClass, setSelectedClass] = useState('All Classes');
    const [searchQuery, setSearchQuery] = useState('');
    const [saved, setSaved] = useState(false);
    const [allStudents, setAllStudents] = useState([]);
    const [attendanceData, setAttendanceData] = useState({});
    const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, late: 0 });

    const classes = ['All Classes', 'Grade 9-A', 'Grade 9-B', 'Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 11-B', 'Grade 12-A', 'Grade 12-B'];

    // Load students and attendance
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
        const attendanceMap = {};

        todayAttendance.forEach(record => {
            attendanceMap[record.studentId] = record.status;
        });

        setAttendanceData(attendanceMap);

        // Update stats
        const statsData = getAttendanceStats(selectedDate);
        setStats(statsData);
    }, [selectedDate]);

    const toggleAttendance = (studentId, newStatus) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: newStatus
        }));
        setSaved(false);
    };

    const markAllPresent = () => {
        const newAttendance = {};
        filteredStudents.forEach(student => {
            newAttendance[student.id] = 'Present';
        });
        setAttendanceData(prev => ({ ...prev, ...newAttendance }));
        setSaved(false);
    };

    const markAllAbsent = () => {
        const newAttendance = {};
        filteredStudents.forEach(student => {
            newAttendance[student.id] = 'Absent';
        });
        setAttendanceData(prev => ({ ...prev, ...newAttendance }));
        setSaved(false);
    };

    const saveAttendance = () => {
        try {
            const teacherName = localStorage.getItem('userName') || 'Teacher';
            const attendanceList = filteredStudents.map(student => ({
                date: selectedDate,
                studentId: student.id,
                status: attendanceData[student.id] || 'Absent',
                markedBy: teacherName
            }));

            bulkMarkAttendance(attendanceList);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            alert('Error saving attendance: ' + error.message);
        }
    };

    const filteredStudents = allStudents.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesClass = selectedClass === 'All Classes' || student.class === selectedClass;
        return matchesSearch && matchesClass;
    });

    // Calculate current stats based on UI state
    const currentPresentCount = filteredStudents.filter(s => attendanceData[s.id] === 'Present').length;
    const currentAbsentCount = filteredStudents.filter(s => attendanceData[s.id] === 'Absent').length;
    const currentLateCount = filteredStudents.filter(s => attendanceData[s.id] === 'Late').length;
    const currentAttendancePercentage = filteredStudents.length > 0
        ? Math.round((currentPresentCount / filteredStudents.length) * 100)
        : 0;

    return (
        <div className="flex-1 overflow-y-auto p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Attendance Management
                </h1>
                <p className="text-sm text-gray-500">Mark and track student attendance (Real-time sync with Admin)</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Students</h3>
                        <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{filteredStudents.length}</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Present</h3>
                        <UserCheck className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold text-green-600`}>{currentPresentCount}</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Absent</h3>
                        <UserX className="w-5 h-5 text-red-500" />
                    </div>
                    <p className={`text-3xl font-bold text-red-600`}>{currentAbsentCount}</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Attendance Rate</h3>
                        <TrendingUp className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentAttendancePercentage}%</p>
                </div>
            </div>

            {/* Filters */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
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

                    <div>
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

                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Search
                        </label>
                        <div className="relative">
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search student..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                    : 'bg-gray-50 border-gray-300 text-gray-900'
                                    } focus:outline-none`}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={markAllPresent}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                        <CheckCircle className="w-5 h-5" />
                        <span>Mark All Present</span>
                    </button>

                    <button
                        onClick={markAllAbsent}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                    >
                        <XCircle className="w-5 h-5" />
                        <span>Mark All Absent</span>
                    </button>

                    <button
                        onClick={saveAttendance}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                        <Save className="w-5 h-5" />
                        <span>Save Attendance</span>
                    </button>
                </div>

                {saved && (
                    <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>Attendance saved successfully and synced with Admin!</span>
                    </div>
                )}
            </div>

            {/* Attendance Table */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                <div className="overflow-x-auto">
                    {filteredStudents.length === 0 ? (
                        <div className="p-12 text-center">
                            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                No students found
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Students added by Admin will appear here automatically
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
                                    <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                        Overall Attendance
                                    </th>
                                    <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                        Today's Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                {filteredStudents.map((student) => {
                                    const overallAttendance = calculateAttendancePercentage(student.id);
                                    const todayStatus = attendanceData[student.id] || 'Absent';

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
                                                        <div className="text-sm text-gray-500">{student.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {student.class}
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
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        onClick={() => toggleAttendance(student.id, 'Present')}
                                                        className={`p-2 rounded-lg transition-all ${todayStatus === 'Present'
                                                            ? 'bg-green-100 text-green-600 ring-2 ring-green-500'
                                                            : 'bg-gray-100 text-gray-400 hover:bg-green-50'
                                                            }`}
                                                        title="Present"
                                                    >
                                                        <CheckCircle className="w-6 h-6" />
                                                    </button>

                                                    <button
                                                        onClick={() => toggleAttendance(student.id, 'Late')}
                                                        className={`p-2 rounded-lg transition-all ${todayStatus === 'Late'
                                                            ? 'bg-yellow-100 text-yellow-600 ring-2 ring-yellow-500'
                                                            : 'bg-gray-100 text-gray-400 hover:bg-yellow-50'
                                                            }`}
                                                        title="Late"
                                                    >
                                                        <Clock className="w-6 h-6" />
                                                    </button>

                                                    <button
                                                        onClick={() => toggleAttendance(student.id, 'Absent')}
                                                        className={`p-2 rounded-lg transition-all ${todayStatus === 'Absent'
                                                            ? 'bg-red-100 text-red-600 ring-2 ring-red-500'
                                                            : 'bg-gray-100 text-gray-400 hover:bg-red-50'
                                                            }`}
                                                        title="Absent"
                                                    >
                                                        <XCircle className="w-6 h-6" />
                                                    </button>
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
