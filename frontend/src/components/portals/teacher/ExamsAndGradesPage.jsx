import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    BookOpen,
    Edit,
    Save,
    Download,
    Search,
    Award,
    TrendingUp,
    Users,
    FileText,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import {
    studentApi,
    courseApi,
    resultApi,
    assignmentApi
} from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

const ExamsAndGradesPage = () => {
    const { darkMode } = useOutletContext();
    const { showSuccess, showError, showWarning, showInfo } = useToast();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [marksData, setMarksData] = useState({});
    const [saving, setSaving] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const teacherId = currentUser.id || localStorage.getItem('userId') || 'teacher_1';

    useEffect(() => {
        loadCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            loadCourseData(selectedCourse.id);
        }
    }, [selectedCourse]);

    const loadCourses = async () => {
        try {
            const res = await courseApi.getAll();
            const data = res.data?.data || res.data;
            const allCourses = Array.isArray(data) ? data : [];
            
            console.log('All courses:', allCourses.length);
            console.log('Current teacher ID:', teacherId, 'Name:', currentUser.name);
            
            const teacherCourses = allCourses.filter(c => 
                c.teacherId === teacherId || 
                c.teacherId == teacherId ||
                c.teacher === currentUser.name ||
                c.teacherName === currentUser.name
            );
            
            console.log('Teacher courses:', teacherCourses.length);
            
            setCourses(teacherCourses);
            if (teacherCourses.length > 0 && !selectedCourse) {
                setSelectedCourse(teacherCourses[0]);
            }
        } catch (error) {
            console.error('Failed to load courses:', error);
            showError('Failed to load courses');
        }
    };

    const loadCourseData = async (courseId) => {
        const course = courses.find(c => c.id === courseId) || selectedCourse;
        if (!course) return;

        try {
            const studentRes = await studentApi.getAll();
            const studentsData = studentRes.data?.data;
            const allStudents = Array.isArray(studentsData) ? studentsData : [];
            const classStudents = allStudents.filter(s => s.class === course.class);
            setStudents(classStudents);

            const resultsRes = await resultApi.getAll({ courseId });
            const allResultsData = resultsRes.data?.data;
            const allResults = Array.isArray(allResultsData) ? allResultsData : [];

            const assignments = course.assignments || [];
            const marksMap = {};
            const submissionsMap = {};

            for (const assign of assignments) {
                try {
                    const subRes = await assignmentApi.getSubmissions(assign.id);
                    const subData = subRes.data?.data;
                    submissionsMap[assign.id] = Array.isArray(subData) ? subData : [];
                } catch (e) {
                    submissionsMap[assign.id] = [];
                }
            }

            classStudents.forEach(student => {
                const result = allResults.find(r => r.studentId === student.id);
                const examScores = result ? (result.examScores || {}) : {};

                let assignment1 = 0;
                let assignment2 = 0;

                if (assignments.length > 0) {
                    const sub1 = submissionsMap[assignments[0].id]?.find(s => s.studentId === student.id);
                    assignment1 = sub1 ? sub1.marks || 0 : 0;
                }
                if (assignments.length > 1) {
                    const sub2 = submissionsMap[assignments[1].id]?.find(s => s.studentId === student.id);
                    assignment2 = sub2 ? sub2.marks || 0 : 0;
                }

                marksMap[student.id] = {
                    exam1: examScores.exam1 || 0,
                    exam2: examScores.exam2 || 0,
                    exam3: examScores.exam3 || 0,
                    assignment1,
                    assignment2
                };
            });

            setMarksData(marksMap);
        } catch (error) {
            console.error('Failed to load course data:', error);
            showError('Failed to load student data');
        }
    };

    const updateMarks = (studentId, field, value) => {
        const numValue = Math.max(0, Math.min(100, parseInt(value) || 0));
        setMarksData(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: numValue
            }
        }));
    };

    const calculateTotals = (studentId) => {
        const marks = marksData[studentId] || {};

        const examTotal = ((parseFloat(marks.exam1) || 0) + (parseFloat(marks.exam2) || 0) + (parseFloat(marks.exam3) || 0)) / 300 * 75;

        const assignmentTotal = ((parseFloat(marks.assignment1) || 0) + (parseFloat(marks.assignment2) || 0)) / 200 * 25;

        const finalTotal = examTotal + assignmentTotal;

        return {
            examTotal: examTotal.toFixed(2),
            assignmentTotal: assignmentTotal.toFixed(2),
            finalTotal: finalTotal.toFixed(2)
        };
    };

    const getGrade = (finalTotal) => {
        const score = parseFloat(finalTotal);
        if (score >= 90) return { grade: 'A+', color: 'text-green-600 bg-green-100' };
        if (score >= 85) return { grade: 'A', color: 'text-green-600 bg-green-100' };
        if (score >= 75) return { grade: 'B+', color: 'text-green-600 bg-green-100' };
        if (score >= 70) return { grade: 'B', color: 'text-green-600 bg-green-100' };
        if (score >= 60) return { grade: 'C+', color: 'text-yellow-600 bg-yellow-100' };
        if (score >= 50) return { grade: 'C', color: 'text-yellow-600 bg-yellow-100' };
        return { grade: 'D', color: 'text-red-600 bg-red-100' };
    };

    const handleSave = async () => {
        if (!selectedCourse) return;

        setSaving(true);
        try {
            const assignments = selectedCourse.assignments || [];

            const submissionsMap = {};
            for (const assign of assignments) {
                try {
                    const subRes = await assignmentApi.getSubmissions(assign.id);
                    const subData = subRes.data?.data;
                    submissionsMap[assign.id] = Array.isArray(subData) ? subData : [];
                } catch (e) {
                    submissionsMap[assign.id] = [];
                }
            }

            for (const student of students) {
                const marks = marksData[student.id];
                if (marks) {

                    await resultApi.save({
                        courseId: selectedCourse.id,
                        studentId: student.id,
                        studentName: student.name,
                        examScores: {
                            exam1: marks.exam1 || 0,
                            exam2: marks.exam2 || 0,
                            exam3: marks.exam3 || 0
                        },
                        enteredBy: teacherId
                    });

                    const saveAssignmentMark = async (assignmentIndex, markField) => {
                        if (assignments.length > assignmentIndex) {
                            const assignmentId = assignments[assignmentIndex].id;
                            const markToSave = marks[markField] || 0;
                            const existingSub = submissionsMap[assignmentId].find(s => s.studentId === student.id);

                            if (existingSub) {
                                await assignmentApi.gradeSubmission(existingSub.id, {
                                    marks: markToSave,
                                    comments: 'Graded by teacher'
                                });
                            } else {
                                await assignmentApi.createSubmission({
                                    assignmentId: assignmentId,
                                    studentId: student.id,
                                    marks: markToSave,
                                    status: 'graded',
                                    feedback: 'Graded by teacher'
                                });
                            }
                        }
                    };

                    await saveAssignmentMark(0, 'assignment1');
                    await saveAssignmentMark(1, 'assignment2');
                }
            }

            showSuccess('Marks saved successfully!');
            setEditMode(false);
            loadCourseData(selectedCourse.id);
        } catch (error) {
            console.error(error);
            showError('Error saving marks: ' + (error.response?.data?.message || error.message));
        } finally {
            setSaving(false);
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.rollNumber || student.rollNo || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const calculateStats = () => {
        if (filteredStudents.length === 0) return { average: 0, topScore: 0, passRate: 0 };

        const totals = filteredStudents.map(s => parseFloat(calculateTotals(s.id).finalTotal));
        const average = totals.reduce((a, b) => a + b, 0) / totals.length;
        const topScore = Math.max(...totals);
        const passRate = (totals.filter(t => t >= 50).length / totals.length) * 100;

        return {
            average: average.toFixed(2),
            topScore: topScore.toFixed(2),
            passRate: passRate.toFixed(0)
        };
    };

    const stats = calculateStats();

    return (
        <div className="flex-1 overflow-y-auto p-8">
            { }
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Exams & Grades
                </h1>
                <p className="text-sm text-gray-500">Manage student marks and assessments</p>
            </div>

            { }
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:scale-[1.02] hover:shadow-lg transition-all duration-200 group cursor-pointer`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Students</h3>
                        <Users className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{students.length}</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:scale-[1.02] hover:shadow-lg transition-all duration-200 group cursor-pointer`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Average Score</h3>
                        <TrendingUp className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.average}/100</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:scale-[1.02] hover:shadow-lg transition-all duration-200 group cursor-pointer`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Top Score</h3>
                        <Award className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.topScore}/100</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:scale-[1.02] hover:shadow-lg transition-all duration-200 group cursor-pointer`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pass Rate</h3>
                        <FileText className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.passRate}%</p>
                </div>
            </div>

            { }
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6 hover:shadow-lg transition-all duration-200`}>
                <div className="flex flex-col md:flex-row gap-4">
                    <select
                        value={selectedCourse?.id || ''}
                        onChange={(e) => {
                            const course = courses.find(c => c.id === e.target.value);
                            setSelectedCourse(course);
                        }}
                        className={`w-48 px-4 py-2.5 text-sm rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 cursor-pointer hover:border-green-400`}
                    >
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.name} - {course.class}
                            </option>
                        ))}
                    </select>

                    <div className="w-80 relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search student..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200`}
                        />
                    </div>
                    
                    <div className="flex flex-wrap gap-3 ml-auto">
                        {editMode ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className={`px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:scale-105 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <Save className="w-4 h-4" />
                                    <span className="text-sm font-medium">{saving ? 'Saving...' : 'Save Changes'}</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setEditMode(false);
                                        loadCourseData(selectedCourse.id);
                                    }}
                                    className="px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setEditMode(true)}
                                className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:scale-105 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
                            >
                                <Edit className="w-4 h-4" />
                                <span className="text-sm font-medium">Edit Grades</span>
                            </button>
                        )}

                        <button className="px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 hover:scale-105 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md">
                            <Download className="w-4 h-4" />
                            <span className="text-sm font-medium">Export Report</span>
                        </button>
                    </div>
                </div>
            </div>

            { }
            {editMode && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                        <p className="text-sm text-green-800 font-medium">Edit Mode Active</p>
                        <p className="text-sm text-green-600 mt-1">
                            Enter marks for Exam 1, Exam 2, Exam 3, Assignment 1, and Assignment 2 (each out of 100).
                            Totals will be calculated automatically: Exam Total (75) + Assignment Total (25) = Final Total (100).
                        </p>
                    </div>
                </div>
            )}

            { }
            {!selectedCourse ? (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 text-center border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        No courses available
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Create a course first to start entering marks
                    </p>
                </div>
            ) : (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                                <tr>
                                    <th className={`px-4 py-3 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider sticky left-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} z-10`}>
                                        Student Name
                                    </th>
                                    <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                        Student ID
                                    </th>
                                    <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider bg-green-50`}>
                                        Exam 1
                                    </th>
                                    <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider bg-green-50`}>
                                        Exam 2
                                    </th>
                                    <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider bg-green-50`}>
                                        Exam 3
                                    </th>
                                    <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider bg-green-100`}>
                                        Exam Total (75)
                                    </th>
                                    <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider bg-green-50`}>
                                        Assignment 1
                                    </th>
                                    <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider bg-green-50`}>
                                        Assignment 2
                                    </th>
                                    <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider bg-green-100`}>
                                        Assignment Total (25)
                                    </th>
                                    <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider bg-purple-100`}>
                                        Final Total (100)
                                    </th>
                                    <th className={`px-4 py-3 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                        Grade
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                {filteredStudents.map((student) => {
                                    const marks = marksData[student.id] || {};
                                    const totals = calculateTotals(student.id);
                                    const gradeInfo = getGrade(totals.finalTotal);

                                    return (
                                        <tr key={student.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-all duration-200 group`}>
                                            { }
                                            <td className={`px-4 py-3 whitespace-nowrap sticky left-0 ${darkMode ? 'bg-gray-800 group-hover:bg-gray-700' : 'bg-white group-hover:bg-gray-50'} z-10 transition-all duration-200`}>
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm group-hover:scale-110 transition-transform duration-200">
                                                        {student.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            {student.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            { }
                                            <td className="px-4 py-3 text-center">
                                                <span className="text-xs text-gray-500">{student.rollNumber || student.rollNo || student.id}</span>
                                            </td>

                                            { }
                                            <td className="px-4 py-3 text-center bg-green-50">
                                                {editMode ? (
                                                    <input
                                                        type="number"
                                                        value={marks.exam1 || ''}
                                                        onChange={(e) => updateMarks(student.id, 'exam1', e.target.value)}
                                                        className="w-16 px-2 py-1 text-center rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                        min="0"
                                                        max="100"
                                                        placeholder="0"
                                                    />
                                                ) : (
                                                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {marks.exam1 || 0}
                                                    </span>
                                                )}
                                            </td>

                                            { }
                                            <td className="px-4 py-3 text-center bg-green-50">
                                                {editMode ? (
                                                    <input
                                                        type="number"
                                                        value={marks.exam2 || ''}
                                                        onChange={(e) => updateMarks(student.id, 'exam2', e.target.value)}
                                                        className="w-16 px-2 py-1 text-center rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                        min="0"
                                                        max="100"
                                                        placeholder="0"
                                                    />
                                                ) : (
                                                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {marks.exam2 || 0}
                                                    </span>
                                                )}
                                            </td>

                                            { }
                                            <td className="px-4 py-3 text-center bg-green-50">
                                                {editMode ? (
                                                    <input
                                                        type="number"
                                                        value={marks.exam3 || ''}
                                                        onChange={(e) => updateMarks(student.id, 'exam3', e.target.value)}
                                                        className="w-16 px-2 py-1 text-center rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                        min="0"
                                                        max="100"
                                                        placeholder="0"
                                                    />
                                                ) : (
                                                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {marks.exam3 || 0}
                                                    </span>
                                                )}
                                            </td>

                                            { }
                                            <td className="px-4 py-3 text-center bg-green-100">
                                                <span className="text-sm font-bold text-green-700">
                                                    {totals.examTotal}
                                                </span>
                                            </td>

                                            { }
                                            <td className="px-4 py-3 text-center bg-green-50">
                                                {editMode ? (
                                                    <input
                                                        type="number"
                                                        value={marks.assignment1 || ''}
                                                        onChange={(e) => updateMarks(student.id, 'assignment1', e.target.value)}
                                                        className="w-16 px-2 py-1 text-center rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                        min="0"
                                                        max="100"
                                                        placeholder="0"
                                                    />
                                                ) : (
                                                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {marks.assignment1 || 0}
                                                    </span>
                                                )}
                                            </td>

                                            { }
                                            <td className="px-4 py-3 text-center bg-green-50">
                                                {editMode ? (
                                                    <input
                                                        type="number"
                                                        value={marks.assignment2 || ''}
                                                        onChange={(e) => updateMarks(student.id, 'assignment2', e.target.value)}
                                                        className="w-16 px-2 py-1 text-center rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                        min="0"
                                                        max="100"
                                                        placeholder="0"
                                                    />
                                                ) : (
                                                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {marks.assignment2 || 0}
                                                    </span>
                                                )}
                                            </td>

                                            { }
                                            <td className="px-4 py-3 text-center bg-green-100">
                                                <span className="text-sm font-bold text-green-700">
                                                    {totals.assignmentTotal}
                                                </span>
                                            </td>

                                            { }
                                            <td className="px-4 py-3 text-center bg-purple-100">
                                                <span className="text-lg font-bold text-purple-700">
                                                    {totals.finalTotal}
                                                </span>
                                            </td>

                                            { }
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${gradeInfo.color}`}>
                                                    {gradeInfo.grade}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {filteredStudents.length === 0 && (
                        <div className="p-12 text-center">
                            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                No students found
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                {searchQuery ? 'Try a different search term' : 'No students enrolled in this class'}
                            </p>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default ExamsAndGradesPage;
