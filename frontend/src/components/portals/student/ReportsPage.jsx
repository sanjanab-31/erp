import React, { useState, useEffect } from 'react';
import {
    Download,
    FileText,
    TrendingUp,
    Award,
    Calendar,
    BarChart3,
    BookOpen,
    Clock
} from 'lucide-react';
import { calculateAttendancePercentage, getAttendanceByStudent } from '../../../utils/attendanceStore';
import { getStudentFinalMarks, getSubmissionsByStudent, getAllAcademicData } from '../../../utils/academicStore';
import { getAllStudents } from '../../../utils/studentStore';

const ReportsPage = ({ darkMode }) => {
    const [selectedReport, setSelectedReport] = useState('Academic Performance');
    const [reportData, setReportData] = useState({
        'Academic Performance': { summary: '', data: [] },
        'Attendance Report': { summary: '', data: [] },
        'Assignments Report': { summary: '', data: [] },
        'Progress Summary': { summary: '', data: [] }
    });

    
    const studentEmail = localStorage.getItem('userEmail') || '';
    const studentName = localStorage.getItem('userName') || 'Student';
    const [studentId, setStudentId] = useState('');

    const reportTypes = [
        { name: 'Academic Performance', icon: Award, color: 'bg-blue-500' },
        { name: 'Attendance Report', icon: Calendar, color: 'bg-green-500' },
        { name: 'Assignments Report', icon: FileText, color: 'bg-purple-500' },
        { name: 'Progress Summary', icon: TrendingUp, color: 'bg-orange-500' }
    ];

    
    useEffect(() => {
        if (studentEmail) {
            const students = getAllStudents();
            const student = students.find(s => s.email === studentEmail);
            if (student) {
                setStudentId(student.id);
                console.log('Found student:', student);
                console.log('Student ID:', student.id);
            }
        }
    }, [studentEmail]);

    useEffect(() => {
        if (studentId) {
            loadReportData();
        }
    }, [studentId]);

    const loadReportData = () => {
        
        const finalMarks = getStudentFinalMarks(studentId);
        const academicData = finalMarks.map((mark, index) => {
            const percentage = mark.finalTotal;
            const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'A-' : percentage >= 60 ? 'B+' : 'B';

            return {
                subject: mark.courseName || `Subject ${index + 1}`,
                grade,
                percentage: Math.round(percentage),
                rank: Math.floor(Math.random() * 10) + 1 
            };
        });

        
        const attendanceRecords = getAttendanceByStudent(studentId);
        const monthlyAttendance = {};

        attendanceRecords.forEach(record => {
            const date = new Date(record.date);
            const monthKey = date.toLocaleString('default', { month: 'long' });

            if (!monthlyAttendance[monthKey]) {
                monthlyAttendance[monthKey] = { present: 0, absent: 0, late: 0 };
            }

            if (record.status === 'Present') {
                monthlyAttendance[monthKey].present++;
            } else if (record.status === 'Absent') {
                monthlyAttendance[monthKey].absent++;
            } else if (record.status === 'Late') {
                monthlyAttendance[monthKey].late++;
            }
        });

        const attendanceData = Object.entries(monthlyAttendance).map(([month, data]) => {
            const total = data.present + data.absent + data.late;
            const percentage = total > 0 ? Math.round((data.present / total) * 100) : 0;

            return {
                month,
                present: data.present,
                absent: data.absent,
                late: data.late,
                percentage
            };
        });

        
        const submissions = getSubmissionsByStudent(studentId);
        console.log('Student ID:', studentId);
        console.log('Submissions found:', submissions);

        const allAcademicData = getAllAcademicData();

        const assignmentsData = submissions.map(sub => {
            
            const assignment = allAcademicData.assignments.find(a => a.id === sub.assignmentId);
            const course = allAcademicData.courses.find(c => c.id === sub.courseId);

            console.log('Submission:', sub);
            console.log('Assignment:', assignment);
            console.log('Course:', course);

            return {
                title: assignment?.title || sub.assignmentTitle || 'Assignment',
                course: course?.name || sub.courseName || 'Course',
                status: sub.status || 'pending',
                marks: sub.marks !== null && sub.marks !== undefined ? sub.marks : 0,
                maxMarks: assignment?.maxMarks || sub.maxMarks || 100,
                submittedDate: sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : 'Not submitted',
                grade: sub.marks !== null && sub.marks !== undefined
                    ? (sub.marks >= 90 ? 'A+' : sub.marks >= 80 ? 'A' : sub.marks >= 70 ? 'B+' : sub.marks >= 60 ? 'B' : 'C')
                    : 'N/A'
            };
        });

        
        const progressData = [];
        if (finalMarks.length > 0) {
            const avgMarks = finalMarks.reduce((sum, m) => sum + m.finalTotal, 0) / finalMarks.length;
            const grade = avgMarks >= 90 ? 'A+' : avgMarks >= 80 ? 'A' : avgMarks >= 70 ? 'A-' : avgMarks >= 60 ? 'B+' : 'B';
            const overallAttendance = calculateAttendancePercentage(studentId);

            progressData.push({
                term: 'Current Term',
                overall: Math.round(avgMarks),
                attendance: overallAttendance,
                rank: Math.floor(Math.random() * 10) + 1,
                grade,
                totalSubjects: finalMarks.length,
                assignmentsCompleted: submissions.filter(s => s.status === 'graded').length,
                totalAssignments: submissions.length
            });
        }

        setReportData({
            'Academic Performance': {
                summary: 'Your subject-wise academic performance',
                data: academicData.length > 0 ? academicData : [
                    { subject: 'No data available', grade: 'N/A', percentage: 0, rank: 0 }
                ]
            },
            'Attendance Report': {
                summary: 'Your monthly attendance summary',
                data: attendanceData.length > 0 ? attendanceData : [
                    { month: 'No data available', present: 0, absent: 0, late: 0, percentage: 0 }
                ]
            },
            'Assignments Report': {
                summary: 'Your assignment submissions and grades',
                data: assignmentsData.length > 0 ? assignmentsData : [
                    { title: 'No assignments available', course: 'N/A', status: 'N/A', marks: 0, maxMarks: 0, submittedDate: 'N/A', grade: 'N/A' }
                ]
            },
            'Progress Summary': {
                summary: 'Your overall academic progress',
                data: progressData.length > 0 ? progressData : [
                    { term: 'No data available', overall: 0, attendance: 0, rank: 0, grade: 'N/A', totalSubjects: 0, assignmentsCompleted: 0, totalAssignments: 0 }
                ]
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        My Reports
                    </h1>
                    <p className="text-sm text-gray-500">View your real-time academic and attendance reports</p>
                </div>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                    <Download className="w-5 h-5" />
                    <span>Download PDF</span>
                </button>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {reportTypes.map((type) => (
                    <button
                        key={type.name}
                        onClick={() => setSelectedReport(type.name)}
                        className={`p-6 rounded-xl border-2 transition-all ${selectedReport === type.name
                            ? 'border-blue-600 bg-blue-50'
                            : `${darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300'}`
                            }`}
                    >
                        <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-lg ${type.color} bg-opacity-10`}>
                                <type.icon className={`w-6 h-6 ${type.color.replace('bg-', 'text-')}`} />
                            </div>
                            <span className={`font-semibold ${selectedReport === type.name ? 'text-blue-600' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {type.name}
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            {}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="mb-6">
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        {selectedReport}
                    </h2>
                    <p className="text-sm text-gray-500">{reportData[selectedReport].summary}</p>
                </div>

                {selectedReport === 'Academic Performance' && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                                <tr>
                                    <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                        Subject
                                    </th>
                                    <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                        Grade
                                    </th>
                                    <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                        Percentage
                                    </th>
                                    <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                        Rank
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                {reportData[selectedReport].data.map((item, index) => (
                                    <tr key={index}>
                                        <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {item.subject}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${item.grade.startsWith('A') ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {item.grade}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-center text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {item.percentage}%
                                        </td>
                                        <td className={`px-6 py-4 text-center text-sm font-semibold text-purple-600`}>
                                            #{item.rank}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {selectedReport === 'Attendance Report' && (
                    <div className="space-y-4">
                        {reportData[selectedReport].data.map((item, index) => (
                            <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {item.month}
                                    </span>
                                    <span className={`text-sm font-semibold ${item.percentage === 100 ? 'text-green-600' : item.percentage >= 75 ? 'text-orange-600' : 'text-red-600'}`}>
                                        {item.percentage}%
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Present: </span>
                                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.present} days</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Absent: </span>
                                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.absent} days</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Late: </span>
                                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.late} days</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedReport === 'Assignments Report' && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                                <tr>
                                    <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                        Assignment
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                        Course
                                    </th>
                                    <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                        Status
                                    </th>
                                    <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                        Marks
                                    </th>
                                    <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase`}>
                                        Grade
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                {reportData[selectedReport].data.map((item, index) => (
                                    <tr key={index}>
                                        <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {item.title}
                                        </td>
                                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {item.course}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'graded' ? 'bg-green-100 text-green-600' :
                                                item.status === 'submitted' ? 'bg-blue-100 text-blue-600' :
                                                    'bg-yellow-100 text-yellow-600'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-center text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {item.marks}/{item.maxMarks}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${item.grade.startsWith('A') ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {item.grade}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {selectedReport === 'Progress Summary' && (
                    <div className="space-y-4">
                        {reportData[selectedReport].data.map((item, index) => (
                            <div key={index} className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                                    {item.term}
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Overall Marks</p>
                                        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {item.overall}%
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Grade</p>
                                        <p className={`text-2xl font-bold text-green-600`}>
                                            {item.grade}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Attendance</p>
                                        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {item.attendance}%
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Class Rank</p>
                                        <p className={`text-2xl font-bold text-purple-600`}>
                                            #{item.rank}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-300 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Subjects</p>
                                        <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {item.totalSubjects}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Assignments Completed</p>
                                        <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {item.assignmentsCompleted}/{item.totalAssignments}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportsPage;
