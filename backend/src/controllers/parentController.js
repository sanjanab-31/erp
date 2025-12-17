import Parent from '../models/parentmodel.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

export const getAllParents = async (req, res) => {
    try {
        const parents = await Parent.find();
        res.json({ success: true, data: parents });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getParentById = async (req, res) => {
    try {
        const parent = await Parent.findOne({ id: req.params.id });
        if (!parent) {
            return res.status(404).json({ success: false, message: 'Parent not found' });
        }
        res.json({ success: true, data: parent });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createParent = async (req, res) => {
    try {
        const { email, password, name, studentId, ...rest } = req.body;

        const existingParent = await Parent.findOne({ email });
        if (existingParent) {
            return res.status(400).json({ success: false, message: 'Parent with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newParent = await Parent.create({
            id: Date.now(),
            email,
            password: hashedPassword,
            name,
            role: 'parent',
            studentId,
            ...rest,
            createdAt: new Date(),
            active: true
        });

        // Sync with User collection
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            await User.create({
                email,
                password: hashedPassword,
                role: 'parent',
                name,
                active: true
            });
        }

        res.status(201).json({ success: true, data: newParent });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateParent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const parent = await Parent.findOneAndUpdate({ id }, updates, { new: true });

        if (!parent) {
            return res.status(404).json({ success: false, message: 'Parent not found' });
        }

        res.json({ success: true, data: parent });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteParent = async (req, res) => {
    try {
        const { id } = req.params;
        const parent = await Parent.findOneAndDelete({ id });

        if (!parent) {
            return res.status(404).json({ success: false, message: 'Parent not found' });
        }

        await User.findOneAndDelete({ email: parent.email });

        res.json({ success: true, message: 'Parent deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
