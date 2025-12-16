import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, CreditCard, Calendar, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';
import { getAllStudents } from '../../../utils/studentStore';
import { getFeesByStudent, makePayment, subscribeToUpdates } from '../../../utils/feeStore';
import StripePaymentModal from './StripePaymentModal';
import { useToast } from '../../../context/ToastContext';

const PaymentModal = ({ darkMode, fee, onClose, onPaymentSuccess }) => {
    const { showSuccess, showError, showWarning } = useToast();
    const [paymentData, setPaymentData] = useState({
        amount: fee.remainingAmount,
        paymentMethod: 'UPI',
        transactionId: ''
    });
    const [paymentType, setPaymentType] = useState('full');

    useEffect(() => {
        if (paymentType === 'full') {
            setPaymentData(prev => ({ ...prev, amount: fee.remainingAmount }));
        }
    }, [paymentType, fee.remainingAmount]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!paymentData.transactionId.trim()) {
            showWarning('Please enter transaction ID');
            return;
        }

        if (parseFloat(paymentData.amount) <= 0) {
            showWarning('Amount must be greater than 0');
            return;
        }

        if (parseFloat(paymentData.amount) > fee.remainingAmount) {
            showWarning('Amount cannot be greater than remaining amount');
            return;
        }

        try {
            makePayment(fee.id, {
                ...paymentData,
                paidBy: 'Parent'
            });
            showSuccess('Payment successful!');
            onPaymentSuccess();
        } catch (error) {
            showError('Error processing payment: ' + error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-md w-full`}>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6 rounded-t-xl`}>
                    <div className="flex items-center justify-between">
                        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Make Payment
                        </h2>
                        <button onClick={onClose} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Fee Details */}
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Fee Type:</span>
                                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{fee.feeType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Total Amount:</span>
                                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{fee.amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Paid:</span>
                                <span className="text-sm font-medium text-green-600">₹{fee.paidAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-t pt-2">
                                <span className="text-sm font-semibold text-gray-500">Remaining:</span>
                                <span className="text-sm font-bold text-red-600">₹{fee.remainingAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Type */}
                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Payment Type *
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="full"
                                    checked={paymentType === 'full'}
                                    onChange={(e) => setPaymentType(e.target.value)}
                                    className="mr-2"
                                />
                                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Payment</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="partial"
                                    checked={paymentType === 'partial'}
                                    onChange={(e) => setPaymentType(e.target.value)}
                                    className="mr-2"
                                />
                                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Partial Payment</span>
                            </label>
                        </div>
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
                            max={fee.remainingAmount}
                            step="0.01"
                            value={paymentData.amount}
                            onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                            disabled={paymentType === 'full'}
                            placeholder="Enter amount"
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50`}
                        />
                        {paymentType === 'partial' && (
                            <p className="text-xs text-gray-500 mt-1">Maximum: ₹{fee.remainingAmount.toLocaleString()}</p>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Payment Method *
                        </label>
                        <select
                            required
                            value={paymentData.paymentMethod}
                            onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        >
                            <option value="UPI">UPI</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                    </div>

                    {/* Transaction ID */}
                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Transaction ID / Reference Number *
                        </label>
                        <input
                            type="text"
                            required
                            value={paymentData.transactionId}
                            onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                            placeholder="Enter transaction ID"
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter the transaction ID from your payment app/bank</p>
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
                            <CreditCard className="w-5 h-5" />
                            <span>Pay ₹{parseFloat(paymentData.amount).toLocaleString()}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const FeeManagementPage = ({ darkMode }) => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [childName, setChildName] = useState('');
    const [selectedFee, setSelectedFee] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showStripeModal, setShowStripeModal] = useState(false);

    const parentEmail = localStorage.getItem('userEmail');

    useEffect(() => {
        loadFees();
        const unsubscribe = subscribeToUpdates(loadFees);
        return unsubscribe;
    }, []);

    const loadFees = useCallback(() => {
        setLoading(true);
        console.log('Loading fees for parent email:', parentEmail);

        // Find child by parent email
        const students = getAllStudents();
        console.log('All students:', students);

        const child = students.find(s => s.parentEmail === parentEmail || s.guardianEmail === parentEmail);
        console.log('Child found:', child);

        if (child) {
            setChildName(child.name);
            console.log('Child ID:', child.id);

            const childFees = getFeesByStudent(child.id);
            console.log('Child fees found:', childFees);
            setFees(childFees);
        } else {
            console.log('Child not found for parent email:', parentEmail);
            console.log('Trying to match with student emails...');

            // Debug: Show all parent/guardian emails
            students.forEach(s => {
                console.log(`Student: ${s.name}, Parent Email: ${s.parentEmail}, Guardian Email: ${s.guardianEmail}`);
            });
        }

        setLoading(false);
    }, [parentEmail]);

    const handlePayment = (fee, method = 'manual') => {
        setSelectedFee(fee);
        if (method === 'stripe') {
            setShowStripeModal(true);
        } else {
            setShowPaymentModal(true);
        }
    };

    const handlePaymentSuccess = () => {
        setShowPaymentModal(false);
        setShowStripeModal(false);
        setSelectedFee(null);
        loadFees();
    };

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
            {/* Header */}
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    {childName ? `${childName}'s Fees` : 'Fee Management'}
                </h1>
                <p className="text-sm text-gray-500">View and pay fees (Real-time sync with Admin)</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                    <p className="text-sm text-gray-500 mt-1">Completed</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Remaining</h3>
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{remainingAmount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">To be paid</p>
                </div>
            </div>

            {/* Fees List */}
            {fees.length === 0 ? (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
                    <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        No Fees Found
                    </h3>
                    <p className="text-gray-500">
                        No fee records found for your child. Contact admin if this seems incorrect.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {fees.map((fee) => (
                        <div key={fee.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {fee.feeType}
                                        </h3>
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(fee.status)}`}>
                                            {fee.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
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

                                    {/* Payment History */}
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
                                </div>

                                {fee.status !== 'Paid' && (
                                    <div>
                                        <button
                                            onClick={() => handlePayment(fee, 'stripe')}
                                            className="w-full px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-2"
                                        >
                                            <CreditCard className="w-5 h-5" />
                                            <span>Pay Now</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && selectedFee && (
                <PaymentModal
                    darkMode={darkMode}
                    fee={selectedFee}
                    onClose={() => { setShowPaymentModal(false); setSelectedFee(null); }}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}

            {/* Stripe Payment Modal */}
            {showStripeModal && selectedFee && (
                <StripePaymentModal
                    darkMode={darkMode}
                    fee={selectedFee}
                    studentName={childName}
                    onClose={() => { setShowStripeModal(false); setSelectedFee(null); }}
                />
            )}
        </div>
    );
};

export default FeeManagementPage;
