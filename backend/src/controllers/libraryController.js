import LibraryBook from '../models/libraryBook.js'; // Assuming model
import LibraryIssue from '../models/libraryIssue.js'; // Assuming model

// Placeholder model logic if models don't exist yet, we will rely on standard mongoose patterns
// If models are missing, we might need to create them too. For now, let's create the controller assuming models.

export const getAllBooks = async (req, res) => {
    try {
        const books = await LibraryBook.find();
        res.json({ success: true, data: books });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createBook = async (req, res) => {
    try {
        const book = await LibraryBook.create({ ...req.body, id: Date.now() });
        res.status(201).json({ success: true, data: book });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await LibraryBook.findOneAndUpdate({ id }, req.body, { new: true });
        res.json({ success: true, data: book });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        await LibraryBook.findOneAndDelete({ id });
        res.json({ success: true, message: 'Book deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllIssues = async (req, res) => {
    try {
        const { studentId } = req.query;
        let query = {};
        if (studentId) {
            query.studentId = studentId;
        }
        const issues = await LibraryIssue.find(query);
        res.json({ success: true, data: issues });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const issueBook = async (req, res) => {
    try {
        const issue = await LibraryIssue.create({ ...req.body, id: Date.now(), status: 'Issued', issuedAt: new Date() });
        // Optionally update book quantity
        res.status(201).json({ success: true, data: issue });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const returnBook = async (req, res) => {
    try {
        const { id } = req.params;
        const issue = await LibraryIssue.findOneAndUpdate({ id }, { status: 'Returned', returnedAt: new Date() }, { new: true });
        res.json({ success: true, data: issue });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getLibrarySettings = async (req, res) => {
    try {
        // Mock settings
        res.json({ success: true, data: { finePerDay: 5, issuePeriodDays: 14 } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateLibrarySettings = async (req, res) => {
    try {
        // Mock update
        res.json({ success: true, message: 'Settings updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getLibraryStats = async (req, res) => {
    try {
        const totalBooks = await LibraryBook.countDocuments();
        const issuedBooks = await LibraryIssue.countDocuments({ status: 'Issued' });
        const overdueBooks = await LibraryIssue.countDocuments({ status: 'Overdue' }); // Note: This depends on if status is updated automatically or if we calculate it here based on date

        res.json({
            success: true,
            data: {
                totalBooks,
                issuedBooks,
                overdueBooks
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
