import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Plus,
    Edit,
    Trash2,
    X,
    Clock,
    MapPin,
    FileText,
    BookOpen
} from 'lucide-react';
import {
    createExamSchedule,
    getExamSchedulesByClass,
    getAllAcademicData,
    updateExamSchedule,
    deleteExamSchedule,
    subscribeToAcademicUpdates
} from '../../../utils/academicStore';

const AdminExamSchedules = ({ darkMode }) => {
    const [schedules, setSchedules] = useState([]);
    const [courses, setCourses] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [filterClass, setFilterClass] = useState('All Classes');

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const adminId = currentUser.id || 'admin_1';
    const adminName = currentUser.name || 'Admin';

    const [scheduleForm, setScheduleForm] = useState({
        courseId: '',
        courseName: '',
        class: '',
        examName: '',
        examDate: '',
        startTime: '',
        endTime: '',
        venue: '',
        instructions: ''
    });

    const classes = ['All Classes', 'Grade 9-A', 'Grade 9-B', 'Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 11-B', 'Grade 12-A', 'Grade 12-B'];

    useEffect(() => {
        loadData();
        const unsubscribe = subscribeToAcademicUpdates(() => {
            loadData();
        });
        return unsubscribe;
    }, []);

    const loadData = () => {
        const data = getAllAcademicData();
        setSchedules(data.examSchedules);
        setCourses(data.courses.filter(c => c.active));
    };

    const resetForm = () => {
        setScheduleForm({
            courseId: '',
            courseName: '',
            class: '',
            examName: '',
            examDate: '',
            startTime: '',
            endTime: '',
            venue: '',
            instructions: ''
        });
    };

    const handleCourseSelect = (e) => {
        const courseId = e.target.value;
        const course = courses.find(c => c.id === courseId);
        if (course) {
            setScheduleForm({
                ...scheduleForm,
                courseId: course.id,
                courseName: course.name,
                class: course.class
            });
        }
    };

    const handleCreateSchedule = (e) => {
        e.preventDefault();
        try {
            createExamSchedule({
                ...scheduleForm,
                createdBy: adminId
            });
            setShowCreateModal(false);
            resetForm();
            alert('Exam schedule created successfully!');
        } catch (error) {
            alert('Error creating exam schedule: ' + error.message);
        }
    };

    const handleUpdateSchedule = (e) => {
        e.preventDefault();
        try {
            updateExamSchedule(selectedSchedule.id, scheduleForm);
            setShowEditModal(false);
            setSelectedSchedule(null);
            resetForm();
            alert('Exam schedule updated successfully!');
        } catch (error) {
            alert('Error updating exam schedule: ' + error.message);
        }
    };

    const handleDeleteSchedule = (scheduleId) => {
        if (confirm('Are you sure you want to delete this exam schedule?')) {
            try {
                deleteExamSchedule(scheduleId);
                alert('Exam schedule deleted successfully!');
            } catch (error) {
                alert('Error deleting exam schedule: ' + error.message);
            }
        }
    };

    const openEditModal = (schedule) => {
        setSelectedSchedule(schedule);
        setScheduleForm({
            courseId: schedule.courseId,
            courseName: schedule.courseName,
            class: schedule.class,
            examName: schedule.examName,
            examDate: schedule.examDate,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            venue: schedule.venue || '',
            instructions: schedule.instructions || ''
        });
        setShowEditModal(true);
    };

    const filteredSchedules = filterClass === 'All Classes'
        ? schedules
        : schedules.filter(s => s.class === filterClass);

    const sortedSchedules = [...filteredSchedules].sort((a, b) =>
        new Date(a.examDate) - new Date(b.examDate)
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Exam Schedule Management
                </h1>
                <p className="text-sm text-gray-500">Create and manage exam schedules for all classes</p>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center">
                <select
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                    {classes.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                    ))}
                </select>
                <button
                    onClick={() => {
                        resetForm();
                        setShowCreateModal(true);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create Schedule</span>
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className="text-sm text-gray-500">Total Schedules</p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {schedules.length}
                    </p>
                </div>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className="text-sm text-gray-500">This Week</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {schedules.filter(s => {
                            const examDate = new Date(s.examDate);
                            const today = new Date();
                            const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                            return examDate >= today && examDate <= weekFromNow;
                        }).length}
                    </p>
                </div>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className="text-sm text-gray-500">This Month</p>
                    <p className="text-2xl font-bold text-green-600">
                        {schedules.filter(s => {
                            const examDate = new Date(s.examDate);
                            const today = new Date();
                            return examDate.getMonth() === today.getMonth() &&
                                examDate.getFullYear() === today.getFullYear();
                        }).length}
                    </p>
                </div>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className="text-sm text-gray-500">Upcoming</p>
                    <p className="text-2xl font-bold text-purple-600">
                        {schedules.filter(s => new Date(s.examDate) > new Date()).length}
                    </p>
                </div>
            </div>

            {/* Schedules List */}
            {sortedSchedules.length === 0 ? (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 text-center border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        No exam schedules yet
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Create your first exam schedule to get started
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {sortedSchedules.map((schedule) => {
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
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {schedule.examName}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isToday ? 'bg-blue-100 text-blue-600' :
                                                    isUpcoming ? 'bg-green-100 text-green-600' :
                                                        'bg-gray-100 text-gray-600'
                                                }`}>
                                                {isToday ? 'Today' : isUpcoming ? 'Upcoming' : 'Past'}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                            <span className="flex items-center space-x-1">
                                                <BookOpen className="w-4 h-4" />
                                                <span>{schedule.courseName}</span>
                                            </span>
                                            <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-semibold">
                                                {schedule.class}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div className="flex items-center space-x-2 text-gray-500">
                                                <Calendar className="w-4 h-4" />
                                                <span>{examDate.toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-gray-500">
                                                <Clock className="w-4 h-4" />
                                                <span>{schedule.startTime} - {schedule.endTime}</span>
                                            </div>
                                            {schedule.venue && (
                                                <div className="flex items-center space-x-2 text-gray-500">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{schedule.venue}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => openEditModal(schedule)}
                                            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-blue-400' : 'hover:bg-gray-50 text-blue-600'}`}
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSchedule(schedule.id)}
                                            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-50 text-red-600'}`}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                {schedule.instructions && (
                                    <div className={`mt-4 p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                                        <p className="text-xs text-gray-500 mb-1 flex items-center space-x-1">
                                            <FileText className="w-3 h-3" />
                                            <span>Instructions:</span>
                                        </p>
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

            {/* Create Schedule Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Create Exam Schedule
                            </h3>
                            <button onClick={() => setShowCreateModal(false)}>
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateSchedule} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Select Course *
                                </label>
                                <select
                                    required
                                    value={scheduleForm.courseId}
                                    onChange={handleCourseSelect}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                >
                                    <option value="">Select a course</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.name} ({course.code}) - {course.class}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Exam Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={scheduleForm.examName}
                                    onChange={(e) => setScheduleForm({ ...scheduleForm, examName: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="e.g., Mid-term Exam, Final Exam"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Exam Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={scheduleForm.examDate}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, examDate: e.target.value })}
                                        className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Venue
                                    </label>
                                    <input
                                        type="text"
                                        value={scheduleForm.venue}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, venue: e.target.value })}
                                        className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        placeholder="e.g., Room 101"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Start Time *
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={scheduleForm.startTime}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                                        className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        End Time *
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={scheduleForm.endTime}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, endTime: e.target.value })}
                                        className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Instructions
                                </label>
                                <textarea
                                    value={scheduleForm.instructions}
                                    onChange={(e) => setScheduleForm({ ...scheduleForm, instructions: e.target.value })}
                                    rows="3"
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="Any special instructions for students..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Create Schedule
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Schedule Modal */}
            {showEditModal && selectedSchedule && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Edit Exam Schedule
                            </h3>
                            <button onClick={() => setShowEditModal(false)}>
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateSchedule} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Course
                                </label>
                                <input
                                    type="text"
                                    disabled
                                    value={`${scheduleForm.courseName} - ${scheduleForm.class}`}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-600'}`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Exam Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={scheduleForm.examName}
                                    onChange={(e) => setScheduleForm({ ...scheduleForm, examName: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Exam Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={scheduleForm.examDate}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, examDate: e.target.value })}
                                        className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Venue
                                    </label>
                                    <input
                                        type="text"
                                        value={scheduleForm.venue}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, venue: e.target.value })}
                                        className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Start Time *
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={scheduleForm.startTime}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                                        className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        End Time *
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={scheduleForm.endTime}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, endTime: e.target.value })}
                                        className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Instructions
                                </label>
                                <textarea
                                    value={scheduleForm.instructions}
                                    onChange={(e) => setScheduleForm({ ...scheduleForm, instructions: e.target.value })}
                                    rows="3"
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Update Schedule
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminExamSchedules;
