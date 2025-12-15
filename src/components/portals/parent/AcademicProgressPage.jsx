import React, { useState, useEffect } from 'react';
import {
    Award,
    TrendingUp,
    BookOpen,
    Calendar,
    Download,
    BarChart3,
    Target
} from 'lucide-react';

const AcademicProgressPage = ({ darkMode }) => {
    const [selectedChild, setSelectedChild] = useState('Emma Wilson');
    const [selectedTerm, setSelectedTerm] = useState('Current Term');

    const terms = ['Current Term', 'Mid-term', 'Final Term'];

    const [progressData, setProgressData] = useState({
        overallGrade: 'A',
        overallPercentage: 93.5,
        rank: 3,
        totalStudents: 30,
        subjects: [
            { name: 'Mathematics', currentGrade: 'A+', percentage: 98, trend: 'up', improvement: '+5%' },
            { name: 'Physics', currentGrade: 'A', percentage: 92, trend: 'stable', improvement: '0%' },
            { name: 'Chemistry', currentGrade: 'A', percentage: 94, trend: 'up', improvement: '+3%' },
            { name: 'English', currentGrade: 'A-', percentage: 88, trend: 'down', improvement: '-2%' },
            { name: 'Computer Science', currentGrade: 'A+', percentage: 96, trend: 'up', improvement: '+4%' }
        ],
        monthlyProgress: [
            { month: 'Aug', percentage: 89 },
            { month: 'Sep', percentage: 91 },
            { month: 'Oct', percentage: 92 },
            { month: 'Nov', percentage: 93 },
            { month: 'Dec', percentage: 93.5 }
        ],
        strengths: ['Mathematics', 'Computer Science', 'Chemistry'],
        needsImprovement: ['English']
    });

    // Real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setProgressData(prev => ({
                ...prev,
                overallPercentage: Math.min(100, prev.overallPercentage + (Math.random() > 0.7 ? 0.1 : 0))
            }));
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    const getTrendIcon = (trend) => {
        if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
        if (trend === 'down') return <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />;
        return <span className="w-4 h-4 text-gray-400">—</span>;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        Academic Progress
                    </h1>
                    <p className="text-sm text-gray-500">Track your child's academic performance</p>
                </div>
                <button className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
                    <Download className="w-5 h-5" />
                    <span>Download Report</span>
                </button>
            </div>

            {/* Filters */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex gap-4">
                    <select
                        value={selectedTerm}
                        onChange={(e) => setSelectedTerm(e.target.value)}
                        className={`flex-1 px-4 py-2 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    >
                        {terms.map((term) => (
                            <option key={term} value={term}>{term}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Overall Performance */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Overall Grade</h3>
                        <Award className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {progressData.overallGrade}
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Percentage</h3>
                        <BarChart3 className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {progressData.overallPercentage.toFixed(1)}%
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Class Rank</h3>
                        <Target className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        #{progressData.rank}
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Students</h3>
                        <BookOpen className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {progressData.totalStudents}
                    </p>
                </div>
            </div>

            {/* Subject-wise Performance */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                <div className="p-6 border-b border-gray-200">
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Subject-wise Performance
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                            <tr>
                                <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Subject
                                </th>
                                <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Grade
                                </th>
                                <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Percentage
                                </th>
                                <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Trend
                                </th>
                                <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Improvement
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {progressData.subjects.map((subject, index) => (
                                <tr key={index} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                                    <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {subject.name}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${subject.currentGrade.startsWith('A') ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {subject.currentGrade}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-center text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {subject.percentage}%
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {getTrendIcon(subject.trend)}
                                    </td>
                                    <td className={`px-6 py-4 text-center text-sm font-semibold ${subject.trend === 'up' ? 'text-green-600' : subject.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                                        {subject.improvement}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Progress Trend */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                    Monthly Progress Trend
                </h3>
                <div className="flex items-end justify-between space-x-4 h-64">
                    {progressData.monthlyProgress.map((month, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="w-full bg-gray-200 rounded-t-lg relative" style={{ height: '200px' }}>
                                <div
                                    className="absolute bottom-0 w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-lg transition-all duration-500"
                                    style={{ height: `${(month.percentage / 100) * 200}px` }}
                                ></div>
                            </div>
                            <p className={`mt-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {month.month}
                            </p>
                            <p className="text-xs text-gray-500">{month.percentage}%</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                        Strengths
                    </h3>
                    <div className="space-y-2">
                        {progressData.strengths.map((subject, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <Award className="w-5 h-5 text-green-500" />
                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{subject}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                        Needs Improvement
                    </h3>
                    <div className="space-y-2">
                        {progressData.needsImprovement.map((subject, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <Target className="w-5 h-5 text-yellow-500" />
                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{subject}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AcademicProgressPage;
