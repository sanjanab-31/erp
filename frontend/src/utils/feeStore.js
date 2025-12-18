

const STORAGE_KEY = 'erp_fee_data';

const initializeDefaultData = () => {
    return [];
};

export const getAllFees = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            const defaultData = initializeDefaultData();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
            return defaultData;
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Error getting fees:', error);
        return initializeDefaultData();
    }
};

export const addFee = (feeData) => {
    try {
        const fees = getAllFees();
        const newFee = {
            id: Date.now(),
            studentId: feeData.studentId,
            studentName: feeData.studentName,
            studentClass: feeData.studentClass,
            feeType: feeData.feeType,
            amount: parseFloat(feeData.amount),
            dueDate: feeData.dueDate,
            status: 'Pending',
            paidAmount: 0,
            remainingAmount: parseFloat(feeData.amount),
            payments: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        fees.push(newFee);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fees));

        window.dispatchEvent(new Event('feesUpdated'));

        return newFee;
    } catch (error) {
        console.error('Error adding fee:', error);
        throw error;
    }
};

export const updateFee = (feeId, updates) => {
    try {
        const fees = getAllFees();
        const index = fees.findIndex(f => f.id === feeId);

        if (index === -1) {
            throw new Error('Fee not found');
        }

        fees[index] = {
            ...fees[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(fees));

        window.dispatchEvent(new Event('feesUpdated'));

        return fees[index];
    } catch (error) {
        console.error('Error updating fee:', error);
        throw error;
    }
};

export const makePayment = (feeId, paymentData) => {
    try {
        const fees = getAllFees();
        const fee = fees.find(f => f.id === feeId);

        if (!fee) {
            throw new Error('Fee not found');
        }

        const payment = {
            id: Date.now(),
            amount: parseFloat(paymentData.amount),
            paymentMethod: paymentData.paymentMethod, 
            transactionId: paymentData.transactionId,
            paymentDate: new Date().toISOString(),
            paidBy: paymentData.paidBy || 'Parent'
        };

        const newPaidAmount = fee.paidAmount + payment.amount;
        const newRemainingAmount = fee.amount - newPaidAmount;

        const updatedFee = {
            ...fee,
            paidAmount: newPaidAmount,
            remainingAmount: newRemainingAmount,
            status: newRemainingAmount <= 0 ? 'Paid' : 'Partial',
            payments: [...fee.payments, payment],
            updatedAt: new Date().toISOString()
        };

        const index = fees.findIndex(f => f.id === feeId);
        fees[index] = updatedFee;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(fees));

        window.dispatchEvent(new Event('feesUpdated'));

        return updatedFee;
    } catch (error) {
        console.error('Error making payment:', error);
        throw error;
    }
};

export const deleteFee = (feeId) => {
    try {
        const fees = getAllFees();
        const filteredFees = fees.filter(f => f.id !== feeId);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredFees));

        window.dispatchEvent(new Event('feesUpdated'));

        return true;
    } catch (error) {
        console.error('Error deleting fee:', error);
        throw error;
    }
};

export const getFeesByStudent = (studentId) => {
    console.log('getFeesByStudent called with studentId:', studentId);
    const fees = getAllFees();
    console.log('All fees in store:', fees);

    const filtered = fees.filter(f => {
        const match = f.studentId.toString() === studentId.toString();
        console.log(`Comparing fee studentId: ${f.studentId} with ${studentId} = ${match}`);
        return match;
    });

    console.log('Filtered fees:', filtered);
    return filtered;
};

export const getFeesByStudentEmail = (studentEmail) => {
    const fees = getAllFees();
    
    return fees; 
};

export const getFeeStats = () => {
    const fees = getAllFees();

    const totalFees = fees.length;
    const paidFees = fees.filter(f => f.status === 'Paid').length;
    const partialFees = fees.filter(f => f.status === 'Partial').length;
    const pendingFees = fees.filter(f => f.status === 'Pending').length;

    const totalAmount = fees.reduce((sum, f) => sum + f.amount, 0);
    const paidAmount = fees.reduce((sum, f) => sum + f.paidAmount, 0);
    const remainingAmount = fees.reduce((sum, f) => sum + f.remainingAmount, 0);

    return {
        totalFees,
        paidFees,
        partialFees,
        pendingFees,
        totalAmount,
        paidAmount,
        remainingAmount,
        collectionRate: totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0
    };
};

export const getOverdueFees = () => {
    const fees = getAllFees();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return fees.filter(f => {
        if (f.status === 'Paid') return false;
        const dueDate = new Date(f.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < today;
    });
};

export const subscribeToUpdates = (callback) => {
    const handler = () => callback(getAllFees());
    window.addEventListener('feesUpdated', handler);

    return () => window.removeEventListener('feesUpdated', handler);
};

export default {
    getAllFees,
    addFee,
    updateFee,
    makePayment,
    deleteFee,
    getFeesByStudent,
    getFeesByStudentEmail,
    getFeeStats,
    getOverdueFees,
    subscribeToUpdates
};
