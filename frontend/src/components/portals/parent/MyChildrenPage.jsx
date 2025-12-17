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
import { getChildrenByParentEmail } from '../../../utils/userStore';
import { getAllStudents } from '../../../utils/studentStore';
import { calculateAttendancePercentage } from '../../../utils/attendanceStore';
import { getStudentFinalMarks, getSubmissionsByStudent } from '../../../utils/academicStore';

const MyChildrenPage = ({ darkMode }) => {
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        const parentEmail = localStorage.getItem('userEmail');

        if (parentEmail) {
            
            const parentChildren = getChildrenByParentEmail(parentEmail);
            console.log('Parent children:', parentChildren);

            if (parentChildren && parentChildren.length > 0) {
                
                const students = getAllStudents();
                const childrenData = parentChildren.map(child => {
                    const student = students.find(s => s.id === child.id);
                    if (!student) return null;

                    
                    const attendance = calculateAttendancePercentage(student.id);

                    
                    const finalMarks = getStudentFinalMarks(student.id);

                    
                    let avgGrade = 0;
                    let currentGrade = 'N/A';
                    if (finalMarks.length > 0) {
                        avgGrade = finalMarks.reduce((sum, m) => sum + m.finalTotal, 0) / finalMarks.length;
                        currentGrade = avgGrade >= 90 ? 'A+' : avgGrade >= 85 ? 'A' : avgGrade >= 75 ? 'B+' : avgGrade >= 70 ? 'B' : avgGrade >= 60 ? 'C' : 'D';
                    }

                    
                    const submissions = getSubmissionsByStudent(student.id);
                    const recentActivities = submissions.slice(0, 3).map((sub, idx) => ({
                        id: idx + 1,
                        activity: sub.assignmentTitle || `Assignment ${sub.assignmentId}`,
                        date: sub.submittedAt || 'N/A',
                        status: sub.status || 'submitted',
                        score: sub.marks || null
                    }));

                    
                    const subjects = finalMarks.map(mark => ({
                        name: mark.courseName,
                        grade: mark.finalTotal >= 90 ? 'A+' : mark.finalTotal >= 85 ? 'A' : mark.finalTotal >= 75 ? 'B+' : mark.finalTotal >= 70 ? 'B' : mark.finalTotal >= 60 ? 'C' : 'D',
                        marks: Math.round(mark.finalTotal)
                    }));

                    return {
                        id: student.id,
                        name: student.name,
                        class: student.class,
                        rollNo: student.rollNumber,
                        dateOfBirth: student.dateOfBirth,
                        email: student.email,
                        phone: student.phone,
                        address: student.address,
                        attendance: attendance,
                        currentGrade: currentGrade,
                        rank: 'N/A', 
                        subjects: subjects,
                        recentActivities: recentActivities
                    };
                }).filter(Boolean);

                console.log('Children data loaded:', childrenData);
                setChildren(childrenData);
                if (childrenData.length > 0) {
                    setSelectedChild(childrenData[0]);
                }
            }
        }

        setLoading(false);
    }, []);

    const getGradeColor = (grade) => {
        if (grade.startsWith('A')) return 'bg-green-100 text-green-600';
        if (grade.startsWith('B')) return 'bg-blue-100 text-blue-600';
        if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-600';
        return 'bg-red-100 text-red-600';
    };

    return (
        <div className="space-y-6">
            {}
            <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    My Children
                </h1>
                <p className="text-sm text-gray-500">View and manage your children's information</p>
            </div>

            {/* Loading State */}
            {loading && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Loading children data...</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && children.length === 0 && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>No children found. Please contact the administrator.</p>
                </div>
            )}

            {/* Child Selector */}
            {!loading && children.length > 1 && (
                <div className="flex gap-4">
                    {children.map((child) => (
                        <button
                            key={child.id}
                            onClick={() => setSelectedChild(child)}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors ${selectedChild?.id === child.id
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
            {!loading && selectedChild && (
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
            )}
        </div>
    );
};

export default MyChildrenPage;
