import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
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
    UserX,
    User
} from 'lucide-react';
import {
    studentApi,
    teacherApi,
    attendanceApi
} from '../../../services/api';

const AttendancePage = () => {
    const { darkMode } = useOutletContext();

    const [activeTab, setActiveTab] = useState('student_attendance');
    const [currentUser, setCurrentUser] = useState(null);

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedClass, setSelectedClass] = useState('All Classes');
    const [searchQuery, setSearchQuery] = useState('');
    const [saveStatus, setSaveStatus] = useState(null);
    const [allStudents, setAllStudents] = useState([]);

    const [localAttendanceData, setLocalAttendanceData] = useState({});

    const [myAttendanceHistory, setMyAttendanceHistory] = useState([]);
    const [availableClasses, setAvailableClasses] = useState(['All Classes']);
    const [allAttendance, setAllAttendance] = useState([]);

    useEffect(() => {
        const init = async () => {
            const userEmail = localStorage.getItem('userEmail');
            if (userEmail) {
                try {
                    const teachersRes = await teacherApi.getAll();
                    const teachersData = teachersRes.data?.data;
                    const teachers = Array.isArray(teachersData) ? teachersData : [];
                    const teacher = teachers.find(t => t.email === userEmail);
                    if (teacher) {
                        setCurrentUser(teacher);
                        loadMyAttendance(teacher.id);
                    }
                } catch (error) {
                    console.error('Error loading teacher profile:', error);
                }
            }
            loadStudents();
            loadStudentAttendance();
        };

        init();
    }, []);

    useEffect(() => {
        if (activeTab === 'student_attendance') {
            loadStudentAttendance();
            setSaveStatus(null);
        }
    }, [selectedDate, selectedClass, activeTab]);

    const loadStudents = async () => {
        try {
            const res = await studentApi.getAll();
            const data = res.data?.data || res.data;
            const students = Array.isArray(data) ? data : [];
            setAllStudents(students);
            
            // Extract unique classes from students
            const uniqueClasses = [...new Set(students.map(s => s.class).filter(Boolean))];
            setAvailableClasses(['All Classes', ...uniqueClasses.sort()]);
            
            console.log('Loaded students:', students.length);
            console.log('Available classes:', uniqueClasses);
        } catch (error) {
            console.error('Error loading students:', error);
        }
    };

    const loadStudentAttendance = async () => {
        try {
            const res = await attendanceApi.getAll();
            const recordsData = res.data?.data || res.data;
            const records = Array.isArray(recordsData) ? recordsData : [];
            
            console.log('Loaded attendance records:', records.length);
            console.log('Sample attendance records:', records.slice(0, 3));
            
            setAllAttendance(records);

            const todayRecords = records.filter(r => r.date === selectedDate);
            const attendanceMap = {};
            todayRecords.forEach(record => {
                attendanceMap[record.studentId] = record.status;
            });
            setLocalAttendanceData(attendanceMap);
        } catch (error) {
            console.error('Error loading student attendance:', error);
        }
    };

    const loadMyAttendance = async (teacherId) => {
        try {
            const res = await attendanceApi.getAll();
            const allRecordsData = res.data?.data;
            const allRecords = Array.isArray(allRecordsData) ? allRecordsData : [];
            const myRecords = allRecords.filter(r => r.teacherId === teacherId);
            myRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
            setMyAttendanceHistory(myRecords);
        } catch (error) {
            console.error('Error loading teacher attendance:', error);
        }
    };

    const calculateAttendancePercentage = (studentId) => {
        // Handle both number and string IDs
        const studentRecords = allAttendance.filter(r => 
            r.studentId == studentId || r.student_id == studentId || r.id == studentId
        );
        
        console.log(`Student ${studentId} has ${studentRecords.length} attendance records`);
        
        if (studentRecords.length === 0) return 0;
        
        const presentCount = studentRecords.filter(r => 
            r.status === 'Present' || r.status === 'present'
        ).length;
        
        const percentage = Math.round((presentCount / studentRecords.length) * 100);
        console.log(`Student ${studentId}: ${presentCount} present out of ${studentRecords.length} = ${percentage}%`);
        
        return percentage;
    };

    const toggleAttendance = (studentId, newStatus) => {
        setLocalAttendanceData(prev => ({
            ...prev,
            [studentId]: newStatus
        }));
        setSaveStatus(null);
    };

    const markAllPresent = () => {
        const newAttendance = { ...localAttendanceData };
        filteredStudents.forEach(student => {
            newAttendance[student.id] = 'Present';
        });
        setLocalAttendanceData(newAttendance);
        setSaveStatus(null);
    };

    const markAllAbsent = () => {
        const newAttendance = { ...localAttendanceData };
        filteredStudents.forEach(student => {
            newAttendance[student.id] = 'Absent';
        });
        setLocalAttendanceData(newAttendance);
        setSaveStatus(null);
    };

    const saveAttendance = async () => {
        setSaveStatus('saving');
        try {
            const teacherName = currentUser ? currentUser.name : 'Teacher';

            const attendanceList = filteredStudents.map(student => ({
                date: selectedDate,
                studentId: student.id,
                status: localAttendanceData[student.id] || 'Absent',
                teacherId: currentUser?.id,
                markedBy: teacherName
            })).filter(r => localAttendanceData[r.studentId]);

            await attendanceApi.markBulk(attendanceList);
            setSaveStatus('saved');
            
            // Reload attendance data to update percentages immediately
            await loadStudentAttendance();
            
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (error) {
            console.error(error);
            setSaveStatus('error');
        }
    };

    const filteredStudents = allStudents.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (student.rollNumber || student.rollNo || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesClass = selectedClass === 'All Classes' || student.class === selectedClass;
        return matchesSearch && matchesClass;
    });

    const currentPresentCount = filteredStudents.filter(s => localAttendanceData[s.id] === 'Present').length;
    const currentAbsentCount = filteredStudents.filter(s => localAttendanceData[s.id] === 'Absent').length;
    const currentAttendancePercentage = filteredStudents.length > 0
        ? Math.round((currentPresentCount / filteredStudents.length) * 100)
        : 0;

    const getStatusStyle = (status, selected) => {
        if (!selected) return 'bg-gray-100 text-gray-400 hover:bg-gray-200';
        switch (status) {
            case 'Present': return 'bg-green-100 text-green-600 ring-2 ring-green-500';
            case 'Absent': return 'bg-red-100 text-red-600 ring-2 ring-red-500';
            case 'Late': return 'bg-yellow-100 text-yellow-600 ring-2 ring-yellow-500';
            default: return 'bg-gray-100 text-gray-400';
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        Attendance
                    </h1>
                    <p className="text-sm text-gray-500">
                        {activeTab === 'student_attendance'
                            ? 'Manage Student Attendance'
                            : 'My Attendance History'}
                    </p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('student_attendance')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'student_attendance'
                            ? 'bg-white text-green-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Student Attendance
                    </button>
                    <button
                        onClick={() => setActiveTab('my_attendance')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'my_attendance'
                            ? 'bg-white text-green-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        My Attendance
                    </button>
                </div>
            </div>

            {activeTab === 'my_attendance' && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                    <div className="p-6 border-b border-gray-200">
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            My Attendance Records
                        </h3>
                    </div>
                    <div className="p-6">
                        {myAttendanceHistory.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No attendance records found.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Marked By</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                        {myAttendanceHistory.map((record) => (
                                            <tr key={record.id} className={darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}>
                                                <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {record.date}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${record.status === 'Present' ? 'bg-green-100 text-green-700' :
                                                        record.status === 'Absent' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                                <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {record.markedBy}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'student_attendance' && (
                <>
                    { }
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:scale-[1.02] hover:shadow-lg transition-all duration-200 group cursor-pointer`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Students</h3>
                                <Users className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                            </div>
                            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{filteredStudents.length}</p>
                        </div>

                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:scale-[1.02] hover:shadow-lg transition-all duration-200 group cursor-pointer`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Present</h3>
                                <UserCheck className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                            </div>
                            <p className={`text-3xl font-bold text-green-600`}>{currentPresentCount}</p>
                        </div>

                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:scale-[1.02] hover:shadow-lg transition-all duration-200 group cursor-pointer`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Absent</h3>
                                <UserX className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                            </div>
                            <p className={`text-3xl font-bold text-red-600`}>{currentAbsentCount}</p>
                        </div>

                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:scale-[1.02] hover:shadow-lg transition-all duration-200 group cursor-pointer`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Rate</h3>
                                <TrendingUp className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
                            </div>
                            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentAttendancePercentage}%</p>
                        </div>
                    </div>

                    { }
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6 hover:shadow-lg transition-all duration-200`}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className={`w-full px-4 py-2.5 text-sm rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-gray-50 border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 cursor-pointer hover:border-green-400`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Class
                                </label>
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className={`w-full px-4 py-2.5 text-sm rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-gray-50 border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 cursor-pointer hover:border-green-400`}
                                >
                                    {availableClasses.map((cls) => (
                                        <option key={cls} value={cls}>{cls}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Search
                                </label>
                                <div className="relative">
                                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Search student..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border ${darkMode
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                            : 'bg-gray-50 border-gray-300 text-gray-900'
                                            } focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={`flex flex-wrap gap-3 border-t pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                            <div className="flex gap-2">
                                <button
                                    onClick={markAllPresent}
                                    className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 hover:scale-105 transition-all duration-200 flex items-center space-x-2 text-sm font-medium border border-green-200 shadow-sm hover:shadow-md"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Mark All Present</span>
                                </button>

                                <button
                                    onClick={markAllAbsent}
                                    className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 hover:scale-105 transition-all duration-200 flex items-center space-x-2 text-sm font-medium border border-red-200 shadow-sm hover:shadow-md"
                                >
                                    <XCircle className="w-4 h-4" />
                                    <span>Mark All Absent</span>
                                </button>
                            </div>

                            <button
                                onClick={saveAttendance}
                                disabled={saveStatus === 'saved'}
                                className={`ml-auto px-6 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 font-medium shadow-sm ${saveStatus === 'saved'
                                    ? 'bg-green-600 text-white cursor-default'
                                    : 'bg-green-600 text-white hover:bg-green-700 hover:scale-105 hover:shadow-md'
                                    }`}
                            >
                                {saveStatus === 'saved' ? (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        <span>Saved Successfully</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        <span>Save Attendance</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    { }
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                        <div className="overflow-x-auto">
                            {filteredStudents.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        No students found
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
                                                Overall
                                            </th>
                                            <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                                Mark Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                        {filteredStudents.map((student) => {
                                            const overallAttendance = calculateAttendancePercentage(student.id);
                                            const todayStatus = localAttendanceData[student.id];

                                            return (
                                                <tr key={student.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-all duration-200 group`}>
                                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {student.rollNumber || student.rollNo}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-xs mr-3 shadow-sm group-hover:scale-110 transition-transform duration-200">
                                                                {student.name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                                    {student.name}
                                                                </div>
                                                                <div className="text-xs text-gray-500">{student.class}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mr-2`}>
                                                                {overallAttendance}%
                                                            </span>
                                                            <div className="w-20 bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className={`h-2 rounded-full transition-all duration-500 ${overallAttendance >= 90 ? 'bg-green-500' :
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
                                                                className={`p-2.5 rounded-lg transition-all duration-200 hover:scale-110 ${getStatusStyle('Present', todayStatus === 'Present')}`}
                                                                title="Present"
                                                            >
                                                                <CheckCircle className="w-5 h-5" />
                                                            </button>

                                                            <button
                                                                onClick={() => toggleAttendance(student.id, 'Late')}
                                                                className={`p-2.5 rounded-lg transition-all duration-200 hover:scale-110 ${getStatusStyle('Late', todayStatus === 'Late')}`}
                                                                title="Late"
                                                            >
                                                                <Clock className="w-5 h-5" />
                                                            </button>

                                                            <button
                                                                onClick={() => toggleAttendance(student.id, 'Absent')}
                                                                className={`p-2.5 rounded-lg transition-all duration-200 hover:scale-110 ${getStatusStyle('Absent', todayStatus === 'Absent')}`}
                                                                title="Absent"
                                                            >
                                                                <XCircle className="w-5 h-5" />
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
                </>
            )}
        </div>
    );
};

export default AttendancePage;

