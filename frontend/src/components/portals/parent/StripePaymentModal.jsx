import React, { useState, useEffect } from 'react';
import { X, CreditCard, Lock, Loader, ExternalLink, AlertCircle } from 'lucide-react';
import { paymentApi } from '../../../services/api';

const StripePaymentModal = ({ darkMode, fee, studentName, onClose }) => {
    const [paymentData, setPaymentData] = useState({
        amount: fee.remainingAmount,
    });
    const [paymentType, setPaymentType] = useState('full');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (paymentType === 'full') {
            setPaymentData(prev => ({ ...prev, amount: fee.remainingAmount }));
        }
    }, [paymentType, fee.remainingAmount]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {

            const amount = parseFloat(paymentData.amount);

            if (isNaN(amount) || amount <= 0) {
                throw new Error('Please enter a valid amount greater than 0');
            }

            if (amount > fee.remainingAmount) {
                throw new Error(`Amount cannot be greater than remaining amount (₹${fee.remainingAmount})`);
            }


            const res = await paymentApi.createCheckoutSession({
                amount,
                feeId: fee.id,
                studentName: studentName || 'Student',
                feeType: fee.feeType
            });

            const { url, sessionId } = res.data;


            sessionStorage.setItem('pendingPayment', JSON.stringify({
                feeId: fee.id,
                amount: amount,
                sessionId: sessionId
            }));

            window.location.href = url;
        } catch (err) {
            console.error('❌ Payment error:', err);
            setError(err.message || 'Failed to initiate payment. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl max-w-md w-full shadow-2xl overflow-hidden`}>
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Fee Payment</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Summary Card */}
                    <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} p-4 rounded-xl space-y-3`}>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Student</span>
                            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{studentName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Fee Category</span>
                            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{fee.feeType}</span>
                        </div>
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Balance Due</span>
                            <span className="text-lg font-bold text-purple-600">₹{fee.remainingAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Payment Options */}
                    <div className="space-y-3">
                        <label className={`block text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Payment Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setPaymentType('full')}
                                className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${paymentType === 'full'
                                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-600'
                                    : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300'
                                    }`}
                            >
                                Full Payment
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentType('partial')}
                                className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${paymentType === 'partial'
                                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-600'
                                    : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300'
                                    }`}
                            >
                                Partial
                            </button>
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-2">
                        <label className={`block text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Amount (₹)
                        </label>
                        <input
                            type="number"
                            value={paymentData.amount}
                            onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                            disabled={paymentType === 'full' || loading}
                            className={`w-full px-4 py-3 rounded-xl border transition-all ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                                : 'bg-white border-gray-200 text-gray-900 focus:border-purple-500'
                                } outline-none disabled:opacity-50`}
                            placeholder="Enter amount"
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                            <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold shadow-lg shadow-purple-200 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <Lock className="w-4 h-4" />
                                    <span>Pay Now</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>



    );
};

export default StripePaymentModal;
