import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useToast } from '../../../context/ToastContext';
import {
    Calendar,
    Plus,
    Edit,
    Trash2,
    X,
    Clock,
    MapPin,
    FileText,
    BookOpen,
    ChevronDown,
    ChevronUp,
    Search
} from 'lucide-react';
import { examApi, courseApi } from '../../../services/api';

const AdminExamSchedules = ({ darkMode }) => {
    const { showSuccess, showError, showWarning } = useToast();
    const [selectedClass, setSelectedClass] = useState('Grade 10-A');
    const [schedules, setSchedules] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editData, setEditData] = useState(null);

    const [groupedSchedules, setGroupedSchedules] = useState({});
    const [expandedExam, setExpandedExam] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const adminId = currentUser.id || 'admin_1';

    const classes = ['Grade 9-A', 'Grade 9-B', 'Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 11-B', 'Grade 12-A', 'Grade 12-B'];

    const [subjects, setSubjects] = useState([]);

    const loadData = useCallback(async () => {
        try {
            const [examRes, courseRes] = await Promise.all([
                examApi.getAll(),
                courseApi.getAll()
            ]);

            const allExams = examRes.data || [];
            const allCourses = courseRes.data || [];

            const classSchedules = allExams.filter(e => e.class === selectedClass);
            setSchedules(classSchedules);

            const groups = {};
            classSchedules.forEach(schedule => {
                const examName = schedule.examName || 'Untitled Exam';
                if (!groups[examName]) {
                    groups[examName] = [];
                }
                groups[examName].push(schedule);
            });
            setGroupedSchedules(groups);

            const classCourses = allCourses.filter(c => c.class === selectedClass && (c.active === undefined || c.active));
            setSubjects(classCourses.map(c => c.name));

        } catch (error) {
            console.error('Failed to load exam schedules', error);

        }
    }, [selectedClass]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleEditExam = (examName, e) => {
        e.stopPropagation();
        const papers = groupedSchedules[examName];
        if (!papers) return;

        setEditData({
            examName: examName,
            rows: papers.map(p => ({
                id: p.id,
                subject: p.subject || p.courseName,
                date: p.examDate,
                startTime: p.startTime,
                endTime: p.endTime,
                venue: p.venue || ''
            })),
            originalIds: papers.map(p => p.id)
        });
        setShowCreateModal(true);
    };

    const handleDeleteExam = async (examName) => {
        if (confirm(`Are you sure you want to delete all schedules for "${examName}"?`)) {
            const schedulesToDelete = groupedSchedules[examName];
            try {

                const deletePromises = schedulesToDelete.map(schedule => examApi.delete(schedule.id));
                await Promise.all(deletePromises);
                showSuccess('Exam deleted successfully!');
                loadData();
            } catch (error) {
                showError('Failed to delete exam: ' + error.message);
            }
        }
    };

    const handleDeletePaper = async (scheduleId) => {
        if (confirm('Are you sure you want to delete this paper?')) {
            try {
                await examApi.delete(scheduleId);
                showSuccess('Paper deleted successfully!');
                loadData();
            } catch (error) {
                showError('Failed to delete paper: ' + error.message);
            }
        }
    };

    const [searchTerm, setSearchTerm] = useState('');

    const getUpcomingCount = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return schedules.filter(s => new Date(s.examDate) >= today).length;
    };

    const filteredExamGroups = useMemo(() => {
        if (!searchTerm) return Object.entries(groupedSchedules);
        const term = searchTerm.toLowerCase();
        return Object.entries(groupedSchedules).filter(([examName, papers]) => {
            return examName.toLowerCase().includes(term) ||
                papers.some(p => p.subject?.toLowerCase().includes(term));
        });
    }, [searchTerm, groupedSchedules]);

    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <div className="space-y-6">
            { }
            <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Exam Schedule Management
                </h1>
                <p className="text-sm text-gray-500">Create and manage exam schedules for students</p>
            </div>

            { }
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-1">
                    <div className="w-full sm:w-64">
                        <label className={`block text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'} mb-1`}>
                            Select Class
                        </label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        >
                            {classes.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>

                    { }
                    <div className="w-full sm:w-64 relative">
                        <label className={`block text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'} mb-1`}>
                            Search Exams
                        </label>
                        <Search className="absolute left-3 top-8 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or subject..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-9 pr-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        />
                    </div>
                </div>

                <div className="md:self-end">
                    <button
                        onClick={() => {
                            setEditData(null);
                            setShowCreateModal(true);
                        }}
                        className="w-full md:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Create Multiple Exams</span>
                    </button>
                </div>
            </div>

            { }
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Exams</p>
                            <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {Object.keys(groupedSchedules).length}
                            </h3>
                        </div>
                        <div className={`p-3 rounded-full ${darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                            <FileText className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Papers</p>
                            <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {schedules.length}
                            </h3>
                        </div>
                        <div className={`p-3 rounded-full ${darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                            <BookOpen className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Upcoming Papers</p>
                            <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {getUpcomingCount()}
                            </h3>
                        </div>
                        <div className={`p-3 rounded-full ${darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'}`}>
                            <Calendar className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            { }
            {filteredExamGroups.length === 0 ? (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 text-center border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {searchTerm ? 'No exams found matching your search' : `No exams scheduled for ${selectedClass}`}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        {searchTerm ? 'Try simple search terms' : 'Select a class and click "Create Multiple Exams" to get started'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredExamGroups.map(([examName, papers]) => (
                        <div key={examName} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden shadow-sm`}>
                            { }
                            <div
                                className={`p-4 flex items-center justify-between cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                                onClick={() => setExpandedExam(expandedExam === examName ? null : examName)}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {examName}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {papers.length} Papers Scheduled ΓÇó {selectedClass}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={(e) => handleEditExam(examName, e)}
                                        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600 text-purple-400' : 'hover:bg-white text-purple-600'}`}
                                        title="Edit exam"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteExam(examName); }}
                                        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600 text-red-400' : 'hover:bg-white text-red-600'}`}
                                        title="Delete entire exam"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    {expandedExam === examName ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </div>

                            { }
                            {expandedExam === examName && (
                                <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className={`${darkMode ? 'bg-gray-750 text-gray-400' : 'bg-gray-50 text-gray-600'} text-sm`}>
                                                    <th className="p-4 font-medium">Subject</th>
                                                    <th className="p-4 font-medium">Date</th>
                                                    <th className="p-4 font-medium">Time</th>
                                                    <th className="p-4 font-medium">Venue</th>
                                                    <th className="p-4 font-medium text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                                {papers.sort((a, b) => new Date(a.examDate) - new Date(b.examDate)).map(paper => (
                                                    <tr key={paper.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                                        <td className={`p-4 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            {paper.subject}
                                                        </td>
                                                        <td className={`p-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                            {new Date(paper.examDate).toLocaleDateString()}
                                                        </td>
                                                        <td className={`p-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                            {paper.startTime} - {paper.endTime}
                                                        </td>
                                                        <td className={`p-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                            {paper.venue || '-'}
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <button
                                                                onClick={() => handleDeletePaper(paper.id)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            { }
            {showCreateModal && (
                <CreateExamModal
                    darkMode={darkMode}
                    selectedClass={selectedClass}
                    subjects={subjects}
                    editData={editData}
                    onClose={() => setShowCreateModal(false)}
                    onSave={() => {
                        setShowCreateModal(false);
                        loadData();
                    }}
                    adminId={adminId}
                    showSuccess={showSuccess}
                    showError={showError}
                    showWarning={showWarning}
                    minDate={todayStr}
                />
            )}
        </div>
    );
};

const CreateExamModal = ({ darkMode, selectedClass, subjects, editData, onClose, onSave, adminId, showSuccess, showError, showWarning, minDate }) => {
    const [examName, setExamName] = useState(editData ? editData.examName : '');
    const [rows, setRows] = useState(editData ? editData.rows : [
        { id: 1, subject: '', date: '', startTime: '', endTime: '', venue: '' }
    ]);

    const addRow = () => {
        setRows([...rows, { id: Date.now(), subject: '', date: '', startTime: '', endTime: '', venue: '' }]);
    };

    const removeRow = (id) => {
        if (rows.length > 1) {
            setRows(rows.filter(r => r.id !== id));
        }
    };

    const updateRow = (id, field, value) => {
        setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!examName) {
            showWarning('Please enter an exam name');
            return;
        }

        const validRows = rows.filter(r => r.subject && r.date && r.startTime && r.endTime);
        if (validRows.length === 0) {
            showWarning('Please add at least one complete exam paper');
            return;
        }

        try {
            if (editData) {

                const originalIds = new Set(editData.originalIds);
                const currentIds = new Set(rows.map(r => r.id));

                const idsToDelete = editData.originalIds.filter(id => !currentIds.has(id));
                await Promise.all(idsToDelete.map(id => examApi.delete(id)));

                const rowsToUpdate = rows.filter(r => typeof r.id === 'string' && originalIds.has(r.id));

                await Promise.all(rowsToUpdate.map(row =>
                    examApi.update(row.id, {
                        examName: examName,
                        subject: row.subject,
                        examDate: row.date,
                        startTime: row.startTime,
                        endTime: row.endTime,
                        venue: row.venue
                    })
                ));

                const rowsToCreate = rows.filter(r => typeof r.id !== 'string');

                if (rowsToCreate.length > 0) {

                    await Promise.all(rowsToCreate.map(row =>
                        examApi.create({
                            class: selectedClass,
                            examName: examName,
                            subject: row.subject,
                            examDate: row.date,
                            startTime: row.startTime,
                            endTime: row.endTime,
                            venue: row.venue,
                            createdBy: adminId,
                            courseName: row.subject
                        })
                    ));
                }

                showSuccess('Exam schedule updated successfully!');
            } else {

                await Promise.all(validRows.map(row =>
                    examApi.create({
                        class: selectedClass,
                        examName: examName,
                        subject: row.subject,
                        examDate: row.date,
                        startTime: row.startTime,
                        endTime: row.endTime,
                        venue: row.venue,
                        createdBy: adminId,
                        courseName: row.subject
                    })
                ));
                showSuccess('Exam schedules created successfully!');
            }
            onSave();
        } catch (error) {
            showError('Error creating/updating schedules: ' + error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl`}>
                <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {editData ? 'Edit Exam Group' : 'Create Exam Schedule'} for {selectedClass}
                    </h3>
                    <button onClick={onClose}>
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <div className="mb-6">
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Exam Name (e.g., Mid-Term Exam 2024, Unit Test 1) *
                        </label>
                        <input
                            type="text"
                            value={examName}
                            onChange={(e) => setExamName(e.target.value)}
                            placeholder="Enter Exam Name"
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Exam Papers</h4>
                            <button
                                type="button"
                                onClick={addRow}
                                className="text-sm text-purple-500 hover:text-purple-600 font-medium flex items-center"
                            >
                                <Plus className="w-4 h-4 mr-1" /> Add Paper
                            </button>
                        </div>

                        {rows.map((row, index) => (
                            <div key={row.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-750 border-gray-600' : 'bg-gray-50 border-gray-200'} grid grid-cols-1 md:grid-cols-12 gap-4 items-end`}>
                                <div className="md:col-span-3">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Subject *</label>
                                    <input
                                        type="text"
                                        list={`subjects-${row.id}`}
                                        value={row.subject}
                                        onChange={(e) => updateRow(row.id, 'subject', e.target.value)}
                                        placeholder="Subject"
                                        className={`w-full px-3 py-2 text-sm rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-1 focus:ring-purple-500`}
                                    />
                                    <datalist id={`subjects-${row.id}`}>
                                        {subjects.map(s => <option key={s} value={s} />)}
                                    </datalist>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Date *</label>
                                    <input
                                        type="date"
                                        min={minDate}
                                        value={row.date}
                                        onChange={(e) => updateRow(row.id, 'date', e.target.value)}
                                        className={`w-full px-3 py-2 text-sm rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-1 focus:ring-purple-500`}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Start Time *</label>
                                    <input
                                        type="time"
                                        value={row.startTime}
                                        onChange={(e) => updateRow(row.id, 'startTime', e.target.value)}
                                        className={`w-full px-3 py-2 text-sm rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-1 focus:ring-purple-500`}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">End Time *</label>
                                    <input
                                        type="time"
                                        value={row.endTime}
                                        onChange={(e) => updateRow(row.id, 'endTime', e.target.value)}
                                        className={`w-full px-3 py-2 text-sm rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-1 focus:ring-purple-500`}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Venue</label>
                                    <input
                                        type="text"
                                        value={row.venue}
                                        onChange={(e) => updateRow(row.id, 'venue', e.target.value)}
                                        placeholder="Room"
                                        className={`w-full px-3 py-2 text-sm rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-1 focus:ring-purple-500`}
                                    />
                                </div>
                                <div className="md:col-span-1 flex justify-center pb-2">
                                    {rows.length > 1 && (
                                        <button onClick={() => removeRow(row.id)} className="text-red-500 hover:text-red-700">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-end gap-3 bg-opacity-50`}>
                    <button
                        onClick={onClose}
                        className={`px-6 py-2 rounded-lg border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                    >
                        {editData ? 'Update Schedule' : 'Save Schedule'}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default AdminExamSchedules;
