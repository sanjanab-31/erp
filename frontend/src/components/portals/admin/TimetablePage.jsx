import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Plus, Edit, Trash2, Save, X, Calendar as CalendarIcon, Users, GraduationCap } from 'lucide-react';
import { getAllTeachers } from '../../../utils/teacherStore';
import { useToast } from '../../../context/ToastContext';
import {
    saveTeacherTimetable,
    saveClassTimetable,
    getAllTeacherTimetables,
    getAllClassTimetables,
    deleteTeacherTimetable,
    deleteClassTimetable,
    subscribeToUpdates,
    getTimetableStats
} from '../../../utils/timetableStore';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = [
    { label: '09:00 - 10:00', value: '09:00-10:00' },
    { label: '10:00 - 11:00', value: '10:00-11:00' },
    { label: '11:00 - 12:00', value: '11:00-12:00' },
    { label: '12:00 - 13:00', value: '12:00-13:00' },
    { label: '13:00 - 14:00', value: '13:00-14:00' },
    { label: '14:00 - 15:00', value: '14:00-15:00' },
    { label: '15:00 - 16:00', value: '15:00-16:00' }
];

const classNames = ['Grade 9-A', 'Grade 9-B', 'Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 11-B', 'Grade 12-A', 'Grade 12-B'];

// Move modal component outside to prevent re-creation
const TimetableModal = ({ darkMode, activeView, teachers, editingTimetable, onClose, onSave }) => {
    const { showSuccess, showError, showWarning, showInfo } = useToast();
    const [selectedEntity, setSelectedEntity] = useState('');
    const [timetableGrid, setTimetableGrid] = useState({});

    useEffect(() => {
        console.log('TimetableModal useEffect triggered');
        console.log('editingTimetable:', editingTimetable);

        // Initialize grid
        const grid = {};

        // First, initialize all cells with empty values
        days.forEach(day => {
            timeSlots.forEach(slot => {
                const key = `${day}-${slot.value}`;
                grid[key] = { subject: '', room: '' };
            });
        });

        // Then, if editing, overlay the existing data
        if (editingTimetable && editingTimetable.schedule) {
            console.log('Loading existing schedule:', editingTimetable.schedule);
            editingTimetable.schedule.forEach(entry => {
                const key = `${entry.day}-${entry.time}`;
                console.log('Setting cell:', key, entry);
                grid[key] = {
                    subject: entry.subject || '',
                    room: entry.room || ''
                };
            });
            setSelectedEntity(activeView === 'teacher' ? editingTimetable.teacherId.toString() : editingTimetable.className);
        }

        console.log('Final grid:', grid);
        setTimetableGrid(grid);
    }, [editingTimetable, activeView]);

    const updateCell = useCallback((day, time, field, value) => {
        const key = `${day}-${time}`;
        setTimetableGrid(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: value
            }
        }));
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        if (!selectedEntity) {
            showWarning('Please select a ' + (activeView === 'teacher' ? 'teacher' : 'class'));
            return;
        }

        try {
            // Convert grid to schedule array
            const schedule = [];
            Object.keys(timetableGrid).forEach(key => {
                // Split only on the first hyphen to separate day from time
                const firstHyphenIndex = key.indexOf('-');
                const day = key.substring(0, firstHyphenIndex);
                const time = key.substring(firstHyphenIndex + 1);
                const cell = timetableGrid[key];

                // Only add non-empty cells
                if (cell.subject || cell.room) {
                    schedule.push({
                        day,
                        time,
                        subject: cell.subject || '',
                        room: cell.room || ''
                    });
                }
            });

            if (activeView === 'teacher') {
                const teacher = teachers.find(t => t.id.toString() === selectedEntity);
                saveTeacherTimetable(selectedEntity, {
                    teacherName: teacher?.name || 'Unknown',
                    schedule
                });
            } else {
                saveClassTimetable(selectedEntity, { schedule });
            }

            showSuccess('Timetable saved successfully!');
            onSave();
        } catch (error) {
            showError('Error saving timetable: ' + error.message);
        }
    }, [selectedEntity, timetableGrid, activeView, teachers, onSave]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-7xl w-full max-h-[95vh] overflow-y-auto my-4`}>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6 rounded-t-xl`}>
                    <div className="flex items-center justify-between">
                        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {editingTimetable ? 'Edit' : 'Create'} {activeView === 'teacher' ? 'Teacher' : 'Class'} Timetable
                        </h2>
                        <button onClick={onClose} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Select Entity */}
                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Select {activeView === 'teacher' ? 'Teacher' : 'Class'} *
                        </label>
                        <select
                            required
                            value={selectedEntity}
                            onChange={(e) => setSelectedEntity(e.target.value)}
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none`}
                            disabled={!!editingTimetable}
                        >
                            <option value="">Select {activeView === 'teacher' ? 'Teacher' : 'Class'}</option>
                            {activeView === 'teacher' ? (
                                teachers.map(teacher => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.name} - {teacher.subject}
                                    </option>
                                ))
                            ) : (
                                classNames.map(className => (
                                    <option key={className} value={className}>
                                        {className}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    {/* Timetable Grid */}
                    <div className="overflow-x-auto">
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                            Weekly Schedule
                        </h3>
                        <table className={`w-full border-collapse ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                            <thead>
                                <tr>
                                    <th className={`border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-gray-100 text-gray-700'} p-3 text-left font-semibold`}>
                                        Time
                                    </th>
                                    {days.map(day => (
                                        <th key={day} className={`border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-gray-100 text-gray-700'} p-3 text-center font-semibold`}>
                                            {day}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {timeSlots.map(slot => (
                                    <tr key={slot.value}>
                                        <td className={`border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-gray-50 text-gray-700'} p-3 font-medium whitespace-nowrap`}>
                                            {slot.label}
                                        </td>
                                        {days.map(day => {
                                            const key = `${day}-${slot.value}`;
                                            const cell = timetableGrid[key] || { subject: '', room: '' };

                                            return (
                                                <td key={key} className={`border ${darkMode ? 'border-gray-600' : 'border-gray-300'} p-2`}>
                                                    <div className="space-y-1">
                                                        <input
                                                            type="text"
                                                            value={cell.subject}
                                                            onChange={(e) => updateCell(day, slot.value, 'subject', e.target.value)}
                                                            placeholder="Subject"
                                                            className={`w-full px-2 py-1 text-sm rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-400'} focus:outline-none focus:ring-1 focus:ring-purple-500`}
                                                        />
                                                        <input
                                                            type="text"
                                                            value={cell.room}
                                                            onChange={(e) => updateCell(day, slot.value, 'room', e.target.value)}
                                                            placeholder="Room"
                                                            className={`w-full px-2 py-1 text-sm rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-400'} focus:outline-none focus:ring-1 focus:ring-purple-500`}
                                                        />
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
                            <Save className="w-5 h-5" />
                            <span>Save Timetable</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const TimetablePage = ({ darkMode }) => {
    const { showSuccess, showError, showWarning } = useToast();
    const [activeView, setActiveView] = useState('teacher'); // 'teacher' or 'student'
    const [teachers, setTeachers] = useState([]);
    const [teacherTimetables, setTeacherTimetables] = useState([]);
    const [classTimetables, setClassTimetables] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingTimetable, setEditingTimetable] = useState(null);
    const [stats, setStats] = useState({ totalTeachers: 0, totalClasses: 0 });

    // Load data
    useEffect(() => {
        loadTeachers();
        loadTimetables();

        const unsubscribe = subscribeToUpdates(loadTimetables);
        return unsubscribe;
    }, []);

    const loadTeachers = useCallback(() => {
        const teacherData = getAllTeachers();
        setTeachers(teacherData);
    }, []);

    const loadTimetables = useCallback(() => {
        const teacherTT = getAllTeacherTimetables();
        const classTT = getAllClassTimetables();
        setTeacherTimetables(teacherTT);
        setClassTimetables(classTT);
        setStats(getTimetableStats());
    }, []);

    const handleModalClose = useCallback(() => {
        setShowAddModal(false);
        setEditingTimetable(null);
    }, []);

    const handleModalSave = useCallback(() => {
        setShowAddModal(false);
        setEditingTimetable(null);
    }, []);

    const handleDelete = useCallback((id, type) => {
        if (window.confirm('Are you sure you want to delete this timetable?')) {
            try {
                if (type === 'teacher') {
                    deleteTeacherTimetable(id);
                } else {
                    deleteClassTimetable(id);
                }
                showSuccess('Timetable deleted successfully!');
            } catch (error) {
                showError('Error deleting timetable: ' + error.message);
            }
        }
    }, []);

    const handleEdit = useCallback((timetable) => {
        // Close modal first if open
        setShowAddModal(false);
        // Reset editing state
        setEditingTimetable(null);
        // Use setTimeout to ensure state updates
        setTimeout(() => {
            setEditingTimetable(timetable);
            setShowAddModal(true);
        }, 0);
    }, []);

    const handleCreate = useCallback(() => {
        setEditingTimetable(null);
        setShowAddModal(true);
    }, []);

    const currentTimetables = activeView === 'teacher' ? teacherTimetables : classTimetables;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Timetable Management
                </h1>
                <p className="text-sm text-gray-500">Create and manage timetables for teachers and students (Real-time sync)</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Teacher Timetables</h3>
                        <GraduationCap className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.totalTeachers}</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Class Timetables</h3>
                        <Users className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.totalClasses}</p>
                </div>
            </div>

            {/* View Toggle & Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className={`inline-flex rounded-lg border ${darkMode ? 'border-gray-600' : 'border-gray-300'} p-1`}>
                    <button
                        onClick={() => setActiveView('teacher')}
                        className={`px-4 py-2 rounded-lg transition-colors ${activeView === 'teacher'
                            ? 'bg-purple-600 text-white'
                            : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Teacher Timetables
                    </button>
                    <button
                        onClick={() => setActiveView('student')}
                        className={`px-4 py-2 rounded-lg transition-colors ${activeView === 'student'
                            ? 'bg-purple-600 text-white'
                            : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Class Timetables
                    </button>
                </div>

                <button
                    onClick={handleCreate}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create Timetable</span>
                </button>
            </div>

            {/* Timetables List */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                {currentTimetables.length === 0 ? (
                    <div className="p-12 text-center">
                        <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            No timetables created yet
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Click "Create Timetable" to add a new {activeView} timetable
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {currentTimetables.map((timetable) => (
                            <div key={timetable.id} className={`p-6 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {activeView === 'teacher' ? timetable.teacherName : timetable.className}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {timetable.schedule?.length || 0} periods scheduled
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleEdit(timetable)}
                                            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                                        >
                                            <Edit className="w-5 h-5 text-blue-500" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(activeView === 'teacher' ? timetable.teacherId : timetable.className, activeView)}
                                            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                                        >
                                            <Trash2 className="w-5 h-5 text-red-500" />
                                        </button>
                                    </div>
                                </div>

                                {/* Schedule Preview */}
                                {timetable.schedule && timetable.schedule.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {timetable.schedule.slice(0, 6).map((entry, index) => (
                                            <div key={index} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-gray-50 border-gray-200'}`}>
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <Clock className="w-4 h-4 text-purple-500" />
                                                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        {entry.day}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500">{entry.time}</p>
                                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} mt-1`}>
                                                    {entry.subject} {entry.room && `• Room ${entry.room}`}
                                                </p>
                                            </div>
                                        ))}
                                        {timetable.schedule.length > 6 && (
                                            <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-gray-50 border-gray-200'} flex items-center justify-center`}>
                                                <span className="text-sm text-gray-500">
                                                    +{timetable.schedule.length - 6} more
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showAddModal && (
                <TimetableModal
                    key={editingTimetable ? editingTimetable.id : 'new'}
                    darkMode={darkMode}
                    activeView={activeView}
                    teachers={teachers}
                    editingTimetable={editingTimetable}
                    onClose={handleModalClose}
                    onSave={handleModalSave}
                />
            )}
        </div>
    );
};

export default TimetablePage;

