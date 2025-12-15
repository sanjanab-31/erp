import React, { useState } from 'react';
import {
    BookMarked,
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Download,
    Upload,
    BookOpen,
    Users,
    Clock,
    CheckCircle,
    AlertCircle,
    Calendar
} from 'lucide-react';

const LibraryPage = ({ darkMode }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [activeTab, setActiveTab] = useState('books');

    const categories = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'General'];

    const [books, setBooks] = useState([
        {
            id: 1,
            title: 'Advanced Calculus',
            author: 'James Stewart',
            category: 'Mathematics',
            isbn: '978-1285741550',
            totalCopies: 10,
            available: 7,
            issued: 3,
            status: 'available'
        },
        {
            id: 2,
            title: 'Physics for Scientists',
            author: 'Raymond Serway',
            category: 'Physics',
            isbn: '978-1133954057',
            totalCopies: 8,
            available: 5,
            issued: 3,
            status: 'available'
        },
        {
            id: 3,
            title: 'Introduction to Algorithms',
            author: 'Thomas Cormen',
            category: 'Computer Science',
            isbn: '978-0262033848',
            totalCopies: 5,
            available: 0,
            issued: 5,
            status: 'unavailable'
        },
        {
            id: 4,
            title: 'Organic Chemistry',
            author: 'Paula Bruice',
            category: 'Chemistry',
            isbn: '978-0321803221',
            totalCopies: 6,
            available: 4,
            issued: 2,
            status: 'available'
        }
    ]);

    const [issuedBooks, setIssuedBooks] = useState([
        {
            id: 1,
            bookTitle: 'Advanced Calculus',
            studentName: 'John Doe',
            rollNo: '10A-001',
            issueDate: '2025-12-01',
            dueDate: '2025-12-15',
            status: 'active',
            daysLeft: 0
        },
        {
            id: 2,
            bookTitle: 'Physics for Scientists',
            studentName: 'Jane Smith',
            rollNo: '10A-002',
            issueDate: '2025-11-25',
            dueDate: '2025-12-10',
            status: 'overdue',
            daysLeft: -5
        },
        {
            id: 3,
            bookTitle: 'Introduction to Algorithms',
            studentName: 'Mike Wilson',
            rollNo: '11B-015',
            issueDate: '2025-12-05',
            dueDate: '2025-12-20',
            status: 'active',
            daysLeft: 5
        }
    ]);

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.isbn.includes(searchQuery);
        const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const totalBooks = books.reduce((acc, book) => acc + book.totalCopies, 0);
    const totalIssued = books.reduce((acc, book) => acc + book.issued, 0);
    const totalAvailable = books.reduce((acc, book) => acc + book.available, 0);
    const overdueCount = issuedBooks.filter(b => b.status === 'overdue').length;

    return (
        <div className="flex-1 overflow-y-auto p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Library Management
                </h1>
                <p className="text-sm text-gray-500">Manage books and track issued materials</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Books</h3>
                        <BookOpen className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{totalBooks}</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Available</h3>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold text-green-600`}>{totalAvailable}</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Issued</h3>
                        <Users className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{totalIssued}</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Overdue</h3>
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <p className={`text-3xl font-bold text-red-600`}>{overdueCount}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setActiveTab('books')}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'books'
                        ? 'bg-green-600 text-white'
                        : `${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'} hover:bg-green-50`
                        }`}
                >
                    Book Catalog
                </button>
                <button
                    onClick={() => setActiveTab('issued')}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'issued'
                        ? 'bg-green-600 text-white'
                        : `${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'} hover:bg-green-50`
                        }`}
                >
                    Issued Books
                </button>
            </div>

            {/* Book Catalog Tab */}
            {activeTab === 'books' && (
                <>
                    {/* Filters */}
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6`}>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search by title, author, or ISBN..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-gray-50 border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                />
                            </div>

                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className={`px-4 py-2 rounded-lg border ${darkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-gray-50 border-gray-300 text-gray-900'
                                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>

                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                                <Plus className="w-5 h-5" />
                                <span>Add Book</span>
                            </button>
                        </div>
                    </div>

                    {/* Books Table */}
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                                    <tr>
                                        <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                            Book Details
                                        </th>
                                        <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                            Category
                                        </th>
                                        <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                            ISBN
                                        </th>
                                        <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                            Total
                                        </th>
                                        <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                            Available
                                        </th>
                                        <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                            Issued
                                        </th>
                                        <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                            Status
                                        </th>
                                        <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                    {filteredBooks.map((book) => (
                                        <tr key={book.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        {book.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{book.author}</div>
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {book.category}
                                            </td>
                                            <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {book.isbn}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {book.totalCopies}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-sm font-medium text-green-600">
                                                    {book.available}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-sm font-medium text-purple-600">
                                                    {book.issued}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${book.status === 'available'
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-red-100 text-red-600'
                                                    }`}>
                                                    {book.status === 'available' ? 'Available' : 'Unavailable'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button className="text-blue-600 hover:text-blue-900 mr-3">
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Issued Books Tab */}
            {activeTab === 'issued' && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                                <tr>
                                    <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                        Book Title
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                        Student
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                        Issue Date
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                        Due Date
                                    </th>
                                    <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                        Status
                                    </th>
                                    <th className={`px-6 py-4 text-center text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                {issuedBooks.map((book) => (
                                    <tr key={book.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                                        <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {book.bookTitle}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {book.studentName}
                                                </div>
                                                <div className="text-sm text-gray-500">{book.rollNo}</div>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {book.issueDate}
                                        </td>
                                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {book.dueDate}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${book.status === 'overdue'
                                                ? 'bg-red-100 text-red-600'
                                                : 'bg-green-100 text-green-600'
                                                }`}>
                                                {book.status === 'overdue' ? `Overdue (${Math.abs(book.daysLeft)} days)` : `Active (${book.daysLeft} days left)`}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                                Return Book
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LibraryPage;
