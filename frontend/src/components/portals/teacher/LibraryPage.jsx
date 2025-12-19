import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    Book,
    BookOpen,
    Search,
    Clock,
    CheckCircle,
    Info,
    Calendar,
    Filter
} from 'lucide-react';
import { libraryApi } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

const TeacherLibraryPage = () => {
    const { darkMode } = useOutletContext();
    const { showSuccess, showError } = useToast();
    const [activeTab, setActiveTab] = useState('browse');
    const [books, setBooks] = useState([]);
    const [myIssues, setMyIssues] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [rules, setRules] = useState({ currency: '₹', maxBooks: 3, issueDays: 14 });
    const [user] = useState({
        email: localStorage.getItem('userEmail') || 'teacher@eshwar.com',
        name: localStorage.getItem('userName') || 'Teacher',
        role: 'Teacher'
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [booksRes, issuesRes, statsRes] = await Promise.all([
                    libraryApi.getAllBooks(),
                    libraryApi.getAllIssues({ userEmail: user.email }),
                    libraryApi.getStats()
                ]);

                setBooks(Array.isArray(booksRes.data?.data) ? booksRes.data.data : (Array.isArray(booksRes.data) ? booksRes.data : []));
                setMyIssues(Array.isArray(issuesRes.data?.data) ? issuesRes.data.data : (Array.isArray(issuesRes.data) ? issuesRes.data : []));
                if (statsRes.data?.rules) {
                    setRules(statsRes.data.rules);
                }
            } catch (error) {
                console.error('Error loading library data:', error);
            }
        };

        loadData();
    }, [user.email]);

    const handleIssueBook = async (book) => {
        if (window.confirm(`Issue "${book.title}" to yourself?`)) {
            try {
                await libraryApi.issueBook({
                    bookId: book.id,
                    userEmail: user.email,
                    userName: user.name,
                    userRole: user.role
                });
                showSuccess('Book issued successfully!');

                const [booksRes, issuesRes] = await Promise.all([
                    libraryApi.getAllBooks(),
                    libraryApi.getAllIssues({ userEmail: user.email })
                ]);
                setBooks(Array.isArray(booksRes.data?.data) ? booksRes.data.data : (Array.isArray(booksRes.data) ? booksRes.data : []));
                setMyIssues(Array.isArray(issuesRes.data?.data) ? issuesRes.data.data : (Array.isArray(issuesRes.data) ? issuesRes.data : []));
            } catch (error) {
                showError(error.message);
            }
        }
    };

    const filteredBooks = books.filter(b =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex-1 overflow-y-auto p-8">
            <div className="flex justify-between items-center bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 mb-6 hover:shadow-lg transition-all duration-200 group">
                <div>
                    <h2 className="text-2xl font-bold text-green-900">Teacher Library Portal</h2>
                    <p className="text-sm text-green-700 mt-1">Browse and issue books for your reference</p>
                </div>
                <Book className="w-10 h-10 text-green-600 group-hover:scale-110 transition-transform duration-200" />
            </div>

            { }
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-6 shadow-sm">
                <button
                    onClick={() => setActiveTab('browse')}
                    className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'browse' ? 'bg-white shadow-md text-green-600 scale-105' : 'text-gray-600 hover:text-gray-900'}`}
                >
                    Browse Books ({books.length})
                </button>
                <button
                    onClick={() => setActiveTab('myIssues')}
                    className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'myIssues' ? 'bg-white shadow-md text-green-600 scale-105' : 'text-gray-600 hover:text-gray-900'}`}
                >
                    My Issued Books ({myIssues.filter(i => i.status === 'Issued').length})
                </button>
            </div>

            { }
            {activeTab === 'browse' && (
                <div className="space-y-6">
                    <div className="relative max-w-2xl">
                        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by title, author, or subject..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-11 pr-4 py-3 text-sm rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 shadow-sm hover:shadow-md`}
                        />
                    </div>

                    {filteredBooks.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>No books found. {searchQuery ? 'Try a different search.' : 'The library is empty.'}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredBooks.map(book => (
                                <div key={book.id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 group`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-green-50 rounded-lg text-green-600 group-hover:scale-110 transition-transform duration-200">
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${book.available > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {book.available > 0 ? `${book.available} Available` : 'Out of Stock'}
                                        </span>
                                    </div>
                                    <h3 className={`font-bold text-lg mb-2 line-clamp-1 ${darkMode ? 'text-white' : 'text-gray-900'}`} title={book.title}>{book.title}</h3>
                                    <p className="text-sm text-gray-500 mb-3">by {book.author}</p>

                                    <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                                        <span className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-3 py-1.5 rounded-full font-medium`}>{book.subject}</span>
                                        <span className="font-medium">{book.category}</span>
                                    </div>

                                    <div className="text-xs text-gray-400 mb-4 font-mono">
                                        ISBN: {book.isbn || 'N/A'}
                                    </div>

                                    <button
                                        onClick={() => handleIssueBook(book)}
                                        disabled={book.available <= 0}
                                        className={`w-full py-2.5 rounded-lg font-medium transition-all duration-200 ${book.available > 0
                                            ? 'bg-green-600 text-white hover:bg-green-700 hover:scale-105 shadow-sm hover:shadow-md'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {book.available > 0 ? 'Issue Book' : 'Unavailable'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'myIssues' && (
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200`}>
                    <table className="w-full text-left">
                        <thead className={`${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'} text-xs uppercase font-semibold`}>
                            <tr>
                                <th className="px-6 py-4">Book</th>
                                <th className="px-6 py-4">Issue Date</th>
                                <th className="px-6 py-4">Due Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Fine</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {myIssues.map(issue => {
                                const isOverdue = issue.status === 'Issued' && new Date(issue.dueDate) < new Date();
                                return (
                                    <tr key={issue.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-all duration-200`}>
                                        <td className={`px-6 py-4 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{issue.bookTitle}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(issue.issueDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(issue.dueDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${issue.status === 'Returned' ? 'bg-green-100 text-green-700' :
                                                isOverdue ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {issue.status === 'Returned' ? 'Returned' : isOverdue ? 'Overdue' : 'Issued'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-red-500">
                                            {issue.fine > 0 ? `${rules.currency}${issue.fine}` : '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                            {myIssues.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                        <p className="font-medium">No books issued yet.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TeacherLibraryPage;
