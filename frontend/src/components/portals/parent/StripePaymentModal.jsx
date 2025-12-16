import React, { useState, useEffect } from 'react';
import { X, CreditCard, Lock, Loader, ExternalLink } from 'lucide-react';
import { createCheckoutSession } from '../../../utils/stripeConfig';

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
            console.log('💳 Payment submission:', {
                amount: paymentData.amount,
                type: typeof paymentData.amount,
                parsed: parseFloat(paymentData.amount),
                feeId: fee.id,
                studentName,
                feeType: fee.feeType
            });

            // Validate amount
            const amount = parseFloat(paymentData.amount);

            if (isNaN(amount) || amount <= 0) {
                throw new Error('Please enter a valid amount greater than 0');
            }

            if (amount > fee.remainingAmount) {
                throw new Error(`Amount cannot be greater than remaining amount (₹${fee.remainingAmount})`);
            }

            console.log('✅ Amount validated:', amount);

            // Create checkout session
            const { url, sessionId } = await createCheckoutSession(
                amount,
                fee.id,
                studentName || 'Student',
                fee.feeType
            );

            console.log('✅ Session created:', sessionId);

            // Store fee info in sessionStorage for when user returns
            sessionStorage.setItem('pendingPayment', JSON.stringify({
                feeId: fee.id,
                amount: amount,
                sessionId: sessionId
            }));

            // Redirect to Stripe Checkout
            window.location.href = url;
        } catch (err) {
            console.error('❌ Payment error:', err);
            setError(err.message || 'Failed to initiate payment. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-md w-full`}>
                {/* Header */}
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6 rounded-t-xl`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Pay with Card
                                </h2>
                                <p className="text-xs text-gray-500 flex items-center mt-1">
                                    <Lock className="w-3 h-3 mr-1" />
                                    Secured by Stripe
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} disabled:opacity-50`}
                        >
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Fee Details */}
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Student:</span>
                                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{studentName || 'Student'}</span>
                            </div>
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
                                    disabled={loading}
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
                                    disabled={loading}
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
                            min="50"
                            max={fee.remainingAmount}
                            step="1"
                            value={paymentData.amount}
                            onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                            disabled={paymentType === 'full' || loading}
                            placeholder="Enter amount (min ₹50)"
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50`}
                        />
                        {paymentType === 'partial' && (
                            <p className="text-xs text-gray-500 mt-1">Minimum: ₹50 | Maximum: ₹{fee.remainingAmount.toLocaleString()}</p>
                        )}
                    </div>

                    {/* Info Box */}
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'} border`}>
                        <div className="flex items-start space-x-2">
                            <ExternalLink className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-1">
                                    You'll be redirected to Stripe
                                </p>
                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                    Complete your payment securely on Stripe's payment page. You'll be redirected back after payment.
                                </p>
                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-semibold">
                                    ⚠️ Stripe requires minimum ₹50 per transaction
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Test Card Info */}
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'} border`}>
                        <p className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1">Test Mode - Use Test Card:</p>
                        <p className="text-xs text-green-600 dark:text-green-400">Card: 4242 4242 4242 4242</p>
                        <p className="text-xs text-green-600 dark:text-green-400">Expiry: Any future date | CVC: Any 3 digits</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className={`px-6 py-2 rounded-lg border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} disabled:opacity-50`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    <span>Redirecting...</span>
                                </>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5" />
                                    <span>Pay ₹{parseFloat(paymentData.amount).toLocaleString()}</span>
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
