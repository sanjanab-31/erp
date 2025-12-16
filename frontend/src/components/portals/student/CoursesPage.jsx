import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, FileText, Link as LinkIcon, Calendar, Upload, CheckCircle, X, Save } from 'lucide-react';
import { getAllStudents } from '../../../utils/studentStore';
import { getCoursesForStudent, getCoursesByClass, submitAssignment, subscribeToUpdates } from '../../../utils/courseStore';
import { useToast } from '../../../context/ToastContext';

const SubmissionModal = ({ darkMode, onClose, onSubmit, assignment, courseName }) => {
    const { showSuccess, showError, showWarning, showInfo } = useToast();
    const [link, setLink] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!link.trim()) {
            showWarning('Please enter a link');
            return;
        }

        onSubmit(link);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-md w-full`}>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6 rounded-t-xl`}>
                    <div className="flex items-center justify-between">
                        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Submit Assignment
                        </h2>
                        <button onClick={onClose} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className="text-sm text-gray-500 mb-1">Course:</p>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{courseName}</p>
                        <p className="text-sm text-gray-500 mt-2 mb-1">Assignment:</p>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{assignment.title}</p>
                        <p className="text-sm text-gray-500 mt-2 mb-1">Due Date:</p>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Google Drive Link or File Link *
                        </label>
                        <input
                            type="url"
                            required
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            placeholder="https://drive.google.com/... or https://..."
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Upload your file to Google Drive and share the link, or provide any external file link
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`px-6 py-2 rounded-lg border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                        >
                            <Upload className="w-5 h-5" />
                            <span>Submit</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CoursesPage = ({ darkMode }) => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [studentId, setStudentId] = useState('');
    const [studentName, setStudentName] = useState('');
    const [studentClass, setStudentClass] = useState('');
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    const studentEmail = localStorage.getItem('userEmail');

    useEffect(() => {
        loadStudentInfo();
    }, []);

    useEffect(() => {
        if (studentClass) {
            loadCourses();
            const unsubscribe = subscribeToUpdates(loadCourses);
            return unsubscribe;
        }
    }, [studentClass]);

    const loadStudentInfo = useCallback(() => {
        console.log('Loading student info for email:', studentEmail);
        const students = getAllStudents();
        console.log('All students:', students);

        const student = students.find(s => s.email === studentEmail);
        console.log('Student found:', student);

        if (student) {
            setStudentId(student.id);
            setStudentName(student.name);
            setStudentClass(student.class);
            console.log('Student ID set to:', student.id);
            console.log('Student Name set to:', student.name);
            console.log('Student Class set to:', student.class);
        }
    }, [studentEmail]);

    const loadCourses = useCallback(() => {
        if (studentClass) {
            console.log('Loading courses for class:', studentClass);
            // Get courses for student's class
            const classCourses = getCoursesByClass(studentClass);
            console.log('Class courses found:', classCourses);
            setCourses(classCourses);

            // Update selected course if it exists
            if (selectedCourse) {
                const updated = classCourses.find(c => c.id === selectedCourse.id);
                if (updated) {
                    setSelectedCourse(updated);
                }
            }
        } else {
            console.log('No student class set, cannot load courses');
        }
    }, [studentClass, selectedCourse]);

    const handleSubmitAssignment = useCallback((link) => {
        try {
            submitAssignment(selectedCourse.id, selectedAssignment.id, {
                studentId,
                studentName,
                link
            });
            setShowSubmissionModal(false);
            setSelectedAssignment(null);
            showSuccess('Assignment submitted successfully!');
        } catch (error) {
            showError('Error submitting assignment: ' + error.message);
        }
    }, [selectedCourse, selectedAssignment, studentId, studentName]);

    const hasSubmitted = (assignment) => {
        return assignment.submissions.some(s => s.studentId.toString() === studentId.toString());
    };

    const getSubmission = (assignment) => {
        return assignment.submissions.find(s => s.studentId.toString() === studentId.toString());
    };

    return (
        <div className="flex-1 overflow-y-auto p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    My Courses
                </h1>
                <p className="text-sm text-gray-500">
                    {studentClass} - View course materials and submit assignments (Real-time sync with Teachers)
                </p>
            </div>

            {/* Courses List */}
            {courses.length === 0 ? (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        No Courses Available
                    </h3>
                    <p className="text-gray-500">
                        Your teachers haven't created any courses yet
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Courses Sidebar */}
                    <div className="lg:col-span-1 space-y-4">
                        {courses.map(course => (
                            <div
                                key={course.id}
                                onClick={() => setSelectedCourse(course)}
                                className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedCourse?.id === course.id
                                    ? 'bg-purple-50 border-purple-500'
                                    : darkMode
                                        ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                                        : 'bg-white border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                                    {course.courseName}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2">{course.subject}</p>
                                <p className="text-xs text-gray-500">Teacher: {course.teacherName}</p>
                            </div>
                        ))}
                    </div>

                    {/* Course Details */}
                    <div className="lg:col-span-2">
                        {selectedCourse ? (
                            <div className="space-y-6">
                                {/* Course Header */}
                                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                                        {selectedCourse.courseName}
                                    </h2>
                                    <p className="text-gray-500 mb-4">{selectedCourse.subject}</p>
                                    {selectedCourse.description && (
                                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                                            {selectedCourse.description}
                                        </p>
                                    )}
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <div>Teacher: {selectedCourse.teacherName}</div>
                                        <div>•</div>
                                        <div>{selectedCourse.materials.length} Materials</div>
                                        <div>•</div>
                                        <div>{selectedCourse.assignments.length} Assignments</div>
                                    </div>
                                </div>

                                {/* Course Materials */}
                                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                                        Course Materials
                                    </h3>

                                    {selectedCourse.materials.length === 0 ? (
                                        <p className="text-center text-gray-500 py-8">No materials available yet</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {selectedCourse.materials.map(material => (
                                                <div key={material.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                                                    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                                                        {material.title}
                                                    </h4>
                                                    {material.description && (
                                                        <p className="text-sm text-gray-500 mb-2">{material.description}</p>
                                                    )}
                                                    <a
                                                        href={material.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-purple-600 hover:text-purple-700 flex items-center space-x-1"
                                                    >
                                                        <LinkIcon className="w-4 h-4" />
                                                        <span>Open Material</span>
                                                    </a>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        Uploaded: {new Date(material.uploadedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Assignments */}
                                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                                        Assignments
                                    </h3>

                                    {selectedCourse.assignments.length === 0 ? (
                                        <p className="text-center text-gray-500 py-8">No assignments posted yet</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {selectedCourse.assignments.map(assignment => {
                                                const submitted = hasSubmitted(assignment);
                                                const submission = getSubmission(assignment);
                                                const isOverdue = new Date(assignment.dueDate) < new Date() && !submitted;

                                                return (
                                                    <div key={assignment.id} className={`p-4 rounded-lg border ${submitted
                                                        ? 'bg-green-50 border-green-200'
                                                        : isOverdue
                                                            ? 'bg-red-50 border-red-200'
                                                            : darkMode
                                                                ? 'bg-gray-700 border-gray-600'
                                                                : 'bg-gray-50 border-gray-200'
                                                        }`}>
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-2 mb-1">
                                                                    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                                        {assignment.title}
                                                                    </h4>
                                                                    {submitted && (
                                                                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full flex items-center space-x-1">
                                                                            <CheckCircle className="w-3 h-3" />
                                                                            <span>Submitted</span>
                                                                        </span>
                                                                    )}
                                                                    {isOverdue && (
                                                                        <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                                                                            Overdue
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {assignment.description && (
                                                                    <p className="text-sm text-gray-500 mb-2">{assignment.description}</p>
                                                                )}
                                                                <div className="flex items-center space-x-1 text-sm text-gray-500">
                                                                    <Calendar className="w-4 h-4" />
                                                                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>
                                                            {!submitted && (
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedAssignment(assignment);
                                                                        setShowSubmissionModal(true);
                                                                    }}
                                                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center space-x-2"
                                                                >
                                                                    <Upload className="w-4 h-4" />
                                                                    <span>Submit</span>
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Submission Info */}
                                                        {submitted && submission && (
                                                            <div className="mt-3 pt-3 border-t border-green-200">
                                                                <p className="text-sm font-medium text-gray-500 mb-1">Your Submission:</p>
                                                                <a
                                                                    href={submission.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-sm text-purple-600 hover:text-purple-700 flex items-center space-x-1"
                                                                >
                                                                    <LinkIcon className="w-4 h-4" />
                                                                    <span>View Submission</span>
                                                                </a>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
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
                        ) : (
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
                                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">Select a course to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Submission Modal */}
            {showSubmissionModal && selectedAssignment && (
                <SubmissionModal
                    darkMode={darkMode}
                    onClose={() => {
                        setShowSubmissionModal(false);
                        setSelectedAssignment(null);
                    }}
                    onSubmit={handleSubmitAssignment}
                    assignment={selectedAssignment}
                    courseName={selectedCourse.courseName}
                />
            )}
        </div>
    );
};

export default CoursesPage;
