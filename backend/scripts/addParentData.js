import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from '../src/models/studentmodel.js';
import Parent from '../src/models/parentmodel.js';
import User from '../src/models/userModel.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school-erp';

async function addParentData() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if parent user already exists
        const existingParentUser = await User.findOne({ email: 'eshwari@parent.com' });
        
        if (!existingParentUser) {
            // Create parent user
            const hashedPassword = await bcrypt.hash('parent123', 10);
            const parentUser = new User({
                id: 9001,
                email: 'eshwari@parent.com',
                password: hashedPassword,
                name: 'Eshwari',
                role: 'Parent',
                createdAt: new Date(),
                createdBy: 'System',
                active: true
            });
            await parentUser.save();
            console.log('✅ Parent user created');
        } else {
            console.log('ℹ️  Parent user already exists');
        }

        // Check if student exists
        let student = await Student.findOne({ email: 'student1@school.com' });
        
        if (!student) {
            // Create a sample student
            const studentPassword = await bcrypt.hash('student123', 10);
            const maxStudent = await Student.findOne().sort({ id: -1 });
            const newStudentId = maxStudent ? maxStudent.id + 1 : 1001;

            student = new Student({
                id: newStudentId,
                email: 'student1@school.com',
                password: studentPassword,
                name: 'Raj Kumar',
                role: 'Student',
                class: 'Grade 10-A',
                rollNumber: 'STU001',
                parent: 'Eshwari',
                parentEmail: 'eshwari@parent.com',
                parentPhone: '+91-9876543210',
                phone: '+91-9876543211',
                gender: 'Male',
                address: '123 School Street, City',
                dateOfBirth: '2010-05-15',
                createdAt: new Date(),
                createdBy: 'System',
                status: 'Active',
                active: true
            });
            await student.save();
            console.log('✅ Student created');

            // Create user for student
            const studentUser = new User({
                id: newStudentId,
                email: 'student1@school.com',
                password: studentPassword,
                name: 'Raj Kumar',
                role: 'Student',
                createdAt: new Date(),
                createdBy: 'System',
                active: true
            });
            await studentUser.save();
            console.log('✅ Student user created');
        } else {
            // Update existing student with parent email
            student.parentEmail = 'eshwari@parent.com';
            student.parent = 'Eshwari';
            await student.save();
            console.log('✅ Updated student with parent info');
        }

        // Check if parent record exists
        const existingParent = await Parent.findOne({ email: 'eshwari@parent.com' });
        
        if (!existingParent) {
            const hashedPassword = await bcrypt.hash('parent123', 10);
            const parent = new Parent({
                id: 9001,
                email: 'eshwari@parent.com',
                password: hashedPassword,
                name: 'Eshwari',
                role: 'Parent',
                studentId: student.id,
                childName: student.name,
                childClass: student.class,
                relationship: 'Mother',
                phone: '+91-9876543210',
                address: '123 School Street, City',
                createdAt: new Date(),
                createdBy: 'System',
                active: true
            });
            await parent.save();
            console.log('✅ Parent record created');
        } else {
            // Update existing parent
            existingParent.studentId = student.id;
            existingParent.childName = student.name;
            existingParent.childClass = student.class;
            await existingParent.save();
            console.log('✅ Updated parent record');
        }

        console.log('\n📋 Login Credentials:');
        console.log('Email: eshwari@parent.com');
        console.log('Password: parent123');
        console.log('\nStudent linked:', student.name, '(', student.class, ')');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
    }
}

addParentData();
