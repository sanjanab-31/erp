


const STORAGE_KEY_BOOKS = 'erp_library_books';
const STORAGE_KEY_ISSUES = 'erp_library_issues';
const STORAGE_KEY_RULES = 'erp_library_rules';


const DEFAULT_RULES = {
    maxBooksPerUser: 3,
    issueDurationDays: 14,
    finePerDay: 5, 
    currency: '₹'
};


const initializeDefaultData = () => {
    
    if (!localStorage.getItem(STORAGE_KEY_BOOKS)) {
        const defaultBooks = [
            {
                id: 1,
                title: 'Introduction to Physics',
                author: 'H.C. Verma',
                subject: 'Physics',
                isbn: '978-8177091878',
                quantity: 10,
                available: 8,
                category: 'Science',
                type: 'Textbook',
                addedAt: new Date().toISOString()
            },
            {
                id: 2,
                title: 'Organic Chemistry',
                author: 'Morrison & Boyd',
                subject: 'Chemistry',
                isbn: '978-8131704813',
                quantity: 5,
                available: 5,
                category: 'Science',
                type: 'Reference',
                addedAt: new Date().toISOString()
            },
            {
                id: 3,
                title: 'Mathematics for Class 10',
                author: 'R.D. Sharma',
                subject: 'Mathematics',
                isbn: '978-8193663004',
                quantity: 15,
                available: 12,
                category: 'Mathematics',
                type: 'Textbook',
                addedAt: new Date().toISOString()
            }
        ];
        localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(defaultBooks));
    }

    
    if (!localStorage.getItem(STORAGE_KEY_ISSUES)) {
        localStorage.setItem(STORAGE_KEY_ISSUES, JSON.stringify([]));
    }

    
    if (!localStorage.getItem(STORAGE_KEY_RULES)) {
        localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(DEFAULT_RULES));
    }
};



export const getAllBooks = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY_BOOKS);
        if (!data) {
            initializeDefaultData();
            return JSON.parse(localStorage.getItem(STORAGE_KEY_BOOKS));
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Error getting books:', error);
        return [];
    }
};

export const addBook = (bookData) => {
    try {
        const books = getAllBooks();
        const newBook = {
            id: Date.now(),
            ...bookData,
            available: bookData.quantity, 
            addedAt: new Date().toISOString()
        };
        books.push(newBook);
        localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(books));
        window.dispatchEvent(new Event('libraryUpdated'));
        return newBook;
    } catch (error) {
        console.error('Error adding book:', error);
        throw error;
    }
};

export const updateBook = (bookId, updates) => {
    try {
        const books = getAllBooks();
        const index = books.findIndex(b => b.id === bookId);
        if (index === -1) throw new Error('Book not found');

        
        if (updates.quantity !== undefined) {
            const diff = updates.quantity - books[index].quantity;
            books[index].available += diff;
        }

        books[index] = { ...books[index], ...updates };
        localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(books));
        window.dispatchEvent(new Event('libraryUpdated'));
        return books[index];
    } catch (error) {
        console.error('Error updating book:', error);
        throw error;
    }
};

export const deleteBook = (bookId) => {
    try {
        const books = getAllBooks();
        const filteredBooks = books.filter(b => b.id !== bookId);
        localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(filteredBooks));
        window.dispatchEvent(new Event('libraryUpdated'));
        return true;
    } catch (error) {
        console.error('Error deleting book:', error);
        throw error;
    }
};



export const getAllIssues = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY_ISSUES);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting issues:', error);
        return [];
    }
};

export const issueBook = (bookId, user, rules = null, status = 'Issued') => {
    try {
        const books = getAllBooks();
        const bookIndex = books.findIndex(b => b.id === bookId);
        if (bookIndex === -1) throw new Error('Book not found');
        if (books[bookIndex].available <= 0 && status === 'Issued') throw new Error('Book not available');
        

        const activeRules = rules || getLibraryRules();
        const issueDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + activeRules.issueDurationDays);

        const newIssue = {
            id: Date.now(),
            bookId,
            bookTitle: books[bookIndex].title,
            userId: user.id, 
            userName: user.name,
            userRole: user.role, 
            issueDate: issueDate.toISOString(),
            dueDate: dueDate.toISOString(),
            status: status, 
            fine: 0
        };

        
        if (status === 'Issued') {
            books[bookIndex].available -= 1;
            localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(books));
        }

        
        const issues = getAllIssues();
        issues.push(newIssue);
        localStorage.setItem(STORAGE_KEY_ISSUES, JSON.stringify(issues));

        window.dispatchEvent(new Event('libraryUpdated'));
        return newIssue;
    } catch (error) {
        console.error('Error issuing book:', error);
        throw error;
    }
};

export const updateIssueStatus = (issueId, newStatus) => {
    try {
        const issues = getAllIssues();
        const issueIndex = issues.findIndex(i => i.id === issueId);
        if (issueIndex === -1) throw new Error('Issue record not found');

        const issue = issues[issueIndex];
        const oldStatus = issue.status;

        
        if (oldStatus === 'Requested' && newStatus === 'Issued') {
            const books = getAllBooks();
            const bookIndex = books.findIndex(b => b.id === issue.bookId);
            if (bookIndex !== -1) {
                if (books[bookIndex].available <= 0) throw new Error('Book not available for issue');
                books[bookIndex].available -= 1;
                localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(books));
            }
        }

        

        issue.status = newStatus;
        if (newStatus === 'Issued') {
            
            const rules = getLibraryRules();
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + rules.issueDurationDays);
            issue.dueDate = dueDate.toISOString();
            issue.issueDate = new Date().toISOString();
        }

        issues[issueIndex] = issue;
        localStorage.setItem(STORAGE_KEY_ISSUES, JSON.stringify(issues));
        window.dispatchEvent(new Event('libraryUpdated'));
        return issue;
    } catch (error) {
        console.error('Error updating issue status:', error);
        throw error;
    }
};

export const returnBook = (issueId) => {
    try {
        const issues = getAllIssues();
        const issueIndex = issues.findIndex(i => i.id === issueId);
        if (issueIndex === -1) throw new Error('Issue record not found');

        const issue = issues[issueIndex];
        if (issue.status === 'Returned') throw new Error('Book already returned');

        
        const fine = calculateFine(issue.dueDate);

        issue.returnDate = new Date().toISOString();
        issue.status = 'Returned';
        issue.fine = fine;

        issues[issueIndex] = issue;
        localStorage.setItem(STORAGE_KEY_ISSUES, JSON.stringify(issues));

        
        const books = getAllBooks();
        const bookIndex = books.findIndex(b => b.id === issue.bookId);
        if (bookIndex !== -1) {
            books[bookIndex].available += 1;
            localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(books));
        }

        window.dispatchEvent(new Event('libraryUpdated'));
        return issue;
    } catch (error) {
        console.error('Error returning book:', error);
        throw error;
    }
};



export const getLibraryRules = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY_RULES);
        return data ? JSON.parse(data) : DEFAULT_RULES;
    } catch (error) {
        return DEFAULT_RULES;
    }
};

export const updateLibraryRules = (newRules) => {
    localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(newRules));
    window.dispatchEvent(new Event('libraryUpdated'));
    return newRules;
};

export const calculateFine = (dueDateStr) => {
    const rules = getLibraryRules();
    const dueDate = new Date(dueDateStr);
    const today = new Date();

    
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (today <= dueDate) return 0;

    const diffTime = Math.abs(today - dueDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays * rules.finePerDay;
};



export const getIssuesByUser = (userId) => {
    const issues = getAllIssues();
    
    return issues.filter(i => i.userId === userId).map(issue => {
        if (issue.status === 'Issued') {
            issue.fine = calculateFine(issue.dueDate);
        }
        return issue;
    });
};

export const getLibraryStats = () => {
    const books = getAllBooks();
    const issues = getAllIssues();
    const activeIssues = issues.filter(i => i.status === 'Issued');

    let totalFineCollected = 0;
    let pendingFines = 0;

    issues.forEach(i => {
        if (i.status === 'Returned') totalFineCollected += (i.fine || 0);
        else pendingFines += calculateFine(i.dueDate);
    });

    return {
        totalBooks: books.reduce((sum, b) => sum + b.quantity, 0),
        availableBooks: books.reduce((sum, b) => sum + b.available, 0),
        issuedBooks: activeIssues.length,
        totalFineCollected,
        pendingFines
    };
};

export const subscribeToUpdates = (callback) => {
    const handler = () => {
        callback({
            books: getAllBooks(),
            issues: getAllIssues(),
            rules: getLibraryRules(),
            stats: getLibraryStats()
        });
    };
    window.addEventListener('libraryUpdated', handler);
    return () => window.removeEventListener('libraryUpdated', handler);
};


initializeDefaultData();

export default {
    getAllBooks,
    addBook,
    updateBook,
    deleteBook,
    getAllIssues,
    issueBook,
    returnBook,
    getLibraryRules,
    updateLibraryRules,
    calculateFine,
    getIssuesByUser,
    getLibraryStats,
    updateIssueStatus,
    subscribeToUpdates
};
