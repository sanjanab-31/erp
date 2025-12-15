import React, { useState } from 'react';
import {
    BookOpen,
    Users,
    Clock,
    Plus,
    Edit,
    Trash2,
    Search,
    Filter,
    Calendar,
    Award
} from 'lucide-react';

const CoursesPage = ({ darkMode }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('All');

    const departments = ['All', 'Science', 'Mathematics', 'Arts', 'Commerce'];

    const [courses, setCourses] = useState([
        {
            id: 1,
            name: 'Advanced Mathematics',
            code: 'MATH-401',
            department: 'Mathematics',
            teacher: 'Dr. Sarah Johnson',
            students: 30,
            duration: '6 months',
            status: 'active'
        },
        {
            id: 2,
            name: 'Physics - Mechanics',
            code: 'PHY-301',
            department: 'Science',
            teacher: 'Prof. Michael Chen',
            students: 28,
            duration: '6 months',
            status: 'active'
        },
        {
            id: 3,
            name: 'Computer Science Fundamentals',
            code: 'CS-101',
            department: 'Science',
            teacher: 'Dr. Emily Davis',
            students: 35,
            duration: '4 months',
            status: 'active'
        },
        {
            id: 4,
            name: 'English Literature',
            code: 'ENG-201',
            department: 'Arts',
            teacher: 'Prof. James Wilson',
            students: 25,
            duration: '6 months',
            status: 'active'
        }
    ]);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.code.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDepartment = selectedDepartment === 'All' || course.department === selectedDepartment;
        return matchesSearch && matchesDepartment;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        Courses Management
                    </h1>
                    <p className="text-sm text-gray-500">Manage all courses and curriculum</p>
                </div>
                <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Add Course</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Courses</h3>
                        <BookOpen className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{courses.length}</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Active Courses</h3>
                        <Award className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {courses.filter(c => c.status === 'active').length}
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Students</h3>
                        <Users className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {courses.reduce((acc, c) => acc + c.students, 0)}
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Departments</h3>
                        <BookOpen className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {departments.length - 1}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        />
                    </div>

                    <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className={`px-4 py-2 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    >
                        {departments.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                    <div
                        key={course.id}
                        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-shadow`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                                    {course.name}
                                </h3>
                                <p className="text-sm text-gray-500">{course.code}</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
                                Active
                            </span>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center space-x-2 text-sm">
                                <BookOpen className="w-4 h-4 text-gray-400" />
                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                    {course.department}
                                </span>
                            </div>

                            <div className="flex items-center space-x-2 text-sm">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                    {course.students} Students
                                </span>
                            </div>

                            <div className="flex items-center space-x-2 text-sm">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                    {course.duration}
                                </span>
                            </div>

                            <div className="flex items-center space-x-2 text-sm">
                                <Award className="w-4 h-4 text-gray-400" />
                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                    {course.teacher}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                                View Details
                            </button>
                            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                                <Edit className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoursesPage;
