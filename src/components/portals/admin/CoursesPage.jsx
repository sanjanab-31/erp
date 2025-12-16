import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    Users,
    Clock,
    Search,
    Filter,
    Calendar,
    Award,
    GraduationCap,
    Eye
} from 'lucide-react';
import { getAllAcademicData, subscribeToAcademicUpdates } from '../../../utils/academicStore';

const CoursesPage = ({ darkMode }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState('All');
    const [courses, setCourses] = useState([]);
    const [classes, setClasses] = useState(['All']);

    // Fetch courses in real-time
    useEffect(() => {
        const fetchCourses = () => {
            const academicData = getAllAcademicData();
            const allCourses = academicData.courses || [];

            // Extract unique classes
            const uniqueClasses = ['All', ...new Set(allCourses.map(c => c.class).filter(Boolean))];
            setClasses(uniqueClasses);

            setCourses(allCourses);
        };

        // Initial fetch
        fetchCourses();

        // Subscribe to real-time updates
        const unsubscribe = subscribeToAcademicUpdates(fetchCourses);

        return () => unsubscribe();
    }, []);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.teacherName?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesClass = selectedClass === 'All' || course.class === selectedClass;
        return matchesSearch && matchesClass;
    });

    const activeCourses = courses.filter(c => c.active);
    const totalStudents = courses.length * 30; // Approximate, can be calculated from actual enrollments

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        Courses Management
                    </h1>
                    <p className="text-sm text-gray-500">View all courses created by teachers (Read-only)</p>
                </div>
                <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                    <p className="text-sm font-medium">Real-time Updates Active</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Courses</h3>
                        <BookOpen className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{courses.length}</p>
                    <p className="text-xs text-gray-500 mt-1">All courses in system</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Active Courses</h3>
                        <Award className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {activeCourses.length}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Currently running</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Teachers</h3>
                        <GraduationCap className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {new Set(courses.map(c => c.teacherId)).size}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Teaching courses</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Classes</h3>
                        <BookOpen className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {classes.length - 1}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Different classes</p>
                </div>
            </div>

            {/* Filters */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by course name, code, or teacher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        />
                    </div>

                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className={`px-4 py-2 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    >
                        {classes.map((cls) => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Courses Grid */}
            {filteredCourses.length === 0 ? (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
                    <BookOpen className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        No Courses Found
                    </h3>
                    <p className="text-gray-500">
                        {searchQuery || selectedClass !== 'All'
                            ? 'Try adjusting your filters'
                            : 'Teachers haven\'t created any courses yet'}
                    </p>
                </div>
            ) : (
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
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${course.active
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {course.active ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center space-x-2 text-sm">
                                    <BookOpen className="w-4 h-4 text-gray-400" />
                                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                        Class: {course.class || 'Not specified'}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-2 text-sm">
                                    <GraduationCap className="w-4 h-4 text-gray-400" />
                                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                        {course.teacherName || 'Unknown Teacher'}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-2 text-sm">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                        Created: {new Date(course.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                {course.description && (
                                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2 p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                        <p className="line-clamp-2">{course.description}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center justify-center space-x-2">
                                    <Eye className="w-4 h-4" />
                                    <span>View Details</span>
                                </button>
                            </div>

                            {/* Read-only indicator */}
                            <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <p className="text-xs text-gray-500 text-center">
                                    📖 Read-only • Created by teacher
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CoursesPage;
