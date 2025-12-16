import React, { useState, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext';
import {
    BookOpen,
    Plus,
    Upload,
    FileText,
    Users,
    CheckCircle,
    Clock,
    Edit,
    Trash2,
    X,
    Save,
    Link as LinkIcon,
    Calendar,
    Award,
    TrendingUp
} from 'lucide-react';
import {
    createCourse,
    getCoursesByTeacher,
    createAssignment,
    getAssignmentsByCourse,
    getSubmissionsByAssignment,
    gradeSubmission,
    enterExamMarks,
    getExamMarksByCourse,
    uploadCourseMaterial,
    getCourseMaterials,
    deleteAssignment,
    deleteCourseMaterial,
    calculateFinalMarks,
    subscribeToAcademicUpdates
} from '../../../utils/academicStore';

const AcademicManagement = ({ darkMode }) => {
    const { showSuccess, showError, showWarning, showInfo } = useToast();
    const [activeTab, setActiveTab] = useState('courses');
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
    const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
    const [showGradingModal, setShowGradingModal] = useState(false);
    const [showExamMarksModal, setShowExamMarksModal] = useState(false);
    const [showMaterialModal, setShowMaterialModal] = useState(false);

    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [examMarks, setExamMarks] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const teacherId = currentUser.id || localStorage.getItem('userId') || 'teacher_1';
    const teacherName = currentUser.name || localStorage.getItem('userName') || 'Teacher';

    // Course form
    const [courseForm, setCourseForm] = useState({
        name: '',
        code: '',
        class: '',
        description: ''
    });

    // Assignment form
    const [assignmentForm, setAssignmentForm] = useState({
        title: '',
        description: '',
        dueDate: '',
        maxMarks: 100
    });

    // Grading form
    const [gradingForm, setGradingForm] = useState({
        marks: '',
        feedback: ''
    });

    // Exam marks form
    const [examMarksForm, setExamMarksForm] = useState({
        studentId: '',
        studentName: '',
        exam1: '',
        exam2: '',
        exam3: ''
    });

    // Material form
    const [materialForm, setMaterialForm] = useState({
        title: '',
        description: '',
        link: '',
        type: 'link'
    });

    // Load data
    useEffect(() => {
        loadCourses();
        const unsubscribe = subscribeToAcademicUpdates(() => {
            loadCourses();
            if (selectedCourse) {
                loadCourseData(selectedCourse.id);
            }
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            loadCourseData(selectedCourse.id);
        }
    }, [selectedCourse]);

    const loadCourses = () => {
        const teacherCourses = getCoursesByTeacher(teacherId);
        setCourses(teacherCourses);
    };

    const loadCourseData = (courseId) => {
        const courseAssignments = getAssignmentsByCourse(courseId);
        setAssignments(courseAssignments);

        const courseExamMarks = getExamMarksByCourse(courseId);
        setExamMarks(courseExamMarks);

        const courseMaterials = getCourseMaterials(courseId);
        setMaterials(courseMaterials);
    };

    const handleCreateCourse = (e) => {
        e.preventDefault();
        try {
            createCourse({
                ...courseForm,
                teacherId,
                teacherName
            });
            setShowCreateCourseModal(false);
            setCourseForm({ name: '', code: '', class: '', description: '' });
            showSuccess('Course created successfully!');
        } catch (error) {
            showError('Error creating course: ' + error.message);
        }
    };

    const handleAddAssignment = (e) => {
        e.preventDefault();
        try {
            createAssignment({
                ...assignmentForm,
                courseId: selectedCourse.id,
                createdBy: teacherId
            });
            setShowAddAssignmentModal(false);
            setAssignmentForm({ title: '', description: '', dueDate: '', maxMarks: 100 });
            showSuccess('Assignment added successfully!');
        } catch (error) {
            showError('Error adding assignment: ' + error.message);
        }
    };

    const handleGradeSubmission = (e) => {
        e.preventDefault();
        try {
            gradeSubmission(
                selectedSubmission.id,
                parseFloat(gradingForm.marks),
                gradingForm.feedback
            );
            setShowGradingModal(false);
            setGradingForm({ marks: '', feedback: '' });
            setSelectedSubmission(null);
            showSuccess('Submission graded successfully!');
        } catch (error) {
            showError('Error grading submission: ' + error.message);
        }
    };

    const handleEnterExamMarks = (e) => {
        e.preventDefault();
        try {
            enterExamMarks({
                courseId: selectedCourse.id,
                studentId: examMarksForm.studentId,
                studentName: examMarksForm.studentName,
                exam1: parseFloat(examMarksForm.exam1) || 0,
                exam2: parseFloat(examMarksForm.exam2) || 0,
                exam3: parseFloat(examMarksForm.exam3) || 0,
                enteredBy: teacherId
            });
            setShowExamMarksModal(false);
            setExamMarksForm({ studentId: '', studentName: '', exam1: '', exam2: '', exam3: '' });
            showSuccess('Exam marks entered successfully!');
        } catch (error) {
            showError('Error entering exam marks: ' + error.message);
        }
    };

    const handleUploadMaterial = (e) => {
        e.preventDefault();
        try {
            uploadCourseMaterial({
                ...materialForm,
                courseId: selectedCourse.id,
                uploadedBy: teacherId
            });
            setShowMaterialModal(false);
            setMaterialForm({ title: '', description: '', link: '', type: 'link' });
            showSuccess('Material uploaded successfully!');
        } catch (error) {
            showError('Error uploading material: ' + error.message);
        }
    };

    const openGradingModal = (submission) => {
        setSelectedSubmission(submission);
        setGradingForm({
            marks: submission.marks || '',
            feedback: submission.feedback || ''
        });
        setShowGradingModal(true);
    };

    const renderCoursesTab = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    My Courses
                </h2>
                <button
                    onClick={() => setShowCreateCourseModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create Course</span>
                </button>
            </div>

            {courses.length === 0 ? (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 text-center border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        No courses yet
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Create your first course to get started
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            onClick={() => {
                                setSelectedCourse(course);
                                setActiveTab('assignments');
                            }}
                            className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 cursor-pointer hover:shadow-lg transition-all`}
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
                            {course.description && (
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                                    {course.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderAssignmentsTab = () => {
        if (!selectedCourse) {
            return (
                <div className="text-center py-12">
                    <p className="text-gray-500">Please select a course first</p>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {selectedCourse.name} - Assignments
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {assignments.length}/2 assignments created
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddAssignmentModal(true)}
                        disabled={assignments.length >= 2}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${assignments.length >= 2
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Assignment</span>
                    </button>
                </div>

                {assignments.length === 0 ? (
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 text-center border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            No assignments yet
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {assignments.map((assignment) => {
                            const assignmentSubmissions = getSubmissionsByAssignment(assignment.id);
                            const gradedCount = assignmentSubmissions.filter(s => s.status === 'graded').length;

                            return (
                                <div
                                    key={assignment.id}
                                    className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                                                {assignment.title}
                                            </h3>
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
                                        <button
                                            onClick={() => {
                                                if (confirm('Delete this assignment?')) {
                                                    deleteAssignment(assignment.id);
                                                }
                                            }}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3`}>
                                            <p className="text-sm text-gray-500">Submissions</p>
                                            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {assignmentSubmissions.length}
                                            </p>
                                        </div>
                                        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3`}>
                                            <p className="text-sm text-gray-500">Graded</p>
                                            <p className="text-2xl font-bold text-green-600">
                                                {gradedCount}
                                            </p>
                                        </div>
                                        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3`}>
                                            <p className="text-sm text-gray-500">Pending</p>
                                            <p className="text-2xl font-bold text-orange-600">
                                                {assignmentSubmissions.length - gradedCount}
                                            </p>
                                        </div>
                                    </div>

                                    {assignmentSubmissions.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                                Submissions
                                            </h4>
                                            {assignmentSubmissions.map((submission) => (
                                                <div
                                                    key={submission.id}
                                                    className={`flex items-center justify-between p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}
                                                >
                                                    <div className="flex-1">
                                                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            {submission.studentName}
                                                        </p>
                                                        <a
                                                            href={submission.driveLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-blue-500 hover:underline flex items-center space-x-1"
                                                        >
                                                            <LinkIcon className="w-3 h-3" />
                                                            <span>View Submission</span>
                                                        </a>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        {submission.status === 'graded' ? (
                                                            <span className="px-3 py-1 bg-green-100 text-green-600 text-sm font-semibold rounded-full flex items-center space-x-1">
                                                                <CheckCircle className="w-4 h-4" />
                                                                <span>{submission.marks}/{assignment.maxMarks}</span>
                                                            </span>
                                                        ) : (
                                                            <span className="px-3 py-1 bg-orange-100 text-orange-600 text-sm font-semibold rounded-full flex items-center space-x-1">
                                                                <Clock className="w-4 h-4" />
                                                                <span>Pending</span>
                                                            </span>
                                                        )}
                                                        <button
                                                            onClick={() => openGradingModal(submission)}
                                                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                                                        >
                                                            {submission.status === 'graded' ? 'Edit Grade' : 'Grade'}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    const renderExamMarksTab = () => {
        if (!selectedCourse) {
            return (
                <div className="text-center py-12">
                    <p className="text-gray-500">Please select a course first</p>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedCourse.name} - Exam Marks
                    </h2>
                    <button
                        onClick={() => setShowExamMarksModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Enter Marks</span>
                    </button>
                </div>

                {examMarks.length === 0 ? (
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 text-center border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            No exam marks entered yet
                        </p>
                    </div>
                ) : (
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam 1</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam 2</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam 3</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                    {examMarks.map((marks) => {
                                        const total = (marks.exam1 + marks.exam2 + marks.exam3);
                                        const finalMarks = calculateFinalMarks(marks.studentId, selectedCourse.id);

                                        return (
                                            <tr key={marks.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                                                <td className="px-6 py-4">
                                                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        {marks.studentName}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {marks.exam1}/100
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {marks.exam2}/100
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {marks.exam3}/100
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-blue-600">
                                                        {total}/300
                                                    </span>
                                                    <p className="text-xs text-gray-500">
                                                        Scaled: {finalMarks.examMarks}/75
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => {
                                                            setExamMarksForm({
                                                                studentId: marks.studentId,
                                                                studentName: marks.studentName,
                                                                exam1: marks.exam1,
                                                                exam2: marks.exam2,
                                                                exam3: marks.exam3
                                                            });
                                                            setShowExamMarksModal(true);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-700"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderMaterialsTab = () => {
        if (!selectedCourse) {
            return (
                <div className="text-center py-12">
                    <p className="text-gray-500">Please select a course first</p>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedCourse.name} - Course Materials
                    </h2>
                    <button
                        onClick={() => setShowMaterialModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Upload className="w-5 h-5" />
                        <span>Upload Material</span>
                    </button>
                </div>

                {materials.length === 0 ? (
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 text-center border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            No materials uploaded yet
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {materials.map((material) => (
                            <div
                                key={material.id}
                                className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {material.title}
                                    </h3>
                                    <button
                                        onClick={() => {
                                            if (confirm('Delete this material?')) {
                                                deleteCourseMaterial(material.id);
                                            }
                                        }}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
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
                                <p className="text-xs text-gray-500 mt-3">
                                    Uploaded {new Date(material.uploadedAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Academic Management
                </h1>
                <p className="text-sm text-gray-500">Manage courses, assignments, and student marks</p>
            </div>

            {/* Tabs */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="border-b border-gray-200">
                    <div className="flex space-x-8 px-6">
                        {['courses', 'assignments', 'examMarks', 'materials'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors capitalize ${activeTab === tab
                                        ? 'border-blue-600 text-blue-600'
                                        : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                                    }`}
                            >
                                {tab === 'examMarks' ? 'Exam Marks' : tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === 'courses' && renderCoursesTab()}
                    {activeTab === 'assignments' && renderAssignmentsTab()}
                    {activeTab === 'examMarks' && renderExamMarksTab()}
                    {activeTab === 'materials' && renderMaterialsTab()}
                </div>
            </div>

            {/* Create Course Modal */}
            {showCreateCourseModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-md w-full p-6`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Create New Course</h3>
                            <button onClick={() => setShowCreateCourseModal(false)}>
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateCourse} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Course Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={courseForm.name}
                                    onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="e.g., Mathematics"
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Course Code *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={courseForm.code}
                                    onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="e.g., MATH101"
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Class *
                                </label>
                                <select
                                    required
                                    value={courseForm.class}
                                    onChange={(e) => setCourseForm({ ...courseForm, class: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                >
                                    <option value="">Select Class</option>
                                    <option value="Grade 9-A">Grade 9-A</option>
                                    <option value="Grade 9-B">Grade 9-B</option>
                                    <option value="Grade 10-A">Grade 10-A</option>
                                    <option value="Grade 10-B">Grade 10-B</option>
                                    <option value="Grade 11-A">Grade 11-A</option>
                                    <option value="Grade 11-B">Grade 11-B</option>
                                    <option value="Grade 12-A">Grade 12-A</option>
                                    <option value="Grade 12-B">Grade 12-B</option>
                                </select>
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Description
                                </label>
                                <textarea
                                    value={courseForm.description}
                                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                                    rows="3"
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="Course description..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Create Course
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Assignment Modal */}
            {showAddAssignmentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-md w-full p-6`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Add Assignment</h3>
                            <button onClick={() => setShowAddAssignmentModal(false)}>
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleAddAssignment} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={assignmentForm.title}
                                    onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Description
                                </label>
                                <textarea
                                    value={assignmentForm.description}
                                    onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                                    rows="3"
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Due Date *
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={assignmentForm.dueDate}
                                    onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Max Marks
                                </label>
                                <input
                                    type="number"
                                    value={assignmentForm.maxMarks}
                                    onChange={(e) => setAssignmentForm({ ...assignmentForm, maxMarks: parseInt(e.target.value) })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Add Assignment
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Grading Modal */}
            {showGradingModal && selectedSubmission && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-md w-full p-6`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Grade Submission - {selectedSubmission.studentName}
                            </h3>
                            <button onClick={() => setShowGradingModal(false)}>
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleGradeSubmission} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Marks (out of 100) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={gradingForm.marks}
                                    onChange={(e) => setGradingForm({ ...gradingForm, marks: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Feedback
                                </label>
                                <textarea
                                    value={gradingForm.feedback}
                                    onChange={(e) => setGradingForm({ ...gradingForm, feedback: e.target.value })}
                                    rows="3"
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="Optional feedback..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Save Grade
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Exam Marks Modal */}
            {showExamMarksModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-md w-full p-6`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Enter Exam Marks</h3>
                            <button onClick={() => setShowExamMarksModal(false)}>
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleEnterExamMarks} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Student ID *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={examMarksForm.studentId}
                                    onChange={(e) => setExamMarksForm({ ...examMarksForm, studentId: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="e.g., student_123"
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Student Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={examMarksForm.studentName}
                                    onChange={(e) => setExamMarksForm({ ...examMarksForm, studentName: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Exam 1 *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        max="100"
                                        value={examMarksForm.exam1}
                                        onChange={(e) => setExamMarksForm({ ...examMarksForm, exam1: e.target.value })}
                                        className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Exam 2 *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        max="100"
                                        value={examMarksForm.exam2}
                                        onChange={(e) => setExamMarksForm({ ...examMarksForm, exam2: e.target.value })}
                                        className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Exam 3 *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        max="100"
                                        value={examMarksForm.exam3}
                                        onChange={(e) => setExamMarksForm({ ...examMarksForm, exam3: e.target.value })}
                                        className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Save Exam Marks
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Upload Material Modal */}
            {showMaterialModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-md w-full p-6`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Upload Course Material</h3>
                            <button onClick={() => setShowMaterialModal(false)}>
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleUploadMaterial} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={materialForm.title}
                                    onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Description
                                </label>
                                <textarea
                                    value={materialForm.description}
                                    onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                                    rows="2"
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Link (Drive or External) *
                                </label>
                                <input
                                    type="url"
                                    required
                                    value={materialForm.link}
                                    onChange={(e) => setMaterialForm({ ...materialForm, link: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="https://drive.google.com/..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Upload Material
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AcademicManagement;
