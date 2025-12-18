import mongoose from 'mongoose';

const libraryBookSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String },
    category: { type: String },
    quantity: { type: Number, default: 1 },
    available: { type: Number, default: 1 },
    location: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('LibraryBook', libraryBookSchema);
