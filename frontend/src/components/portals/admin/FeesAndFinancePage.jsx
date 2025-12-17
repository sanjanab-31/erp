import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Save, X, IndianRupee, Users, AlertCircle, TrendingUp, Calendar, Search } from 'lucide-react';
import { getAllStudents } from '../../../utils/studentStore';
import { useToast } from '../../../context/ToastContext';
import {
    getAllFees,
    addFee,
    updateFee,
    deleteFee,
    getFeeStats,
    getOverdueFees,
    subscribeToUpdates
} from '../../../utils/feeStore';

const FeeModal = ({ darkMode, onClose, onSave, editingFee, students }) => {
    const { showSuccess, showError, showWarning, showInfo } = useToast();
    const [formData, setFormData] = useState({
        studentId: '',
        feeType: '',
        amount: '',
        dueDate: ''
    });

    useEffect(() => {
        if (editingFee) {
            setFormData({
                studentId: editingFee.studentId,
                feeType: editingFee.feeType,
                amount: editingFee.amount,
                dueDate: editingFee.dueDate
            });
        }
    }, [editingFee]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.studentId || !formData.feeType || !formData.amount || !formData.dueDate) {
            showWarning('Please fill all fields');
            return;
        }

        const student = students.find(s => s.id.toString() === formData.studentId.toString());

        if (!student) {
            showInfo('Student not found');
            return;
        }

        const feeData = {
            ...formData,
            studentName: student.name,
            studentClass: student.class
        };

        onSave(feeData);
    };

    const feeTypes = [
        'Tuition Fee',
        'Exam Fee',
        'Library Fee',
        'Transport Fee',
        'Sports Fee',
        'Lab Fee',
        'Annual Fee',
        'Other'
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-md w-full`}>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6 rounded-t-xl`}>
                    <div className="flex items-center justify-between">
                        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {editingFee ? 'Edit' : 'Add'} Fee
                        </h2>
                        <button onClick={onClose} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Student Selection */}
                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Select Student *
                        </label>
                        <select
                            required
                            value={formData.studentId}
                            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            disabled={!!editingFee}
                        >
                            <option value="">Select Student</option>
                            {students.map(student => (
                                <option key={student.id} value={student.id}>
                                    {student.name} - {student.class} (Roll: {student.rollNumber})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Fee Type */}
                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Fee Type *
                        </label>
                        <select
                            required
                            value={formData.feeType}
                            onChange={(e) => setFormData({ ...formData, feeType: e.target.value })}
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        >
                            <option value="">Select Fee Type</option>
                            {feeTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Amount (₹) *
                        </label>
                        <input
                            type="number"
                            required
                            min="1"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="Enter amount"
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        />
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Due Date *
                        </label>
                        <input
                            type="date"
                            required
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        />
                    </div>

                    {/* Action Buttons */}
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
                            <Save className="w-5 h-5" />
                            <span>Save Fee</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const FeesAndFinancePage = ({ darkMode }) => {
    const { showSuccess, showError } = useToast();
    const [fees, setFees] = useState([]);
    const [students, setStudents] = useState([]);
    const [stats, setStats] = useState({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingFee, setEditingFee] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        loadData();
        const unsubscribe = subscribeToUpdates(loadData);
        return unsubscribe;
    }, []);

    const loadData = useCallback(() => {
        const allFees = getAllFees();
        const allStudents = getAllStudents();
        const feeStats = getFeeStats();

        setFees(allFees);
        setStudents(allStudents);
        setStats(feeStats);
    }, []);

    const handleAddFee = useCallback((feeData) => {
        try {
            if (editingFee) {
                updateFee(editingFee.id, feeData);
                showSuccess('Fee updated successfully!');
            } else {
                addFee(feeData);
                showSuccess('Fee added successfully!');
            }
            setShowAddModal(false);
            setEditingFee(null);
        } catch (error) {
            showError(`Error ${editingFee ? 'updating' : 'adding'} fee: ` + error.message);
        }
    }, [editingFee, showSuccess, showError]);

    const handleDelete = useCallback((feeId) => {
        if (window.confirm('Are you sure you want to delete this fee?')) {
            try {
                deleteFee(feeId);
                showSuccess('Fee deleted successfully!');
            } catch (error) {
                showError('Error deleting fee: ' + error.message);
            }
        }
    }, []);

    // Filter fees
    const filteredFees = fees.filter(fee => {
        const matchesSearch = fee.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fee.studentClass.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fee.feeType.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'All' || fee.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Partial':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Pending':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Fees & Finance Management
                </h1>
                <p className="text-sm text-gray-500">Manage student fees and track payments (Real-time sync)</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Receivables</h3>
                        <IndianRupee className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{stats.totalAmount?.toLocaleString() || 0}</p>
                    <p className="text-sm text-gray-500 mt-1">{stats.totalFees || 0} total invoices</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Collected</h3>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{stats.paidAmount?.toLocaleString() || 0}</p>
                    <p className="text-sm text-gray-500 mt-1">{stats.paidFees || 0} fully paid</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pending</h3>
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{stats.remainingAmount?.toLocaleString() || 0}</p>
                    <p className="text-sm text-gray-500 mt-1">{stats.pendingFees || 0} pending invoices</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Partial Paid</h3>
                        <Users className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.partialFees || 0}</p>
                    <p className="text-sm text-gray-500 mt-1">Partially paid invoices</p>
                </div>
            </div>

            {/* Filters & Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search student, class, fee type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`pl-10 pr-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Partial">Partial</option>
                        <option value="Paid">Paid</option>
                    </select>
                </div>

                <button
                    onClick={() => {
                        setEditingFee(null);
                        setShowAddModal(true);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Fee</span>
                </button>
            </div>

            {/* Fees List */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                {filteredFees.length === 0 ? (
                    <div className="p-12 text-center">
                        <IndianRupee className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            No fees found
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            {searchTerm || filterStatus !== 'All' ? 'Try adjusting your filters' : 'Click "Add Fee" to create a new fee record'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                <tr>
                                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Student</th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Fee Type</th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Amount</th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Paid</th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Remaining</th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Due Date</th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Status</th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                {filteredFees.map((fee) => (
                                    <tr key={fee.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{fee.studentName}</div>
                                                <div className="text-sm text-gray-500">{fee.studentClass}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{fee.feeType}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{fee.amount.toLocaleString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>₹{fee.paidAmount.toLocaleString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>₹{fee.remainingAmount.toLocaleString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{new Date(fee.dueDate).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(fee.status)}`}>
                                                {fee.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => {
                                                    setEditingFee(fee);
                                                    setShowAddModal(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(fee.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showAddModal && (
                <FeeModal
                    darkMode={darkMode}
                    onClose={() => { setShowAddModal(false); setEditingFee(null); }}
                    onSave={handleAddFee}
                    editingFee={editingFee}
                    students={students}
                />
            )}
        </div>
    );
};

export default FeesAndFinancePage;
