import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Plus, MoreVertical, Mail, Phone, Edit, Trash2, X, Save, UserPlus, BookOpen, Calendar, Award, GraduationCap, UserCheck, Clock, UserX } from 'lucide-react';
import { teacherApi, emailApi } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

const TeacherFormModal = ({ isEdit, onClose, onSubmit, formData, setFormData, darkMode }) => {
    const departments = ['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science', 'Physical Education', 'Arts', 'Languages'];
    const qualifications = ['B.Ed', 'M.Ed', 'B.A', 'M.A', 'B.Sc', 'M.Sc', 'B.Tech', 'M.Tech', 'PhD'];

    const inputClass = `w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm`;
    const labelClass = `block text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`;
    const sectionTitleClass = `text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} uppercase tracking-wider mb-3 pb-1 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl w-full max-w-6xl shadow-2xl flex flex-col max-h-[90vh]`}>

                { }
                <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {isEdit ? 'Edit Teacher Details' : 'Add New Teacher'}
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                { }
                <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        { }
                        <div className="space-y-4">
                            <h3 className={sectionTitleClass}>Identity & Status</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className={labelClass}>Full Name *</label>
                                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} placeholder="Enter full name" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelClass}>Employee ID *</label>
                                        <input type="text" required value={formData.employeeId} onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })} className={inputClass} placeholder="T-101" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Status</label>
                                        <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={inputClass}>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                            <option value="On Leave">On Leave</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Joining Date</label>
                                    <input type="date" value={formData.joiningDate} onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })} className={inputClass} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelClass}>Experience (Yrs)</label>
                                        <input type="number" min="0" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className={inputClass} placeholder="0" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Salary</label>
                                        <input type="number" min="0" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} className={inputClass} placeholder="0" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        { }
                        <div className="space-y-4">
                            <h3 className={sectionTitleClass}>Academic Role</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className={labelClass}>Department *</label>
                                    <select required value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className={inputClass}>
                                        <option value="">Select Department</option>
                                        {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Subject *</label>
                                    <input type="text" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className={inputClass} placeholder="e.g. Mathematics" />
                                </div>
                                <div>
                                    <label className={labelClass}>Qualification</label>
                                    <select value={formData.qualification} onChange={(e) => setFormData({ ...formData, qualification: e.target.value })} className={inputClass}>
                                        <option value="">Select Qualification</option>
                                        {qualifications.map(qual => <option key={qual} value={qual}>{qual}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        { }
                        <div className="space-y-4">
                            <h3 className={sectionTitleClass}>Personal & Contact</h3>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelClass}>Gender</label>
                                        <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className={inputClass}>
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Date of Birth</label>
                                        <input
                                            type="date"
                                            value={formData.dateOfBirth}
                                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                            max={new Date().toISOString().split('T')[0]}
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Email *</label>
                                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} placeholder="teacher@school.com" />
                                </div>
                                <div>
                                    <label className={labelClass}>Phone *</label>
                                    <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} placeholder="+1 234-567-8900" />
                                </div>
                                <div>
                                    <label className={labelClass}>Address</label>
                                    <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={`${inputClass} resize-none h-[88px]`} rows="3" placeholder="Residential Address" />
                                </div>
                            </div>
                        </div>

                    </div>

                    { }
                    <div className="flex justify-end gap-3 pt-6 mt-2  border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} transition-colors`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            <span>{isEdit ? 'Update Teacher' : 'Save Teacher'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DeleteConfirmModal = ({ darkMode, selectedTeacher, onClose, onConfirm }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
    const { showSuccess, showError, showWarning } = useToast();
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

    const loadTeachers = useCallback(async () => {
        try {
            const response = await teacherApi.getAll();
            const data = response.data?.data || [];
            setTeachers(Array.isArray(data) ? data : []);

            try {
                const statsResponse = await teacherApi.getStats();
                setStats(statsResponse.data?.data || { total: 0, active: 0, inactive: 0, onLeave: 0 });
            } catch (statsError) {

                setStats({
                    total: data.length,
                    active: data.filter(t => t.status === 'Active').length,
                    inactive: data.filter(t => t.status === 'Inactive').length,
                    onLeave: data.filter(t => t.status === 'On Leave').length
                });
            }
        } catch (error) {
            console.error('Failed to load teachers', error);
            setTeachers([]);
        }
    }, []);

    useEffect(() => {
        loadTeachers();
    }, [loadTeachers]);

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

    const handleAddTeacher = useCallback(async (e) => {
        e.preventDefault();
        try {

            if (formData.dateOfBirth) {
                const dob = new Date(formData.dateOfBirth);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (dob > today) {
                    showError('Date of birth cannot be in the future!');
                    return;
                }
            }

            // Build payload with required fields
            const teacherPayload = {
                ...formData,
                id: Date.now(),
                password: 'password123',
                role: 'teacher',
                createdAt: new Date().toISOString(),
                createdBy: localStorage.getItem('userEmail') || 'admin@example.com',
                active: true
            };

            await teacherApi.create(teacherPayload);

            // UI cleanup first for better UX
            setShowAddModal(false);
            resetForm();
            loadTeachers();
            showSuccess('Teacher added successfully! Sending credentials...');

            // Send credentials email in background
            emailApi.sendTeacherCredentials({
                email: formData.email,
                password: teacherPayload.password,
                name: formData.name
            }).then(() => {
                showSuccess('📧 Credentials emailed successfully to Faculty!');
            }).catch((emailError) => {
                console.warn('Email sending failed:', emailError);
                // Optional: showError('Failed to send credentials email');
            });
        } catch (error) {
            showError('Error adding teacher: ' + (error.response?.data?.message || error.message));
        }
    }, [formData, resetForm, showSuccess, showError, loadTeachers]);

    const handleEditTeacher = useCallback(async (e) => {
        e.preventDefault();
        try {

            if (formData.dateOfBirth) {
                const dob = new Date(formData.dateOfBirth);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (dob > today) {
                    showError('Date of birth cannot be in the future!');
                    return;
                }
            }

            await teacherApi.update(selectedTeacher.id, formData);
            setShowEditModal(false);
            setSelectedTeacher(null);
            resetForm();
            loadTeachers();
            showSuccess('Teacher updated successfully!');
        } catch (error) {
            showError('Error updating teacher: ' + (error.response?.data?.message || error.message));
        }
    }, [formData, selectedTeacher, resetForm, showSuccess, showError, loadTeachers]);

    const handleDeleteTeacher = useCallback(async () => {
        try {
            await teacherApi.delete(selectedTeacher.id);

            setShowDeleteConfirm(false);
            setSelectedTeacher(null);
            loadTeachers();
            showSuccess('Teacher deleted successfully!');
        } catch (error) {
            showError('Error deleting teacher: ' + (error.response?.data?.message || error.message));
        }
    }, [selectedTeacher, showSuccess, showError, loadTeachers]);

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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer group`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Teachers</h3>
                        <GraduationCap className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{stats.total}</p>
                </div>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer group`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Active</h3>
                        <UserCheck className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{stats.active}</p>
                </div>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer group`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>On Leave</h3>
                        <Clock className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{stats.onLeave}</p>
                </div>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer group`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Inactive</h3>
                        <UserX className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{stats.inactive}</p>
                </div>
            </div>

            { }
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Teachers Management
                </h2>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search teachers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`pl-9 pr-4 py-2 w-full md:w-64 rounded-lg border text-sm ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                                } focus:outline-none`}
                        />
                    </div>
                    <select
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                        className={`px-4 py-2 rounded-lg border text-sm md:w-40 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'} focus:outline-none`}
                    >
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className={`px-4 py-2 rounded-lg border text-sm md:w-32 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'} focus:outline-none`}
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
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 hover:shadow-lg transition-all duration-200 whitespace-nowrap group"
                    >
                        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline">Add Teacher</span>
                    </button>
                </div>
            </div>

            { }
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
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(teacher.status || 'Active') === 'Active'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : teacher.status === 'On Leave'
                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }`}>
                                    {teacher.status || 'Active'}
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

            { }
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
