import React, { useState, useEffect } from 'react';
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

const AttendancePage = ({ darkMode }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedClass, setSelectedClass] = useState('Grade 10-A');
    const [selectedSubject, setSelectedSubject] = useState('Mathematics');
    const [searchQuery, setSearchQuery] = useState('');
    const [saved, setSaved] = useState(false);

    const classes = ['Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 11-B'];
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science'];

    const [students, setStudents] = useState([
        { id: 1, name: 'John Doe', rollNo: '10A-001', status: 'present', totalAttendance: 95 },
        { id: 2, name: 'Jane Smith', rollNo: '10A-002', status: 'present', totalAttendance: 88 },
        { id: 3, name: 'Mike Wilson', rollNo: '10A-003', status: 'absent', totalAttendance: 92 },
        { id: 4, name: 'Sarah Johnson', rollNo: '10A-004', status: 'present', totalAttendance: 78 },
        { id: 5, name: 'David Brown', rollNo: '10A-005', status: 'late', totalAttendance: 85 },
        { id: 6, name: 'Emily Davis', rollNo: '10A-006', status: 'present', totalAttendance: 97 },
        { id: 7, name: 'James Wilson', rollNo: '10A-007', status: 'present', totalAttendance: 90 },
        { id: 8, name: 'Lisa Anderson', rollNo: '10A-008', status: 'absent', totalAttendance: 82 }
    ]);

    const toggleAttendance = (studentId, newStatus) => {
        setStudents(students.map(student =>
            student.id === studentId ? { ...student, status: newStatus } : student
        ));
        setSaved(false);
    };

    const markAllPresent = () => {
        setStudents(students.map(student => ({ ...student, status: 'present' })));
        setSaved(false);
    };

    const markAllAbsent = () => {
        setStudents(students.map(student => ({ ...student, status: 'absent' })));
        setSaved(false);
    };

    const saveAttendance = () => {
        // Simulate saving to backend
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const presentCount = students.filter(s => s.status === 'present').length;
    const absentCount = students.filter(s => s.status === 'absent').length;
    const lateCount = students.filter(s => s.status === 'late').length;
    const attendancePercentage = Math.round((presentCount / students.length) * 100);

    return (
        <div className="flex-1 overflow-y-auto p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Attendance Management
                </h1>
                <p className="text-sm text-gray-500">Mark and track student attendance</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Students</h3>
                        <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{students.length}</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Present</h3>
                        <UserCheck className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold text-green-600`}>{presentCount}</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Absent</h3>
                        <UserX className="w-5 h-5 text-red-500" />
                    </div>
                    <p className={`text-3xl font-bold text-red-600`}>{absentCount}</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Attendance Rate</h3>
                        <TrendingUp className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{attendancePercentage}%</p>
                </div>
            </div>

            {/* Filters */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
                                } focus:outline-none focus:ring-2 focus:ring-green-500`}
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
                                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                        >
                            {classes.map((cls) => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Subject
                        </label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                        >
                            {subjects.map((subject) => (
                                <option key={subject} value={subject}>{subject}</option>
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
                                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
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

                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
                        <Download className="w-5 h-5" />
                        <span>Export Report</span>
                    </button>
                </div>

                {saved && (
                    <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>Attendance saved successfully!</span>
                    </div>
                )}
            </div>

            {/* Attendance Table */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                <div className="overflow-x-auto">
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
                                    Total Attendance
                                </th>
                                <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {filteredStudents.map((student) => (
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
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {student.totalAttendance}%
                                            </span>
                                            <div className="ml-2 w-20 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${student.totalAttendance >= 90 ? 'bg-green-500' :
                                                        student.totalAttendance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}
                                                    style={{ width: `${student.totalAttendance}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button
                                                onClick={() => toggleAttendance(student.id, 'present')}
                                                className={`p-2 rounded-lg transition-all ${student.status === 'present'
                                                    ? 'bg-green-100 text-green-600 ring-2 ring-green-500'
                                                    : 'bg-gray-100 text-gray-400 hover:bg-green-50'
                                                    }`}
                                                title="Present"
                                            >
                                                <CheckCircle className="w-6 h-6" />
                                            </button>

                                            <button
                                                onClick={() => toggleAttendance(student.id, 'late')}
                                                className={`p-2 rounded-lg transition-all ${student.status === 'late'
                                                    ? 'bg-yellow-100 text-yellow-600 ring-2 ring-yellow-500'
                                                    : 'bg-gray-100 text-gray-400 hover:bg-yellow-50'
                                                    }`}
                                                title="Late"
                                            >
                                                <Clock className="w-6 h-6" />
                                            </button>

                                            <button
                                                onClick={() => toggleAttendance(student.id, 'absent')}
                                                className={`p-2 rounded-lg transition-all ${student.status === 'absent'
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;
