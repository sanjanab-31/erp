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
    Eye,
    ChevronLeft,
    School,
    UserCheck,
    Save
} from 'lucide-react';
import { getAllStudents, subscribeToUpdates as subscribeToStudentUpdates } from '../../../utils/studentStore';
import {
    getAllAttendance,
    getAttendanceByDate,
    getAttendanceStats,
    subscribeToUpdates as subscribeToAttendanceUpdates
} from '../../../utils/attendanceStore';
import { getAllTeachers } from '../../../utils/teacherStore';
import {
    getAttendanceByDate as getTeacherAttendanceByDate,
    bulkMarkAttendance as bulkMarkTeacherAttendance,
    subscribeToUpdates as subscribeToTeacherAttendanceUpdates,
    getAttendanceStats as getTeacherAttendanceStats
} from '../../../utils/teacherAttendanceStore';
import { useToast } from '../../../context/ToastContext';

const AttendancePage = ({ darkMode }) => {
    const { showSuccess, showError } = useToast();
    // Global State
    const [activeTab, setActiveTab] = useState('teachers'); // 'teachers' | 'students'
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [saveStatus, setSaveStatus] = useState(null); // 'saving' | 'saved' | 'error' | null

    // Student State
    const [studentViewMode, setStudentViewMode] = useState('summary'); // 'summary' | 'details'
    const [selectedClassDetail, setSelectedClassDetail] = useState(null);
    const [allStudents, setAllStudents] = useState([]);
    const [studentAttendanceRecords, setStudentAttendanceRecords] = useState([]);
    const [studentStats, setStudentStats] = useState({ total: 0, present: 0, absent: 0, late: 0 });

    // Teacher State
    const [allTeachers, setAllTeachers] = useState([]);
    // localTeacherAttendance: Local state for UI changes before saving
    const [localTeacherAttendance, setLocalTeacherAttendance] = useState({});
    // dbTeacherAttendance: Committed state from store
    const [dbTeacherAttendance, setDbTeacherAttendance] = useState([]);
    const [teacherStats, setTeacherStats] = useState({ total: 0, present: 0, absent: 0, late: 0 });

    const classes = ['Grade 9-A', 'Grade 9-B', 'Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 11-B', 'Grade 12-A', 'Grade 12-B'];

    // Load Data
    useEffect(() => {
        loadStudentData();
        loadTeacherData();
        loadAttendanceData();

        const unsubStudents = subscribeToStudentUpdates(loadStudentData);
        const unsubStudentAtt = subscribeToAttendanceUpdates(loadAttendanceData);
        const unsubTeacherAtt = subscribeToTeacherAttendanceUpdates(loadAttendanceData);

        return () => {
            unsubStudents();
            unsubStudentAtt();
            unsubTeacherAtt();
        };
    }, []);

    useEffect(() => {
        loadAttendanceData();
        // Reset save status when date changes
        setSaveStatus(null);
    }, [selectedDate]);

    const loadStudentData = () => {
        setAllStudents(getAllStudents());
    };

    const loadTeacherData = () => {
        const teachers = getAllTeachers();
        setAllTeachers(teachers);
        return teachers;
    };

    const loadAttendanceData = () => {
        // Get fresh teacher data for stats calculation
        const currentTeachers = getAllTeachers();

        // Student Attendance (Read Only for Admin)
        const sAttendance = getAttendanceByDate(selectedDate);
        setStudentAttendanceRecords(sAttendance);
        setStudentStats(getAttendanceStats(selectedDate));

        // Teacher Attendance
        const tAttendance = getTeacherAttendanceByDate(selectedDate);
        setDbTeacherAttendance(tAttendance);

        // Calculate teacher stats based on actual records for this date
        const tStats = getTeacherAttendanceStats(selectedDate, currentTeachers.length);
        setTeacherStats(tStats);

        // Initialize local state from DB - ensure string keys for consistency
        const initialMap = {};
        tAttendance.forEach(r => {
            initialMap[String(r.teacherId)] = r.status;
        });
        setLocalTeacherAttendance(initialMap);
    };

    // --- Student Logic ---
    const getStudentAttendanceRecord = (studentId) => {
        return studentAttendanceRecords.find(r => r.studentId === studentId);
    };

    const getClassStats = () => {
        return classes.map(className => {
            const classStudents = allStudents.filter(s => s.class === className);
            const classStudentIds = classStudents.map(s => s.id);

            const records = studentAttendanceRecords.filter(r => classStudentIds.includes(r.studentId));

            const total = classStudents.length;
            const present = records.filter(r => r.status === 'Present').length;
            const absent = records.filter(r => r.status === 'Absent').length;
            const late = records.filter(r => r.status === 'Late').length;

            return {
                className,
                total,
                present,
                absent,
                late
            };
        });
    };

    // --- Teacher Logic ---
    const handleLocalStatusChange = (teacherId, status) => {
        setLocalTeacherAttendance(prev => ({
            ...prev,
            [String(teacherId)]: status
        }));
        setSaveStatus(null); // Reset save status on change
    };

    const saveTeacherAttendance = () => {
        setSaveStatus('saving');
        try {
            // Iterate over allTeachers to preserve original ID types (numbers)
            // and only save records for valid teachers
            const attendanceList = allTeachers
                .filter(teacher => localTeacherAttendance[String(teacher.id)]) // Only include if status is set
                .map(teacher => ({
                    date: selectedDate,
                    teacherId: teacher.id, // Preserves original ID type (number)
                    status: localTeacherAttendance[String(teacher.id)],
                    markedBy: 'Admin'
                }));

            if (attendanceList.length === 0 && Object.keys(localTeacherAttendance).length > 0) {
                // Fallback if no matching teachers found but local state exists (shouldn't happen)
                console.warn("Mismatch between teachers list and attendance map");
            }

            bulkMarkTeacherAttendance(attendanceList);
            setSaveStatus('saved');
            showSuccess('Teacher attendance saved successfully!');
            setTimeout(() => setSaveStatus(null), 3000);

            // Stats will update automatically via subscription
        } catch (error) {
            console.error(error);
            setSaveStatus('error');
            showError('Error saving attendance: ' + error.message);
        }
    };

    // Status Styles
    const getStatusStyle = (status, isSelected) => {
        if (!isSelected) return 'bg-transparent border-gray-300 text-gray-500 hover:bg-gray-50';

        switch (status) {
            case 'Present': return 'bg-green-100 text-green-700 border-green-200 ring-1 ring-green-500';
            case 'Absent': return 'bg-red-100 text-red-700 border-red-200 ring-1 ring-red-500';
            case 'Late': return 'bg-yellow-100 text-yellow-700 border-yellow-200 ring-1 ring-yellow-500';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };

    const getReadOnlyStatusBadge = (status) => {
        switch (status) {
            case 'Present': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">Present</span>;
            case 'Absent': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">Absent</span>;
            case 'Late': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">Late</span>;
            default: return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">Not Marked</span>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Toggle */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Attendance Management
                    </h1>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {activeTab === 'teachers' ? 'Manage Staff Attendance' : 'Monitor Student Attendance'}
                    </p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('teachers')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'teachers'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Teachers
                    </button>
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'students'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Students
                    </button>
                </div>
            </div>

            {/* Date Filter (Common) */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-4">
                    <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Select Date:
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className={`pl-10 pr-4 py-2 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                    </div>
                </div>
            </div>

            {/* TEACHER VIEW */}
            {activeTab === 'teachers' && (
                <div className="space-y-6">
                    {/* Teacher Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <StatCard title="Total Staff" value={allTeachers.length} icon={Users} color="blue" darkMode={darkMode} />
                        <StatCard title="Present" value={teacherStats.present} icon={CheckCircle} color="green" darkMode={darkMode} />
                        <StatCard title="Absent" value={teacherStats.absent} icon={XCircle} color="red" darkMode={darkMode} />
                        <StatCard title="Late" value={teacherStats.late} icon={Clock} color="yellow" darkMode={darkMode} />
                    </div>

                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Teacher Attendance Records
                            </h3>
                            {/* Save Button */}
                            <button
                                onClick={saveTeacherAttendance}
                                disabled={saveStatus === 'saved'}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${saveStatus === 'saved'
                                    ? 'bg-green-100 text-green-700 cursor-default'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                {saveStatus === 'saved' ? (
                                    <>
                                        <CheckCircle className="w-4 h-4" /> Saved
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" /> Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Employee ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Teacher Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Department</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                    {allTeachers.map(teacher => {
                                        const status = localTeacherAttendance[String(teacher.id)] || '';

                                        return (
                                            <tr key={teacher.id} className={darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}>
                                                <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{teacher.employeeId}</td>
                                                <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{teacher.name}</td>
                                                <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{teacher.department || 'General'}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        {['Present', 'Absent', 'Late'].map(opt => (
                                                            <button
                                                                key={opt}
                                                                onClick={() => handleLocalStatusChange(teacher.id, opt)}
                                                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${getStatusStyle(opt, status === opt)}`}
                                                            >
                                                                {opt}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {allTeachers.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                                No teachers found. Add teachers in the Teachers module.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* STUDENT VIEW */}
            {activeTab === 'students' && (
                <div className="space-y-6">
                    {studentViewMode === 'summary' ? (
                        <>
                            {/* Stats (Overall) */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <StatCard title="Total Students" value={allStudents.length} icon={School} color="blue" darkMode={darkMode} />
                                <StatCard title="Present Today" value={studentStats.present} icon={CheckCircle} color="green" darkMode={darkMode} />
                                <StatCard title="Absent Today" value={studentStats.absent} icon={XCircle} color="red" darkMode={darkMode} />
                                <StatCard title="Late Today" value={studentStats.late} icon={Clock} color="yellow" darkMode={darkMode} />
                            </div>

                            {/* Class Summary Table */}
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Class-wise Attendance Summary
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">Student attendance is marked by teachers</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Class Name</th>
                                                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Total Students</th>
                                                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Present</th>
                                                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Absent</th>
                                                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Late</th>
                                                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                            {getClassStats().map((stat, idx) => (
                                                <tr key={idx} className={darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}>
                                                    <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.className}</td>
                                                    <td className={`px-6 py-4 text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{stat.total}</td>
                                                    <td className="px-6 py-4 text-sm text-center text-green-600 font-medium">{stat.present}</td>
                                                    <td className="px-6 py-4 text-sm text-center text-red-600 font-medium">{stat.absent}</td>
                                                    <td className="px-6 py-4 text-sm text-center text-yellow-600 font-medium">{stat.late}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedClassDetail(stat.className);
                                                                setStudentViewMode('details');
                                                            }}
                                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center gap-1 mx-auto"
                                                        >
                                                            <Eye className="w-4 h-4" /> View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        // Details View (Read Only)
                        <div className="space-y-4">
                            <button
                                onClick={() => setStudentViewMode('summary')}
                                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" /> Back to Summary
                            </button>

                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Attendance for {selectedClassDetail}
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full border border-gray-200">Read Only View</span>
                                        <span className="text-sm text-gray-500">{selectedDate}</span>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Roll No</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Student Name</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                            {allStudents
                                                .filter(s => s.class === selectedClassDetail)
                                                .map(student => {
                                                    const record = getStudentAttendanceRecord(student.id);
                                                    const status = record ? record.status : 'Not Marked';
                                                    return (
                                                        <tr key={student.id} className={darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}>
                                                            <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{student.rollNo}</td>
                                                            <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{student.name}</td>
                                                            <td className="px-6 py-4">
                                                                {getReadOnlyStatusBadge(status)}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            {allStudents.filter(s => s.class === selectedClassDetail).length === 0 && (
                                                <tr>
                                                    <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                                                        No students found in this class.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color, darkMode }) => {
    const colors = {
        blue: 'text-blue-500',
        green: 'text-green-500',
        red: 'text-red-500',
        yellow: 'text-yellow-500'
    };

    return (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{title}</h3>
                <Icon className={`w-5 h-5 ${colors[color]}`} />
            </div>
            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {value}
            </p>
        </div>
    );
};

export default AttendancePage;
