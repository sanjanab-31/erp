import React, { useState, useEffect, useCallback } from 'react';
import { Plus, BookOpen, FileText, Link as LinkIcon, Trash2, Calendar, Users, Upload, X, Save } from 'lucide-react';
import { getAllStudents } from '../../../utils/studentStore';
import { getAllTeachers } from '../../../utils/teacherStore';
import { useToast } from '../../../context/ToastContext';
import {
    getCoursesByTeacher,
    addCourse,
    deleteCourse,
    addCourseMaterial,
    deleteCourseMaterial,
    addAssignment,
    deleteAssignment,
    subscribeToUpdates
} from '../../../utils/courseStore';

const CourseModal = ({ darkMode, onClose, onSave, teacherId, teacherName }) => {
    const { showSuccess, showError, showWarning, showInfo } = useToast();
    const [formData, setFormData] = useState({
        courseName: '',
        subject: '',
        class: '',
        description: ''
    });
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const allStudents = getAllStudents();
        setStudents(allStudents);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.courseName || !formData.subject || !formData.class) {
            showWarning('Please fill all required fields');
            return;
        }

        // Get students enrolled in this class
        const enrolledStudents = students
            .filter(s => s.class === formData.class)
            .map(s => s.id);

        const courseData = {
            ...formData,
            teacherId,
            teacherName,
            enrolledStudents
        };

        onSave(courseData);
    };

    const classes = ['Grade 9-A', 'Grade 9-B', 'Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 11-B', 'Grade 12-A', 'Grade 12-B'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto`}>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6 rounded-t-xl sticky top-0`}>
                    <div className="flex items-center justify-between">
                        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Create New Course
                        </h2>
                        <button onClick={onClose} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Course Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.courseName}
                            onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                            placeholder="e.g., Advanced Mathematics"
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Subject *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            placeholder="e.g., Mathematics"
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Class *
                        </label>
                        <select
                            required
                            value={formData.class}
                            onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                        >
                            <option value="">Select Class</option>
                            {classes.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Course description..."
                            rows="3"
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                    </div>

                    {formData.class && (
                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <p className="text-sm text-gray-500 mb-2">
                                Students in {formData.class}: {students.filter(s => s.class === formData.class).length}
                            </p>
                            <p className="text-xs text-gray-500">
                                All students in this class will be automatically enrolled
                            </p>
                        </div>
                    )}

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
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                        >
                            <Save className="w-5 h-5" />
                            <span>Create Course</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const MaterialModal = ({ darkMode, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        link: '',
        type: 'link'
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title || !formData.link) {
            showWarning('Please fill all required fields');
            return;
        }

        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-md w-full`}>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6 rounded-t-xl`}>
                    <div className="flex items-center justify-between">
                        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Add Course Material
                        </h2>
                        <button onClick={onClose} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Chapter 1 Notes"
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Type *
                        </label>
                        <select
                            required
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                        >
                            <option value="link">External Link</option>
                            <option value="drive">Google Drive Link</option>
                            <option value="document">Document Link</option>
                        </select>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Link *
                        </label>
                        <input
                            type="url"
                            required
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            placeholder="https://..."
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Material description..."
                            rows="3"
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
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
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                        >
                            <Upload className="w-5 h-5" />
                            <span>Add Material</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AssignmentModal = ({ darkMode, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title || !formData.dueDate) {
            showWarning('Please fill all required fields');
            return;
        }

        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-md w-full`}>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6 rounded-t-xl`}>
                    <div className="flex items-center justify-between">
                        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Create Assignment
                        </h2>
                        <button onClick={onClose} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Chapter 1 Assignment"
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Due Date *
                        </label>
                        <input
                            type="date"
                            required
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Assignment instructions..."
                            rows="4"
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
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
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                        >
                            <Save className="w-5 h-5" />
                            <span>Create Assignment</span>
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
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [showMaterialModal, setShowMaterialModal] = useState(false);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [teacherId, setTeacherId] = useState('');
    const [teacherName, setTeacherName] = useState('');

    const teacherEmail = localStorage.getItem('userEmail');
    const storedTeacherName = localStorage.getItem('userName');

    useEffect(() => {
        loadTeacherInfo();
    }, []);

    useEffect(() => {
        if (teacherId) {
            loadCourses();
            const unsubscribe = subscribeToUpdates(loadCourses);
            return unsubscribe;
        }
    }, [teacherId]);

    const loadTeacherInfo = useCallback(() => {
        console.log('Loading teacher info for email:', teacherEmail);
        const teachers = getAllTeachers();
        console.log('All teachers:', teachers);

        const teacher = teachers.find(t => t.email === teacherEmail);
        console.log('Teacher found:', teacher);

        if (teacher) {
            setTeacherId(teacher.id);
            setTeacherName(teacher.name);
            console.log('Teacher ID set to:', teacher.id);
            console.log('Teacher Name set to:', teacher.name);
        } else {
            console.log('Teacher not found, using stored name:', storedTeacherName);
            setTeacherName(storedTeacherName || 'Teacher');
        }
    }, [teacherEmail, storedTeacherName]);

    const loadCourses = useCallback(() => {
        if (teacherId) {
            console.log('Loading courses for teacher ID:', teacherId);
            const teacherCourses = getCoursesByTeacher(teacherId);
            console.log('Teacher courses found:', teacherCourses);
            setCourses(teacherCourses);

            // Update selected course if it exists
            if (selectedCourse) {
                const updated = teacherCourses.find(c => c.id === selectedCourse.id);
                if (updated) {
                    setSelectedCourse(updated);
                }
            }
        } else {
            console.log('No teacher ID set, cannot load courses');
        }
    }, [teacherId, selectedCourse]);

    const handleAddCourse = useCallback((courseData) => {
        try {
            addCourse(courseData);
            setShowCourseModal(false);
            showSuccess('Course created successfully!');
        } catch (error) {
            showError('Error creating course: ' + error.message);
        }
    }, []);

    const handleDeleteCourse = useCallback((courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                deleteCourse(courseId);
                setSelectedCourse(null);
                showSuccess('Course deleted successfully!');
            } catch (error) {
                showError('Error deleting course: ' + error.message);
            }
        }
    }, []);

    const handleAddMaterial = useCallback((materialData) => {
        try {
            addCourseMaterial(selectedCourse.id, materialData);
            setShowMaterialModal(false);
            showSuccess('Material added successfully!');
        } catch (error) {
            showError('Error adding material: ' + error.message);
        }
    }, [selectedCourse]);

    const handleDeleteMaterial = useCallback((materialId) => {
        if (window.confirm('Are you sure you want to delete this material?')) {
            try {
                deleteCourseMaterial(selectedCourse.id, materialId);
                showSuccess('Material deleted successfully!');
            } catch (error) {
                showError('Error deleting material: ' + error.message);
            }
        }
    }, [selectedCourse]);

    const handleAddAssignment = useCallback((assignmentData) => {
        try {
            addAssignment(selectedCourse.id, assignmentData);
            setShowAssignmentModal(false);
            showSuccess('Assignment created successfully!');
        } catch (error) {
            showError('Error creating assignment: ' + error.message);
        }
    }, [selectedCourse]);

    const handleDeleteAssignment = useCallback((assignmentId) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                deleteAssignment(selectedCourse.id, assignmentId);
                showSuccess('Assignment deleted successfully!');
            } catch (error) {
                showError('Error deleting assignment: ' + error.message);
            }
        }
    }, [selectedCourse]);

    return (
        <div className="flex-1 overflow-y-auto p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    My Courses
                </h1>
                <p className="text-sm text-gray-500">Manage your courses, materials, and assignments (Real-time sync with Students)</p>
            </div>

            {/* Add Course Button */}
            <div className="mb-6">
                <button
                    onClick={() => setShowCourseModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create New Course</span>
                </button>
            </div>

            {/* Courses List */}
            {courses.length === 0 ? (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        No Courses Yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Create your first course to get started
                    </p>
                    <button
                        onClick={() => setShowCourseModal(true)}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Create Course
                    </button>
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
                                    ? 'bg-green-50 border-green-500'
                                    : darkMode
                                        ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                                        : 'bg-white border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                                    {course.courseName}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2">{course.subject}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{course.class}</span>
                                    <span>{course.enrolledStudents.length} students</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Course Details */}
                    <div className="lg:col-span-2">
                        {selectedCourse ? (
                            <div className="space-y-6">
                                {/* Course Header */}
                                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                                                {selectedCourse.courseName}
                                            </h2>
                                            <p className="text-gray-500">{selectedCourse.subject} - {selectedCourse.class}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteCourse(selectedCourse.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    {selectedCourse.description && (
                                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {selectedCourse.description}
                                        </p>
                                    )}
                                    <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                                        <div className="flex items-center space-x-2">
                                            <Users className="w-4 h-4" />
                                            <span>{selectedCourse.enrolledStudents.length} Students</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <FileText className="w-4 h-4" />
                                            <span>{selectedCourse.materials.length} Materials</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>{selectedCourse.assignments.length} Assignments</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Course Materials */}
                                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            Course Materials
                                        </h3>
                                        <button
                                            onClick={() => setShowMaterialModal(true)}
                                            className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Add Material</span>
                                        </button>
                                    </div>

                                    {selectedCourse.materials.length === 0 ? (
                                        <p className="text-center text-gray-500 py-8">No materials added yet</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {selectedCourse.materials.map(material => (
                                                <div key={material.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
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
                                                                className="text-sm text-green-600 hover:text-green-700 flex items-center space-x-1"
                                                            >
                                                                <LinkIcon className="w-4 h-4" />
                                                                <span>Open Link</span>
                                                            </a>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteMaterial(material.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Assignments */}
                                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            Assignments
                                        </h3>
                                        <button
                                            onClick={() => setShowAssignmentModal(true)}
                                            className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Create Assignment</span>
                                        </button>
                                    </div>

                                    {selectedCourse.assignments.length === 0 ? (
                                        <p className="text-center text-gray-500 py-8">No assignments created yet</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {selectedCourse.assignments.map(assignment => (
                                                <div key={assignment.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1">
                                                            <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                                                                {assignment.title}
                                                            </h4>
                                                            {assignment.description && (
                                                                <p className="text-sm text-gray-500 mb-2">{assignment.description}</p>
                                                            )}
                                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                                <div className="flex items-center space-x-1">
                                                                    <Calendar className="w-4 h-4" />
                                                                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                                                </div>
                                                                <div className="flex items-center space-x-1">
                                                                    <Users className="w-4 h-4" />
                                                                    <span>{assignment.submissions.length} Submissions</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteAssignment(assignment.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    {/* Submissions */}
                                                    {assignment.submissions.length > 0 && (
                                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                                            <p className="text-sm font-medium text-gray-500 mb-2">Submissions:</p>
                                                            <div className="space-y-2">
                                                                {assignment.submissions.map(submission => (
                                                                    <div key={submission.id} className="flex items-center justify-between text-sm">
                                                                        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                                                            {submission.studentName}
                                                                        </span>
                                                                        <a
                                                                            href={submission.link}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-green-600 hover:text-green-700 flex items-center space-x-1"
                                                                        >
                                                                            <LinkIcon className="w-3 h-3" />
                                                                            <span>View</span>
                                                                        </a>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
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

            {/* Modals */}
            {showCourseModal && (
                <CourseModal
                    darkMode={darkMode}
                    onClose={() => setShowCourseModal(false)}
                    onSave={handleAddCourse}
                    teacherId={teacherId}
                    teacherName={teacherName}
                />
            )}

            {showMaterialModal && (
                <MaterialModal
                    darkMode={darkMode}
                    onClose={() => setShowMaterialModal(false)}
                    onSave={handleAddMaterial}
                />
            )}

            {showAssignmentModal && (
                <AssignmentModal
                    darkMode={darkMode}
                    onClose={() => setShowAssignmentModal(false)}
                    onSave={handleAddAssignment}
                />
            )}
        </div>
    );
};

export default CoursesPage;

