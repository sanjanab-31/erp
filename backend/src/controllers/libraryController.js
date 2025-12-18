import mongoose from 'mongoose';

// Book Model
const bookSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    subject: { type: String, required: true },
    category: { type: String, required: true },
    isbn: { type: String },
    quantity: { type: Number, default: 1 },
    available: { type: Number, default: 1 },
    status: { type: String, default: 'Available' },
    coverImage: { type: String }
});

const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);

// Issue Model
const issueSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    bookId: { type: Number, required: true },
    bookTitle: { type: String },
    userId: { type: String, required: true },
    userName: { type: String },
    userRole: { type: String, default: 'Student' },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date },
    status: { type: String, default: 'Issued' }, // Issued, Returned, Overdue
    fine: { type: Number, default: 0 }
});

const Issue = mongoose.models.Issue || mongoose.model('Issue', issueSchema);

// Controllers
export const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json({ success: true, data: books });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createBook = async (req, res) => {
    try {
        const newBook = await Book.create({
            id: Date.now(),
            ...req.body
        });
        res.status(201).json({ success: true, data: newBook });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findOneAndUpdate({ id }, req.body, { new: true });
        res.json({ success: true, data: book });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        await Book.findOneAndDelete({ id });
        res.json({ success: true, message: 'Book deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllIssues = async (req, res) => {
    try {
        const issues = await Issue.find().sort({ issueDate: -1 });
        res.json({ success: true, data: issues });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const issueBook = async (req, res) => {
    try {
        const issueData = req.body;
        const newIssue = await Issue.create({
            id: Date.now(),
            ...issueData,
            status: 'Issued'
        });

        // Decrease available copies
        await Book.findOneAndUpdate(
            { id: issueData.bookId },
            { $inc: { available: -1 } }
        );

        res.status(201).json({ success: true, data: newIssue });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const returnBook = async (req, res) => {
    try {
        const { id } = req.params;
        const issue = await Issue.findOne({ id });
        if (!issue) return res.status(404).json({ message: 'Issue record not found' });

        issue.returnDate = new Date();
        issue.status = 'Returned';
        await issue.save();

        // Increase available copies
        await Book.findOneAndUpdate(
            { id: issue.bookId },
            { $inc: { available: 1 } }
        );

        res.json({ success: true, data: issue });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getLibraryStats = async (req, res) => {
    try {
        const bookStats = await Book.aggregate([
            {
                $group: {
                    _id: null,
                    totalBooks: { $sum: "$quantity" },
                    availableBooks: { $sum: "$available" }
                }
            }
        ]);

        const issuedBooks = await Issue.countDocuments({ status: 'Issued' });

        const fineStats = await Issue.aggregate([
            {
                $group: {
                    _id: null,
                    totalFines: { $sum: "$fine" }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                totalBooks: bookStats[0]?.totalBooks || 0,
                availableBooks: bookStats[0]?.availableBooks || 0,
                issuedBooks,
                pendingFines: fineStats[0]?.totalFines || 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Library Settings Model
const librarySettingsSchema = new mongoose.Schema({
    maxBooksPerUser: { type: Number, default: 3 },
    issueDurationDays: { type: Number, default: 14 },
    finePerDay: { type: Number, default: 5 }
});

const LibrarySettings = mongoose.models.LibrarySettings || mongoose.model('LibrarySettings', librarySettingsSchema);

export const getLibrarySettings = async (req, res) => {
    try {
        let settings = await LibrarySettings.findOne();
        if (!settings) {
            settings = await LibrarySettings.create({});
        }
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateLibrarySettings = async (req, res) => {
    try {
        const settings = await LibrarySettings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
