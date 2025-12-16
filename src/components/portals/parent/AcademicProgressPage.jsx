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

const AcademicProgressPage = ({ darkMode }) => {
    const [courses, setCourses] = useState([]);
    const [examSchedules, setExamSchedules] = useState([]);
    const [allMarks, setAllMarks] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    // Get child info from parent's profile
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const childId = currentUser.studentId || 'student_1'; // Link to child
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

        // Calculate all marks for all courses
        const marksData = classCourses.map(course => {
            const finalMarks = calculateFinalMarks(childId, course.id);
            const examMarks = getStudentCourseMarks(childId, course.id);
            return {
                courseId: course.id,
                courseName: course.name,
                courseCode: course.code,
                finalMarks,
                examMarks
            };
        }).filter(m => m.finalMarks.finalTotal > 0);

        setAllMarks(marksData);
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

    let overallGrade = 'N/A';
    if (overallAverage >= 90) overallGrade = 'A+';
    else if (overallAverage >= 85) overallGrade = 'A';
    else if (overallAverage >= 75) overallGrade = 'B+';
    else if (overallAverage >= 70) overallGrade = 'B';
    else if (overallAverage >= 60) overallGrade = 'C+';
    else if (overallAverage >= 50) overallGrade = 'C';
    else if (overallAverage > 0) overallGrade = 'D';

    return (
        <div className="space-y-6">
            {/* Header */}
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
                            Grade: {overallGrade} - {overallAverage >= 90 ? 'Excellent Performance!' :
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Overall Grade
                        </h3>
                        <Award className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {overallGrade}
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Percentage
                        </h3>
                        <BarChart3 className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {overallAverage}%
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Total Courses
                        </h3>
                        <BookOpen className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {courses.length}
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Graded Courses
                        </h3>
                        <Award className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {allMarks.length}
                    </p>
                </div>
            </div>

            {/* Course-wise Performance */}
            <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Course-wise Performance
                </h2>
                {allMarks.length === 0 ? (
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 text-center border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            No grades available yet
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Grades will appear here once teachers enter marks
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allMarks.map((mark) => (
                            <div
                                key={mark.courseId}
                                onClick={() => setSelectedCourse(mark)}
                                className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 cursor-pointer hover:shadow-lg transition-all ${selectedCourse?.courseId === mark.courseId ? 'ring-2 ring-blue-500' : ''
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${mark.finalMarks.finalTotal >= 90 ? 'bg-green-100 text-green-600' :
                                            mark.finalMarks.finalTotal >= 75 ? 'bg-blue-100 text-blue-600' :
                                                mark.finalMarks.finalTotal >= 60 ? 'bg-yellow-100 text-yellow-600' :
                                                    mark.finalMarks.finalTotal > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {mark.finalMarks.finalTotal > 0 ? `${mark.finalMarks.finalTotal}/100` : 'No marks'}
                                    </span>
                                </div>
                                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                                    {mark.courseName}
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">{mark.courseCode}</p>

                                {mark.finalMarks.finalTotal > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Assignment:</span>
                                            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {mark.finalMarks.assignmentMarks}/25
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Exam:</span>
                                            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {mark.finalMarks.examMarks}/75
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detailed Course View */}
            {selectedCourse && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                        {selectedCourse.courseName} - Detailed Marks
                    </h2>

                    <div className="space-y-6">
                        {/* Assignment Marks */}
                        <div>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                                Assignment Marks
                            </h3>
                            {(() => {
                                const submissions = getSubmissionsByStudent(childId).filter(s => s.courseId === selectedCourse.courseId);

                                if (submissions.length === 0) {
                                    return <p className="text-gray-500">No assignments submitted yet</p>;
                                }

                                return (
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
                                                {selectedCourse.finalMarks.assignmentMarks}/25
                                            </p>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Exam Marks */}
                        <div>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                                Exam Marks
                            </h3>
                            {!selectedCourse.examMarks ? (
                                <p className="text-gray-500">No exam marks entered yet</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                                        <p className="text-sm text-gray-500 mb-2">Exam 1</p>
                                        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {selectedCourse.examMarks.exam1}/100
                                        </p>
                                    </div>
                                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                                        <p className="text-sm text-gray-500 mb-2">Exam 2</p>
                                        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {selectedCourse.examMarks.exam2}/100
                                        </p>
                                    </div>
                                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                                        <p className="text-sm text-gray-500 mb-2">Exam 3</p>
                                        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {selectedCourse.examMarks.exam3}/100
                                        </p>
                                    </div>
                                    <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-50'} rounded-lg p-4`}>
                                        <p className="text-sm text-blue-600 mb-2">Total (Scaled)</p>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {selectedCourse.finalMarks.examMarks}/75
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
                                        {selectedCourse.finalMarks.assignmentMarks}/25
                                    </p>
                                </div>
                                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                                    <p className="text-sm text-gray-500 mb-2">Exam Component</p>
                                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {selectedCourse.finalMarks.examMarks}/75
                                    </p>
                                </div>
                                <div className={`${darkMode ? 'bg-green-900' : 'bg-green-50'} rounded-lg p-4`}>
                                    <p className="text-sm text-green-600 mb-2">Final Total</p>
                                    <p className="text-3xl font-bold text-green-600">
                                        {selectedCourse.finalMarks.finalTotal}/100
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {examSchedules.map((schedule) => {
                            const examDate = new Date(schedule.examDate);
                            const isUpcoming = examDate > new Date();
                            const isPast = examDate < new Date();
                            const isToday = examDate.toDateString() === new Date().toDateString();

                            return (
                                <div
                                    key={schedule.id}
                                    className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 ${isToday ? 'ring-2 ring-blue-500' : ''
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                                                {schedule.examName}
                                            </h3>
                                            <p className="text-sm text-gray-500">{schedule.courseName}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isToday ? 'bg-blue-100 text-blue-600' :
                                                isUpcoming ? 'bg-green-100 text-green-600' :
                                                    'bg-gray-100 text-gray-600'
                                            }`}>
                                            {isToday ? 'Today' : isUpcoming ? 'Upcoming' : 'Past'}
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <p className="flex items-center space-x-2 text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            <span>{examDate.toLocaleDateString()}</span>
                                        </p>
                                        <p className="flex items-center space-x-2 text-gray-500">
                                            <Clock className="w-4 h-4" />
                                            <span>{schedule.startTime} - {schedule.endTime}</span>
                                        </p>
                                        {schedule.venue && (
                                            <p className="text-gray-500">Venue: {schedule.venue}</p>
                                        )}
                                    </div>
                                    {schedule.instructions && (
                                        <div className={`mt-4 p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                                            <p className="text-xs text-gray-500 mb-1">Instructions:</p>
                                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {schedule.instructions}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AcademicProgressPage;
