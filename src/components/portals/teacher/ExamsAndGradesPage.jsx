import React, { useState } from 'react';
import {
    BookOpen,
    Edit,
    Save,
    Download,
    Filter,
    Search,
    Award,
    TrendingUp,
    Users,
    FileText,
    Plus,
    X
} from 'lucide-react';

const ExamsAndGradesPage = ({ darkMode }) => {
    const [selectedClass, setSelectedClass] = useState('Grade 10-A');
    const [selectedExam, setSelectedExam] = useState('Mid-term Exam');
    const [searchQuery, setSearchQuery] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [showAddExam, setShowAddExam] = useState(false);

    const classes = ['Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 11-B'];
    const exams = ['Mid-term Exam', 'Final Exam', 'Quiz 1', 'Quiz 2', 'Assignment 1'];

    const [grades, setGrades] = useState([
        { id: 1, name: 'John Doe', rollNo: '10A-001', videoMark: 45, assignment1: 20, assignment2: 22, quiz1: 8, quiz2: 9, quiz3: 7, totalMarks: 111, grade: 'A' },
        { id: 2, name: 'Jane Smith', rollNo: '10A-002', videoMark: 42, assignment1: 18, assignment2: 20, quiz1: 7, quiz2: 8, quiz3: 8, totalMarks: 103, grade: 'A-' },
        { id: 3, name: 'Mike Wilson', rollNo: '10A-003', videoMark: 48, assignment1: 22, assignment2: 23, quiz1: 9, quiz2: 9, quiz3: 8, totalMarks: 119, grade: 'A+' },
        { id: 4, name: 'Sarah Johnson', rollNo: '10A-004', videoMark: 38, assignment1: 15, assignment2: 17, quiz1: 6, quiz2: 7, quiz3: 6, totalMarks: 89, grade: 'B+' },
        { id: 5, name: 'David Brown', rollNo: '10A-005', videoMark: 40, assignment1: 19, assignment2: 18, quiz1: 7, quiz2: 8, quiz3: 7, totalMarks: 99, grade: 'A-' }
    ]);

    const updateGrade = (studentId, field, value) => {
        setGrades(grades.map(student => {
            if (student.id === studentId) {
                const updated = { ...student, [field]: parseInt(value) || 0 };
                // Recalculate totals
                const assignmentTotal = (updated.assignment1 || 0) + (updated.assignment2 || 0);
                const quizTotal = (updated.quiz1 || 0) + (updated.quiz2 || 0) + (updated.quiz3 || 0);
                updated.totalMarks = (updated.videoMark || 0) + assignmentTotal + quizTotal;

                // Calculate grade
                if (updated.totalMarks >= 110) updated.grade = 'A+';
                else if (updated.totalMarks >= 100) updated.grade = 'A';
                else if (updated.totalMarks >= 90) updated.grade = 'A-';
                else if (updated.totalMarks >= 80) updated.grade = 'B+';
                else if (updated.totalMarks >= 70) updated.grade = 'B';
                else if (updated.totalMarks >= 60) updated.grade = 'C';
                else updated.grade = 'F';

                return updated;
            }
            return student;
        }));
    };

    const filteredGrades = grades.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const averageMarks = Math.round(grades.reduce((acc, s) => acc + s.totalMarks, 0) / grades.length);
    const topPerformer = grades.reduce((max, s) => s.totalMarks > max.totalMarks ? s : max, grades[0]);

    const getGradeColor = (grade) => {
        if (grade.startsWith('A')) return 'text-green-600 bg-green-100';
        if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
        if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    return (
        <div className="flex-1 overflow-y-auto p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Exams & Grades
                </h1>
                <p className="text-sm text-gray-500">Manage student grades and assessments</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Students</h3>
                        <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{grades.length}</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Average Score</h3>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{averageMarks}/120</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Top Performer</h3>
                        <Award className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{topPerformer.name}</p>
                    <p className="text-sm text-gray-500">{topPerformer.totalMarks}/120</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pass Rate</h3>
                        <FileText className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {Math.round((grades.filter(s => s.totalMarks >= 60).length / grades.length) * 100)}%
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6`}>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className={`px-4 py-2 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-green-500`}
                    >
                        {classes.map((cls) => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>

                    <select
                        value={selectedExam}
                        onChange={(e) => setSelectedExam(e.target.value)}
                        className={`px-4 py-2 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-green-500`}
                    >
                        {exams.map((exam) => (
                            <option key={exam} value={exam}>{exam}</option>
                        ))}
                    </select>

                    <div className="flex-1 relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search student..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className={`px-4 py-2 ${editMode ? 'bg-green-600' : 'bg-blue-600'} text-white rounded-lg hover:opacity-90 transition-colors flex items-center space-x-2`}
                    >
                        <Edit className="w-5 h-5" />
                        <span>{editMode ? 'Save Changes' : 'Edit Grades'}</span>
                    </button>

                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
                        <Download className="w-5 h-5" />
                        <span>Export Report</span>
                    </button>

                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
                        <Plus className="w-5 h-5" />
                        <span>Add Exam</span>
                    </button>
                </div>
            </div>

            {/* Gradebook Table */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                            <tr>
                                <th className={`px-4 py-3 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider sticky left-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                    Student
                                </th>
                                <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Video (50)
                                </th>
                                <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Assign 1
                                </th>
                                <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Assign 2
                                </th>
                                <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Total Assign (25)
                                </th>
                                <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Quiz 1
                                </th>
                                <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Quiz 2
                                </th>
                                <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Quiz 3
                                </th>
                                <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Total Quiz (25)
                                </th>
                                <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Final (100)
                                </th>
                                <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                    Grade
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {filteredGrades.map((student) => {
                                const assignmentTotal = (student.assignment1 || 0) + (student.assignment2 || 0);
                                const quizTotal = (student.quiz1 || 0) + (student.quiz2 || 0) + (student.quiz3 || 0);

                                return (
                                    <tr key={student.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                                        <td className={`px-4 py-3 whitespace-nowrap sticky left-0 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                                    {student.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className="ml-3">
                                                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        {student.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{student.rollNo}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {student.videoMark}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {editMode ? (
                                                <input
                                                    type="number"
                                                    value={student.assignment1}
                                                    onChange={(e) => updateGrade(student.id, 'assignment1', e.target.value)}
                                                    className={`w-16 px-2 py-1 text-center rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                                                    max="25"
                                                />
                                            ) : (
                                                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {student.assignment1}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {editMode ? (
                                                <input
                                                    type="number"
                                                    value={student.assignment2}
                                                    onChange={(e) => updateGrade(student.id, 'assignment2', e.target.value)}
                                                    className={`w-16 px-2 py-1 text-center rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                                                    max="25"
                                                />
                                            ) : (
                                                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {student.assignment2}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {assignmentTotal}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {student.quiz1}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {student.quiz2}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {student.quiz3}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {quizTotal}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {student.totalMarks}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(student.grade)}`}>
                                                {student.grade}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExamsAndGradesPage;
