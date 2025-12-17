import React, { useState, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext';
import {
    BookOpen,
    Upload,
    FileText,
    Calendar,
    Award,
    TrendingUp,
    CheckCircle,
    Clock,
    Link as LinkIcon,
    X,
    AlertCircle
} from 'lucide-react';
import {
    getCoursesByClass,
    getAssignmentsByCourse,
    getSubmission,
    submitAssignment,
    getCourseMaterials,
    getExamSchedulesByClass,
    calculateFinalMarks,
    getStudentCourseMarks,
    subscribeToAcademicUpdates
} from '../../../utils/academicStore';

const StudentCoursesPage = ({ darkMode }) => {
    const { showSuccess, showError, showWarning, showInfo } = useToast();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [examSchedules, setExamSchedules] = useState([]);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [driveLink, setDriveLink] = useState('');

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const studentId = currentUser.id || localStorage.getItem('userId') || 'student_1';
    const studentName = currentUser.name || localStorage.getItem('userName') || 'Student';
    const studentClass = currentUser.class || 'Grade 10-A';

    useEffect(() => {
        loadData();
        const unsubscribe = subscribeToAcademicUpdates(() => {
            loadData();
        });
        return unsubscribe;
    }, []);

    const loadData = () => {
        const classCourses = getCoursesByClass(studentClass);
        setCourses(classCourses);

        const classSchedules = getExamSchedulesByClass(studentClass);
        setExamSchedules(classSchedules);
    };

    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
        const courseAssignments = getAssignmentsByCourse(course.id);
        setAssignments(courseAssignments);

        const courseMaterials = getCourseMaterials(course.id);
        setMaterials(courseMaterials);
    };

    const handleSubmitAssignment = (e) => {
        e.preventDefault();
        try {
            submitAssignment({
                assignmentId: selectedAssignment.id,
                courseId: selectedCourse.id,
                studentId,
                studentName,
                driveLink
            });
            setShowSubmitModal(false);
            setDriveLink('');
            setSelectedAssignment(null);
            showSuccess('Assignment submitted successfully!');
        } catch (error) {
            showError('Error submitting assignment: ' + error.message);
        }
    };

    const openSubmitModal = (assignment) => {
        const existingSubmission = getSubmission(studentId, assignment.id);
        setSelectedAssignment(assignment);
        setDriveLink(existingSubmission?.driveLink || '');
        setShowSubmitModal(true);
    };

    return (
        <div className="space-y-6">
            {}
            <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    My Courses
                </h1>
                <p className="text-sm text-gray-500">View courses, submit assignments, and track your progress</p>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => {
                    const finalMarks = calculateFinalMarks(studentId, course.id);
                    const examMarks = getStudentCourseMarks(studentId, course.id);

                    return (
                        <div
                            key={course.id}
                            onClick={() => handleCourseSelect(course)}
                            className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 cursor-pointer hover:shadow-lg transition-all ${selectedCourse?.id === course.id ? 'ring-2 ring-blue-500' : ''
                                }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
                                    {course.class}
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
                                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3 mt-4`}>
                                    <p className="text-xs text-gray-500 mb-1">Final Score</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {finalMarks.finalTotal}/100
                                    </p>
                                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                                        <span>Assignment: {finalMarks.assignmentMarks}/25</span>
                                        <span>Exam: {finalMarks.examMarks}/75</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {}
            {selectedCourse && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                        {selectedCourse.name} - Details
                    </h2>

                    {}
                    <div className="mb-8">
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                            Assignments
                        </h3>
                        {assignments.length === 0 ? (
                            <p className="text-gray-500">No assignments yet</p>
                        ) : (
                            <div className="space-y-4">
                                {assignments.map((assignment) => {
                                    const submission = getSubmission(studentId, assignment.id);
                                    const isOverdue = new Date(assignment.dueDate) < new Date() && !submission;

                                    return (
                                        <div
                                            key={assignment.id}
                                            className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                                                        {assignment.title}
                                                    </h4>
                                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                                                        {assignment.description}
                                                    </p>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                        <span className="flex items-center space-x-1">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                                        </span>
                                                        <span className="flex items-center space-x-1">
                                                            <Award className="w-4 h-4" />
                                                            <span>Max: {assignment.maxMarks}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end space-y-2">
                                                    {submission ? (
                                                        <>
                                                            {submission.status === 'graded' ? (
                                                                <span className="px-3 py-1 bg-green-100 text-green-600 text-sm font-semibold rounded-full flex items-center space-x-1">
                                                                    <CheckCircle className="w-4 h-4" />
                                                                    <span>{submission.marks}/{assignment.maxMarks}</span>
                                                                </span>
                                                            ) : (
                                                                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-semibold rounded-full flex items-center space-x-1">
                                                                    <Clock className="w-4 h-4" />
                                                                    <span>Submitted</span>
                                                                </span>
                                                            )}
                                                            <button
                                                                onClick={() => openSubmitModal(assignment)}
                                                                className="text-sm text-blue-500 hover:underline"
                                                            >
                                                                Resubmit
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {isOverdue && (
                                                                <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-full flex items-center space-x-1">
                                                                    <AlertCircle className="w-4 h-4" />
                                                                    <span>Overdue</span>
                                                                </span>
                                                            )}
                                                            <button
                                                                onClick={() => openSubmitModal(assignment)}
                                                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                                                            >
                                                                Submit
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            {submission?.feedback && (
                                                <div className={`mt-3 p-3 ${darkMode ? 'bg-gray-600' : 'bg-white'} rounded-lg`}>
                                                    <p className="text-xs text-gray-500 mb-1">Teacher Feedback:</p>
                                                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {submission.feedback}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {}
                    <div className="mb-8">
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                            Exam Marks
                        </h3>
                        {(() => {
                            const examMarks = getStudentCourseMarks(studentId, selectedCourse.id);
                            const finalMarks = calculateFinalMarks(studentId, selectedCourse.id);

                            if (!examMarks) {
                                return <p className="text-gray-500">No exam marks entered yet</p>;
                            }

                            return (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                                        <p className="text-sm text-gray-500 mb-1">Exam 1</p>
                                        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {examMarks.exam1}/100
                                        </p>
                                    </div>
                                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                                        <p className="text-sm text-gray-500 mb-1">Exam 2</p>
                                        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {examMarks.exam2}/100
                                        </p>
                                    </div>
                                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                                        <p className="text-sm text-gray-500 mb-1">Exam 3</p>
                                        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {examMarks.exam3}/100
                                        </p>
                                    </div>
                                    <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-50'} rounded-lg p-4`}>
                                        <p className="text-sm text-blue-600 mb-1">Total (Scaled)</p>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {finalMarks.examMarks}/75
                                        </p>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    {}
                    <div className="mb-8">
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                            Final Marks Summary
                        </h3>
                        {(() => {
                            const finalMarks = calculateFinalMarks(studentId, selectedCourse.id);

                            if (finalMarks.finalTotal === 0) {
                                return <p className="text-gray-500">No marks available yet</p>;
                            }

                            return (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                                        <p className="text-sm text-gray-500 mb-1">Assignment Marks</p>
                                        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {finalMarks.assignmentMarks}/25
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {finalMarks.assignmentCount} assignment(s)
                                        </p>
                                    </div>
                                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                                        <p className="text-sm text-gray-500 mb-1">Exam Marks</p>
                                        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {finalMarks.examMarks}/75
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            3 exams
                                        </p>
                                    </div>
                                    <div className={`${darkMode ? 'bg-green-900' : 'bg-green-50'} rounded-lg p-4`}>
                                        <p className="text-sm text-green-600 mb-1">Final Total</p>
                                        <p className="text-3xl font-bold text-green-600">
                                            {finalMarks.finalTotal}/100
                                        </p>
                                        <p className="text-xs text-green-600 mt-1">
                                            {finalMarks.finalTotal >= 90 ? 'Excellent!' : finalMarks.finalTotal >= 75 ? 'Good!' : finalMarks.finalTotal >= 60 ? 'Fair' : 'Needs Improvement'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    {}
                    <div className="mb-8">
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                            Course Materials
                        </h3>
                        {materials.length === 0 ? (
                            <p className="text-gray-500">No materials uploaded yet</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {materials.map((material) => (
                                    <div
                                        key={material.id}
                                        className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}
                                    >
                                        <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                                            {material.title}
                                        </h4>
                                        {material.description && (
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                                                {material.description}
                                            </p>
                                        )}
                                        <a
                                            href={material.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center space-x-2 text-blue-500 hover:underline"
                                        >
                                            <LinkIcon className="w-4 h-4" />
                                            <span>Open Material</span>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {}
                    <div>
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                            Exam Schedules
                        </h3>
                        {examSchedules.filter(s => s.courseId === selectedCourse.id).length === 0 ? (
                            <p className="text-gray-500">No exam schedules yet</p>
                        ) : (
                            <div className="space-y-3">
                                {examSchedules.filter(s => s.courseId === selectedCourse.id).map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                                                    {schedule.examName}
                                                </h4>
                                                <div className="space-y-1 text-sm text-gray-500">
                                                    <p className="flex items-center space-x-2">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{new Date(schedule.examDate).toLocaleDateString()}</span>
                                                    </p>
                                                    <p className="flex items-center space-x-2">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{schedule.startTime} - {schedule.endTime}</span>
                                                    </p>
                                                    {schedule.venue && (
                                                        <p>Venue: {schedule.venue}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {schedule.instructions && (
                                            <div className={`mt-3 p-3 ${darkMode ? 'bg-gray-600' : 'bg-white'} rounded-lg`}>
                                                <p className="text-xs text-gray-500 mb-1">Instructions:</p>
                                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {schedule.instructions}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {}
            {showSubmitModal && selectedAssignment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-md w-full p-6`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Submit Assignment
                            </h3>
                            <button onClick={() => setShowSubmitModal(false)}>
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="mb-4">
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                                {selectedAssignment.title}
                            </p>
                            <p className="text-sm text-gray-500">
                                Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                            </p>
                        </div>
                        <form onSubmit={handleSubmitAssignment} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Google Drive Link *
                                </label>
                                <input
                                    type="url"
                                    required
                                    value={driveLink}
                                    onChange={(e) => setDriveLink(e.target.value)}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="https://drive.google.com/..."
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Make sure the link is accessible to your teacher
                                </p>
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Submit Assignment
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentCoursesPage;
