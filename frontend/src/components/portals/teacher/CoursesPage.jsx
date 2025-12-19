import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, BookOpen, FileText, Link as LinkIcon, Trash2, Calendar, Users, Upload, X, Save } from 'lucide-react';
import {
    studentApi,
    teacherApi,
    courseApi,
    assignmentApi
} from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

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
        const fetchStudents = async () => {
            try {
                const res = await studentApi.getAll();
                const data = res.data?.data;
                setStudents(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };
        fetchStudents();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.courseName || !formData.subject || !formData.class) {
            showWarning('Please fill all required fields');
            return;
        }

        const enrolledStudents = Array.isArray(students)
            ? students
                .filter(s => s.class === formData.class)
                .map(s => s.id)
            : [];

        const courseData = {
            ...formData,
            name: formData.courseName,
            teacherId: teacherId || 0, // Fallback if teacherId is missing, though it should be handled
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
                                Students in {formData.class}: {Array.isArray(students) ? students.filter(s => s.class === formData.class).length : 0}
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

const CoursesPage = () => {
    const { darkMode } = useOutletContext();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [showMaterialModal, setShowMaterialModal] = useState(false);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [teacherId, setTeacherId] = useState('');
    const [teacherName, setTeacherName] = useState('');

    const teacherEmail = localStorage.getItem('userEmail');
    const storedTeacherName = localStorage.getItem('userName');

    const { showSuccess, showError, showWarning } = useToast();

    useEffect(() => {
        loadTeacherInfo();
    }, []);

    useEffect(() => {
        if (teacherId) {
            loadCourses();
        }
    }, [teacherId]);

    const loadTeacherInfo = useCallback(async () => {
        try {
            const teachersRes = await teacherApi.getAll();
            const teachersData = teachersRes.data?.data;
            // console.log('Teachers data:', teachersData); // Debug log
            const allTeachers = Array.isArray(teachersData) ? teachersData : [];
            const teacher = allTeachers.find(t => t.email === teacherEmail);

            if (teacher) {
                setTeacherId(teacher.id);
                setTeacherName(teacher.name);
            } else {
                setTeacherName(storedTeacherName || 'Teacher');
                // Try to find teacher by name if email match fails
                const teacherByName = allTeachers.find(t => t.name === storedTeacherName);
                if (teacherByName) {
                    setTeacherId(teacherByName.id);
                }
            }
        } catch (error) {
            console.error('Error loading teacher info:', error);
            setTeacherName(storedTeacherName || 'Teacher');
        }
    }, [teacherEmail, storedTeacherName]);

    const loadCourses = useCallback(async () => {
        if (!teacherId) return;
        try {
            const res = await courseApi.getAll({ teacherId });
            const data = res.data?.data;
            const teacherCourses = Array.isArray(data) ? data : [];

            // Enrich courses with assignment submissions
            const enrichedCourses = await Promise.all(teacherCourses.map(async (course) => {
                const assignments = course.assignments || [];
                const assignmentsWithSubs = await Promise.all(assignments.map(async (assign) => {
                    try {
                        const subRes = await assignmentApi.getSubmissions(assign.id);
                        return { ...assign, submissions: subRes.data?.data || [] };
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
            console.error('Error loading courses:', error);
        }
    }, [teacherId, selectedCourse]);

    const handleAddCourse = useCallback(async (courseData) => {
        try {
            await courseApi.create(courseData);
            setShowCourseModal(false);
            showSuccess('Course created successfully!');
            loadCourses();
        } catch (error) {
            showError('Error creating course: ' + error.message);
        }
    }, [loadCourses]);

    const handleDeleteCourse = useCallback(async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await courseApi.delete(courseId);
                setSelectedCourse(null);
                showSuccess('Course deleted successfully!');
                loadCourses();
            } catch (error) {
                showError('Error deleting course: ' + error.message);
            }
        }
    }, [loadCourses]);

    const handleAddMaterial = useCallback(async (materialData) => {
        try {
            const updatedMaterials = [...(selectedCourse.materials || []), { ...materialData, id: Date.now().toString() }];
            await courseApi.update(selectedCourse.id, { ...selectedCourse, materials: updatedMaterials });
            setShowMaterialModal(false);
            showSuccess('Material added successfully!');
            loadCourses();
        } catch (error) {
            showError('Error adding material: ' + error.message);
        }
    }, [selectedCourse, loadCourses]);

    const handleDeleteMaterial = useCallback(async (materialId) => {
        if (window.confirm('Are you sure you want to delete this material?')) {
            try {
                const updatedMaterials = selectedCourse.materials.filter(m => m.id !== materialId);
                await courseApi.update(selectedCourse.id, { ...selectedCourse, materials: updatedMaterials });
                showSuccess('Material deleted successfully!');
                loadCourses();
            } catch (error) {
                showError('Error deleting material: ' + error.message);
            }
        }
    }, [selectedCourse, loadCourses]);

    const handleAddAssignment = useCallback(async (assignmentData) => {
        try {
            await assignmentApi.create({ ...assignmentData, courseId: selectedCourse.id });
            setShowAssignmentModal(false);
            showSuccess('Assignment created successfully!');
            loadCourses();
        } catch (error) {
            showError('Error creating assignment: ' + error.message);
        }
    }, [selectedCourse, loadCourses]);

    const handleDeleteAssignment = useCallback(async (assignmentId) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                await assignmentApi.delete(assignmentId);
                showSuccess('Assignment deleted successfully!');
                loadCourses();
            } catch (error) {
                showError('Error deleting assignment: ' + error.message);
            }
        }
    }, [loadCourses]);

    return (
        <div className="flex-1 overflow-y-auto p-8">
            { }
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        My Courses
                    </h1>
                    <p className="text-sm text-gray-500">Manage your courses, materials, and assignments (Real-time sync with Students)</p>
                </div>
                <button
                    onClick={() => setShowCourseModal(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create New Course</span>
                </button>
            </div>

            { }
            {courses.length === 0 ? (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center hover:shadow-lg transition-all duration-200`}>
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        No Courses Yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Create your first course to get started
                    </p>
                    <button
                        onClick={() => setShowCourseModal(true)}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                    >
                        Create Course
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    { }
                    <div className="lg:col-span-1 space-y-4">
                        {courses.map(course => (
                            <div
                                key={course.id}
                                onClick={() => setSelectedCourse(course)}
                                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 group ${selectedCourse?.id === course.id
                                    ? 'bg-green-50 border-green-500 shadow-md scale-[1.02]'
                                    : darkMode
                                        ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 hover:scale-[1.02] hover:shadow-lg'
                                        : 'bg-white border-gray-200 hover:bg-gray-50 hover:scale-[1.02] hover:shadow-lg'
                                    }`}
                            >
                                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1 group-hover:text-green-600 transition-colors`}>
                                    {course.courseName}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2">{course.subject}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{course.class}</span>
                                    <span className="flex items-center space-x-1">
                                        <Users className="w-3 h-3" />
                                        <span>{course.enrolledStudents.length}</span>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    { }
                    <div className="lg:col-span-2">
                        {selectedCourse ? (
                            <div className="space-y-6">
                                { }
                                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-all duration-200`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                                                {selectedCourse.courseName}
                                            </h2>
                                            <p className="text-gray-500">{selectedCourse.subject} - {selectedCourse.class}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteCourse(selectedCourse.id)}
                                            className={`p-2 text-red-600 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-red-50'}`}
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

                                { }
                                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-all duration-200`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            Course Materials
                                        </h3>
                                        <button
                                            onClick={() => setShowMaterialModal(true)}
                                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
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
                                                <div key={material.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
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

                                { }
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
                                                <div key={assignment.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
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
                                                                    <span>{(assignment.submissions || []).length} Submissions</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteAssignment(assignment.id)}
                                                            className={`p-2 text-red-600 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-red-50'}`}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    { }
                                                    {(assignment.submissions || []).length > 0 && (
                                                        <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
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

            { }
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

