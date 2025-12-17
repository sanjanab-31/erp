import React, { useState, useEffect } from 'react';
import {
    Book,
    BookOpen,
    AlertTriangle,
    CheckCircle,
    Info
} from 'lucide-react';
import { libraryApi, studentApi } from '../../../services/api';

const ParentLibraryPage = ({ darkMode }) => {
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

                const studentRes = await studentApi.getAll();
                const students = studentRes.data || [];
                const child = students.find(s => s.parentEmail === parentEmail || s.guardianEmail === parentEmail || s.email === parentEmail);

                if (child) {

                    const res = await libraryApi.getAllIssues();
                    const allIssues = res.data || [];
                    const childRecords = allIssues.filter(i =>
                        i.userId === child.email || i.studentId === child.id
                    );
                    setChildIssues(childRecords);
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
            <div className="flex justify-between items-center bg-orange-50 p-4 rounded-xl border border-orange-100">
                <div>
                    <h2 className="text-xl font-bold text-orange-900">Child's Library Records</h2>
                    <p className="text-sm text-orange-700">Track book issues and returns for your child</p>
                </div>
                <Book className="w-8 h-8 text-orange-600" />
            </div>

            {}
            {overdueCount > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center shadow-sm">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-red-800">Overdue Alert</h3>
                        <p className="text-sm text-red-700">Your child has {overdueCount} overdue book(s). Please ensure they are returned soon to avoid additional fines.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border p-4 rounded-xl`}>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-500 text-sm">Books Currently Issued</p>
                        <BookOpen className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold">{activeIssues}</p>
                </div>
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border p-4 rounded-xl`}>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-500 text-sm">Overdue Books</p>
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-2xl font-bold text-red-500">{overdueCount}</p>
                </div>
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border p-4 rounded-xl`}>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-500 text-sm">Total Pending Fines</p>
                        <Info className="w-5 h-5 text-orange-500" />
                    </div>
                    <p className="text-2xl font-bold text-red-500">{rules.currency}{totalFines}</p>
                </div>
            </div>

            {}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl overflow-hidden`}>
                <div className="p-4 border-b">
                    <h3 className="font-bold">Issue History</h3>
                    <p className="text-sm text-gray-500 mt-1">Complete borrowing history for your child</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className={`${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'} text-xs uppercase font-semibold`}>
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
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                        No records found for your child.
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
