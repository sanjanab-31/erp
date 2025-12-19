import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    Book,
    BookOpen,
    AlertTriangle,
    CheckCircle,
    Info
} from 'lucide-react';
import { libraryApi, studentApi, parentApi } from '../../../services/api';

const ParentLibraryPage = () => {
    const { darkMode } = useOutletContext();
    const [childIssues, setChildIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rules, setRules] = useState({
        maxBooks: 5,
        issuePeriod: 14,
        finePerDay: 5,
        currency: '₹'
    });

    const parentEmail = localStorage.getItem('userEmail');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Fetch everything in parallel
                const [parentsRes, studentRes, libraryRes] = await Promise.all([
                    parentApi.getAll(),
                    studentApi.getAll(),
                    libraryApi.getAllIssues()
                ]);

                const allParents = Array.isArray(parentsRes?.data?.data) ? parentsRes.data.data : [];
                const currentParent = allParents.find(p => p.email?.toLowerCase() === parentEmail?.toLowerCase());

                if (!currentParent) {
                    console.error('Parent record not found for:', parentEmail);
                    setLoading(false);
                    return;
                }

                const allStudents = Array.isArray(studentRes?.data?.data) ? studentRes.data.data : [];
                const child = allStudents.find(s =>
                    (s.id?.toString() === currentParent.studentId?.toString()) ||
                    (s.parentEmail?.toLowerCase() === currentParent.email?.toLowerCase())
                );

                if (child) {
                    const allIssues = Array.isArray(libraryRes?.data?.data) ? libraryRes.data.data : [];
                    const childRecords = allIssues.filter(i =>
                        i.userId === child.email ||
                        i.studentId?.toString() === child.id?.toString() ||
                        i.studentId === child.id
                    );
                    setChildIssues(childRecords);
                } else {
                    console.error('Student not found for studentId:', currentParent.studentId);
                }
            } catch (error) {
                console.error('Error loading library data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [parentEmail]);

    const overdueCount = childIssues.filter(i => i.status === 'Issued' && new Date(i.dueDate) < new Date()).length;
    const totalFines = childIssues.reduce((sum, i) => sum + (i.fine || 0), 0);
    const activeIssues = childIssues.filter(i => i.status === 'Issued').length;

    return (
        <div className={`space-y-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <div className={`flex justify-between items-center ${darkMode ? 'bg-orange-900/20' : 'bg-orange-50'} p-6 rounded-xl`}>
                <div>
                    <h2 className={`text-xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-900'}`}>Child's Library Records</h2>
                    <p className={`text-sm ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>Track book issues and returns for your child</p>
                </div>
                <Book className={`w-8 h-8 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
            </div>

            { }
            {overdueCount > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center shadow-sm">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-red-800">Overdue Alert</h3>
                        <p className="text-sm text-red-700">Your child has {overdueCount} overdue book(s). Please ensure they are returned soon to avoid additional fines.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border p-6 rounded-xl shadow-sm`}>
                    <div className="flex items-center justify-between mb-3">
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Books Currently Issued</p>
                        <BookOpen className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{activeIssues}</p>
                </div>
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border p-6 rounded-xl shadow-sm`}>
                    <div className="flex items-center justify-between mb-3">
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Overdue Books</p>
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <p className={`text-3xl font-bold ${overdueCount > 0 ? 'text-red-500' : (darkMode ? 'text-white' : 'text-gray-900')}`}>{overdueCount}</p>
                </div>
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border p-6 rounded-xl shadow-sm`}>
                    <div className="flex items-center justify-between mb-3">
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Pending Fines</p>
                        <Info className="w-5 h-5 text-orange-500" />
                    </div>
                    <p className={`text-3xl font-bold ${totalFines > 0 ? 'text-red-500' : (darkMode ? 'text-white' : 'text-gray-900')}`}>{rules.currency}{totalFines}</p>
                </div>
            </div>

            {/* Issue History */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl overflow-hidden shadow-sm`}>
                <div className={`p-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Issue History</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Complete borrowing history for your child</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className={`${darkMode ? 'bg-gray-750 text-gray-400' : 'bg-gray-100 text-gray-600'} text-xs uppercase font-semibold`}>
                            <tr>
                                <th className="px-6 py-4">Book Title</th>
                                <th className="px-6 py-4">Issued On</th>
                                <th className="px-6 py-4">Due Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Fine</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {childIssues.map(issue => {
                                const isOverdue = issue.status === 'Issued' && new Date(issue.dueDate) < new Date();

                                return (
                                    <tr key={issue.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                        <td className="px-6 py-4 font-medium">{issue.bookTitle}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {issue.status === 'Requested' ? '-' : new Date(issue.issueDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {issue.status === 'Requested' ? '-' : new Date(issue.dueDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${issue.status === 'Returned' ? 'bg-green-100 text-green-700' :
                                                issue.status === 'Requested' ? 'bg-yellow-100 text-yellow-700' :
                                                    isOverdue ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {issue.status === 'Returned' ? 'Returned' :
                                                    issue.status === 'Requested' ? 'Pending Approval' :
                                                        isOverdue ? 'Overdue' : 'Issued'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-red-500">
                                            {issue.fine > 0 ? `${rules.currency}${issue.fine}` : '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                            {childIssues.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <BookOpen className={`w-16 h-16 mx-auto mb-3 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No records found for your child.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ParentLibraryPage;
