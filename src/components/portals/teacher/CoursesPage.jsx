import React, { useState } from 'react';
import {
    BookOpen,
    Users,
    Clock,
    Calendar,
    Edit,
    Trash2,
    Plus,
    Search,
    Filter,
    FileText,
    Video,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

const CoursesPage = ({ darkMode }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All');

    const [courses, setCourses] = useState([
        {
            id: 1,
            name: 'Mathematics - Advanced',
            code: 'MATH-101',
            class: 'Grade 10-A',
            students: 30,
            schedule: 'Mon, Wed, Fri - 9:00 AM',
            progress: 65,
            status: 'active',
            topics: 15,
            completedTopics: 10
        },
        {
            id: 2,
            name: 'Physics - Mechanics',
            code: 'PHY-201',
            class: 'Grade 11-B',
            students: 25,
            schedule: 'Tue, Thu - 11:00 AM',
            progress: 45,
            status: 'active',
            topics: 12,
            completedTopics: 5
        },
        {
            id: 3,
            name: 'Mathematics - Calculus',
            code: 'MATH-102',
            class: 'Grade 10-B',
            students: 28,
            schedule: 'Mon, Wed - 2:00 PM',
            progress: 80,
            status: 'active',
            topics: 10,
            completedTopics: 8
        },
        {
            id: 4,
            name: 'Computer Science',
            code: 'CS-101',
            class: 'Grade 11-A',
            students: 22,
            schedule: 'Fri - 10:00 AM',
            progress: 30,
            status: 'active',
            topics: 20,
            completedTopics: 6
        }
    ]);

    const filters = ['All', 'Active', 'Completed', 'Upcoming'];

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.class.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = selectedFilter === 'All' || course.status.toLowerCase() === selectedFilter.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    const getProgressColor = (progress) => {
        if (progress >= 75) return 'bg-green-500';
        if (progress >= 50) return 'bg-blue-500';
        if (progress >= 25) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="flex-1 overflow-y-auto p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    My Courses
                </h1>
                <p className="text-sm text-gray-500">Manage your teaching courses and curriculum</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Courses</h3>
                        <BookOpen className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{courses.length}</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Students</h3>
                        <Users className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {courses.reduce((acc, course) => acc + course.students, 0)}
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Active Courses</h3>
                        <CheckCircle className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {courses.filter(c => c.status === 'active').length}
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Avg. Progress</h3>
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)}%
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6`}>
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
                                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                    </div>

                    <div className="flex gap-2">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(filter)}
                                className={`px-4 py-2 rounded-lg transition-colors ${selectedFilter === filter
                                    ? 'bg-green-600 text-white'
                                    : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} hover:bg-green-50`
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                        <Plus className="w-5 h-5" />
                        <span>Add Course</span>
                    </button>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                            </span>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center space-x-2 text-sm">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                    {course.students} Students
                                </span>
                            </div>

                            <div className="flex items-center space-x-2 text-sm">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                    {course.class}
                                </span>
                            </div>

                            <div className="flex items-center space-x-2 text-sm">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                    {course.schedule}
                                </span>
                            </div>

                            <div className="flex items-center space-x-2 text-sm">
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                    {course.completedTopics}/{course.topics} Topics Completed
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-500">Course Progress</span>
                                <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {course.progress}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${getProgressColor(course.progress)} transition-all duration-500`}
                                    style={{ width: `${course.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                                <Video className="w-4 h-4" />
                                <span>View Course</span>
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
