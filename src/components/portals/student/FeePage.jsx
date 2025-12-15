import React, { useState, useEffect } from 'react';
import {
    DollarSign,
    CheckCircle,
    AlertTriangle,
    Receipt,
    Download,
    CreditCard,
    Calendar,
    TrendingUp
} from 'lucide-react';

const FeePage = () => {
    const [activeTab, setActiveTab] = useState('My Fees');

    // Real-time fee data
    const [feeData, setFeeData] = useState({
        totalFees: 5000,
        paid: 5000,
        pending: 0,
        feeRecords: [
            {
                id: 1,
                feeType: 'Tuition Fee',
                amount: 5000,
                dueDate: '1/15/2024',
                paidDate: '1/10/2024',
                status: 'paid'
            }
        ],
        paymentHistory: [
            {
                id: 1,
                date: '1/10/2024',
                amount: 5000,
                method: 'Credit Card',
                transactionId: 'TXN123456789',
                feeType: 'Tuition Fee'
            }
        ]
    });

    // Calculate totals in real-time
    useEffect(() => {
        const interval = setInterval(() => {
            const totalPaid = feeData.feeRecords
                .filter(record => record.status === 'paid')
                .reduce((sum, record) => sum + record.amount, 0);

            const totalPending = feeData.feeRecords
                .filter(record => record.status === 'pending')
                .reduce((sum, record) => sum + record.amount, 0);

            setFeeData(prev => ({
                ...prev,
                paid: totalPaid,
                pending: totalPending
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, [feeData.feeRecords]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-gray-900 text-white';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'overdue':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const handleDownloadReceipt = (record) => {
        // Create receipt content
        const receiptContent = `
PAYMENT RECEIPT
================

Fee Type: ${record.feeType}
Amount: $${record.amount}
Due Date: ${record.dueDate}
Paid Date: ${record.paidDate}
Status: ${record.status.toUpperCase()}

Thank you for your payment!
    `.trim();

        // Create and download file
        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt_${record.feeType.replace(/\s+/g, '_')}_${record.id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const handlePayNow = (record) => {
        // Simulate payment
        const updatedRecords = feeData.feeRecords.map(r => {
            if (r.id === record.id) {
                return {
                    ...r,
                    status: 'paid',
                    paidDate: new Date().toLocaleDateString('en-US')
                };
            }
            return r;
        });

        setFeeData(prev => ({
            ...prev,
            feeRecords: updatedRecords
        }));

        alert('Payment processed successfully!');
    };

    return (
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Fee Management</h1>
                <p className="text-sm text-gray-500">Manage student fees and payments</p>
            </div>

            {/* Tab */}
            <div className="mb-6">
                <button
                    onClick={() => setActiveTab('My Fees')}
                    className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'My Fees'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500'
                        }`}
                >
                    My Fees
                </button>
            </div>

            {/* Fee Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Fees */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600">Total Fees</h3>
                        <DollarSign className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="mb-2">
                        <p className="text-3xl font-bold text-gray-900">${feeData.totalFees}</p>
                    </div>
                    <p className="text-sm text-gray-500">This academic year</p>
                </div>

                {/* Paid */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600">Paid</h3>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="mb-2">
                        <p className="text-3xl font-bold text-green-600">${feeData.paid}</p>
                    </div>
                    <p className="text-sm text-gray-500">Payments made</p>
                </div>

                {/* Pending */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600">Pending</h3>
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="mb-2">
                        <p className="text-3xl font-bold text-yellow-600">${feeData.pending}</p>
                    </div>
                    <p className="text-sm text-gray-500">Due payments</p>
                </div>
            </div>

            {/* Fee Records Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">My Fee Records</h3>
                <p className="text-sm text-gray-500 mb-6">View your fee payment history and pending payments</p>

                {/* Fee Records Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Fee Type
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Due Date
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Paid Date
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {feeData.feeRecords.map((record) => (
                                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900">{record.feeType}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-600">${record.amount}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-600">{record.dueDate}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-600">
                                            {record.paidDate || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(record.status)}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {record.status === 'paid' ? (
                                            <button
                                                onClick={() => handleDownloadReceipt(record)}
                                                className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                                            >
                                                <Receipt className="w-4 h-4" />
                                                Receipt
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handlePayNow(record)}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <CreditCard className="w-4 h-4" />
                                                Pay Now
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {feeData.feeRecords.length === 0 && (
                    <div className="text-center py-12">
                        <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-sm">No fee records found</p>
                    </div>
                )}
            </div>

            {/* Payment History Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment History</h3>
                <p className="text-sm text-gray-500 mb-6">View all your previous payments</p>

                <div className="space-y-4">
                    {feeData.paymentHistory.map((payment) => (
                        <div
                            key={payment.id}
                            className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{payment.feeType}</h4>
                                            <p className="text-sm text-gray-500">Transaction ID: {payment.transactionId}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 ml-13">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            {payment.date}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <CreditCard className="w-4 h-4" />
                                            {payment.method}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-green-600">${payment.amount}</p>
                                    <button
                                        onClick={() => handleDownloadReceipt(feeData.feeRecords.find(r => r.feeType === payment.feeType))}
                                        className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {feeData.paymentHistory.length === 0 && (
                    <div className="text-center py-12">
                        <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-sm">No payment history found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeePage;
