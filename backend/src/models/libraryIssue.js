import mongoose from 'mongoose';

const libraryIssueSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    bookId: { type: Number, required: true },
    studentId: { type: Number, required: true }, // or userId if general
    bookTitle: { type: String },
    studentName: { type: String },
    issuedAt: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnedAt: { type: Date },
    status: { type: String, enum: ['Issued', 'Returned', 'Overdue'], default: 'Issued' },
    fine: { type: Number, default: 0 }
});

export default mongoose.model('LibraryIssue', libraryIssueSchema);
