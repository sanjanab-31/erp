import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Plus, MoreVertical, Mail, Phone, Edit, Trash2, X, Save, UserPlus, Users, UserCheck, AlertTriangle, UserX } from 'lucide-react';
import { studentApi, emailApi } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

const StudentFormModal = ({ isEdit, onClose, onSubmit, formData, setFormData, darkMode }) => {
    const classes = ['Grade 9-A', 'Grade 9-B', 'Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 11-B', 'Grade 12-A', 'Grade 12-B'];

    const inputClass = `w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm`;
    const labelClass = `block text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`;
    const sectionTitleClass = `text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} uppercase tracking-wider mb-3 pb-1 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl w-full max-w-6xl shadow-2xl flex flex-col max-h-[90vh]`}>

                { }
                <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {isEdit ? 'Edit Student Details' : 'Add New Student'}
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
                            <h3 className={sectionTitleClass}>Academic Identity</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className={labelClass}>Full Name *</label>
                                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className={labelClass}>Roll Number *</label>
                                    <input type="text" required value={formData.rollNo} onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })} className={inputClass} placeholder="e.g. 10A-001" />
                                </div>
                                <div>
                                    <label className={labelClass}>Class *</label>
                                    <select required value={formData.class} onChange={(e) => setFormData({ ...formData, class: e.target.value })} className={inputClass}>
                                        <option value="">Select Class</option>
                                        {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Status</label>
                                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={inputClass}>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Warning">Warning</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        { }
                        <div className="space-y-4">
                            <h3 className={sectionTitleClass}>Personal Details</h3>
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
                                    <label className={labelClass}>Student Email *</label>
                                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} placeholder="student@school.com" />
                                </div>
                                <div>
                                    <label className={labelClass}>Student Phone</label>
                                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} placeholder="+1 234-567-8900" />
                                </div>
                            </div>
                        </div>

                        { }
                        <div className="space-y-4">
                            <h3 className={sectionTitleClass}>Family & Address</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className={labelClass}>Parent Name *</label>
                                    <input type="text" required value={formData.parent} onChange={(e) => setFormData({ ...formData, parent: e.target.value })} className={inputClass} placeholder="Guardian Name" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelClass}>Parent Email</label>
                                        <input type="email" value={formData.parentEmail} onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })} className={inputClass} placeholder="parent@mail.com" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Parent Phone</label>
                                        <input type="tel" value={formData.parentPhone} onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })} className={inputClass} placeholder="+1 ..." />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Address</label>
                                    <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={`${inputClass} resize-none h-[88px]`} placeholder="Full residential address..." />
                                </div>
                            </div>
                        </div>

                    </div>

                    { }
                    <div className="flex justify-end gap-3 pt-6 mt-2 border-gray-200 dark:border-gray-700">
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
                            <span>{isEdit ? 'Update Student' : 'Save Student'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DeleteConfirmModal = ({ darkMode, selectedStudent, onClose, onConfirm }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-md w-full p-6`}>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Confirm Delete
            </h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                Are you sure you want to delete <strong>{selectedStudent?.name}</strong>? This action cannot be undone.
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

const Students = ({ darkMode }) => {
    const { showSuccess, showError, showWarning } = useToast();
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState('All Classes');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, warning: 0 });

    const [formData, setFormData] = useState({
        name: '',
        rollNo: '',
        class: '',
        email: '',
        phone: '',
        parent: '',
        parentEmail: '',
        parentPhone: '',
        address: '',
        dateOfBirth: '',
        gender: '',
        status: 'Active',
        attendance: 100,
        grade: 'A'
    });

    const loadStudents = useCallback(async () => {
        try {
            const response = await studentApi.getAll();
            const data = response.data?.data || [];
            // Map backend fields to frontend format
            const mappedData = (Array.isArray(data) ? data : []).map(student => ({
                ...student,
                rollNo: student.rollNumber || student.rollNo || ''
            }));
            setStudents(mappedData);

            try {
                const statsRes = await studentApi.getStats();
                setStats(statsRes.data?.data || { total: 0, active: 0, inactive: 0, warning: 0 });
            } catch (e) {
                const s = Array.isArray(data) ? data : [];
                setStats({
                    total: s.length,
                    active: s.filter(i => i.status === 'Active').length,
                    inactive: s.filter(i => i.status === 'Inactive').length,
                    warning: s.filter(i => i.status === 'Warning').length
                });
            }
        } catch (error) {
            console.error('Failed to load students', error);
            setStudents([]);
        }
    }, []);

    useEffect(() => {
        loadStudents();
    }, [loadStudents]);

    const resetForm = useCallback(() => {
        setFormData({
            name: '',
            rollNo: '',
            class: '',
            email: '',
            phone: '',
            parent: '',
            parentEmail: '',
            parentPhone: '',
            address: '',
            dateOfBirth: '',
            gender: '',
            status: 'Active',
            attendance: 100,
            grade: 'A'
        });
    }, []);

    const handleAddStudent = useCallback(async (e) => {
        e.preventDefault();
        try {

            if (formData.email && formData.parentEmail &&
                formData.email.toLowerCase().trim() === formData.parentEmail.toLowerCase().trim()) {
                showError('Student email and parent email cannot be the same!');
                return;
            }

            if (formData.dateOfBirth) {
                const dob = new Date(formData.dateOfBirth);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (dob > today) {
                    showError('Date of birth cannot be in the future!');
                    return;
                }
            }

            // Ensure required fields for backend and map to schema
            const payload = {
                ...formData,
                // map frontend field names to backend schema
                rollNumber: formData.rollNo,
                // role is fixed for students
                role: 'student',
                // createdBy could be the admin email from localStorage or a placeholder
                createdBy: localStorage.getItem('userEmail') || 'admin@example.com',
                active: true,
                createdAt: new Date().toISOString(),
                // generate a numeric id if needed
                id: Date.now(),
                // ensure password is set
                password: 'password123',
                // remove the unused rollNo field
                // (spread already includes it, but we overwrite with correct name)
            };
            await studentApi.create(payload);

            // UI cleanup first
            setShowAddModal(false);
            resetForm();
            loadStudents();

            let message = 'Student added successfully!\n\n';
            message += '📚 Student Login:\n';
            message += 'Email: ' + formData.email + '\n';
            message += 'Password: password\n';

            if (formData.parentEmail && formData.parentEmail.trim()) {
                message += '\n👨‍👩‍👧 Parent Login:\n';
                message += 'Email: ' + formData.parentEmail + '\n';
                message += 'Password: password';
            }
            showSuccess(message);

            // Send email in background
            emailApi.sendStudentCredentials({
                email: formData.email,
                password: 'password',
                name: formData.name,
                parentEmail: formData.parentEmail
            }).then(() => {
                showSuccess('📧 Credentials emailed successfully!');
            }).catch((emailError) => {
                console.warn('Email sending failed:', emailError);
            });
        } catch (error) {
            showError('Error adding student: ' + (error.response?.data?.message || error.message));
        }
    }, [formData, resetForm, showSuccess, showError]);

    const handleEditStudent = useCallback(async (e) => {
        e.preventDefault();
        try {

            if (formData.email && formData.parentEmail &&
                formData.email.toLowerCase().trim() === formData.parentEmail.toLowerCase().trim()) {
                showError('Student email and parent email cannot be the same!');
                return;
            }

            if (formData.dateOfBirth) {
                const dob = new Date(formData.dateOfBirth);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (dob > today) {
                    showError('Date of birth cannot be in the future!');
                    return;
                }
            }

            // Map frontend fields to backend schema
            const payload = {
                ...formData,
                rollNumber: formData.rollNo,
            };

            await studentApi.update(selectedStudent.id, payload);
            setShowEditModal(false);
            setSelectedStudent(null);
            resetForm();
            loadStudents();
            showSuccess('Student updated successfully!');
        } catch (error) {
            showError('Error updating student: ' + (error.response?.data?.message || error.message));
        }
    }, [formData, selectedStudent, resetForm, showSuccess, showError, loadStudents]);

    const handleDeleteStudent = useCallback(async () => {
        try {

            await studentApi.delete(selectedStudent.id);

            setShowDeleteConfirm(false);
            setSelectedStudent(null);
            loadStudents();
            showSuccess('Student deleted successfully!');
        } catch (error) {
            showError('Error deleting student: ' + (error.response?.data?.message || error.message));
        }
    }, [selectedStudent, showSuccess, showError, loadStudents]);

    const openEditModal = useCallback((student) => {
        console.log('Opening edit modal for student:', student); // Debug log
        setSelectedStudent(student);
        
        // Clean up auto-generated parent name if it matches the pattern "Parent of {name}"
        let parentName = student.parent || '';
        if (parentName && student.name && parentName === `Parent of ${student.name}`) {
            parentName = ''; // Clear it so user can enter actual name
        }
        
        setFormData({
            name: student.name || '',
            rollNo: student.rollNumber || student.rollNo || '',
            class: student.class || '',
            email: student.email || '',
            phone: student.phone || '',
            parent: parentName,
            parentEmail: student.parentEmail || '',
            parentPhone: student.parentPhone || '',
            address: student.address || '',
            dateOfBirth: student.dateOfBirth || '',
            gender: student.gender || '',
            status: student.status || 'Active',
            attendance: student.attendance || 100,
            grade: student.grade || 'A'
        });
        setShowEditModal(true);
    }, []);

    const openDeleteConfirm = useCallback((student) => {
        setSelectedStudent(student);
        setShowDeleteConfirm(true);
    }, []);

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesClass = filterClass === 'All Classes' || student.class === filterClass;
        const matchesStatus = filterStatus === 'All' || student.status === filterStatus;
        return matchesSearch && matchesClass && matchesStatus;
    });

    const classes = ['All Classes', 'Grade 9-A', 'Grade 9-B', 'Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 11-B', 'Grade 12-A', 'Grade 12-B'];
    const statuses = ['All', 'Active', 'Inactive', 'Warning'];

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer group`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Students</h3>
                        <Users className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
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
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Warning</h3>
                        <AlertTriangle className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{stats.warning}</p>
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
                    Students Management
                </h2>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-white border-gray-300 text-gray-900'
                                } focus:outline-none`}
                        />
                    </div>
                    <select
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                        className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none`}
                    >
                        {classes.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className={`px-3 py-2 text-sm rounded-lg border md:w-32 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
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
                        <span>Add Student</span>
                    </button>
                </div>
            </div>

            { }
            <div className={`overflow-hidden rounded-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="overflow-x-auto">
                    <table className={`w-full text-left ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <thead className={`text-xs uppercase ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                            <tr>
                                <th className="px-6 py-4 font-medium">Name</th>
                                <th className="px-6 py-4 font-medium">ID / Class</th>
                                <th className="px-6 py-4 font-medium">Parent Info</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <UserPlus className="w-16 h-16 text-gray-400 mb-4" />
                                            <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                No students found
                                            </p>
                                            <p className="text-sm text-gray-500 mt-2">
                                                Click "Add Student" to create your first student record
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className={`${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} transition-colors`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                                                    {student.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{student.name}</p>
                                                    <p className="text-sm text-gray-500">{student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{student.rollNo}</p>
                                            <p className="text-sm text-gray-500">Class {student.class}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                {student.parent && !student.parent.startsWith('Parent of ') && (
                                                    <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{student.parent}</p>
                                                )}
                                                <div className="flex gap-2">
                                                    {student.parentEmail ? (
                                                        <div className="relative group">
                                                            <button
                                                                className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    navigator.clipboard.writeText(student.parentEmail);
                                                                    showSuccess(`Email copied: ${student.parentEmail}`);
                                                                }}
                                                            >
                                                                <Mail className="w-4 h-4" />
                                                            </button>
                                                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-10 w-max max-w-xs">
                                                                <div className={`px-3 py-2 text-xs rounded-lg shadow-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'}`}>
                                                                    {student.parentEmail}
                                                                    <div className="text-[10px] text-gray-400 mt-0.5">Click to copy</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                    {(student.parentPhone || student.phone) ? (
                                                        <div className="relative group">
                                                            <button
                                                                className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    const phoneNum = student.parentPhone || student.phone;
                                                                    navigator.clipboard.writeText(phoneNum);
                                                                    showSuccess(`Phone copied: ${phoneNum}`);
                                                                }}
                                                            >
                                                                <Phone className="w-4 h-4" />
                                                            </button>
                                                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-10 w-max max-w-xs">
                                                                <div className={`px-3 py-2 text-xs rounded-lg shadow-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'}`}>
                                                                    {student.parentPhone || student.phone}
                                                                    <div className="text-[10px] text-gray-400 mt-0.5">Click to copy</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(student.status || 'Active') === 'Active'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : student.status === 'Warning'
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                }`}>
                                                {student.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(student)}
                                                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} transition-colors`}
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4 text-blue-500" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteConfirm(student)}
                                                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} transition-colors`}
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            { }
            {showAddModal && (
                <StudentFormModal
                    isEdit={false}
                    onClose={() => {
                        setShowAddModal(false);
                        resetForm();
                    }}
                    onSubmit={handleAddStudent}
                    formData={formData}
                    setFormData={setFormData}
                    darkMode={darkMode}
                />
            )}

            {showEditModal && (
                <StudentFormModal
                    isEdit={true}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedStudent(null);
                        resetForm();
                    }}
                    onSubmit={handleEditStudent}
                    formData={formData}
                    setFormData={setFormData}
                    darkMode={darkMode}
                />
            )}

            {showDeleteConfirm && (
                <DeleteConfirmModal
                    darkMode={darkMode}
                    selectedStudent={selectedStudent}
                    onClose={() => {
                        setShowDeleteConfirm(false);
                        setSelectedStudent(null);
                    }}
                    onConfirm={handleDeleteStudent}
                />
            )}
        </div>
    );
};

export default Students;

