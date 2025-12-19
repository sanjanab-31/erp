import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { DollarSign, CreditCard, Calendar, AlertCircle, CheckCircle, Clock, X, Loader } from 'lucide-react';
import { studentApi, feeApi, parentApi, paymentApi } from '../../../services/api';
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

    const handleSubmit = async (e) => {
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
            await feeApi.update(fee.id, {
                status: parseFloat(paymentData.amount) >= fee.remainingAmount ? 'Paid' : 'Partial',
                paidAmount: (fee.paidAmount || 0) + parseFloat(paymentData.amount),

                paymentDetails: {
                    amount: parseFloat(paymentData.amount),
                    paymentMethod: paymentData.paymentMethod,
                    transactionId: paymentData.transactionId,
                    paidBy: 'Parent',
                    paymentDate: new Date().toISOString()
                }
            });
            showSuccess('Payment successful!');
            onPaymentSuccess();
        } catch (error) {
            console.error(error);
            showError('Error processing payment: ' + (error.response?.data?.message || error.message));
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
                    { }
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

                    { }
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

                    { }
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

                    { }
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

                    { }
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

                    { }
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

const FeeManagementPage = () => {
    const { darkMode } = useOutletContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const { showSuccess, showError, showInfo } = useToast();
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [childName, setChildName] = useState('');
    const [selectedFee, setSelectedFee] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showStripeModal, setShowStripeModal] = useState(false);
    const processedRef = useRef(false);

    const parentEmail = localStorage.getItem('userEmail');

    // Handle Stripe Redirect Success
    useEffect(() => {
        const paymentStatus = searchParams.get('payment');
        const sessionId = searchParams.get('session_id');

        if (paymentStatus === 'success' && sessionId && !processedRef.current) {
            processedRef.current = true;
            handleStripeSuccess(sessionId);
        } else if (paymentStatus === 'cancelled') {
            showInfo('Payment was cancelled');
            // Clean up URL
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('payment');
            setSearchParams(newParams);
        }
    }, [searchParams]);

    const handleStripeSuccess = async (sessionId) => {
        console.log('🏁 Starting Stripe payment verification for session:', sessionId);
        setProcessingPayment(true);
        try {
            // 1. Verify session with payment server
            console.log('📡 Fetching session details from payment server...');
            const sessionRes = await paymentApi.getCheckoutSession(sessionId);
            const session = sessionRes.data;
            console.log('✅ Session retrieved:', session.id, 'Status:', session.payment_status);

            if (session.payment_status === 'paid') {
                const pendingData = JSON.parse(sessionStorage.getItem('pendingPayment') || '{}');

                // Use metadata if sessionStorage is cleared/lost
                const feeId = pendingData.feeId || session.metadata?.feeId;
                const amount = pendingData.amount || (session.amount_total / 100);

                console.log('🔗 Verifying Fee ID:', feeId, 'Amount:', amount);

                if (feeId) {
                    // 2. Update backend database
                    console.log('💾 Updating backend database for fee:', feeId);
                    await feeApi.pay(feeId, {
                        amount: amount,
                        paymentMethod: 'Stripe',
                        transactionId: session.payment_intent || 'STRIPE_TXN',
                        paidBy: 'Parent'
                    });

                    showSuccess('Payment verified and updated successfully!');
                    console.log('🎉 Payment successfully reflected in database');
                    sessionStorage.removeItem('pendingPayment');
                } else {
                    console.error('❌ Could not find Fee ID in session or storage');
                    showError('Payment verification failed: Internal ID missing.');
                }
            } else {
                console.warn('⚠️ Payment not completed. Status:', session.payment_status);
                showError('Payment verification failed: Status is ' + session.payment_status);
            }
        } catch (error) {
            console.error('❌ Error verifying payment:', error);
            const errorMsg = error.response?.data?.error || error.message;
            showError('Payment verification error: ' + errorMsg);
            processedRef.current = false; // Allow retry on error
        } finally {
            setProcessingPayment(false);
            // Clean up URL parameters to prevent repeated processing on manual refreshes
            const newParams = new URLSearchParams(window.location.search);
            newParams.delete('payment');
            newParams.delete('session_id');
            const newUrl = window.location.pathname + (newParams.toString() ? '?' + newParams.toString() : '');
            window.history.replaceState({}, '', newUrl);

            console.log('🔄 Cleaning up URL and refreshing fee list...');
            loadFees(); // Refresh data
        }
    };

    useEffect(() => {
        loadFees();
    }, [parentEmail]);

    const loadFees = useCallback(async () => {
        if (!parentEmail) return;
        setLoading(true);

        try {
            // Fetch everything in parallel
            const [parentsRes, studentRes, feesRes] = await Promise.all([
                parentApi.getAll(),
                studentApi.getAll(),
                feeApi.getAll()
            ]);

            const allParents = Array.isArray(parentsRes?.data?.data) ? parentsRes.data.data : [];
            const currentParent = allParents.find(p => p.email?.toLowerCase() === parentEmail?.toLowerCase());


            if (!currentParent) {
                console.error('Parent record not found for:', parentEmail);
                setLoading(false);
                return;
            }

            const allStudents = Array.isArray(studentRes?.data?.data) ? studentRes.data.data : [];
            const child = allStudents.find(s =>
                (s.id?.toString() === currentParent.studentId?.toString()) ||
                (s.parentEmail?.toLowerCase() === currentParent.email?.toLowerCase())
            );


            if (child) {
                setChildName(child.name);

                const allFees = Array.isArray(feesRes?.data?.data) ? feesRes.data.data : [];


                // Filter fees for this specific child - handle both string and number comparison
                const childFees = allFees.filter(f => {
                    const feeStudentId = f.studentId;
                    const childStudentId = child.id;

                    // Compare as both string and number to handle type mismatches
                    const match = feeStudentId == childStudentId ||
                        String(feeStudentId) === String(childStudentId);


                    return match;
                });


                // Calculate remaining amount for each fee
                const feesWithRemaining = childFees.map(fee => ({
                    ...fee,
                    remainingAmount: (fee.amount || 0) - (fee.paidAmount || 0)
                }));

                setFees(feesWithRemaining);
            } else {
                console.error('Student not found for studentId:', currentParent.studentId);
                setFees([]);
            }
        } catch (error) {
            console.error('Error loading fees:', error);
        } finally {
            setLoading(false);
        }
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

    if (processingPayment) {
        return (
            <div className="flex-1 overflow-y-auto p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <Loader className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-spin" />
                        <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Verifying payment...
                        </p>
                        <p className="text-sm text-gray-500 mt-2">Please do not refresh the page.</p>
                    </div>
                </div>
            </div>
        );
    }

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
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                    {childName ? `${childName}'s Fees` : 'Fee Management'}
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    View and pay fees • Real-time sync with Admin
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Fees</h3>
                        <DollarSign className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>₹{totalAmount.toLocaleString()}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>All fees</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Paid</h3>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>₹{paidAmount.toLocaleString()}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Completed</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Remaining</h3>
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>₹{remainingAmount.toLocaleString()}</p>
                    <p className={`text-sm ${darkMode ? 'text-orange-500' : 'text-orange-600'} font-medium`}>
                        {remainingAmount > 0 ? 'Due payment' : 'All clear'}
                    </p>
                </div>
            </div>

            {/* Fee List or Empty State */}
            {fees.length === 0 ? (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
                    <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        No Fees Found
                    </h3>
                    <p className="text-gray-500 mb-4">
                        No fee records found for {childName || 'your child'}. Contact admin if this seems incorrect.
                    </p>
                    <div className={`text-left max-w-md mx-auto p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} text-sm`}>
                        <p className="font-semibold mb-2">Troubleshooting:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                            <li>Check browser console (F12) for detailed logs</li>
                            <li>Verify fees are created in admin portal for this student</li>
                            <li>Ensure student ID matches in fee records</li>
                        </ul>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {fees.map((fee) => (
                        <div key={fee.id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md`}>
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                                            {fee.feeType}
                                        </h3>
                                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(fee.status)}`}>
                                            {fee.status}
                                        </span>
                                    </div>
                                    {fee.status !== 'Paid' && (
                                        <button
                                            onClick={() => handlePayment(fee, 'stripe')}
                                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm"
                                        >
                                            <CreditCard className="w-5 h-5" />
                                            Pay Now
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                        <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Total Amount</p>
                                        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{fee.amount.toLocaleString()}</p>
                                    </div>
                                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
                                        <p className={`text-xs font-medium ${darkMode ? 'text-green-300' : 'text-green-600'} mb-1`}>Paid</p>
                                        <p className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>₹{fee.paidAmount.toLocaleString()}</p>
                                    </div>
                                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
                                        <p className={`text-xs font-medium ${darkMode ? 'text-red-300' : 'text-red-600'} mb-1`}>Remaining</p>
                                        <p className={`text-2xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>₹{fee.remainingAmount.toLocaleString()}</p>
                                    </div>
                                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                        <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Due Date</p>
                                        <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {new Date(fee.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                {fee.payments && fee.payments.length > 0 && (
                                    <div className="mt-6">
                                        <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>Payment History:</p>
                                        <div className="space-y-2">
                                            {fee.payments.map((payment, idx) => (
                                                <div key={payment.id || `pay-${idx}`} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-2 h-2 rounded-full bg-green-500`}></div>
                                                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                            {new Date(payment.paymentDate).toLocaleDateString('en-IN')} - {payment.paymentMethod}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{payment.amount.toLocaleString()}</span>
                                                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} font-mono`}>ID: {payment.transactionId}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            { }
            {showPaymentModal && selectedFee && (
                <PaymentModal
                    darkMode={darkMode}
                    fee={selectedFee}
                    onClose={() => { setShowPaymentModal(false); setSelectedFee(null); }}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}

            { }
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
