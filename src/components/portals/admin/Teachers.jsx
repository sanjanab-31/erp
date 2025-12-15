import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Plus, MoreVertical, Mail, Phone, Edit, Trash2, X, Save, UserPlus, BookOpen, Calendar, Award } from 'lucide-react';
import { getAllTeachers, addTeacher, updateTeacher, deleteTeacher, subscribeToUpdates, getTeacherStats } from '../../../utils/teacherStore';

// Move modal components outside to prevent re-creation on every render
const TeacherFormModal = ({ isEdit, onClose, onSubmit, formData, setFormData, darkMode }) => {
    const departments = ['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science', 'Physical Education', 'Arts', 'Languages'];
    const qualifications = ['B.Ed', 'M.Ed', 'B.A', 'M.A', 'B.Sc', 'M.Sc', 'B.Tech', 'M.Tech', 'PhD'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto`}>
                <div className={`sticky top-0 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6 z-10`}>
                    <div className="flex items-center justify-between">
                        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {isEdit ? 'Edit Teacher' : 'Add New Teacher'}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-6">
                    {/* Personal Information */}
                    <div>
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none`}
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Employee ID *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.employeeId}
                                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none`}
                                    placeholder="e.g., T-101"
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Department *
                                </label>
                                <select
                                    required
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none`}
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
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
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none`}
                                    placeholder="e.g., Mathematics"
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Qualification
                                </label>
                                <select
                                    value={formData.qualification}
                                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none`}
                                >
                                    <option value="">Select Qualification</option>
                                    {qualifications.map(qual => (
                                        <option key={qual} value={qual}>{qual}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Gender
                                </label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none`}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Joining Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.joiningDate}
                                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none`}
                                    placeholder="teacher@school.com"
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Phone *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none`}
                                    placeholder="+1 234-567-8900"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Address
                                </label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none`}
                                    rows="2"
                                    placeholder="Enter address"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Employment Details */}
                    <div>
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                            Employment Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Experience (Years)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none`}
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Salary
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.salary}
                                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none`}
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none`}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="On Leave">On Leave</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`px-6 py-2 rounded-lg border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} transition-colors`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                        >
                            <Save className="w-5 h-5" />
                            <span>{isEdit ? 'Update Teacher' : 'Add Teacher'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DeleteConfirmModal = ({ darkMode, selectedTeacher, onClose, onConfirm }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-md w-full p-6`}>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Confirm Delete
            </h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                Are you sure you want to delete <strong>{selectedTeacher?.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
                <button
                    onClick={onClose}
                    className={`px-4 py-2 rounded-lg border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
);

const Teachers = ({ darkMode }) => {
    const [teachers, setTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('All Departments');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, onLeave: 0 });

    const [formData, setFormData] = useState({
        name: '',
        employeeId: '',
        department: '',
        subject: '',
        qualification: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        gender: '',
        joiningDate: '',
        experience: '',
        salary: '',
        status: 'Active'
    });

    // Load teachers on mount and subscribe to updates
    useEffect(() => {
        loadTeachers();
        const unsubscribe = subscribeToUpdates(loadTeachers);
        return unsubscribe;
    }, []);

    const loadTeachers = useCallback(() => {
        const data = getAllTeachers();
        setTeachers(data);
        setStats(getTeacherStats());
    }, []);

    const resetForm = useCallback(() => {
        setFormData({
            name: '',
            employeeId: '',
            department: '',
            subject: '',
            qualification: '',
            email: '',
            phone: '',
            address: '',
            dateOfBirth: '',
            gender: '',
            joiningDate: '',
            experience: '',
            salary: '',
            status: 'Active'
        });
    }, []);

    const handleAddTeacher = useCallback((e) => {
        e.preventDefault();
        try {
            addTeacher(formData);
            setShowAddModal(false);
            resetForm();
            alert('Teacher added successfully!');
        } catch (error) {
            alert('Error adding teacher: ' + error.message);
        }
    }, [formData, resetForm]);

    const handleEditTeacher = useCallback((e) => {
        e.preventDefault();
        try {
            updateTeacher(selectedTeacher.id, formData);
            setShowEditModal(false);
            setSelectedTeacher(null);
            resetForm();
            alert('Teacher updated successfully!');
        } catch (error) {
            alert('Error updating teacher: ' + error.message);
        }
    }, [formData, selectedTeacher, resetForm]);

    const handleDeleteTeacher = useCallback(() => {
        try {
            deleteTeacher(selectedTeacher.id);
            setShowDeleteConfirm(false);
            setSelectedTeacher(null);
            alert('Teacher deleted successfully!');
        } catch (error) {
            alert('Error deleting teacher: ' + error.message);
        }
    }, [selectedTeacher]);

    const openEditModal = useCallback((teacher) => {
        setSelectedTeacher(teacher);
        setFormData({
            name: teacher.name || '',
            employeeId: teacher.employeeId || '',
            department: teacher.department || '',
            subject: teacher.subject || '',
            qualification: teacher.qualification || '',
            email: teacher.email || '',
            phone: teacher.phone || '',
            address: teacher.address || '',
            dateOfBirth: teacher.dateOfBirth || '',
            gender: teacher.gender || '',
            joiningDate: teacher.joiningDate || '',
            experience: teacher.experience || '',
            salary: teacher.salary || '',
            status: teacher.status || 'Active'
        });
        setShowEditModal(true);
    }, []);

    const openDeleteConfirm = useCallback((teacher) => {
        setSelectedTeacher(teacher);
        setShowDeleteConfirm(true);
    }, []);

    const filteredTeachers = teachers.filter(teacher => {
        const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (teacher.email && teacher.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (teacher.subject && teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesDepartment = filterDepartment === 'All Departments' || teacher.department === filterDepartment;
        const matchesStatus = filterStatus === 'All' || teacher.status === filterStatus;
        return matchesSearch && matchesDepartment && matchesStatus;
    });

    const departments = ['All Departments', 'Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science', 'Physical Education', 'Arts', 'Languages'];
    const statuses = ['All', 'Active', 'Inactive', 'On Leave'];

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className="text-sm text-gray-500">Total Teachers</p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
                </div>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className="text-sm text-gray-500">Active</p>
                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className="text-sm text-gray-500">On Leave</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.onLeave}</p>
                </div>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className="text-sm text-gray-500">Inactive</p>
                    <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Teachers Management
                </h2>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search teachers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-white border-gray-300 text-gray-900'
                                } focus:outline-none`}
                        />
                    </div>
                    <select
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                        className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none`}
                    >
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none`}
                    >
                        {statuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowAddModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">Add Teacher</span>
                    </button>
                </div>
            </div>

            {/* Teachers Grid */}
            {filteredTeachers.length === 0 ? (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 text-center border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        No teachers found
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Click "Add Teacher" to create your first teacher record
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeachers.map((teacher) => (
                        <div key={teacher.id} className={`rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 transition-shadow hover:shadow-lg`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                        {teacher.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{teacher.name}</h3>
                                        <p className="text-sm text-gray-500">{teacher.employeeId}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <BookOpen className="w-4 h-4 text-purple-500" />
                                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{teacher.subject}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>{teacher.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{teacher.phone}</span>
                                </div>
                                {teacher.experience && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Award className="w-4 h-4 text-gray-400" />
                                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{teacher.experience} years exp.</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${teacher.status === 'Active'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : teacher.status === 'On Leave'
                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }`}>
                                    {teacher.status}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(teacher)}
                                        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-blue-400' : 'hover:bg-gray-50 text-blue-600'}`}
                                        title="Edit"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => openDeleteConfirm(teacher)}
                                        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-50 text-red-600'}`}
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modals */}
            {showAddModal && (
                <TeacherFormModal
                    isEdit={false}
                    onClose={() => {
                        setShowAddModal(false);
                        resetForm();
                    }}
                    onSubmit={handleAddTeacher}
                    formData={formData}
                    setFormData={setFormData}
                    darkMode={darkMode}
                />
            )}

            {showEditModal && (
                <TeacherFormModal
                    isEdit={true}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedTeacher(null);
                        resetForm();
                    }}
                    onSubmit={handleEditTeacher}
                    formData={formData}
                    setFormData={setFormData}
                    darkMode={darkMode}
                />
            )}

            {showDeleteConfirm && (
                <DeleteConfirmModal
                    darkMode={darkMode}
                    selectedTeacher={selectedTeacher}
                    onClose={() => {
                        setShowDeleteConfirm(false);
                        setSelectedTeacher(null);
                    }}
                    onConfirm={handleDeleteTeacher}
                />
            )}
        </div>
    );
};

export default Teachers;
