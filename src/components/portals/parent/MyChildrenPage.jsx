import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Award,
    TrendingUp,
    BookOpen,
    Clock,
    GraduationCap
} from 'lucide-react';

const MyChildrenPage = ({ darkMode }) => {
    const [children, setChildren] = useState([
        {
            id: 1,
            name: 'Emma Wilson',
            class: 'Grade 10-A',
            rollNo: '10A-015',
            dateOfBirth: '2010-05-15',
            email: 'emma.wilson@student.school.com',
            phone: '+1 234-567-8901',
            address: '123 Main Street, City, State 12345',
            attendance: 95,
            currentGrade: 'A',
            rank: 3,
            subjects: [
                { name: 'Mathematics', grade: 'A+', marks: 98 },
                { name: 'Physics', grade: 'A', marks: 92 },
                { name: 'Chemistry', grade: 'A', marks: 94 },
                { name: 'English', grade: 'A-', marks: 88 },
                { name: 'Computer Science', grade: 'A+', marks: 96 }
            ],
            recentActivities: [
                { id: 1, activity: 'Submitted Math Assignment', date: '2025-12-14', status: 'completed' },
                { id: 2, activity: 'Attended Physics Lab', date: '2025-12-13', status: 'completed' },
                { id: 3, activity: 'Quiz - Chemistry', date: '2025-12-12', status: 'graded', score: 95 }
            ]
        }
    ]);

    const [selectedChild, setSelectedChild] = useState(children[0]);

    // Real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setChildren(prev => prev.map(child => ({
                ...child,
                attendance: Math.min(100, child.attendance + (Math.random() > 0.5 ? 0.1 : 0))
            })));
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const getGradeColor = (grade) => {
        if (grade.startsWith('A')) return 'bg-green-100 text-green-600';
        if (grade.startsWith('B')) return 'bg-blue-100 text-blue-600';
        if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-600';
        return 'bg-red-100 text-red-600';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    My Children
                </h1>
                <p className="text-sm text-gray-500">View and manage your children's information</p>
            </div>

            {/* Child Selector */}
            {children.length > 1 && (
                <div className="flex gap-4">
                    {children.map((child) => (
                        <button
                            key={child.id}
                            onClick={() => setSelectedChild(child)}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors ${selectedChild.id === child.id
                                ? 'bg-orange-600 text-white'
                                : `${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'} hover:bg-orange-50`
                                }`}
                        >
                            {child.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Child Profile */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-start space-x-6 mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        {selectedChild.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                            {selectedChild.name}
                        </h2>
                        <p className="text-gray-500 mb-4">{selectedChild.class} • Roll No: {selectedChild.rollNo}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2 text-sm">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{selectedChild.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{selectedChild.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>DOB: {selectedChild.dateOfBirth}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{selectedChild.address}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-500">Attendance</span>
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {selectedChild.attendance.toFixed(1)}%
                        </p>
                    </div>

                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-500">Current Grade</span>
                            <Award className="w-5 h-5 text-yellow-500" />
                        </div>
                        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {selectedChild.currentGrade}
                        </p>
                    </div>

                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-500">Class Rank</span>
                            <GraduationCap className="w-5 h-5 text-purple-500" />
                        </div>
                        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            #{selectedChild.rank}
                        </p>
                    </div>

                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-500">Subjects</span>
                            <BookOpen className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {selectedChild.subjects.length}
                        </p>
                    </div>
                </div>

                {/* Subject Performance */}
                <div className="mb-8">
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                        Subject Performance
                    </h3>
                    <div className="space-y-3">
                        {selectedChild.subjects.map((subject, index) => (
                            <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {subject.name}
                                    </span>
                                    <div className="flex items-center space-x-3">
                                        <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {subject.marks}/100
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(subject.grade)}`}>
                                            {subject.grade}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${subject.marks}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activities */}
                <div>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                        Recent Activities
                    </h3>
                    <div className="space-y-3">
                        {selectedChild.recentActivities.map((activity) => (
                            <div key={activity.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between`}>
                                <div className="flex-1">
                                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {activity.activity}
                                    </p>
                                    <p className="text-sm text-gray-500">{activity.date}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {activity.score && (
                                        <span className="text-sm font-semibold text-green-600">
                                            Score: {activity.score}%
                                        </span>
                                    )}
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${activity.status === 'completed'
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        {activity.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyChildrenPage;
