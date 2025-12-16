import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, AlertCircle, CheckCircle, Search, Plus } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

const LibraryPage = ({ darkMode }) => {
    const { showSuccess, showError, showWarning, showInfo } = useToast();
    const [activeTab, setActiveTab] = useState('Browse Books');
    const [searchQuery, setSearchQuery] = useState('');
    const [issuedBooks, setIssuedBooks] = useState([
        {
            id: 1,
            title: 'Advanced Mathematics',
            author: 'John Smith',
            isbn: '978-8123456789',
            category: 'Mathematics',
            availability: '7 / 10',
            status: 'Available',
            issueDate: null,
            dueDate: null
        },
        {
            id: 2,
            title: 'Physics Concepts',
            author: 'Jane Doe',
            isbn: '978-8987654321',
            category: 'Physics',
            availability: '5 / 8',
            status: 'Available',
            issueDate: null,
            dueDate: null
        },
        {
            id: 3,
            title: 'English Literature Classics',
            author: 'William Shakespeare',
            isbn: '978-8456789123',
            category: 'Literature',
            availability: '12 / 15',
            status: 'Available',
            issueDate: null,
            dueDate: null
        }
    ]);

    const [myBooks, setMyBooks] = useState([
        {
            id: 101,
            title: 'Chemistry Fundamentals',
            author: 'Dr. Robert Brown',
            isbn: '978-8111222333',
            category: 'Chemistry',
            issueDate: '2025-12-01',
            dueDate: '2025-12-29',
            status: 'Issued'
        },
        {
            id: 102,
            title: 'World History',
            author: 'Prof. Sarah Johnson',
            isbn: '978-8444555666',
            category: 'History',
            issueDate: '2025-12-05',
            dueDate: '2026-01-02',
            status: 'Issued'
        },
        {
            id: 103,
            title: 'Computer Science Basics',
            author: 'Mark Anderson',
            isbn: '978-8777888999',
            category: 'Computer Science',
            issueDate: '2025-11-20',
            dueDate: '2025-12-18',
            status: 'Overdue'
        }
    ]);

    const [issueHistory, setIssueHistory] = useState([
        {
            id: 201,
            title: 'Biology Essentials',
            author: 'Dr. Emily White',
            issueDate: '2025-11-01',
            returnDate: '2025-11-25',
            status: 'Returned'
        },
        {
            id: 202,
            title: 'Geography Atlas',
            author: 'Michael Green',
            issueDate: '2025-10-15',
            returnDate: '2025-11-10',
            status: 'Returned'
        }
    ]);

    // Library statistics
    const [stats, setStats] = useState({
        booksIssued: 3,
        dueSoon: 0,
        overdue: 1,
        totalFines: 50
    });

    // Calculate real-time stats
    useEffect(() => {
        const calculateStats = () => {
            const currentDate = new Date();
            const threeDaysFromNow = new Date();
            threeDaysFromNow.setDate(currentDate.getDate() + 3);

            let dueSoonCount = 0;
            let overdueCount = 0;

            myBooks.forEach(book => {
                const dueDate = new Date(book.dueDate);
                if (dueDate < currentDate) {
                    overdueCount++;
                } else if (dueDate <= threeDaysFromNow) {
                    dueSoonCount++;
                }
            });

            setStats({
                booksIssued: myBooks.length,
                dueSoon: dueSoonCount,
                overdue: overdueCount,
                totalFines: overdueCount * 50
            });
        };

        calculateStats();
        const interval = setInterval(calculateStats, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [myBooks]);

    const handleIssueBook = (bookId) => {
        const book = issuedBooks.find(b => b.id === bookId);
        if (book && book.status === 'Available') {
            const issueDate = new Date();
            const dueDate = new Date();
            dueDate.setDate(issueDate.getDate() + 28); // 28 days loan period

            const newIssuedBook = {
                ...book,
                id: Date.now(),
                issueDate: issueDate.toISOString().split('T')[0],
                dueDate: dueDate.toISOString().split('T')[0],
                status: 'Issued'
            };

            setMyBooks([...myBooks, newIssuedBook]);
            showSuccess(`Book "${book.title}" has been issued successfully!`);
        }
    };

    const filteredBooks = issuedBooks.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.includes(searchQuery) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderStatsCards = () => (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Books Issued */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Books Issued</h3>
                    <Plus className="w-5 h-5 text-blue-500" />
                </div>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.booksIssued}</p>
                <p className="text-sm text-gray-500 mt-1">Currently borrowed</p>
            </div>

            {/* Due Soon */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Due Soon</h3>
                    <Clock className="w-5 h-5 text-orange-500" />
                </div>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.dueSoon}</p>
                <p className="text-sm text-gray-500 mt-1">Within 3 days</p>
            </div>

            {/* Overdue */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Overdue</h3>
                    <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.overdue}</p>
                <p className="text-sm text-gray-500 mt-1">Return immediately</p>
            </div>

            {/* Total Fines */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-sm border`}>
                <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Fines</h3>
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                </div>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{stats.totalFines}</p>
                <p className="text-sm text-gray-500 mt-1">Pending payment</p>
            </div>
        </div>
    );

    const renderBrowseBooks = () => (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border`}>
            {/* Search Bar */}
            <div className="p-6 border-b border-gray-200">
                <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search books by title, author, or ISBN..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <tr>
                            <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Title</th>
                            <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Author</th>
                            <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>ISBN</th>
                            <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Category</th>
                            <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Availability</th>
                            <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Status</th>
                            <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredBooks.map((book) => (
                            <tr key={book.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                                <td className={`px-6 py-4 ${darkMode ? 'text-white' : 'text-gray-900'} font-medium`}>{book.title}</td>
                                <td className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{book.author}</td>
                                <td className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{book.isbn}</td>
                                <td className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{book.category}</td>
                                <td className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{book.availability}</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
                                        {book.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleIssueBook(book.id)}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Issue Book
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderMyIssuedBooks = () => (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border`}>
            <div className="p-6">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>My Issued Books</h3>
                <div className="space-y-4">
                    {myBooks.map((book) => {
                        const dueDate = new Date(book.dueDate);
                        const currentDate = new Date();
                        const isOverdue = dueDate < currentDate;
                        const daysUntilDue = Math.ceil((dueDate - currentDate) / (1000 * 60 * 60 * 24));

                        return (
                            <div
                                key={book.id}
                                className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{book.title}</h4>
                                        <p className="text-sm text-gray-500 mb-2">{book.author}</p>
                                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                                            <span>ISBN: {book.isbn}</span>
                                            <span>Category: {book.category}</span>
                                        </div>
                                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                                            <span>Issued: {book.issueDate}</span>
                                            <span className={isOverdue ? 'text-red-500 font-semibold' : ''}>
                                                Due: {book.dueDate}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        {isOverdue ? (
                                            <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                                                Overdue
                                            </span>
                                        ) : daysUntilDue <= 3 ? (
                                            <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full">
                                                Due Soon
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    const renderIssueHistory = () => (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border`}>
            <div className="p-6">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Issue History</h3>
                <div className="space-y-4">
                    {issueHistory.map((book) => (
                        <div
                            key={book.id}
                            className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{book.title}</h4>
                                    <p className="text-sm text-gray-500 mb-2">{book.author}</p>
                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                        <span>Issued: {book.issueDate}</span>
                                        <span>Returned: {book.returnDate}</span>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                                    {book.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex-1 overflow-y-auto p-8">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Library Management
                </h1>
                <p className="text-sm text-gray-500">Browse and manage your library books</p>
            </div>

            {/* Stats Cards */}
            {renderStatsCards()}

            {/* Tabs */}
            <div className="mb-6">
                <div className="flex space-x-1 border-b border-gray-200">
                    {['Browse Books', 'My Issued Books', 'Issue History'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === tab
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'Browse Books' && renderBrowseBooks()}
            {activeTab === 'My Issued Books' && renderMyIssuedBooks()}
            {activeTab === 'Issue History' && renderIssueHistory()}
        </div>
    );
};

export default LibraryPage;
