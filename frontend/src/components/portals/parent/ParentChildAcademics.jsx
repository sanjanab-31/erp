import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    Award,
    TrendingUp,
    Calendar,
    Clock,
    BarChart3
} from 'lucide-react';
import {
    getCoursesByClass,
    calculateFinalMarks,
    getStudentCourseMarks,
    getExamSchedulesByClass,
    getSubmissionsByStudent,
    subscribeToAcademicUpdates
} from '../../../utils/academicStore';

const ParentChildAcademics = ({ darkMode }) => {
    const [courses, setCourses] = useState([]);
    const [examSchedules, setExamSchedules] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const childId = currentUser.studentId || 'student_1'; 
    const childName = currentUser.childName || 'Student Name';
    const childClass = currentUser.childClass || 'Grade 10-A';

    useEffect(() => {
        loadData();
        const unsubscribe = subscribeToAcademicUpdates(() => {
            loadData();
        });
        return unsubscribe;
    }, []);

    const loadData = () => {
        const classCourses = getCoursesByClass(childClass);
        setCourses(classCourses);

        const classSchedules = getExamSchedulesByClass(childClass);
        setExamSchedules(classSchedules);
    };

    const calculateOverallPerformance = () => {
        let totalMarks = 0;
        let courseCount = 0;

        courses.forEach(course => {
            const finalMarks = calculateFinalMarks(childId, course.id);
            if (finalMarks.finalTotal > 0) {
                totalMarks += finalMarks.finalTotal;
                courseCount++;
            }
        });

        return courseCount > 0 ? (totalMarks / courseCount).toFixed(2) : 0;
    };

    const overallAverage = calculateOverallPerformance();

    return (
        <div className="space-y-6">
            {}
            <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    {childName}'s Academic Progress
                </h1>
                <p className="text-sm text-gray-500">Class: {childClass}</p>
            </div>

            {/* Overall Performance Card */}
            <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-500 to-purple-600'} rounded-xl p-6 text-white`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm opacity-90 mb-1">Overall Average</p>
                        <p className="text-4xl font-bold">{overallAverage}/100</p>
                        <p className="text-sm opacity-90 mt-2">
                            {overallAverage >= 90 ? 'Excellent Performance!' :
                                overallAverage >= 75 ? 'Good Performance' :
                                    overallAverage >= 60 ? 'Satisfactory' :
                                        overallAverage > 0 ? 'Needs Improvement' : 'No marks yet'}
                        </p>
                    </div>
                    <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-10 h-10" />
                    </div>
                </div>
            </div>

            {/* Courses Performance */}
            <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Course-wise Performance
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => {
                        const finalMarks = calculateFinalMarks(childId, course.id);
                        const examMarks = getStudentCourseMarks(childId, course.id);

                        return (
                            <div
                                key={course.id}
                                onClick={() => setSelectedCourse(course)}
                                className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 cursor-pointer hover:shadow-lg transition-all ${selectedCourse?.id === course.id ? 'ring-2 ring-blue-500' : ''
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${finalMarks.finalTotal >= 90 ? 'bg-green-100 text-green-600' :
                                        finalMarks.finalTotal >= 75 ? 'bg-blue-100 text-blue-600' :
                                            finalMarks.finalTotal >= 60 ? 'bg-yellow-100 text-yellow-600' :
                                                finalMarks.finalTotal > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {finalMarks.finalTotal > 0 ? `${finalMarks.finalTotal}/100` : 'No marks'}
                                    </span>
                                </div>
                                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                                    {course.name}
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">{course.code}</p>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                                    Teacher: {course.teacherName}
                                </p>

                                {finalMarks.finalTotal > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Assignment:</span>
                                            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {finalMarks.assignmentMarks}/25
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Exam:</span>
                                            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {finalMarks.examMarks}/75
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Detailed Course View */}
            {selectedCourse && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                        {selectedCourse.name} - Detailed Marks
                    </h2>

                    {(() => {
                        const finalMarks = calculateFinalMarks(childId, selectedCourse.id);
                        const examMarks = getStudentCourseMarks(childId, selectedCourse.id);
                        const submissions = getSubmissionsByStudent(childId).filter(s => s.courseId === selectedCourse.id);

                        return (
                            <div className="space-y-6">
                                {/* Assignment Marks */}
                                <div>
                                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                                        Assignment Marks
                                    </h3>
                                    {submissions.length === 0 ? (
                                        <p className="text-gray-500">No assignments submitted yet</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {submissions.map((submission, index) => (
                                                <div
                                                    key={submission.id}
                                                    className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}
                                                >
                                                    <p className="text-sm text-gray-500 mb-2">Assignment {index + 1}</p>
                                                    {submission.status === 'graded' ? (
                                                        <>
                                                            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                                {submission.marks}/100
                                                            </p>
                                                            {submission.feedback && (
                                                                <p className="text-sm text-gray-500 mt-2">
                                                                    Feedback: {submission.feedback}
                                                                </p>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <p className="text-sm text-blue-600">Pending grading</p>
                                                    )}
                                                </div>
                                            ))}
                                            <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-50'} rounded-lg p-4`}>
                                                <p className="text-sm text-blue-600 mb-2">Total (Scaled)</p>
                                                <p className="text-2xl font-bold text-blue-600">
                                                    {finalMarks.assignmentMarks}/25
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Exam Marks */}
                                <div>
                                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                                        Exam Marks
                                    </h3>
                                    {!examMarks ? (
                                        <p className="text-gray-500">No exam marks entered yet</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                                                <p className="text-sm text-gray-500 mb-2">Exam 1</p>
                                                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {examMarks.exam1}/100
                                                </p>
                                            </div>
                                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                                                <p className="text-sm text-gray-500 mb-2">Exam 2</p>
                                                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {examMarks.exam2}/100
                                                </p>
                                            </div>
                                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                                                <p className="text-sm text-gray-500 mb-2">Exam 3</p>
                                                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {examMarks.exam3}/100
                                                </p>
                                            </div>
                                            <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-50'} rounded-lg p-4`}>
                                                <p className="text-sm text-blue-600 mb-2">Total (Scaled)</p>
                                                <p className="text-2xl font-bold text-blue-600">
                                                    {finalMarks.examMarks}/75
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Final Summary */}
                                <div>
                                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                                        Final Score
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                                            <p className="text-sm text-gray-500 mb-2">Assignment Component</p>
                                            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {finalMarks.assignmentMarks}/25
                                            </p>
                                        </div>
                                        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                                            <p className="text-sm text-gray-500 mb-2">Exam Component</p>
                                            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {finalMarks.examMarks}/75
                                            </p>
                                        </div>
                                        <div className={`${darkMode ? 'bg-green-900' : 'bg-green-50'} rounded-lg p-4`}>
                                            <p className="text-sm text-green-600 mb-2">Final Total</p>
                                            <p className="text-3xl font-bold text-green-600">
                                                {finalMarks.finalTotal}/100
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* Exam Schedules */}
            <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Upcoming Exam Schedules
                </h2>
                {examSchedules.length === 0 ? (
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 text-center border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            No exam schedules yet
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {(() => {
                            const groupedSchedules = {};
                            examSchedules.forEach(schedule => {
                                if (!groupedSchedules[schedule.examName]) {
                                    groupedSchedules[schedule.examName] = [];
                                }
                                groupedSchedules[schedule.examName].push(schedule);
                            });

                            return Object.entries(groupedSchedules).map(([examName, papers]) => (
                                <div key={examName} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden`}>
                                    <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'} flex justify-between items-center`}>
                                        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {examName}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                            {papers.length} Papers
                                        </span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className={`border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'}`}>
                                                    <th className={`p-4 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Subject</th>
                                                    <th className={`p-4 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Date</th>
                                                    <th className={`p-4 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Time</th>
                                                    <th className={`p-4 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Venue</th>
                                                </tr>
                                            </thead>
                                            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                                {papers.sort((a, b) => new Date(a.examDate) - new Date(b.examDate)).map(paper => (
                                                    <tr key={paper.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                                        <td className={`p-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            {paper.subject || paper.courseName}
                                                        </td>
                                                        <td className={`p-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                            {new Date(paper.examDate).toLocaleDateString()}
                                                        </td>
                                                        <td className={`p-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                            {paper.startTime} - {paper.endTime}
                                                        </td>
                                                        <td className={`p-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                            {paper.venue || '-'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParentChildAcademics;
