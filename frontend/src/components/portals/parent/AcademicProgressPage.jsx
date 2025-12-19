import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    BookOpen,
    Award,
    TrendingUp,
    Calendar,
    Clock,
    BarChart3,
    Grid3x3,
    List,
    AlertCircle,
    Loader
} from 'lucide-react';
import {
    studentApi,
    courseApi,
    examApi,
    resultApi,
    parentApi
} from '../../../services/api';

const AcademicProgressPage = () => {
    const { darkMode } = useOutletContext();
    const [courses, setCourses] = useState([]);
    const [examSchedules, setExamSchedules] = useState([]);
    const [allMarks, setAllMarks] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('table');

    const parentEmail = localStorage.getItem('userEmail');
    const [childId, setChildId] = useState('');
    const [childName, setChildName] = useState('');
    const [childClass, setChildClass] = useState('');

    useEffect(() => {
        const init = async () => {
            if (!parentEmail) return;
            setLoading(true);
            try {
                // Fetch basic data first
                const [parentsRes, studentsRes] = await Promise.all([
                    parentApi.getAll(),
                    studentApi.getAll()
                ]);

                const allParents = Array.isArray(parentsRes?.data?.data) ? parentsRes.data.data : [];
                const currentParent = allParents.find(p => p.email?.toLowerCase() === parentEmail?.toLowerCase());

                const allStudents = Array.isArray(studentsRes?.data?.data) ? studentsRes.data.data : [];

                // Find child based on parent record or parentEmail
                let child;
                if (currentParent) {
                    child = allStudents.find(s =>
                        (s.id?.toString() === currentParent.studentId?.toString()) ||
                        (s.parentEmail?.toLowerCase() === currentParent.email?.toLowerCase())
                    );
                } else {
                    child = allStudents.find(s => s.parentEmail?.toLowerCase() === parentEmail?.toLowerCase());
                }

                if (!child) {
                    console.error('Child not found for parent:', parentEmail);
                    setLoading(false);
                    return;
                }

                setChildId(child.id);
                setChildName(child.name);
                setChildClass(child.class);

                // Fetch academic data
                const [coursesRes, examsRes, resultsRes] = await Promise.all([
                    courseApi.getAll(),
                    examApi.getAll(),
                    resultApi.getAll()
                ]);

                const classCourses = Array.isArray(coursesRes?.data?.data)
                    ? coursesRes.data.data.filter(c => c.class === child.class)
                    : [];
                setCourses(classCourses);

                const classExams = Array.isArray(examsRes?.data?.data)
                    ? examsRes.data.data.filter(e => e.class === child.class && new Date(e.examDate) >= new Date())
                    : [];
                setExamSchedules(classExams);

                const allResults = Array.isArray(resultsRes?.data?.data) ? resultsRes.data.data : [];
                const studentResults = allResults.filter(r => r.studentId === child.id);

                const marksData = classCourses.map(course => {
                    const result = studentResults.find(r => r.courseId === course.id) || {};

                    const courseAssignments = course.assignments || [];
                    const studentSubmissions = [];
                    let assignmentScore = 0;

                    courseAssignments.forEach(assign => {
                        const sub = (assign.submissions || []).find(s => s.studentId === child.id);
                        if (sub) {
                            studentSubmissions.push({
                                ...sub,
                                assignmentId: assign.id,
                                title: assign.title,
                                courseId: course.id,
                                marks: sub.grade || 0,
                                status: sub.status || 'pending',
                                submittedAt: sub.submittedAt || sub.createdAt,
                                feedback: sub.feedback
                            });
                            if (sub.grade) assignmentScore += sub.grade;
                        }
                    });

                    if (result.assignmentScore !== undefined) assignmentScore = result.assignmentScore;

                    const examScore = result.examScore || 0;
                    const finalTotal = result.percentage || 0;

                    console.log(`Course: ${course.name}, Result:`, result, `Final Total: ${finalTotal}`);

                    return {
                        courseId: course.id,
                        courseName: course.name,
                        courseCode: course.code,
                        teacherName: course.teacherName || course.teacher,
                        finalMarks: {
                            assignmentMarks: assignmentScore,
                            examMarks: examScore,
                            finalTotal: finalTotal
                        },
                        examMarks: result.examBreakdown || { exam1: 0, exam2: 0, exam3: 0 },
                        submissions: studentSubmissions
                    };
                });

                console.log('All marks data:', marksData);

                setAllMarks(marksData);
                if (selectedCourse) {
                    const updatedSelected = marksData.find(m => m.courseId === selectedCourse.courseId);
                    if (updatedSelected) setSelectedCourse(updatedSelected);
                }

            } catch (err) {
                console.error("Error loading academic data", err);
            } finally {
                setLoading(false);
            }
        };

        if (parentEmail) {
            init();
        }
    }, [parentEmail]);

    const calculateOverallPerformance = React.useCallback(() => {
        let totalMarks = 0;
        let courseCount = 0;
        allMarks.forEach(m => {
            if (m.finalMarks.finalTotal > 0) {
                totalMarks += m.finalMarks.finalTotal;
                courseCount++;
            }
        });
        return courseCount > 0 ? (totalMarks / courseCount).toFixed(0) : '0';
    }, [allMarks]);

    const overallAverage = calculateOverallPerformance();

    let overallGrade = 'N/A';
    const avgNum = parseFloat(overallAverage);
    if (avgNum >= 90) overallGrade = 'A+';
    else if (avgNum >= 85) overallGrade = 'A';
    else if (avgNum >= 75) overallGrade = 'B+';
    else if (avgNum >= 70) overallGrade = 'B';
    else if (avgNum >= 60) overallGrade = 'C+';
    else if (avgNum >= 50) overallGrade = 'C';
    else if (avgNum > 0) overallGrade = 'D';
    else overallGrade = 'N/A';

    return (
        <div className="space-y-6">
            {loading ? (
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <Loader className={`w-12 h-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'} animate-spin mx-auto mb-4`} />
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading academic progress...</p>
                    </div>
                </div>
            ) : (
                <>
                    <div>
                        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                            {childName ? `${childName}'s Academic Progress` : 'Academic Progress'}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {childClass ? `Class: ${childClass}` : 'No class assigned'}
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Overall Grade</h3>
                                <Award className="w-5 h-5 text-yellow-500" />
                            </div>
                            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{overallGrade}</p>
                            <p className="text-sm text-gray-500 mt-2">Current standing</p>
                        </div>

                        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Percentage</h3>
                                <BarChart3 className="w-5 h-5 text-green-500" />
                            </div>
                            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{overallAverage}%</p>
                            <p className="text-sm text-gray-500 mt-2">Average score</p>
                        </div>

                        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Courses</h3>
                                <BookOpen className="w-5 h-5 text-blue-500" />
                            </div>
                            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{courses.length}</p>
                            <p className="text-sm text-gray-500 mt-2">This semester</p>
                        </div>

                        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Graded Courses</h3>
                                <Award className="w-5 h-5 text-purple-500" />
                            </div>
                            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{allMarks.filter(m => m.finalMarks.finalTotal > 0).length}</p>
                            <p className="text-sm text-gray-500 mt-2">Completed</p>
                        </div>
                    </div>

                    { }
                    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden`}>
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Course-wise Performance</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'table'
                                        ? 'bg-blue-500 text-white'
                                        : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('cards')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'cards'
                                        ? 'bg-blue-500 text-white'
                                        : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}`}
                                >
                                    <Grid3x3 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {viewMode === 'table' ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className={`${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Course Name</th>
                                            <th className="px-6 py-3 font-medium">Teacher</th>
                                            <th className="px-6 py-3 font-medium">Assignment (25%)</th>
                                            <th className="px-6 py-3 font-medium">Exam (75%)</th>
                                            <th className="px-6 py-3 font-medium">Final Score</th>
                                            <th className="px-6 py-3 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`${darkMode ? 'divide-gray-700' : 'divide-gray-200'} divide-y`}>
                                        {allMarks.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No courses available</td>
                                            </tr>
                                        ) : (
                                            allMarks.map((mark) => (
                                                <tr key={mark.courseId} className={`hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                                    <td className={`px-6 py-4 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        <div>
                                                            <div>{mark.courseName}</div>
                                                            <div className="text-xs text-gray-500">{mark.courseCode}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                            {mark.teacherName || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                            {mark.finalMarks.assignmentMarks} / 25
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                            {mark.finalMarks.examMarks} / 75
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${mark.finalMarks.finalTotal >= 75 ? 'bg-green-100 text-green-700' :
                                                            mark.finalMarks.finalTotal >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-red-100 text-red-700'
                                                            }`}>
                                                            {mark.finalMarks.finalTotal}%
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => setSelectedCourse(mark)}
                                                            className="text-blue-500 hover:text-blue-600 font-medium"
                                                        >
                                                            View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {allMarks.map((mark) => (
                                    <div
                                        key={mark.courseId}
                                        onClick={() => setSelectedCourse(mark)}
                                        className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} rounded-xl border p-6 cursor-pointer hover:shadow-lg transition-all ${selectedCourse?.courseId === mark.courseId ? 'ring-2 ring-blue-500' : ''}`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                <BookOpen className="w-6 h-6 text-white" />
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${mark.finalMarks.finalTotal >= 90 ? 'bg-green-100 text-green-600' :
                                                mark.finalMarks.finalTotal >= 75 ? 'bg-blue-100 text-blue-600' :
                                                    mark.finalMarks.finalTotal >= 60 ? 'bg-yellow-100 text-yellow-600' :
                                                        mark.finalMarks.finalTotal > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {mark.finalMarks.finalTotal > 0 ? `${mark.finalMarks.finalTotal}/100` : 'No marks'}
                                            </span>
                                        </div>
                                        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                                            {mark.courseName}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-2">{mark.courseCode}</p>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                                            Teacher: {mark.teacherName || 'N/A'}
                                        </p>

                                        {mark.finalMarks.finalTotal > 0 && (
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">Assignment:</span>
                                                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        {mark.finalMarks.assignmentMarks}/25
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">Exam:</span>
                                                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        {mark.finalMarks.examMarks}/75
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    { }
                    {selectedCourse && (
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6 mt-6`}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {selectedCourse.courseName} - Detailed Breakdown
                                </h2>
                                <button
                                    onClick={() => setSelectedCourse(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    Close
                                </button>
                            </div>

                            <div className="space-y-6">
                                { }
                                <div>
                                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 border-b pb-2`}>
                                        Assignment Marks (Weight: 25%)
                                    </h3>
                                    {(() => {
                                        const submissions = selectedCourse.submissions || [];

                                        if (submissions.length === 0) {
                                            return <p className="text-gray-500 italic">No assignments submitted yet.</p>;
                                        }

                                        return (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {submissions.map((submission, index) => (
                                                    <div
                                                        key={submission.id || index}
                                                        className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 border border-gray-100`}
                                                    >
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-sm font-medium text-gray-500">Assignment {index + 1}</span>
                                                            <span className={`text-xs px-2 py-1 rounded ${submission.status === 'graded' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                                }`}>
                                                                {submission.status === 'graded' ? 'Graded' : 'Pending'}
                                                            </span>
                                                        </div>
                                                        {submission.status === 'graded' ? (
                                                            <>
                                                                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                                    {submission.marks}/100
                                                                </p>
                                                                {submission.feedback && (
                                                                    <p className="text-sm text-gray-500 mt-2 bg-white p-2 rounded border border-dashed">
                                                                        "{submission.feedback}"
                                                                    </p>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <p className="text-sm text-gray-500">Submitted on {new Date(submission.submittedAt).toLocaleDateString()}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                    <div className="mt-4 text-right">
                                        <span className="text-sm text-gray-500 mr-2">Scaled Score:</span>
                                        <span className={`text-xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                            {selectedCourse.finalMarks.assignmentMarks} / 25
                                        </span>
                                    </div>
                                </div>

                                { }
                                <div>
                                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 border-b pb-2`}>
                                        Exam Marks (Weight: 75%)
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {['exam1', 'exam2', 'exam3'].map((examKey, idx) => (
                                            <div key={examKey} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 border border-gray-100 text-center`}>
                                                <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">Exam {idx + 1}</p>
                                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {selectedCourse.finalMarks.examScores ? selectedCourse.finalMarks.examScores[examKey] : 0}
                                                    <span className="text-sm text-gray-400 font-normal">/100</span>
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 text-right">
                                        <span className="text-sm text-gray-500 mr-2">Scaled Score:</span>
                                        <span className={`text-xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                            {selectedCourse.finalMarks.examMarks.toFixed(2)} / 75
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    { }
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <Calendar className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Upcoming Exam Schedules
                            </h2>
                        </div>

                        {examSchedules.length === 0 ? (
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 text-center border border-dashed ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                                <p className="text-gray-500">No upcoming exams scheduled.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {(() => {
                                    const groupedSchedules = {};
                                    examSchedules.forEach(schedule => {
                                        if (!groupedSchedules[schedule.examName]) {
                                            groupedSchedules[schedule.examName] = [];
                                        }
                                        groupedSchedules[schedule.examName].push(schedule);
                                    });

                                    return Object.entries(groupedSchedules).map(([examName, papers]) => (
                                        <div key={examName} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden`}>
                                            <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'} flex justify-between items-center`}>
                                                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {examName}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                                    {papers.length} Papers
                                                </span>
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
                                                    <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                                        {papers.sort((a, b) => new Date(a.examDate) - new Date(b.examDate)).map(paper => (
                                                            <tr key={paper.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                                                <td className={`p-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                                    {paper.subject || paper.courseName}
                                                                </td>
                                                                <td className={`p-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                                    {new Date(paper.examDate).toLocaleDateString()}
                                                                </td>
                                                                <td className={`p-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                                    {paper.startTime} - {paper.endTime}
                                                                </td>
                                                                <td className={`p-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                                    {paper.venue || '-'}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        )}
                    </div>                </>
            )}        </div>
    );
};

export default AcademicProgressPage;
