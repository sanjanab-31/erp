import React, { useState, useEffect } from 'react';
import {
    DollarSign,
    Download,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard
} from 'lucide-react';

const FeeManagementPage = ({ darkMode }) => {
    const [feeData, setFeeData] = useState({
        totalFees: 15000,
        paidAmount: 10000,
        pendingAmount: 5000,
        nextDueDate: 'Jan 20, 2026',
        feeHistory: [
            { id: 1, term: 'Q1 2025', amount: 5000, status: 'paid', date: '2025-04-15', method: 'Credit Card' },
            { id: 2, term: 'Q2 2025', amount: 5000, status: 'paid', date: '2025-07-15', method: 'Bank Transfer' },
            { id: 3, term: 'Q3 2025', amount: 5000, status: 'pending', dueDate: '2026-01-20', method: '-' }
        ]
    });

    // Real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setFeeData(prev => ({ ...prev }));
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Fee Management
                </h1>
                <p className="text-sm text-gray-500">View and manage fee payments</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Fees</h3>
                        <DollarSign className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        ${feeData.totalFees.toLocaleString()}
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Paid Amount</h3>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold text-green-600`}>
                        ${feeData.paidAmount.toLocaleString()}
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pending</h3>
                        <Clock className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className={`text-3xl font-bold text-yellow-600`}>
                        ${feeData.pendingAmount.toLocaleString()}
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Next Due</h3>
                        <Calendar className="w-5 h-5 text-orange-500" />
                    </div>
                    <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {feeData.nextDueDate}
                    </p>
                </div>
            </div>

            {/* Fee History */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Payment History
                    </h3>
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Download Receipt</span>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                            <tr>
                                <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Term
                                </th>
                                <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Amount
                                </th>
                                <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Date
                                </th>
                                <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Method
                                </th>
                                <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Status
                                </th>
                                <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {feeData.feeHistory.map((fee) => (
                                <tr key={fee.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                                    <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {fee.term}
                                    </td>
                                    <td className={`px-6 py-4 text-center text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        ${fee.amount.toLocaleString()}
                                    </td>
                                    <td className={`px-6 py-4 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {fee.status === 'paid' ? fee.date : fee.dueDate}
                                    </td>
                                    <td className={`px-6 py-4 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {fee.method}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${fee.status === 'paid'
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-yellow-100 text-yellow-600'
                                            }`}>
                                            {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {fee.status === 'pending' ? (
                                            <button className="text-orange-600 hover:text-orange-900 text-sm font-medium">
                                                Pay Now
                                            </button>
                                        ) : (
                                            <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                                                View Receipt
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FeeManagementPage;
