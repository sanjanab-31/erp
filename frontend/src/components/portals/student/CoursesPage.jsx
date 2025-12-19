import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { BookOpen, FileText, Link as LinkIcon, Calendar, Upload, CheckCircle, X, Save } from 'lucide-react';
import { studentApi, courseApi, assignmentApi } from '../../../services/api';
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
                            id="submission-link-input"
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

const CoursesPage = () => {
    const { darkMode, student, userName } = useOutletContext();
    const { showSuccess, showError, showWarning } = useToast();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    useEffect(() => {
        if (student) {
            loadCourses();
        }
    }, [student]);

    useEffect(() => {
        if (courses.length > 0 && !selectedCourse) {
            setSelectedCourse(courses[0]);
        }
    }, [courses]);



    const loadCourses = useCallback(async () => {
        if (!student) return;

        try {
            const res = await courseApi.getAll({ class: student.class });
            const classCourses = res.data?.data || [];

            const enrichedCourses = await Promise.all(classCourses.map(async (course) => {
                const assignments = course.assignments || [];
                const assignmentsWithSubs = await Promise.all(assignments.map(async (assign) => {
                    try {
                        const subRes = await assignmentApi.getSubmissions(assign.id);
                        const submissions = subRes.data?.data || [];
                        return { ...assign, submissions };
                    } catch {
                        return { ...assign, submissions: [] };
                    }
                }));
                return { ...course, assignments: assignmentsWithSubs };
            }));

            setCourses(enrichedCourses);

            if (selectedCourse) {
                const updated = enrichedCourses.find(c => c.id === selectedCourse.id);
                if (updated) {
                    setSelectedCourse(updated);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }, [student, selectedCourse]);

    const handleSubmitAssignment = useCallback(async (link) => {
        if (!selectedAssignment) {
            showError('No assignment selected. Please try again.');
            return;
        }

        if (!selectedCourse) {
            showError('Could not identify the course. Please refresh the page.');
            return;
        }

        if (!student && !userName) {
            showError('Student identity not found. Please log in again.');
            return;
        }

        const sid = student?.id || Number(localStorage.getItem('userId'));
        const sName = student?.name || userName || localStorage.getItem('userName') || 'Student';
        const cid = selectedCourse.id || selectedCourse._id;
        const aid = selectedAssignment.id;

        const submissionData = {
            assignmentId: Number(aid),
            courseId: Number(cid),
            studentId: Number(sid),
            studentName: String(sName),
            driveLink: String(link).trim(),
            status: 'Submitted',
            submittedAt: new Date().toISOString()
        };

        console.log('Sending assignment submission:', submissionData);

        // Final sanity check for required fields
        if (!submissionData.driveLink) {
            showError('Submission link is required.');
            return;
        }
        if (!submissionData.courseId) {
            showError('Course ID is missing. Please refresh.');
            return;
        }

        try {
            await assignmentApi.createSubmission(submissionData);
            setShowSubmissionModal(false);
            setSelectedAssignment(null);
            showSuccess('Assignment submitted successfully!');
            loadCourses();
        } catch (error) {
            console.error('Submission failed with data:', submissionData);
            console.error('Server error response:', error.response?.data);
            const errMsg = error.response?.data?.message || error.message;
            showError(`Submission error: ${errMsg}`);
        }
    }, [selectedCourse, selectedAssignment, student, userName, loadCourses, showError, showSuccess]);

    const hasSubmitted = (assignment) => {
        if (!student) return false;
        return assignment.submissions.some(s => s.studentId.toString() === student.id.toString());
    };

    const getSubmission = (assignment) => {
        if (!student) return null;
        return assignment.submissions.find(s => s.studentId.toString() === student.id.toString());
    };

    return (
        <div className="flex-1 overflow-y-auto p-8">
            <div className="mb-6">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    My Courses
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {student ? `${student.class} - View materials and submit assignments` : 'Loading...'}
                </p>
            </div>

            {courses.length === 0 ? (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 text-center`}>
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        No Courses Available
                    </h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Your teachers haven't created any courses yet
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-12 gap-6">
                    {/* Course List Sidebar */}
                    <div className="col-span-12 lg:col-span-4 space-y-2">
                        {courses.map(course => (
                            <div
                                key={course.id}
                                onClick={() => setSelectedCourse(course)}
                                className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedCourse?.id === course.id
                                    ? darkMode
                                        ? 'bg-blue-600 border-blue-500'
                                        : 'bg-blue-50 border-blue-200'
                                    : darkMode
                                        ? 'bg-gray-800 hover:bg-gray-750'
                                        : 'bg-white hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-start space-x-3">
                                    <div className={`p-2 rounded-lg ${selectedCourse?.id === course.id
                                        ? 'bg-blue-500'
                                        : darkMode
                                            ? 'bg-gray-700'
                                            : 'bg-gray-100'
                                        }`}>
                                        <BookOpen className={`w-5 h-5 ${selectedCourse?.id === course.id
                                            ? 'text-white'
                                            : 'text-blue-600'
                                            }`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-semibold truncate ${selectedCourse?.id === course.id
                                            ? darkMode ? 'text-white' : 'text-blue-900'
                                            : darkMode ? 'text-white' : 'text-gray-900'
                                            }`}>
                                            {course.courseName || course.name}
                                        </h3>
                                        <p className={`text-sm truncate ${selectedCourse?.id === course.id
                                            ? darkMode ? 'text-blue-200' : 'text-blue-700'
                                            : darkMode ? 'text-gray-400' : 'text-gray-600'
                                            }`}>
                                            {course.teacherName}
                                        </p>
                                        <div className="flex items-center space-x-3 mt-2 text-xs">
                                            <span className={`flex items-center space-x-1 ${selectedCourse?.id === course.id
                                                ? darkMode ? 'text-blue-300' : 'text-blue-600'
                                                : darkMode ? 'text-gray-500' : 'text-gray-500'
                                                }`}>
                                                <FileText className="w-3 h-3" />
                                                <span>{(course.materials || []).length}</span>
                                            </span>
                                            <span className={`flex items-center space-x-1 ${selectedCourse?.id === course.id
                                                ? darkMode ? 'text-blue-300' : 'text-blue-600'
                                                : darkMode ? 'text-gray-500' : 'text-gray-500'
                                                }`}>
                                                <Calendar className="w-3 h-3" />
                                                <span>{(course.assignments || []).length}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Course Details */}
                    <div className="col-span-12 lg:col-span-8">
                        {selectedCourse ? (
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden`}>
                                {/* Course Header */}
                                <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                                        {selectedCourse.courseName || selectedCourse.name}
                                    </h2>
                                    <div className="flex items-center space-x-4 text-sm">
                                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Teacher: {selectedCourse.teacherName}
                                        </span>
                                        {selectedCourse.description && (
                                            <>
                                                <span className="text-gray-400">•</span>
                                                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {selectedCourse.description}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 space-y-8">
                                    {/* Course Materials */}
                                    <div>
                                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center space-x-2`}>
                                            <FileText className="w-5 h-5 text-blue-600" />
                                            <span>Course Materials</span>
                                            <span className={`text-sm font-normal ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                ({(selectedCourse.materials || []).length})
                                            </span>
                                        </h3>

                                        {(selectedCourse.materials || []).length === 0 ? (
                                            <div className={`text-center py-12 rounded-lg ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                    No materials available yet
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {selectedCourse.materials.map(material => (
                                                    <div
                                                        key={material.id}
                                                        className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}
                                                    >
                                                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                            <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                                                                <FileText className="w-5 h-5 text-blue-600" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                                                                    {material.title}
                                                                </h4>
                                                                {material.description && (
                                                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                                                                        {material.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <a
                                                            href={material.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="ml-4 flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm whitespace-nowrap"
                                                        >
                                                            <LinkIcon className="w-4 h-4" />
                                                            <span>Open</span>
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Assignments */}
                                    <div>
                                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center space-x-2`}>
                                            <Calendar className="w-5 h-5 text-purple-600" />
                                            <span>Assignments</span>
                                            <span className={`text-sm font-normal ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                ({(selectedCourse.assignments || []).length})
                                            </span>
                                        </h3>

                                        {(selectedCourse.assignments || []).length === 0 ? (
                                            <div className={`text-center py-12 rounded-lg ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                                                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                    No assignments posted yet
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {selectedCourse.assignments.map(assignment => {
                                                    const submitted = hasSubmitted(assignment);
                                                    const submission = getSubmission(assignment);
                                                    const isOverdue = new Date(assignment.dueDate) < new Date() && !submitted;

                                                    return (
                                                        <div
                                                            key={assignment.id}
                                                            className={`p-4 rounded-lg ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center space-x-2 mb-2">
                                                                        <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                                            {assignment.title}
                                                                        </h4>
                                                                        {submitted && (
                                                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                                                                                Submitted
                                                                            </span>
                                                                        )}
                                                                        {isOverdue && (
                                                                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded font-medium">
                                                                                Overdue
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    {assignment.description && (
                                                                        <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                            {assignment.description}
                                                                        </p>
                                                                    )}
                                                                    <div className={`flex items-center space-x-1 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                                        <Calendar className="w-4 h-4" />
                                                                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                                                    </div>

                                                                    {submitted && submission && (
                                                                        <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                                                            <p className={`text-xs mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                                                Your Submission:
                                                                            </p>
                                                                            <a
                                                                                href={submission.driveLink}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                                                                            >
                                                                                <LinkIcon className="w-4 h-4" />
                                                                                <span>View Submission</span>
                                                                            </a>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {!submitted && (
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedCourse(selectedCourse);
                                                                            setSelectedAssignment(assignment);
                                                                            setShowSubmissionModal(true);
                                                                        }}
                                                                        className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center space-x-2"
                                                                    >
                                                                        <Upload className="w-4 h-4" />
                                                                        <span>Submit</span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 text-center h-full flex items-center justify-center`}>
                                <div>
                                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Select a course to view materials and assignments
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showSubmissionModal && selectedAssignment && (
                <SubmissionModal
                    darkMode={darkMode}
                    onClose={() => {
                        setShowSubmissionModal(false);
                        setSelectedAssignment(null);
                    }}
                    onSubmit={handleSubmitAssignment}
                    assignment={selectedAssignment}
                    courseName={selectedCourse?.courseName || selectedCourse?.name}
                />
            )}
        </div>
    );
};

export default CoursesPage;
