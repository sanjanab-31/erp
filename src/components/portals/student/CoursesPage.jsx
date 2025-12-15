import React, { useState, useEffect } from 'react';
import {
    User,
    Clock,
    CheckCircle,
    BookOpen
} from 'lucide-react';

const CoursesPage = ({ darkMode }) => {
    const [activeTab, setActiveTab] = useState('My Courses');

    // Real-time data state
    const [coursesData, setCoursesData] = useState({
        enrolledCourses: 3,
        enrolledCoursesText: 'This semester',
        pendingAssignments: 1,
        pendingAssignmentsText: 'Due this week',
        completed: 1,
        completedText: 'Assignments graded',
        totalCredits: 11,
        totalCreditsText: 'Credit hours',
        courses: [
            {
                id: 1,
                title: 'Advanced Mathematics',
                code: 'MATH10A',
                description: 'Advanced mathematical concepts for grade 10',
                instructor: 'Sarah Johnson',
                duration: '1 Year',
                progress: 65,
                credits: 4
            },
            {
                id: 2,
                title: 'Physics Fundamentals',
                code: 'PHY10A',
                description: 'Basic principles of physics',
                instructor: 'David Brown',
                duration: '1 Year',
                progress: 65,
                credits: 4
            },
            {
                id: 3,
                title: 'English Literature',
                code: 'ENG10A',
                description: 'Study of classic and modern literature',
                instructor: 'Lisa Anderson',
                duration: '1 Year',
                progress: 65,
                credits: 3
            }
        ]
    });

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            // You can add real-time data fetching logic here
            setCoursesData(prev => ({
                ...prev,
                // Update any real-time fields
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex-1 overflow-y-auto p-8">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Course Management
                </h1>
                <p className="text-sm text-gray-500">Access your enrolled courses and materials</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Enrolled Courses Card */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Enrolled Courses
                        </h3>
                        <BookOpen className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="mb-2">
                        <p className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {coursesData.enrolledCourses}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500">{coursesData.enrolledCoursesText}</p>
                </div>

                {/* Pending Assignments Card */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Pending Assignments
                        </h3>
                        <Clock className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="mb-2">
                        <p className={`text-4xl font-bold text-orange-600`}>
                            {coursesData.pendingAssignments}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500">{coursesData.pendingAssignmentsText}</p>
                </div>

                {/* Completed Card */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Completed
                        </h3>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="mb-2">
                        <p className={`text-4xl font-bold text-green-600`}>
                            {coursesData.completed}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500">{coursesData.completedText}</p>
                </div>

                {/* Total Credits Card */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Total Credits
                        </h3>
                        <BookOpen className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="mb-2">
                        <p className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {coursesData.totalCredits}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500">{coursesData.totalCreditsText}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border`}>
                <div className="border-b border-gray-200">
                    <div className="flex space-x-8 px-6">
                        <button
                            onClick={() => setActiveTab('My Courses')}
                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'My Courses'
                                    ? 'border-blue-600 text-blue-600'
                                    : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                                }`}
                        >
                            My Courses
                        </button>
                        <button
                            onClick={() => setActiveTab('Assignments')}
                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'Assignments'
                                    ? 'border-blue-600 text-blue-600'
                                    : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                                }`}
                        >
                            Assignments
                        </button>
                        <button
                            onClick={() => setActiveTab('Course Materials')}
                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'Course Materials'
                                    ? 'border-blue-600 text-blue-600'
                                    : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                                }`}
                        >
                            Course Materials
                        </button>
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {coursesData.courses.map((course) => (
                            <div
                                key={course.id}
                                className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                                    } rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow`}
                            >
                                {/* Course Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                                            {course.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">{course.code}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-black text-white text-xs font-semibold rounded-full">
                                        {course.credits} Credits
                                    </span>
                                </div>

                                {/* Course Description */}
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                                    {course.description}
                                </p>

                                {/* Instructor Info */}
                                <div className="flex items-center space-x-2 mb-3">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {course.instructor}
                                    </span>
                                </div>

                                {/* Duration Info */}
                                <div className="flex items-center space-x-2 mb-4">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {course.duration}
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Course Progress
                                        </span>
                                        <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {course.progress}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-black h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${course.progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* View Details Button */}
                                <button className="w-full py-2 px-4 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursesPage;
