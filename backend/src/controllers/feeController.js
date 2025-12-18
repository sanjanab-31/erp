import Fee from '../models/feeModel.js';

export const getAllFees = async (req, res) => {
    try {
        const { studentId } = req.query;
        const filter = {};
        if (studentId) filter.studentId = studentId;

        const fees = await Fee.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, data: fees });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getFeesByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const fees = await Fee.find({ studentId });
        res.json({ success: true, data: fees });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addFee = async (req, res) => {
    try {
        const feeData = req.body;
        const newFee = await Fee.create({
            id: Date.now(),
            ...feeData,
            remainingAmount: feeData.amount,
            paidAmount: 0,
            status: 'Pending'
        });
        res.status(201).json({ success: true, data: newFee });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateFee = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const existingFee = await Fee.findOne({ id: Number(id) });
        if (!existingFee) {
            return res.status(404).json({ success: false, message: 'Fee not found' });
        }

        // If amount is changing, we need to recalculate remainingAmount and status
        if (updates.amount !== undefined) {
            const newAmount = Number(updates.amount);
            const currentPaid = existingFee.paidAmount || 0;
            const newRemaining = newAmount - currentPaid;

            updates.remainingAmount = newRemaining;

            if (newRemaining <= 0) {
                updates.status = 'Paid';
            } else if (currentPaid > 0) {
                updates.status = 'Partial';
            } else {
                updates.status = 'Pending';
            }
        }


        const fee = await Fee.findOneAndUpdate({ id: Number(id) }, updates, { new: true });

        res.json({ success: true, data: fee });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const makePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, paymentMethod, transactionId, paidBy } = req.body;

        const fee = await Fee.findOne({ id: Number(id) });
        if (!fee) return res.status(404).json({ success: false, message: 'Fee not found' });

        const newPaidAmount = fee.paidAmount + Number(amount);
        const newRemainingAmount = fee.amount - newPaidAmount;
        let newStatus = newRemainingAmount <= 0 ? 'Paid' : 'Partial';

        const paymentRecord = {
            amount: Number(amount),
            paymentMethod,
            transactionId,
            paymentDate: new Date(),
            paidBy
        };

        fee.paidAmount = newPaidAmount;
        fee.remainingAmount = newRemainingAmount;
        fee.status = newStatus;
        fee.payments.push(paymentRecord);
        fee.updatedAt = new Date();

        await fee.save();

        res.json({ success: true, data: fee });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getFeeStats = async (req, res) => {
    try {
        const totalFees = await Fee.countDocuments();
        const paidFees = await Fee.countDocuments({ status: 'Paid' });
        const partialFees = await Fee.countDocuments({ status: 'Partial' });
        const pendingFees = await Fee.countDocuments({ status: 'Pending' });

        const aggregation = await Fee.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    paidAmount: { $sum: "$paidAmount" },
                    remainingAmount: { $sum: "$remainingAmount" }
                }
            }
        ]);

        const stats = aggregation[0] || { totalAmount: 0, paidAmount: 0, remainingAmount: 0 };

        res.json({
            success: true,
            data: {
                totalFees,
                paidFees,
                partialFees,
                pendingFees,
                ...stats,
                collectionRate: stats.totalAmount > 0 ? Math.round((stats.paidAmount / stats.totalAmount) * 100) : 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteFee = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFee = await Fee.findOneAndDelete({ id: Number(id) });

        if (!deletedFee) {
            return res.status(404).json({ success: false, message: 'Fee not found' });
        }

        res.json({ success: true, message: 'Fee deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getOverdueFees = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const fees = await Fee.find({
            status: { $ne: 'Paid' },
            dueDate: { $lt: today }
        }).sort({ dueDate: 1 });

        res.json({ success: true, data: fees });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
