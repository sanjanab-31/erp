import React, { useState, useEffect } from 'react';
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
import * as libraryStore from '../../../utils/libraryStore';
import { useToast } from '../../../context/ToastContext';

const TeacherLibraryPage = ({ darkMode }) => {
    const { showSuccess, showError } = useToast();
    const [activeTab, setActiveTab] = useState('browse');
    const [books, setBooks] = useState([]);
    const [myIssues, setMyIssues] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [rules, setRules] = useState(libraryStore.getLibraryRules());
    const [user] = useState({
        email: localStorage.getItem('userEmail') || 'teacher@eshwar.com',
        name: localStorage.getItem('userName') || 'Teacher',
        role: 'Teacher'
    });

    useEffect(() => {
        console.log('TeacherLibrary: Loading data for user:', user.email);

        const loadData = () => {
            const allBooks = libraryStore.getAllBooks();
            const userIssues = libraryStore.getIssuesByUser(user.email);
            const currentRules = libraryStore.getLibraryRules();

            console.log('TeacherLibrary: Loaded books:', allBooks.length);
            console.log('TeacherLibrary: Loaded issues:', userIssues.length);

            setBooks(allBooks);
            setMyIssues(userIssues);
            setRules(currentRules);
        };

        loadData();
        const unsubscribe = libraryStore.subscribeToUpdates(() => {
            console.log('TeacherLibrary: Received update event');
            loadData();
        });

        return () => unsubscribe();
    }, [user.email]);

    const handleIssueBook = (book) => {
        if (window.confirm(`Issue "${book.title}" to yourself?`)) {
            try {
                libraryStore.issueBook(book.id, {
                    id: user.email,
                    name: user.name,
                    role: user.role
                });
                showSuccess('Book issued successfully!');
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
        <div className={`space-y-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <div className="flex justify-between items-center bg-green-50 p-4 rounded-xl border border-green-100">
                <div>
                    <h2 className="text-xl font-bold text-green-900">Teacher Library Portal</h2>
                    <p className="text-sm text-green-700">Browse and issue books for your reference</p>
                </div>
                <Book className="w-8 h-8 text-green-600" />
            </div>

            {}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab('browse')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'browse' ? 'bg-white shadow-sm text-green-600' : 'text-gray-600'}`}
                >
                    Browse Books ({books.length})
                </button>
                <button
                    onClick={() => setActiveTab('myIssues')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'myIssues' ? 'bg-white shadow-sm text-green-600' : 'text-gray-600'}`}
                >
                    My Issued Books ({myIssues.filter(i => i.status === 'Issued').length})
                </button>
            </div>

            {}
            {activeTab === 'browse' && (
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by title, author, or subject..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} focus:ring-2 focus:ring-green-500 outline-none`}
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
                                <div key={book.id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-5 hover:shadow-lg transition-shadow`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${book.available > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {book.available > 0 ? `${book.available} Available` : 'Out of Stock'}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg mb-1 line-clamp-1" title={book.title}>{book.title}</h3>
                                    <p className="text-sm text-gray-500 mb-2">by {book.author}</p>

                                    <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                                        <span className="bg-gray-100 px-2 py-1 rounded">{book.subject}</span>
                                        <span>{book.category}</span>
                                    </div>

                                    <div className="text-xs text-gray-400 mb-3">
                                        ISBN: {book.isbn || 'N/A'}
                                    </div>

                                    <button
                                        onClick={() => handleIssueBook(book)}
                                        disabled={book.available <= 0}
                                        className={`w-full py-2 rounded-lg font-medium transition-colors ${book.available > 0
                                            ? 'bg-green-600 text-white hover:bg-green-700'
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
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl overflow-hidden`}>
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
                        <tbody className="divide-y divide-gray-200">
                            {myIssues.map(issue => {
                                const isOverdue = issue.status === 'Issued' && new Date(issue.dueDate) < new Date();
                                return (
                                    <tr key={issue.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                        <td className="px-6 py-4 font-medium">{issue.bookTitle}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(issue.issueDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(issue.dueDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${issue.status === 'Returned' ? 'bg-green-100 text-green-700' :
                                                isOverdue ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {issue.status === 'Returned' ? 'Returned' : isOverdue ? 'Overdue' : 'Issued'}
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
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                        No books issued yet.
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
