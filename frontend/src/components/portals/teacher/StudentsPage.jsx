import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    Users,
    Search,
    Filter,
    Download,
    Mail,
    Phone,
    MapPin,
    Calendar,
    BookOpen,
    TrendingUp,
    Award,
    AlertCircle,
    CheckCircle,
    XCircle,
    Eye,
    Edit,
    MoreVertical,
    Hash
} from 'lucide-react';
import {
    studentApi,
    courseApi,
    teacherApi,
    attendanceApi
} from '../../../services/api';

const StudentsPage = () => {
    const { darkMode } = useOutletContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState('All Classes');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [students, setStudents] = useState([]);
    const [stats, setStats] = useState({ total: 0, active: 0, warning: 0, avgAttendance: 0 });
    const [allAttendance, setAllAttendance] = useState([]);

    useEffect(() => {
        loadStudents();
        loadAttendance();
    }, []);

    const [availableClasses, setAvailableClasses] = useState(['All Classes']);

    const loadAttendance = async () => {
        try {
            const res = await attendanceApi.getAll();
            const recordsData = res.data?.data || res.data;
            const records = Array.isArray(recordsData) ? recordsData : [];
            setAllAttendance(records);
            console.log('Loaded attendance records for students page:', records.length);
        } catch (error) {
            console.error('Error loading attendance:', error);
        }
    };

    const calculateAttendancePercentage = (studentId) => {
        const studentRecords = allAttendance.filter(r => 
            r.studentId == studentId || r.student_id == studentId
        );
        
        if (studentRecords.length === 0) return 0;
        
        const presentCount = studentRecords.filter(r => 
            r.status === 'Present' || r.status === 'present'
        ).length;
        
        return Math.round((presentCount / studentRecords.length) * 100);
    };

    const loadStudents = async () => {
        try {
            const userEmail = localStorage.getItem('userEmail');
            const userName = localStorage.getItem('userName');
            
            console.log('Loading students for teacher:', userEmail, userName);

            const [allStudentsRes, allTeachersRes, allCoursesRes] = await Promise.all([
                studentApi.getAll(),
                teacherApi.getAll(),
                courseApi.getAll()
            ]);

            // Handle nested data structures
            const allStudentsData = allStudentsRes.data?.data || allStudentsRes.data;
            const allTeachersData = allTeachersRes.data?.data || allTeachersRes.data;
            const allCoursesData = allCoursesRes.data?.data || allCoursesRes.data;

            const allStudents = Array.isArray(allStudentsData) ? allStudentsData : [];
            const allTeachers = Array.isArray(allTeachersData) ? allTeachersData : [];
            const allCourses = Array.isArray(allCoursesData) ? allCoursesData : [];

            console.log('Total students in DB:', allStudents.length);
            console.log('Total courses:', allCourses.length);

            // Find teacher by email or name
            const teacherObj = allTeachers.find(t => 
                t.email === userEmail || t.name === userName
            );

            console.log('Found teacher:', teacherObj);

            if (!teacherObj) {
                console.warn('Teacher not found in database');
                // Show all students if teacher not found
                setStudents(allStudents);
                setAvailableClasses(['All Classes', ...new Set(allStudents.map(s => s.class).filter(Boolean))]);
                
                const avgAttendance = allStudents.length > 0
                    ? Math.round(allStudents.reduce((acc, s) => acc + calculateAttendancePercentage(s.id), 0) / allStudents.length)
                    : 0;
                
                setStats({
                    total: allStudents.length,
                    active: allStudents.filter(s => s.status === 'Active' || !s.status).length,
                    warning: allStudents.filter(s => s.status === 'Warning').length,
                    avgAttendance: avgAttendance
                });
                return;
            }

            // Find courses taught by this teacher
            const teacherCourses = allCourses.filter(c => 
                c.teacherId === teacherObj.id || 
                c.teacher === teacherObj.name ||
                c.teacherEmail === userEmail
            );

            console.log('Teacher courses:', teacherCourses);
            console.log('All courses data:', allCourses);

            // Get unique classes
            const teacherClasses = [...new Set(teacherCourses.map(c => c.class || c.className).filter(Boolean))];

            console.log('Teacher classes:', teacherClasses);
            console.log('Sample student classes:', allStudents.slice(0, 5).map(s => ({ name: s.name, class: s.class })));

            // Filter students by teacher's classes
            let validStudents = allStudents;
            if (teacherClasses.length > 0) {
                validStudents = allStudents.filter(s => teacherClasses.includes(s.class));
            }
            // If no courses assigned, show all students
            else {
                console.log('No courses assigned to teacher, showing all students');
                validStudents = allStudents;
            }

            console.log('Students in teacher classes:', validStudents.length);

            setStudents(validStudents);

            // Extract classes from the actual students being displayed
            const uniqueClasses = [...new Set(validStudents.map(s => s.class).filter(Boolean))];
            console.log('Unique classes from students:', uniqueClasses);
            setAvailableClasses(['All Classes', ...uniqueClasses.sort()]);

            // Calculate real average attendance from attendance records
            const avgAttendance = validStudents.length > 0
                ? Math.round(validStudents.reduce((acc, s) => acc + calculateAttendancePercentage(s.id), 0) / validStudents.length)
                : 0;

            setStats({
                total: validStudents.length,
                active: validStudents.filter(s => s.status === 'Active' || !s.status).length,
                warning: validStudents.filter(s => s.status === 'Warning').length,
                avgAttendance: avgAttendance
            });
        } catch (error) {
            console.error("Failed to load students:", error);
        }
    };

    const classes = availableClasses;
    const statuses = ['All', 'Active', 'Warning', 'Inactive'];

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (student.rollNumber || student.rollNo || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesClass = selectedClass === 'All Classes' || student.class === selectedClass;
        const matchesStatus = selectedStatus === 'All' || student.status.toLowerCase() === selectedStatus.toLowerCase();
        return matchesSearch && matchesClass && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-600';
            case 'warning':
                return 'bg-yellow-100 text-yellow-600';
            case 'inactive':
                return 'bg-red-100 text-red-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const getGradeColor = (grade) => {
        if (!grade) return 'text-gray-600';
        if (grade.startsWith('A')) return 'text-green-600';
        if (grade.startsWith('B')) return 'text-green-600';
        if (grade.startsWith('C')) return 'text-yellow-600';
        return 'text-red-600';
    };

    const StudentDetailsModal = () => {
        if (!selectedStudent) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100`}>
                    <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Student Details
                            </h2>
                            <button
                                onClick={() => setShowDetails(false)}
                                className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-all duration-200 hover:scale-110`}
                            >
                                <XCircle className="w-6 h-6 text-gray-500 hover:text-red-500 transition-colors" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        { }
                        <div className="flex items-start space-x-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer">
                                {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {selectedStudent.name}
                                </h3>
                                <div className="flex items-center space-x-2 mt-1">
                                    <Hash className="w-4 h-4 text-gray-400" />
                                    <p className="text-sm font-medium text-gray-500">{selectedStudent.rollNumber || selectedStudent.rollNo}</p>
                                </div>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${getStatusColor(selectedStudent.status)}`}>
                                    {selectedStudent.status}
                                </span>
                            </div>
                        </div>

                        { }
                        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 space-y-3`}>
                            <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                                Contact Information
                            </h4>
                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                    {selectedStudent.email}
                                </span>
                            </div>
                            {selectedStudent.phone && (
                                <div className="flex items-center space-x-3">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                        {selectedStudent.phone}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center space-x-3">
                                <BookOpen className="w-5 h-5 text-gray-400" />
                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                    {selectedStudent.class}
                                </span>
                            </div>
                        </div>

                        { }
                        <div className="grid grid-cols-2 gap-4">
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 hover:scale-[1.02] transition-all duration-200 cursor-pointer group`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-500 text-sm">Attendance</span>
                                    <TrendingUp className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                                </div>
                                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {calculateAttendancePercentage(selectedStudent.id)}%
                                </p>
                            </div>
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 hover:scale-[1.02] transition-all duration-200 cursor-pointer group`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-500 text-sm">Overall Grade</span>
                                    <Award className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
                                </div>
                                <p className={`text-2xl font-bold ${getGradeColor(selectedStudent.grade)}`}>
                                    {selectedStudent.grade || 'N/A'}
                                </p>
                            </div>
                        </div>

                        { }
                        {selectedStudent.parent && (
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                                <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                                    Parent/Guardian Information
                                </h4>
                                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {selectedStudent.parent}
                                </p>
                                <div className="mt-2 space-y-2">
                                    {selectedStudent.parentEmail && (
                                        <div className="flex items-center space-x-2 text-sm">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-500">{selectedStudent.parentEmail}</span>
                                        </div>
                                    )}
                                    {selectedStudent.parentPhone && (
                                        <div className="flex items-center space-x-2 text-sm">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-500">{selectedStudent.parentPhone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 overflow-y-auto p-8">
            { }
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Students
                </h1>
                <p className="text-sm text-gray-500">View and manage student information (Real-time sync with Admin)</p>
            </div>

            { }
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:scale-[1.02] hover:shadow-lg transition-all duration-200 group cursor-pointer`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Students</h3>
                        <Users className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:scale-[1.02] hover:shadow-lg transition-all duration-200 group cursor-pointer`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Active</h3>
                        <CheckCircle className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {stats.active}
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:scale-[1.02] hover:shadow-lg transition-all duration-200 group cursor-pointer`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Warning</h3>
                        <AlertCircle className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {stats.warning}
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:scale-[1.02] hover:shadow-lg transition-all duration-200 group cursor-pointer`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Avg. Attendance</h3>
                        <TrendingUp className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {stats.avgAttendance}%
                    </p>
                </div>
            </div>

            { }
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6 hover:shadow-lg transition-all duration-200`}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by name or roll number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200`}
                        />
                    </div>

                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className={`px-4 py-2.5 text-sm rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 cursor-pointer hover:border-green-400`}
                    >
                        {classes.map((cls) => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>

                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className={`px-4 py-2.5 text-sm rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 cursor-pointer hover:border-green-400`}
                    >
                        {statuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>

                    <button className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:scale-105 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md">
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">Export</span>
                    </button>
                </div>
            </div>

            { }
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                            <tr>
                                <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Student
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Roll No
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Class
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Attendance
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Grade
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Status
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            No students found
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Students added by Admin will appear here automatically
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-all duration-200 cursor-pointer group`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold group-hover:scale-110 transition-transform duration-200 shadow-sm">
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
                                            {student.rollNumber || student.rollNo}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {student.class}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {calculateAttendancePercentage(student.id)}%
                                                </span>
                                                <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${calculateAttendancePercentage(student.id) >= 90 ? 'bg-green-500' :
                                                            calculateAttendancePercentage(student.id) >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${calculateAttendancePercentage(student.id)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`text-sm font-bold ${getGradeColor(student.grade)}`}>
                                                {student.grade || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(student.status)}`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => {
                                                    setSelectedStudent(student);
                                                    setShowDetails(true);
                                                }}
                                                className="text-green-600 hover:text-green-900 hover:scale-125 transition-all duration-200 p-2 hover:bg-green-50 rounded-lg"
                                                title="View Details"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showDetails && <StudentDetailsModal />}
        </div>
    );
};

export default StudentsPage;

