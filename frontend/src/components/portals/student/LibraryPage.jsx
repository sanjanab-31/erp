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
    AlertTriangle
} from 'lucide-react';
import { libraryApi } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

const StudentLibraryPage = () => {
    const { darkMode, student } = useOutletContext();
    const { showSuccess, showError, showWarning } = useToast();
    const [activeTab, setActiveTab] = useState('browse');
    const [books, setBooks] = useState([]);
    const [myIssues, setMyIssues] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [rules] = useState({ currency: '₹' });

    useEffect(() => {
        const loadData = async () => {
            if (!student) return;
            try {
                const [booksRes, issuesRes] = await Promise.all([
                    libraryApi.getAllBooks(),
                    libraryApi.getAllIssues({ studentId: student.id })
                ]);

                if (booksRes.data && Array.isArray(booksRes.data.data)) {
                    setBooks(booksRes.data.data);
                } else {
                    console.error('Unexpected books response:', booksRes);
                    setBooks([]);
                }

                if (issuesRes.data && Array.isArray(issuesRes.data.data)) {
                    setMyIssues(issuesRes.data.data);
                } else {
                    setMyIssues([]);
                }
            } catch (error) {
                console.error('Failed to load library data:', error);
                setBooks([]);
                setMyIssues([]);
            }
        };

        loadData();
    }, [student]);

    const refreshData = async () => {
        if (!student) return;
        try {
            const [booksRes, issuesRes] = await Promise.all([
                libraryApi.getAllBooks(),
                libraryApi.getAllIssues({ studentId: student.id })
            ]);
            setBooks(Array.isArray(booksRes.data?.data) ? booksRes.data.data : []);
            setMyIssues(Array.isArray(issuesRes.data?.data) ? issuesRes.data.data : []);
        } catch (e) {
            console.error(e);
        }
    };

    const handleRequestBook = async (book) => {

        const alreadyHas = myIssues.some(i => i.bookId === book.id && (i.status === 'Issued' || i.status === 'Requested'));
        if (alreadyHas) {
            showWarning('You have already requested or issued this book.');
            return;
        }

        if (window.confirm(`Request "${book.title}" from the library?`)) {
            try {
                await libraryApi.issueBook({
                    bookId: book.id,
                    bookTitle: book.title,
                    studentId: student.id,
                    studentName: student.name,
                    status: 'Requested',
                    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Default 14 days
                    requestDate: new Date().toISOString()
                });
                showSuccess('Book requested successfully! Please collect it from the library once approved.');
                refreshData();
            } catch (error) {
                showError(error.response?.data?.message || 'Failed to request book');
            }
        }
    };

    const filteredBooks = Array.isArray(books) ? books.filter(b =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.subject.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    return (
        <div className={`space-y-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <div className={`flex justify-between items-center p-4 rounded-xl border ${darkMode ? 'bg-blue-900 border-blue-800' : 'bg-blue-50 border-blue-100'}`}>
                <div>
                    <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-blue-900'}`}>Student Library</h2>
                    <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>Request books and track your reading</p>
                </div>
                <Book className={`w-8 h-8 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
            </div>

            { }
            <div className={`flex space-x-1 p-1 rounded-lg w-fit ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <button
                    onClick={() => setActiveTab('browse')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'browse' ? `${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm text-blue-600` : `${darkMode ? 'text-gray-300' : 'text-gray-600'}`}`}
                >
                    Browse Books ({books.length})
                </button>
                <button
                    onClick={() => setActiveTab('myIssues')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'myIssues' ? `${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm text-blue-600` : `${darkMode ? 'text-gray-300' : 'text-gray-600'}`}`}
                >
                    My Records ({myIssues.length})
                </button>
            </div>

            { }
            {activeTab === 'browse' && (
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by title, author, or subject..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none`}
                        />
                    </div>

                    {filteredBooks.length === 0 ? (
                        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>No books found. {searchQuery ? 'Try a different search.' : 'The library is empty.'}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredBooks.map(book => {
                                const alreadyRequested = myIssues.some(i => i.bookId === book.id && (i.status === 'Issued' || i.status === 'Requested'));

                                return (
                                    <div key={book.id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-5 hover:shadow-lg transition-shadow`}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-600'}`}>
                                                <BookOpen className="w-6 h-6" />
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full ${book.available > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {book.available > 0 ? `${book.available} Available` : 'Out of Stock'}
                                            </span>
                                        </div>
                                        <h3 className={`font-bold text-lg mb-1 line-clamp-1 ${darkMode ? 'text-white' : 'text-gray-900'}`} title={book.title}>{book.title}</h3>
                                        <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>by {book.author}</p>

                                        <div className={`flex justify-between items-center text-xs mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            <span className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>{book.subject}</span>
                                            <span>{book.type}</span>
                                        </div>

                                        <div className={`text-xs mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                            ISBN: {book.isbn || 'N/A'}
                                        </div>

                                        <button
                                            onClick={() => handleRequestBook(book)}
                                            disabled={alreadyRequested}
                                            className={`w-full py-2 rounded-lg font-medium transition-colors ${alreadyRequested
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                                }`}
                                        >
                                            {alreadyRequested ? 'Already Requested' : 'Request Book'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'myIssues' && (
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl overflow-hidden`}>
                    <table className="w-full text-left">
                        <thead className={`text-xs uppercase font-semibold ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
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
                                    <tr key={issue.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                        <td className={`px-6 py-4 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{issue.bookTitle}</td>
                                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {issue.status === 'Requested' ? '-' : new Date(issue.issueDate).toLocaleDateString()}
                                        </td>
                                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
                            {myIssues.length === 0 && (
                                <tr>
                                    <td colSpan="5" className={`px-6 py-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                        No books requested or issued yet.
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

export default StudentLibraryPage;
