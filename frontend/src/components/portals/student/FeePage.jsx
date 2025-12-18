import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DollarSign, Calendar, AlertCircle, CheckCircle, Clock, Info } from 'lucide-react';
import { studentApi, feeApi } from '../../../services/api';

const FeePage = () => {
    const { darkMode, student } = useOutletContext();
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [studentName, setStudentName] = useState(student ? student.name : '');

    useEffect(() => {
        if (student) {
            setStudentName(student.name);
            loadFees();
        }
    }, [student]);

    const loadFees = useCallback(async () => {
        if (!student) return;
        setLoading(true);

        try {
            const feeRes = await feeApi.getAll({ studentId: student.id });
            setFees(feeRes.data?.data || []);
        } catch (error) {
            console.error('Error loading fees:', error);
        } finally {
            setLoading(false);
        }
    }, [student]);

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

    const totalAmount = fees.reduce((sum, f) => sum + f.amount, 0);
    const paidAmount = fees.reduce((sum, f) => sum + f.paidAmount, 0);
    const remainingAmount = fees.reduce((sum, f) => sum + f.remainingAmount, 0);
    const paidFees = fees.filter(f => f.status === 'Paid').length;
    const pendingFees = fees.filter(f => f.status !== 'Paid').length;

    if (loading) {
        return (
            <div className="flex-1 overflow-y-auto p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
                        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Loading fees...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-8">
            { }
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    My Fees
                </h1>
                <p className="text-sm text-gray-500">View your fee details (Real-time sync with Admin)</p>
            </div>

            { }
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Fees</h3>
                        <DollarSign className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{totalAmount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">All fees</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Paid</h3>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{paidAmount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">{paidFees} fees paid</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Remaining</h3>
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{remainingAmount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">{pendingFees} pending</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Payment Rate</h3>
                        <DollarSign className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0}%
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Completed</p>
                </div>
            </div>

            { }
            <div className={`${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-xl p-4 mb-6`}>
                <div className="flex items-start space-x-3">
                    <Info className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mt-0.5`} />
                    <div>
                        <h4 className={`font-semibold text-sm ${darkMode ? 'text-blue-300' : 'text-blue-900'} mb-1`}>
                            Payment Information
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                            To make payments, please ask your parent/guardian to log in to the Parent Portal. Payments can be made via UPI or Bank Transfer.
                        </p>
                    </div>
                </div>
            </div>

            { }
            {fees.length === 0 ? (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
                    <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        No Fees Found
                    </h3>
                    <p className="text-gray-500">
                        No fee records found. Contact admin if this seems incorrect.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {fees.map((fee) => (
                        <div key={fee.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {fee.feeType}
                                </h3>
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(fee.status)}`}>
                                    {fee.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">Total Amount</p>
                                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{fee.amount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Paid</p>
                                    <p className="text-sm font-semibold text-green-600">₹{fee.paidAmount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Remaining</p>
                                    <p className="text-sm font-semibold text-red-600">₹{fee.remainingAmount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Due Date</p>
                                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {new Date(fee.dueDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            { }
                            {fee.payments && fee.payments.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-xs font-semibold text-gray-500 mb-2">Payment History:</p>
                                    <div className="space-y-2">
                                        {fee.payments.map((payment) => (
                                            <div key={payment.id} className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex justify-between`}>
                                                <span>
                                                    {new Date(payment.paymentDate).toLocaleDateString()} - {payment.paymentMethod}
                                                </span>
                                                <span className="font-semibold">₹{payment.amount.toLocaleString()}</span>
                                                <span className="text-gray-500">ID: {payment.transactionId}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            { }
                            <div className="mt-4">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Payment Progress</span>
                                    <span>{Math.round((fee.paidAmount / fee.amount) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${(fee.paidAmount / fee.amount) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FeePage;
