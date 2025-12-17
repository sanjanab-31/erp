import mongoose from "mongoose";

const feeSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    studentId: {
        type: Number,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    studentClass: {
        type: String,
        required: true
    },
    feeType: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Partial', 'Paid', 'Overdue'],
        default: 'Pending'
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    remainingAmount: {
        type: Number,
        required: true
    },
    payments: [{
        amount: Number,
        paymentMethod: String,
        transactionId: String,
        paymentDate: Date,
        paidBy: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Fee = mongoose.model('Fee', feeSchema);
export default Fee;
