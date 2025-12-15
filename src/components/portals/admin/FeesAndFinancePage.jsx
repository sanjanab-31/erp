import React, { useState } from 'react';
import {
    DollarSign,
    TrendingUp,
    Users,
    Download,
    Filter,
    Calendar,
    CheckCircle,
    AlertCircle,
    Clock,
    CreditCard
} from 'lucide-react';

const FeesAndFinancePage = ({ darkMode }) => {
    const [selectedPeriod, setSelectedPeriod] = useState('This Month');
    const [selectedStatus, setSelectedStatus] = useState('All');

    const periods = ['This Week', 'This Month', 'This Quarter', 'This Year'];
    const statuses = ['All', 'Paid', 'Pending', 'Overdue'];

    const [financeData, setFinanceData] = useState({
        overview: {
            totalRevenue: 125000,
            collected: 95000,
            pending: 25000,
            overdue: 5000
        },
        recentPayments: [
            { id: 1, student: 'John Doe', class: 'Grade 10-A', amount: 5000, status: 'paid', date: '2025-12-10' },
            { id: 2, student: 'Jane Smith', class: 'Grade 10-B', amount: 5000, status: 'pending', date: '2025-12-15' },
            { id: 3, student: 'Mike Wilson', class: 'Grade 11-A', amount: 5000, status: 'overdue', date: '2025-11-30' },
            { id: 4, student: 'Sarah Johnson', class: 'Grade 11-B', amount: 5000, status: 'paid', date: '2025-12-12' }
        ],
        monthlyTrend: [
            { month: 'Aug', amount: 110000 },
            { month: 'Sep', amount: 115000 },
            { month: 'Oct', amount: 120000 },
            { month: 'Nov', amount: 118000 },
            { month: 'Dec', amount: 125000 }
        ]
    });

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-600';
            case 'pending':
                return 'bg-yellow-100 text-yellow-600';
            case 'overdue':
                return 'bg-red-100 text-red-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Fees & Finance
                </h1>
                <p className="text-sm text-gray-500">Manage fee collection and financial records</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Revenue</h3>
                        <DollarSign className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        ${financeData.overview.totalRevenue.toLocaleString()}
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Collected</h3>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold text-green-600`}>
                        ${financeData.overview.collected.toLocaleString()}
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pending</h3>
                        <Clock className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className={`text-3xl font-bold text-yellow-600`}>
                        ${financeData.overview.pending.toLocaleString()}
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Overdue</h3>
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <p className={`text-3xl font-bold text-red-600`}>
                        ${financeData.overview.overdue.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex flex-col md:flex-row gap-4">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className={`flex-1 px-4 py-2 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    >
                        {periods.map((period) => (
                            <option key={period} value={period}>{period}</option>
                        ))}
                    </select>

                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className={`flex-1 px-4 py-2 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    >
                        {statuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>

                    <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
                        <Download className="w-5 h-5" />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            {/* Revenue Trend */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                    Monthly Revenue Trend
                </h3>
                <div className="flex items-end justify-between space-x-4 h-64">
                    {financeData.monthlyTrend.map((month, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="w-full bg-gray-200 rounded-t-lg relative" style={{ height: '200px' }}>
                                <div
                                    className="absolute bottom-0 w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-500"
                                    style={{ height: `${(month.amount / 130000) * 200}px` }}
                                ></div>
                            </div>
                            <p className={`mt-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {month.month}
                            </p>
                            <p className="text-xs text-gray-500">${(month.amount / 1000).toFixed(0)}K</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Payments */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                <div className="p-6 border-b border-gray-200">
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Recent Payments
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                            <tr>
                                <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Student
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Class
                                </th>
                                <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Amount
                                </th>
                                <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Date
                                </th>
                                <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Status
                                </th>
                                <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {financeData.recentPayments.map((payment) => (
                                <tr key={payment.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                                    <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {payment.student}
                                    </td>
                                    <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {payment.class}
                                    </td>
                                    <td className={`px-6 py-4 text-center text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        ${payment.amount.toLocaleString()}
                                    </td>
                                    <td className={`px-6 py-4 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {payment.date}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="text-purple-600 hover:text-purple-900 text-sm font-medium">
                                            View Details
                                        </button>
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

export default FeesAndFinancePage;
