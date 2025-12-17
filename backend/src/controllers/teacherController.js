import Teacher from '../models/teachermodel.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

export const getAllTeachers = async (req, res) => {
    try {
        const { query, department, status } = req.query;
        let filter = {};

        // Search options
        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { employeeId: { $regex: query, $options: 'i' } },
                { subject: { $regex: query, $options: 'i' } }
            ];
        }

        // Filter options
        if (department && department !== 'All Departments') {
            filter.department = department;
        }
        if (status && status !== 'All') {
            filter.status = status;
        }

        const teachers = await Teacher.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, data: teachers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTeacherStats = async (req, res) => {
    try {
        const total = await Teacher.countDocuments();
        const active = await Teacher.countDocuments({ status: 'Active' });
        const inactive = await Teacher.countDocuments({ status: 'Inactive' });
        const onLeave = await Teacher.countDocuments({ status: 'On Leave' });

        res.json({
            success: true,
            data: {
                total,
                active,
                inactive,
                onLeave
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ id: req.params.id });
        if (!teacher) {
            return res.status(404).json({ success: false, message: 'Teacher not found' });
        }
        res.json({ success: true, data: teacher });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createTeacher = async (req, res) => {
    try {
        const { email, password, name, subject, ...rest } = req.body;

        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return res.status(400).json({ success: false, message: 'Teacher with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newTeacher = await Teacher.create({
            id: Date.now(),
            email,
            password: hashedPassword,
            name,
            role: 'teacher',
            subject,
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
                role: 'teacher',
                name,
                active: true
            });
        }

        res.status(201).json({ success: true, data: newTeacher });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const teacher = await Teacher.findOneAndUpdate({ id }, updates, { new: true });

        if (!teacher) {
            return res.status(404).json({ success: false, message: 'Teacher not found' });
        }

        res.json({ success: true, data: teacher });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await Teacher.findOneAndDelete({ id });

        if (!teacher) {
            return res.status(404).json({ success: false, message: 'Teacher not found' });
        }

        await User.findOneAndDelete({ email: teacher.email });

        res.json({ success: true, message: 'Teacher deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
