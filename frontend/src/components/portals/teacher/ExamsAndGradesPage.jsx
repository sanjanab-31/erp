import React, { useState, useEffect } from 'react';
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
    getCoursesByTeacher,
    enterExamMarks,
    gradeSubmission,
    createSubmission,
    getExamMarksByCourse,
    getSubmissionsByAssignment,
    getAssignmentsByCourse,
    calculateFinalMarks,
    subscribeToAcademicUpdates
} from '../../../utils/academicStore';
import { getAllStudents } from '../../../utils/studentStore';
import { useToast } from '../../../context/ToastContext';

const ExamsAndGradesPage = ({ darkMode }) => {
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
        const unsubscribe = subscribeToAcademicUpdates(() => {
            loadCourses();
            if (selectedCourse) {
                loadCourseData(selectedCourse.id);
            }
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            loadCourseData(selectedCourse.id);
        }
    }, [selectedCourse]);

    const loadCourses = () => {
        const teacherCourses = getCoursesByTeacher(teacherId);
        setCourses(teacherCourses);
        if (teacherCourses.length > 0 && !selectedCourse) {
            setSelectedCourse(teacherCourses[0]);
        }
    };

    const loadCourseData = (courseId) => {
        // Get all students from the course's class
        const course = courses.find(c => c.id === courseId) || selectedCourse;
        if (!course) return;

        const allStudents = getAllStudents();
        const classStudents = allStudents.filter(s => s.class === course.class);
        setStudents(classStudents);

        // Load existing marks for each student
        const marksMap = {};
        const assignments = getAssignmentsByCourse(courseId);

        classStudents.forEach(student => {
            const examMarks = getExamMarksByCourse(courseId).find(m => m.studentId === student.id);

            // Get assignment marks
            let assignment1 = 0;
            let assignment2 = 0;

            if (assignments.length > 0) {
                const sub1 = getSubmissionsByAssignment(assignments[0].id).find(s => s.studentId === student.id);
                assignment1 = sub1 && sub1.status === 'graded' ? parseFloat(sub1.marks) || 0 : 0;
            }
            if (assignments.length > 1) {
                const sub2 = getSubmissionsByAssignment(assignments[1].id).find(s => s.studentId === student.id);
                assignment2 = sub2 && sub2.status === 'graded' ? parseFloat(sub2.marks) || 0 : 0;
            }

            marksMap[student.id] = {
                exam1: examMarks?.exam1 || 0,
                exam2: examMarks?.exam2 || 0,
                exam3: examMarks?.exam3 || 0,
                assignment1,
                assignment2
            };
        });

        setMarksData(marksMap);
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

        // Exam Total: Sum of 3 exams, scaled to 75
        const examTotal = ((parseFloat(marks.exam1) || 0) + (parseFloat(marks.exam2) || 0) + (parseFloat(marks.exam3) || 0)) / 300 * 75;

        // Assignment Total: Sum of 2 assignments, scaled to 25
        const assignmentTotal = ((parseFloat(marks.assignment1) || 0) + (parseFloat(marks.assignment2) || 0)) / 200 * 25;

        // Final Total: Exam (75) + Assignment (25) = 100
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
            const assignments = getAssignmentsByCourse(selectedCourse.id);
            console.log('Assignments found for save:', assignments);

            // Save marks for each student
            for (const student of students) {
                const marks = marksData[student.id];
                if (marks) {
                    // Save exam marks
                    await enterExamMarks({
                        courseId: selectedCourse.id,
                        studentId: student.id,
                        studentName: student.name,
                        exam1: marks.exam1 || 0,
                        exam2: marks.exam2 || 0,
                        exam3: marks.exam3 || 0,
                        enteredBy: teacherId
                    });

                    // Save assignment 1 marks
                    if (assignments.length > 0) {
                        const assignmentId = assignments[0].id;
                        const submissions = getSubmissionsByAssignment(assignmentId);
                        const existingSub = submissions.find(s => s.studentId === student.id);
                        const markToSave = marks.assignment1 || 0;
                        console.log(`Saving Assignment 1 for ${student.name}: ID=${assignmentId}, Mark=${markToSave}`);

                        if (existingSub) {
                            console.log('Updating existing submission 1:', existingSub.id);
                            gradeSubmission(existingSub.id, markToSave, 'Graded by teacher');
                        } else {
                            console.log('Creating new submission 1');
                            const newSub = await createSubmission({
                                assignmentId: assignmentId,
                                courseId: selectedCourse.id,
                                studentId: student.id,
                                studentName: student.name,
                                link: '',
                                submittedBy: student.id
                            });
                            console.log('New submission 1 created:', newSub.id);
                            gradeSubmission(newSub.id, markToSave, 'Graded by teacher');
                        }
                    }

                    // Save assignment 2 marks
                    if (assignments.length > 1) {
                        const assignmentId = assignments[1].id;
                        const submissions = getSubmissionsByAssignment(assignmentId);
                        const existingSub = submissions.find(s => s.studentId === student.id);
                        const markToSave = marks.assignment2 || 0;
                        console.log(`Saving Assignment 2 for ${student.name}: ID=${assignmentId}, Mark=${markToSave}`);

                        if (existingSub) {
                            console.log('Updating existing submission 2:', existingSub.id);
                            gradeSubmission(existingSub.id, markToSave, 'Graded by teacher');
                        } else {
                            console.log('Creating new submission 2');
                            const newSub = await createSubmission({
                                assignmentId: assignmentId,
                                courseId: selectedCourse.id,
                                studentId: student.id,
                                studentName: student.name,
                                link: '',
                                submittedBy: student.id
                            });
                            console.log('New submission 2 created:', newSub.id);
                            gradeSubmission(newSub.id, markToSave, 'Graded by teacher');
                        }
                    }
                }
            }

            showSuccess('Marks saved successfully!');
            setEditMode(false);
            loadCourseData(selectedCourse.id); // Reload to show updated marks
        } catch (error) {
            console.error(error);
            showError('Error saving marks: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNo?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate statistics
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
            {/* Header */}
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Exams & Grades
                </h1>
                <p className="text-sm text-gray-500">Manage student marks and assessments</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Students</h3>
                        <Users className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{students.length}</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Average Score</h3>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.average}/100</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Top Score</h3>
                        <Award className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.topScore}/100</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pass Rate</h3>
                        <FileText className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.passRate}%</p>
                </div>
            </div>

            {/* Filters */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6`}>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <select
                        value={selectedCourse?.id || ''}
                        onChange={(e) => {
                            const course = courses.find(c => c.id === e.target.value);
                            setSelectedCourse(course);
                        }}
                        className={`px-4 py-2 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-green-500`}
                    >
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.name} - {course.class}
                            </option>
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
                    {editMode ? (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Save className="w-5 h-5" />
                            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => setEditMode(true)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                        >
                            <Edit className="w-5 h-5" />
                            <span>Edit Grades</span>
                        </button>
                    )}

                    {editMode && (
                        <button
                            onClick={() => {
                                setEditMode(false);
                                loadCourseData(selectedCourse.id);
                            }}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                    )}

                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
                        <Download className="w-5 h-5" />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            {/* Info Alert */}
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

            {/* Gradebook Table */}
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
                                        <tr key={student.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                                            {/* Student Name */}
                                            <td className={`px-4 py-3 whitespace-nowrap sticky left-0 ${darkMode ? 'bg-gray-800' : 'bg-white'} z-10`}>
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                                        {student.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            {student.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Student ID */}
                                            <td className="px-4 py-3 text-center">
                                                <span className="text-xs text-gray-500">{student.rollNo || student.id}</span>
                                            </td>

                                            {/* Exam 1 */}
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

                                            {/* Exam 2 */}
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

                                            {/* Exam 3 */}
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

                                            {/* Exam Total (75) */}
                                            <td className="px-4 py-3 text-center bg-green-100">
                                                <span className="text-sm font-bold text-green-700">
                                                    {totals.examTotal}
                                                </span>
                                            </td>

                                            {/* Assignment 1 */}
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

                                            {/* Assignment 2 */}
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

                                            {/* Assignment Total (25) */}
                                            <td className="px-4 py-3 text-center bg-green-100">
                                                <span className="text-sm font-bold text-green-700">
                                                    {totals.assignmentTotal}
                                                </span>
                                            </td>

                                            {/* Final Total (100) */}
                                            <td className="px-4 py-3 text-center bg-purple-100">
                                                <span className="text-lg font-bold text-purple-700">
                                                    {totals.finalTotal}
                                                </span>
                                            </td>

                                            {/* Grade */}
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
