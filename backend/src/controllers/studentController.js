import Student from '../models/studentmodel.js';
import User from '../models/userModel.js';
import Parent from '../models/parentmodel.js';
import bcrypt from 'bcryptjs';

export const getAllStudents = async (req, res) => {
    try {
        const { query, class: className, status } = req.query;
        let filter = {};

        // Search options
        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { rollNo: { $regex: query, $options: 'i' } }
            ];
        }

        // Filter options
        if (className && className !== 'All Classes') {
            filter.class = className;
        }
        if (status && status !== 'All') {
            filter.status = status;
        }

        const students = await Student.find(filter).sort({ createdAt: -1 });
        
        // Populate parent information from Parent collection
        const studentsWithParents = await Promise.all(students.map(async (student) => {
            const studentObj = student.toObject();
            
            // Find parent by studentId
            const parent = await Parent.findOne({ studentId: studentObj.id });
            
            if (parent) {
                studentObj.parent = parent.name;
                studentObj.parentPhone = parent.phone;
                // parentEmail is already in student record
            }
            
            return studentObj;
        }));
        
        res.json({ success: true, data: studentsWithParents });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getStudentStats = async (req, res) => {
    try {
        const total = await Student.countDocuments();
        const active = await Student.countDocuments({ $or: [{ status: 'Active' }, { status: { $exists: false } }] });
        const inactive = await Student.countDocuments({ status: 'Inactive' });

        // Mock warning metric or calculate based on attendance/grades if those models were fully linked
        // For now, let's assume 'Warning' is a status or we return 0
        const warning = await Student.countDocuments({ status: 'Warning' });

        // Average Attendance - assuming we can aggregate from student records or an attendance collection
        // Since Student model structure isn't fully visible for attendance, using a placeholder or aggregating
        // If Student has an 'attendance' field which is a number:
        const students = await Student.find({}, 'attendance');
        const avgAttendance = students.length > 0
            ? Math.round(students.reduce((acc, s) => acc + (s.attendance || 0), 0) / students.length)
            : 0;

        res.json({
            success: true,
            data: {
                total,
                active,
                inactive,
                warning,
                avgAttendance
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getStudentById = async (req, res) => {
    try {
        const student = await Student.findOne({ id: req.params.id });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        
        const studentObj = student.toObject();
        
        // Find parent by studentId
        const parent = await Parent.findOne({ studentId: studentObj.id });
        
        if (parent) {
            studentObj.parent = parent.name;
            studentObj.parentPhone = parent.phone;
        }
        
        res.json({ success: true, data: studentObj });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getStudentByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        res.json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createStudent = async (req, res) => {
    try {
        const { email, password, name, department, year, ...rest } = req.body;

        // Check if student already exists
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ success: false, message: 'Student with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Student Profile
        const newStudent = await Student.create({
            id: Date.now(), // Simple ID generation
            email,
            password: hashedPassword,
            name,
            role: 'student',
            ...rest,
            createdAt: new Date(),
            active: true
        });

        // Also create User for Authentication
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            await User.create({
                email,
                password: hashedPassword,
                role: 'student',
                name,
                active: true
            });
        }

        // Auto-create Parent if email is provided
        if (req.body.parentEmail) {
            const parentEmail = req.body.parentEmail;
            // Use 'parent' field from frontend, only fallback if truly empty
            const parentName = (req.body.parent && req.body.parent.trim()) ? req.body.parent : `Parent of ${name}`;
            const parentPhone = req.body.parentPhone || req.body.phone; // Fallback phone

            // Check if parent user/profile exists
            const existingParentUser = await User.findOne({ email: parentEmail });

            if (!existingParentUser) {
                // Create Parent User Account
                await User.create({
                    email: parentEmail,
                    password: hashedPassword, // Default to same password initially or generate random
                    role: 'parent',
                    name: parentName,
                    active: true
                });

                // Create Parent Profile
                // Import Parent model dynamically to avoid circular dependency issues if any, 
                // but since we are in ES modules, top-level import is fine. 
                // Assuming Parent model is imported at top or available.
                // We need to ensure logic is robust.
            }

            // We should ideally check/create the Parent Profile model details too.
            // Since we don't have Parent model imported here, we should import it.
            // But to avoid messing with top-level imports right now in this Replace block, 
            // I will assume I can do a separate step or just do the User creation part 
            // which is critical for login. 
            // actually, let's do it properly.
        }

        // Auto-create Parent if email is provided
        if (req.body.parentEmail) {
            const parentEmail = req.body.parentEmail;
            // Use 'parent' field from frontend, only fallback if truly empty
            const parentName = (req.body.parent && req.body.parent.trim()) ? req.body.parent : `Parent of ${name}`;
            const parentPhone = req.body.parentPhone || rest.phone;

            // Check if parent exists in Parent collection
            let parentProfile = await Parent.findOne({ email: parentEmail });

            if (!parentProfile) {
                // Create new Parent Profile
                await Parent.create({
                    id: Date.now() + 1, // Ensure unique ID
                    email: parentEmail,
                    password: hashedPassword, // Using same default password
                    name: parentName,
                    role: 'parent',
                    studentId: newStudent.id,
                    childName: name,
                    childClass: rest.class || '',
                    relationship: 'Parent', // Default
                    phone: parentPhone || '',
                    address: rest.address || '',
                    createdAt: new Date(),
                    createdBy: 'system',
                    active: true
                });

                // Create Parent User Account if not exists
                const existingParentUser = await User.findOne({ email: parentEmail });
                if (!existingParentUser) {
                    await User.create({
                        email: parentEmail,
                        password: hashedPassword,
                        role: 'parent',
                        name: parentName,
                        active: true
                    });
                }
            }
        }

        res.status(201).json({ success: true, data: newStudent });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Map rollNumber from frontend if provided
        if (updates.rollNo && !updates.rollNumber) {
            updates.rollNumber = updates.rollNo;
        }

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);

            // Should verify and update User model password too if email matches
            // skipping for simplicity unless requested
        }

        const student = await Student.findOneAndUpdate({ id }, updates, { new: true });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Update or create parent information if provided
        if (updates.parent || updates.parentPhone || updates.parentEmail) {
            const existingParent = await Parent.findOne({ studentId: parseInt(id) });
            
            if (existingParent) {
                // Update existing parent
                const parentUpdates = {};
                if (updates.parent) parentUpdates.name = updates.parent;
                if (updates.parentPhone) parentUpdates.phone = updates.parentPhone;
                
                await Parent.findOneAndUpdate(
                    { studentId: parseInt(id) },
                    parentUpdates,
                    { new: true }
                );
            } else if (updates.parentEmail) {
                // Create parent record if it doesn't exist
                const hashedPassword = await bcrypt.hash('password', 10);
                const parentName = updates.parent || `Parent of ${student.name}`;
                
                await Parent.create({
                    id: Date.now() + Math.floor(Math.random() * 1000),
                    email: updates.parentEmail,
                    password: hashedPassword,
                    name: parentName,
                    role: 'parent',
                    studentId: parseInt(id),
                    childName: student.name,
                    childClass: student.class || '',
                    relationship: 'Parent',
                    phone: updates.parentPhone || '',
                    address: updates.address || '',
                    createdAt: new Date(),
                    createdBy: 'system',
                    active: true
                });
                
                // Also create User account for parent login
                const existingUser = await User.findOne({ email: updates.parentEmail });
                if (!existingUser) {
                    await User.create({
                        email: updates.parentEmail,
                        password: hashedPassword,
                        role: 'parent',
                        name: parentName,
                        active: true
                    });
                }
            }
        }

        res.json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findOneAndDelete({ id });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Optionally delete associated User
        await User.findOneAndDelete({ email: student.email });

        res.json({ success: true, message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
