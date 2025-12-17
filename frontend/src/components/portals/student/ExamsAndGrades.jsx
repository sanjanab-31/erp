import React, { useState, useEffect } from 'react';
import {
    Download,
    TrendingUp,
    CheckCircle,
    Calendar,
    Award,
    BookOpen,
    Clock
} from 'lucide-react';
import {
    getCoursesByClass,
    calculateFinalMarks,
    getStudentCourseMarks,
    getExamSchedulesByClass,
    getSubmissionsByStudent,
    subscribeToAcademicUpdates
} from '../../../utils/academicStore';
import { getAllStudents } from '../../../utils/studentStore';

const ExamsAndGrades = ({ darkMode }) => {
    const [activeTab, setActiveTab] = useState('My Grades');
    const [courses, setCourses] = useState([]);
    const [examSchedules, setExamSchedules] = useState([]);
    const [allMarks, setAllMarks] = useState([]);
    const [studentId, setStudentId] = useState('');
    const [studentClass, setStudentClass] = useState('');

    const studentEmail = localStorage.getItem('userEmail') || '';

    
    useEffect(() => {
        if (studentEmail) {
            const students = getAllStudents();
            const student = students.find(s => s.email === studentEmail);
            if (student) {
                setStudentId(student.id);
                setStudentClass(student.class);
                console.log('Found student for Exams & Grades:', student);
                console.log('Student ID:', student.id);
                console.log('Student Class:', student.class);
            }
        }
    }, [studentEmail]);

    useEffect(() => {
        if (studentId && studentClass) {
            loadData();
            const unsubscribe = subscribeToAcademicUpdates(() => {
                loadData();
            });
            return unsubscribe;
        }
    }, [studentId, studentClass]);

    const loadData = () => {
        const classCourses = getCoursesByClass(studentClass);
        setCourses(classCourses);

        const classSchedules = getExamSchedulesByClass(studentClass);
        setExamSchedules(classSchedules);

        
        const marksData = classCourses.map(course => {
            const finalMarks = calculateFinalMarks(studentId, course.id);
            const examMarks = getStudentCourseMarks(studentId, course.id);
            return {
                courseId: course.id,
                courseName: course.name,
                courseCode: course.code,
                finalMarks,
                examMarks
            };
        }).filter(m => m.finalMarks.finalTotal > 0);

        setAllMarks(marksData);
    };

    
    const calculateStats = () => {
        const totalCourses = allMarks.length;
        const totalMarks = allMarks.reduce((sum, m) => sum + m.finalMarks.finalTotal, 0);
        const average = totalCourses > 0 ? (totalMarks / totalCourses).toFixed(2) : 0;

        const upcomingExams = examSchedules.filter(s => new Date(s.examDate) > new Date()).length;

        let overallGrade = 'N/A';
        if (average >= 90) overallGrade = 'A+';
        else if (average >= 85) overallGrade = 'A';
        else if (average >= 75) overallGrade = 'B+';
        else if (average >= 70) overallGrade = 'B';
        else if (average >= 60) overallGrade = 'C+';
        else if (average >= 50) overallGrade = 'C';
        else if (average > 0) overallGrade = 'D';

        return {
            overallGrade,
            average,
            examsCompleted: totalCourses,
            upcomingExams,
            performance: average >= 75 ? 'Excellent' : average >= 60 ? 'Good' : average > 0 ? 'Fair' : 'N/A'
        };
    };

    const stats = calculateStats();

    const getGradeColor = (grade) => {
        if (grade === 'A' || grade === 'A+') return 'text-green-600 bg-green-50';
        if (grade === 'B' || grade === 'B+') return 'text-blue-600 bg-blue-50';
        if (grade === 'C' || grade === 'C+') return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    const renderMyGrades = () => (
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

            {allMarks.length === 0 ? (
                <div className="text-center py-12">
                    <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        No grades available yet
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Grades will appear here once your teacher enters marks
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <th className={`text-left py-3 px-4 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Subject
                                </th>
                                <th className={`text-left py-3 px-4 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Assignment Marks
                                </th>
                                <th className={`text-left py-3 px-4 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Exam Marks
                                </th>
                                <th className={`text-left py-3 px-4 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Final Total
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
                            {allMarks.map((mark) => {
                                const percentage = mark.finalMarks.finalTotal;
                                let grade = 'D';
                                if (percentage >= 90) grade = 'A+';
                                else if (percentage >= 85) grade = 'A';
                                else if (percentage >= 75) grade = 'B+';
                                else if (percentage >= 70) grade = 'B';
                                else if (percentage >= 60) grade = 'C+';
                                else if (percentage >= 50) grade = 'C';

                                return (
                                    <tr
                                        key={mark.courseId}
                                        className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-100 hover:bg-gray-50'} transition-colors`}
                                    >
                                        <td className={`py-4 px-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {mark.courseName}
                                            <p className="text-xs text-gray-500">{mark.courseCode}</p>
                                        </td>
                                        <td className={`py-4 px-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {mark.finalMarks.assignmentMarks}/25
                                            <p className="text-xs text-gray-500">
                                                {mark.finalMarks.assignmentCount} assignment(s)
                                            </p>
                                        </td>
                                        <td className={`py-4 px-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {mark.finalMarks.examMarks}/75
                                            {mark.examMarks && (
                                                <p className="text-xs text-gray-500">
                                                    ({mark.examMarks.exam1}, {mark.examMarks.exam2}, {mark.examMarks.exam3})
                                                </p>
                                            )}
                                        </td>
                                        <td className={`py-4 px-4 text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {mark.finalMarks.finalTotal}/100
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-3">
                                                <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {percentage}%
                                                </span>
                                                <div className="flex-1 w-20 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all duration-500 ${percentage >= 75 ? 'bg-green-600' :
                                                            percentage >= 60 ? 'bg-blue-600' :
                                                                percentage >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                                                            }`}
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getGradeColor(grade)}`}>
                                                {grade}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    const renderExamSchedule = () => {
        
        const groupedSchedules = {};
        examSchedules.forEach(schedule => {
            if (!groupedSchedules[schedule.examName]) {
                groupedSchedules[schedule.examName] = [];
            }
            groupedSchedules[schedule.examName].push(schedule);
        });

        return (
            <div className="p-6">
                <div className="mb-6">
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Upcoming Exam Schedule
                    </h3>
                    <p className="text-sm text-gray-500">View your scheduled exams</p>
                </div>

                {examSchedules.length === 0 ? (
                    <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            No exam schedules yet
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Exam schedules will appear here once created by admin
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedSchedules).map(([examName, papers]) => (
                            <div key={examName} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden`}>
                                <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} bg-opacity-50 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                                    <div className="flex items-center justify-between">
                                        <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {examName}
                                        </h4>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                            {papers.length} Papers
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className={`border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'}`}>
                                                <th className={`p-4 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Subject</th>
                                                <th className={`p-4 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Date</th>
                                                <th className={`p-4 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Time</th>
                                                <th className={`p-4 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Venue</th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                                            {papers.sort((a, b) => new Date(a.examDate) - new Date(b.examDate)).map(paper => {
                                                const isToday = new Date(paper.examDate).toDateString() === new Date().toDateString();
                                                return (
                                                    <tr key={paper.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} ${isToday ? (darkMode ? 'bg-blue-900/10' : 'bg-blue-50') : ''}`}>
                                                        <td className={`p-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            {paper.subject || paper.courseName}
                                                        </td>
                                                        <td className={`p-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                            <div className="flex items-center space-x-2">
                                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                                <span>{new Date(paper.examDate).toLocaleDateString()}</span>
                                                                {isToday && <span className="text-xs text-blue-600 font-bold ml-2">Today</span>}
                                                            </div>
                                                        </td>
                                                        <td className={`p-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                            <div className="flex items-center space-x-2">
                                                                <Clock className="w-4 h-4 text-gray-400" />
                                                                <span>{paper.startTime} - {paper.endTime}</span>
                                                            </div>
                                                        </td>
                                                        <td className={`p-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                            {paper.venue || '-'}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderPerformanceAnalysis = () => (
        <div className="p-6">
            <div className="mb-6">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Performance Analysis
                </h3>
                <p className="text-sm text-gray-500">Detailed breakdown of your academic performance</p>
            </div>

            {allMarks.length === 0 ? (
                <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        No performance data yet
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {}
                    <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-500 to-purple-600'} rounded-xl p-6 text-white`}>
                        <h4 className="text-lg font-semibold mb-4">Overall Performance</h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm opacity-90">Average Score</p>
                                <p className="text-3xl font-bold">{stats.average}%</p>
                            </div>
                            <div>
                                <p className="text-sm opacity-90">Overall Grade</p>
                                <p className="text-3xl font-bold">{stats.overallGrade}</p>
                            </div>
                            <div>
                                <p className="text-sm opacity-90">Performance</p>
                                <p className="text-3xl font-bold">{stats.performance}</p>
                            </div>
                        </div>
                    </div>

                    {}
                    <div>
                        <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                            Subject-wise Performance
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {allMarks.map((mark) => (
                                <div
                                    key={mark.courseId}
                                    className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-6`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h5 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {mark.courseName}
                                            </h5>
                                            <p className="text-sm text-gray-500">{mark.courseCode}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-blue-600">
                                                {mark.finalMarks.finalTotal}%
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-500">Assignments</span>
                                                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {mark.finalMarks.assignmentMarks}/25
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${(mark.finalMarks.assignmentMarks / 25) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-500">Exams</span>
                                                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {mark.finalMarks.examMarks}/75
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full"
                                                    style={{ width: `${(mark.finalMarks.examMarks / 75) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="flex-1 overflow-y-auto p-8">
            {}
            <div className="mb-6">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Exams & Grades
                </h1>
                <p className="text-sm text-gray-500">View your exam schedules and academic performance</p>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Overall Grade
                        </h3>
                        <Award className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="mb-2">
                        <p className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {stats.overallGrade}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500">{stats.average}% average</p>
                </div>

                {}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Courses Graded
                        </h3>
                        <CheckCircle className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="mb-2">
                        <p className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {stats.examsCompleted}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500">Out of {courses.length} courses</p>
                </div>

                {}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Upcoming Exams
                        </h3>
                        <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="mb-2">
                        <p className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {stats.upcomingExams}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500">Scheduled exams</p>
                </div>

                {}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Performance
                        </h3>
                        <TrendingUp className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="mb-2">
                        <p className={`text-4xl font-bold ${stats.performance === 'Excellent' ? 'text-green-600' :
                            stats.performance === 'Good' ? 'text-blue-600' :
                                stats.performance === 'Fair' ? 'text-yellow-600' : 'text-gray-600'
                            }`}>
                            {stats.performance}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500">Overall status</p>
                </div>
            </div>

            {}
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

                {}
                {activeTab === 'My Grades' && renderMyGrades()}
                {activeTab === 'Exam Schedule' && renderExamSchedule()}
                {activeTab === 'Performance Analysis' && renderPerformanceAnalysis()}
            </div>
        </div>
    );
};

export default ExamsAndGrades;
