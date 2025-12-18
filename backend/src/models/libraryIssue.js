import mongoose from 'mongoose';

const libraryIssueSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    bookId: { type: Number, required: true },
    bookTitle: { type: String },
    userId: { type: String, required: true },
    userName: { type: String },
    userRole: { type: String, default: 'Student' },
    issuedAt: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnedAt: { type: Date },
    status: { type: String, enum: ['Issued', 'Returned', 'Overdue'], default: 'Issued' },
    fine: { type: Number, default: 0 }
});

export default mongoose.model('LibraryIssue', libraryIssueSchema);
