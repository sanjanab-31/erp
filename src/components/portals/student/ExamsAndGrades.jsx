import React, { useState, useEffect } from 'react';
import {
    Download,
    TrendingUp,
    CheckCircle,
    Calendar,
    Award
} from 'lucide-react';

const ExamsAndGrades = ({ darkMode }) => {
    const [activeTab, setActiveTab] = useState('My Grades');
    const [selectedExamFilter, setSelectedExamFilter] = useState('All Exams');
    const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('All Subjects');

    // Real-time data state
    const [gradesData, setGradesData] = useState({
        overallGrade: 'A',
        gradeAverage: 'average',
        examsCompleted: 3,
        examsCompletedText: 'This semester',
        upcomingExams: 3,
        upcomingExamsText: 'Next 30 days',
        performance: 'Good',
        performanceText: 'Improving trend',
        grades: [
            {
                id: 1,
                subject: 'Mathematics',
                examType: 'Mid-term',
                date: '11/15/2024',
                marksObtained: 85,
                totalMarks: 100,
                percentage: 85,
                grade: 'A'
            },
            {
                id: 2,
                subject: 'Mathematics',
                examType: 'Mid-term',
                date: '11/15/2024',
                marksObtained: 92,
                totalMarks: 100,
                percentage: 92,
                grade: 'A+'
            },
            {
                id: 3,
                subject: 'Physics',
                examType: 'Mid-term',
                date: '11/15/2024',
                marksObtained: 78,
                totalMarks: 100,
                percentage: 78,
                grade: 'B+'
            },
            {
                id: 4,
                subject: 'Chemistry',
                examType: 'Mid-term',
                date: '11/20/2024',
                marksObtained: 88,
                totalMarks: 100,
                percentage: 88,
                grade: 'A'
            },
            {
                id: 5,
                subject: 'English',
                examType: 'Final',
                date: '11/22/2024',
                marksObtained: 90,
                totalMarks: 100,
                percentage: 90,
                grade: 'A+'
            }
        ]
    });

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            // You can add real-time data fetching logic here
            setGradesData(prev => ({
                ...prev,
                // Update any real-time fields
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const getGradeColor = (grade) => {
        if (grade === 'A' || grade === 'A+') return 'text-green-600 bg-green-50';
        if (grade === 'B' || grade === 'B+') return 'text-blue-600 bg-blue-50';
        if (grade === 'C' || grade === 'C+') return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    const filteredGrades = gradesData.grades.filter(grade => {
        const examMatch = selectedExamFilter === 'All Exams' || grade.examType === selectedExamFilter;
        const subjectMatch = selectedSubjectFilter === 'All Subjects' || grade.subject === selectedSubjectFilter;
        return examMatch && subjectMatch;
    });

    return (
        <div className="flex-1 overflow-y-auto p-8">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Exams & Grades
                </h1>
                <p className="text-sm text-gray-500">View your exam schedules and academic performance</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Overall Grade Card */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Overall Grade
                        </h3>
                        <Award className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="mb-2">
                        <p className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {gradesData.overallGrade}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500">{gradesData.gradeAverage}</p>
                </div>

                {/* Exams Completed Card */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Exams Completed
                        </h3>
                        <CheckCircle className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="mb-2">
                        <p className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {gradesData.examsCompleted}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500">{gradesData.examsCompletedText}</p>
                </div>

                {/* Upcoming Exams Card */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Upcoming Exams
                        </h3>
                        <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="mb-2">
                        <p className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {gradesData.upcomingExams}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500">{gradesData.upcomingExamsText}</p>
                </div>

                {/* Performance Card */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Performance
                        </h3>
                        <TrendingUp className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="mb-2">
                        <p className={`text-4xl font-bold text-green-600`}>
                            {gradesData.performance}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500">{gradesData.performanceText}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border`}>
                <div className="border-b border-gray-200">
                    <div className="flex space-x-8 px-6">
                        <button
                            onClick={() => setActiveTab('My Grades')}
                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'My Grades'
                                    ? 'border-blue-600 text-blue-600'
                                    : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                                }`}
                        >
                            My Grades
                        </button>
                        <button
                            onClick={() => setActiveTab('Exam Schedule')}
                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'Exam Schedule'
                                    ? 'border-blue-600 text-blue-600'
                                    : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                                }`}
                        >
                            Exam Schedule
                        </button>
                        <button
                            onClick={() => setActiveTab('Performance Analysis')}
                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'Performance Analysis'
                                    ? 'border-blue-600 text-blue-600'
                                    : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                                }`}
                        >
                            Performance Analysis
                        </button>
                    </div>
                </div>

                {/* Grade Report Section */}
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Grade Report
                            </h3>
                            <p className="text-sm text-gray-500">Your academic performance across all subjects</p>
                        </div>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Download className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">Download Report</span>
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex space-x-4 mb-6">
                        <select
                            value={selectedExamFilter}
                            onChange={(e) => setSelectedExamFilter(e.target.value)}
                            className={`px-4 py-2 rounded-lg border ${darkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            <option>All Exams</option>
                            <option>Mid-term</option>
                            <option>Final</option>
                            <option>Quiz</option>
                        </select>

                        <select
                            value={selectedSubjectFilter}
                            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                            className={`px-4 py-2 rounded-lg border ${darkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            <option>All Subjects</option>
                            <option>Mathematics</option>
                            <option>Physics</option>
                            <option>Chemistry</option>
                            <option>English</option>
                        </select>
                    </div>

                    {/* Grades Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <th className={`text-left py-3 px-4 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Subject
                                    </th>
                                    <th className={`text-left py-3 px-4 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Exam Type
                                    </th>
                                    <th className={`text-left py-3 px-4 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Date
                                    </th>
                                    <th className={`text-left py-3 px-4 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Marks Obtained
                                    </th>
                                    <th className={`text-left py-3 px-4 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Total Marks
                                    </th>
                                    <th className={`text-left py-3 px-4 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Percentage
                                    </th>
                                    <th className={`text-left py-3 px-4 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Grade
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredGrades.map((grade) => (
                                    <tr
                                        key={grade.id}
                                        className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-100 hover:bg-gray-50'} transition-colors`}
                                    >
                                        <td className={`py-4 px-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {grade.subject}
                                        </td>
                                        <td className={`py-4 px-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {grade.examType}
                                        </td>
                                        <td className={`py-4 px-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {grade.date}
                                        </td>
                                        <td className={`py-4 px-4 text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {grade.marksObtained}
                                        </td>
                                        <td className={`py-4 px-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {grade.totalMarks}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-3">
                                                <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {grade.percentage}%
                                                </span>
                                                <div className="flex-1 w-20 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-gray-900 h-2 rounded-full transition-all duration-500"
                                                        style={{ width: `${grade.percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getGradeColor(grade.grade)}`}>
                                                {grade.grade}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamsAndGrades;
