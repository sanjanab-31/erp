import React, { useState, useEffect, useCallback } from 'react';
import {
    Book,
    BookOpen,
    Plus,
    Search,
    Edit2,
    Trash2,
    AlertCircle,
    CheckCircle,
    Clock,
    IndianRupee,
    Settings,
    MoreVertical,
    FileText,
    Users,
    Filter,
    X
} from 'lucide-react';
import { libraryApi } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

const LibraryPage = ({ darkMode }) => {
    const { showSuccess, showError, showWarning } = useToast();
    const [activeTab, setActiveTab] = useState('books');
    const [books, setBooks] = useState([]);
    const [issues, setIssues] = useState([]);
    const [rules, setRules] = useState({ maxBooksPerUser: 3, issueDurationDays: 14, finePerDay: 5 });
    const [stats, setStats] = useState({ totalBooks: 0, availableBooks: 0, issuedBooks: 0, pendingFines: 0 });
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);

    const loadData = useCallback(async () => {
        try {
            const [booksRes, issuesRes] = await Promise.all([
                libraryApi.getAllBooks(),
                libraryApi.getAllIssues(),

            ]);

            setBooks(booksRes.data?.data || []);
            setIssues(issuesRes.data?.data || []);

            try {
                const statsRes = await libraryApi.getStats();
                setStats(statsRes.data?.data || { totalBooks: 0, availableBooks: 0, issuedBooks: 0, pendingFines: 0 });
            } catch (e) {

                const b = booksRes.data?.data || [];
                const i = issuesRes.data?.data || [];
                setStats({
                    totalBooks: b.reduce((acc, book) => acc + (book.quantity || 1), 0),
                    availableBooks: b.reduce((acc, book) => acc + (book.available || 0), 0),
                    issuedBooks: i.filter(x => x.status === 'Issued').length,
                    pendingFines: 0
                });
            }

            try {
                const rulesRes = await libraryApi.getSettings();
                setRules(rulesRes.data?.data || rules);
            } catch (e) {

            }

        } catch (error) {
            console.error('Failed to load library data', error);
        }
    }, [rules]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const calculateFine = (dueDate) => {
        if (!dueDate) return 0;
        const due = new Date(dueDate);
        const today = new Date();
        if (today <= due) return 0;
        const diffTime = Math.abs(today - due);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays * (rules.finePerDay || 0);
    };

    const handleAction = (action, item = null) => {
        setModalType(action);
        setSelectedBook(item);
        setShowModal(true);
    };

    const handleDeleteBook = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await libraryApi.deleteBook(id);
                showSuccess('Book deleted successfully');
                loadData();
            } catch (error) {
                showError('Failed to delete book: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleReturnBook = async (issueId) => {
        if (window.confirm('Confirm return of this book?')) {
            try {
                await libraryApi.returnBook(issueId);
                showSuccess('Book returned successfully');
                loadData();
            } catch (error) {
                showError('Failed to return book: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleApproveRequest = async (issueId) => {
        try {
            await libraryApi.updateIssueStatus(issueId, 'Issued');
            showSuccess('Request approved');
            loadData();
        } catch (error) {
            showError(error.message);
        }
    };

    const handleRejectRequest = async (issueId) => {
        if (window.confirm('Reject this request?')) {
            try {
                await libraryApi.updateIssueStatus(issueId, 'Rejected');
                showSuccess('Request rejected');
                loadData();
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

    const filteredIssues = issues.filter(i =>
        (i.bookTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (i.userName || '').toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));

    const Modal = () => {
        const [formData, setFormData] = useState(
            selectedBook || {
                title: '',
                author: '',
                subject: '',
                isbn: '',
                quantity: 1,
                category: 'General',
                type: 'Book'
            }
        );

        const [issueData, setIssueData] = useState({
            userId: '',
            userName: '',
            userRole: 'Student'
        });

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                if (modalType === 'addBook') {
                    await libraryApi.createBook(formData);
                    showSuccess('Book added successfully');
                } else if (modalType === 'editBook') {
                    await libraryApi.updateBook(selectedBook.id, formData);
                    showSuccess('Book updated successfully');
                } else if (modalType === 'issueBook') {
                    if (!issueData.userId) {
                        showWarning('User ID is required');
                        return;
                    }

                    await libraryApi.issueBook({
                        bookId: selectedBook.id,
                        userId: issueData.userId,
                        userName: issueData.userName || issueData.userId,
                        userRole: issueData.userRole,
                        issueDate: new Date().toISOString(),
                        dueDate: new Date(Date.now() + (rules.issueDurationDays * 24 * 60 * 60 * 1000)).toISOString()
                    });
                    showSuccess('Book issued successfully');
                }
                setShowModal(false);
                loadData();
            } catch (error) {
                showError(error.response?.data?.message || 'Operation failed');
            }
        };

        if (modalType === 'settings') {
            const [rulesData, setRulesData] = useState(rules);
            return (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-md w-full p-6`}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Library Settings</h2>
                            <button onClick={() => setShowModal(false)}><X className="text-gray-500" /></button>
                        </div>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                await libraryApi.updateSettings(rulesData);
                                setRules(rulesData);
                                showSuccess('Settings updated');
                                setShowModal(false);
                            } catch (err) {
                                showError('Failed to update settings');
                            }
                        }} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Max Books Per User</label>
                                <input type="number" value={rulesData.maxBooksPerUser} onChange={e => setRulesData({ ...rulesData, maxBooksPerUser: parseInt(e.target.value) })} className="w-full p-2 border rounded-lg " />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Issue Duration (Days)</label>
                                <input type="number" value={rulesData.issueDurationDays} onChange={e => setRulesData({ ...rulesData, issueDurationDays: parseInt(e.target.value) })} className="w-full p-2 border rounded-lg " />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Fine Per Day</label>
                                <input type="number" value={rulesData.finePerDay} onChange={e => setRulesData({ ...rulesData, finePerDay: parseInt(e.target.value) })} className="w-full p-2 border rounded-lg " />
                            </div>
                            <button type="submit" className="w-full py-2 bg-purple-600 text-white rounded-lg">Save Settings</button>
                        </form>
                    </div>
                </div>
            )
        }

        return (
            <div className="fixed inset-0  bg-black/50 backdrop-blur-sm  flex items-center justify-center z-50 p-4">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-lg w-full p-6`}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {modalType === 'addBook' ? 'Add New Book' : modalType === 'editBook' ? 'Edit Book' : 'Issue Book'}
                        </h2>
                        <button onClick={() => setShowModal(false)}><X className="text-gray-500" /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {modalType === 'issueBook' ? (
                            <>
                                <div className="p-4 bg-purple-50 rounded-lg mb-4">
                                    <p className="text-sm text-purple-800 font-medium">Issuing: {selectedBook?.title}</p>
                                    <p className="text-xs text-purple-600">Available copies: {selectedBook?.available}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">User Email / ID</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                        value={issueData.userId}
                                        onChange={(e) => setIssueData({ ...issueData, userId: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                        value={issueData.userName}
                                        onChange={(e) => setIssueData({ ...issueData, userName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                        value={issueData.userRole}
                                        onChange={(e) => setIssueData({ ...issueData, userRole: e.target.value })}
                                    >
                                        <option value="Student">Student</option>
                                        <option value="Teacher">Teacher</option>
                                    </select>
                                </div>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                        value={formData.isbn}
                                        onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>General</option>
                                        <option>Science</option>
                                        <option>Mathematics</option>
                                        <option>Literature</option>
                                        <option>History</option>
                                        <option>Technology</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option>Book</option>
                                        <option>Textbook</option>
                                        <option>Journal</option>
                                        <option>Reference</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2 border text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:shadow-lg"
                            >
                                {modalType === 'addBook' ? 'Add Book' : modalType === 'editBook' ? 'Update' : 'Issue'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className={`space-y-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            { }
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 shadow-sm`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Total Books</h3>
                        <Book className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className="text-3xl font-bold">{stats.totalBooks}</p>
                    <p className="text-xs text-gray-500 mt-1">{stats.availableBooks} Available</p>
                </div>
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 shadow-sm`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Issued Books</h3>
                        <BookOpen className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold">{stats.issuedBooks}</p>
                    <p className="text-xs text-blue-500 mt-1">Active Issues</p>
                </div>
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 shadow-sm`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Pending Fines</h3>
                        <IndianRupee className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-3xl font-bold">₹{stats.pendingFines}</p>
                    <p className="text-xs text-red-500 mt-1">Uncollected</p>
                </div>
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 shadow-sm cursor-pointer hover:shadow-md transition-all`} onClick={() => handleAction('settings')}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Settings</h3>
                        <Settings className="w-5 h-5 text-gray-500" />
                    </div>
                    <p className="text-lg font-medium">Fines: ₹{rules.finePerDay}/day</p>
                    <p className="text-xs text-gray-500 mt-1">Click to configure</p>
                </div>
            </div>

            { }
            <div className="flex justify-between items-center">
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('books')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'books' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        All Books
                    </button>
                    <button
                        onClick={() => setActiveTab('issues')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'issues' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Issued Books
                    </button>
                    <button
                        onClick={() => setActiveTab('overdue')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'overdue' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Overdue Reports
                    </button>
                </div>

                <div className="flex space-x-3">
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`pl-10 pr-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:outline-none`}
                        />
                    </div>
                    <button
                        onClick={() => handleAction('addBook')}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Book</span>
                    </button>
                </div>
            </div>

            { }
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm overflow-hidden`}>
                {activeTab === 'books' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className={`${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'} text-xs uppercase font-semibold`}>
                                <tr>
                                    <th className="px-6 py-4">Title / Author</th>
                                    <th className="px-6 py-4">Subject</th>
                                    <th className="px-6 py-4">ISBN</th>
                                    <th className="px-6 py-4 text-center">Qty / Avail</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredBooks.map((book) => (
                                    <tr key={book.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                                                    <Book className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{book.title}</div>
                                                    <div className="text-xs text-gray-500">{book.author}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{book.subject}</td>
                                        <td className="px-6 py-4 text-sm font-mono text-gray-500">{book.isbn}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                                                {book.available} / {book.quantity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className="px-2 py-1 rounded-full text-xs bg-purple-50 text-purple-600">
                                                {book.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleAction('issueBook', book)}
                                                className="p-1.5 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                                                title="Issue Book"
                                                disabled={book.available <= 0}
                                            >
                                                <Users className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleAction('editBook', book)}
                                                className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBook(book.id)}
                                                className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredBooks.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                            No books found matching your criteria
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {(activeTab === 'issues' || activeTab === 'overdue') && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className={`${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'} text-xs uppercase font-semibold`}>
                                <tr>
                                    <th className="px-6 py-4">Book Title</th>
                                    <th className="px-6 py-4">Issued To</th>
                                    <th className="px-6 py-4">Issued On</th>
                                    <th className="px-6 py-4">Due Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Fine</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredIssues.filter(i => {
                                    if (activeTab === 'overdue') {
                                        return i.status === 'Issued' && new Date(i.dueDate) < new Date();
                                    }
                                    if (activeTab === 'issues') {
                                        return i.status === 'Issued';
                                    }
                                    return true;
                                }).map((issue) => {
                                    const isOverdue = issue.status === 'Issued' && new Date(issue.dueDate) < new Date();
                                    const currentFine = issue.status === 'Issued' ? calculateFine(issue.dueDate) : issue.fine;

                                    return (
                                        <tr key={issue.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                                            <td className="px-6 py-4 font-medium">{issue.bookTitle}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <div>{issue.userName}</div>
                                                <div className="text-xs text-gray-400">{issue.userId} ({issue.userRole})</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(issue.issueDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(issue.dueDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${issue.status === 'Returned' ? 'bg-green-100 text-green-700' :
                                                    isOverdue ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {issue.status === 'Returned' ? 'Returned' : isOverdue ? 'Overdue' : 'Issued'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-red-500">
                                                {currentFine > 0 ? `₹${currentFine}` : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {issue.status === 'Issued' && (
                                                    <button
                                                        onClick={() => handleReturnBook(issue.id)}
                                                        className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                                                    >
                                                        Return
                                                    </button>
                                                )}
                                                {issue.status === 'Requested' && (
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleApproveRequest(issue.id)}
                                                            className="text-sm text-green-600 hover:text-green-800 font-medium"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectRequest(issue.id)}
                                                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && <Modal />}
        </div>
    );
};

export default LibraryPage;
