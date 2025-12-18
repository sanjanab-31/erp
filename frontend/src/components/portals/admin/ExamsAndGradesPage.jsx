import React, { useState, useEffect } from 'react';
import {
    Award,
    TrendingUp,
    Users,
    Download,
} from 'lucide-react';
import { examApi } from '../../../services/api';

const ExamsAndGradesPage = ({ darkMode }) => {
    const [selectedExam, setSelectedExam] = useState('Mid-term Exam');
    const [selectedClass, setSelectedClass] = useState('All Classes');

    const [exams, setExams] = useState(['Mid-term Exam', 'Final Exam', 'Unit Test 1', 'Unit Test 2']);
    const [classes, setClasses] = useState(['All Classes', 'Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 11-B']);

    const [examData, setExamData] = useState({
        overview: {
            totalStudents: 0,
            averageScore: 0,
            passRate: 0,
            topScore: 0
        },
        classPerformance: [],
        gradeDistribution: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {

                const statsResponse = await examApi.getStats();
                if (statsResponse.data) {
                    setExamData(statsResponse.data);
                } else {

                    setExamData({
                        overview: {
                            totalStudents: 450,
                            averageScore: 78.5,
                            passRate: 92,
                            topScore: 98
                        },
                        classPerformance: [
                            { class: 'Grade 10-A', students: 30, average: 82.5, passRate: 95, topScore: 98 },
                            { class: 'Grade 10-B', students: 28, average: 79.3, passRate: 93, topScore: 95 },
                            { class: 'Grade 11-A', students: 32, average: 76.8, passRate: 90, topScore: 94 },
                            { class: 'Grade 11-B', students: 25, average: 75.2, passRate: 88, topScore: 92 }
                        ],
                        gradeDistribution: [
                            { grade: 'A+', count: 45, percentage: 10 },
                            { grade: 'A', count: 90, percentage: 20 },
                            { grade: 'B+', count: 135, percentage: 30 },
                            { grade: 'B', count: 90, percentage: 20 },
                            { grade: 'C', count: 67, percentage: 15 },
                            { grade: 'F', count: 23, percentage: 5 }
                        ]
                    });
                }
            } catch (error) {
                console.error("Failed to fetch exam stats", error);

            }
        };

        fetchData();
    }, [selectedExam, selectedClass]);

    const getGradeColor = (grade) => {
        if (grade.startsWith('A')) return 'bg-green-100 text-green-600';
        if (grade.startsWith('B')) return 'bg-blue-100 text-blue-600';
        if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-600';
        return 'bg-red-100 text-red-600';
    };

    return (
        <div className="space-y-6">
            { }
            <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Exams & Grades
                </h1>
                <p className="text-sm text-gray-500">Monitor exam performance and grade distribution</p>
            </div>

            { }
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Students</h3>
                        <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {examData.overview.totalStudents}
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Average Score</h3>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {examData.overview.averageScore}%
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pass Rate</h3>
                        <Award className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {examData.overview.passRate}%
                    </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Top Score</h3>
                        <Award className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {examData.overview.topScore}%
                    </p>
                </div>
            </div>

            { }
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex flex-col md:flex-row gap-4">
                    <select
                        value={selectedExam}
                        onChange={(e) => setSelectedExam(e.target.value)}
                        className={`flex-1 px-4 py-2 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    >
                        {exams.map((exam) => (
                            <option key={exam} value={exam}>{exam}</option>
                        ))}
                    </select>

                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className={`flex-1 px-4 py-2 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    >
                        {classes.map((cls) => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>

                    <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
                        <Download className="w-5 h-5" />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            { }
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                <div className="p-6 border-b border-gray-200">
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Class-wise Performance
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                            <tr>
                                <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Class
                                </th>
                                <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Students
                                </th>
                                <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Average Score
                                </th>
                                <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Pass Rate
                                </th>
                                <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Top Score
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {examData.classPerformance.map((classData, index) => (
                                <tr key={index} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                                    <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {classData.class}
                                    </td>
                                    <td className={`px-6 py-4 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {classData.students}
                                    </td>
                                    <td className={`px-6 py-4 text-center text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {classData.average}%
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm font-semibold text-green-600">
                                        {classData.passRate}%
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm font-semibold text-purple-600">
                                        {classData.topScore}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            { }
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                    Grade Distribution
                </h3>
                <div className="space-y-4">
                    {examData.gradeDistribution.map((grade, index) => (
                        <div key={index}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(grade.grade)}`}>
                                        {grade.grade}
                                    </span>
                                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {grade.count} students
                                    </span>
                                </div>
                                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {grade.percentage}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${grade.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExamsAndGradesPage;
