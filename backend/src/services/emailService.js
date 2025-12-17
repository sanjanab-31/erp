import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD?.replace(/\s+/g, '') 
    }
});

export const sendStudentCredentials = async (studentEmail, password, studentName, parentEmail = null) => {
    
    const fromAddress = `"Sri Eshwar College Of Engineering" <${process.env.SMTP_EMAIL}>`;

    try {
        
        await transporter.sendMail({
            from: fromAddress,
            to: studentEmail,
            subject: 'Welcome to Sri Eshwar College Of Engineering - Your Login Credentials',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #6d28d9;">Welcome ${studentName}! 🎓</h2>
                    <p>Your student account has been successfully created.</p>
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Your Login Credentials:</h3>
                        <p><strong>Email:</strong> ${studentEmail}</p>
                        <p><strong>Password:</strong> ${password}</p>
                        <p><strong>Role:</strong> Student</p>
                    </div>
                    <p>Please login and change your password immediately.</p>
                </div>
            `
        });

        
        if (parentEmail) {
            await transporter.sendMail({
                from: fromAddress,
                to: parentEmail,
                subject: 'Sri Eshwar College Of Engineering - Account Created for ' + studentName,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                        <h2 style="color: #6d28d9;">Student Account Created</h2>
                        <p>Dear Parent,</p>
                        <p>Use the following credentials to access the portal.</p>
                        
                        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0;">Student Credentials (${studentName}):</h3>
                            <p><strong>Email:</strong> ${studentEmail}</p>
                            <p><strong>Password:</strong> ${password}</p>
                        </div>

                        <div style="background: #eef2ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0;">Your Parent Portal Credentials:</h3>
                            <p><strong>Email:</strong> ${parentEmail}</p>
                            <p><strong>Password:</strong> ${password}</p>
                            <p><strong>Role:</strong> Parent</p>
                        </div>
                    </div>
                `
            });
        }
        return true;
    } catch (error) {
        console.error('Email Service Error:', error);
        throw error;
    }
};

export const sendTeacherCredentials = async (teacherEmail, password, teacherName) => {
    try {
        const fromAddress = `"Sri Eshwar College Of Engineering" <${process.env.SMTP_EMAIL}>`;
        await transporter.sendMail({
            from: fromAddress,
            to: teacherEmail,
            subject: 'Welcome Faculty - Sri Eshwar College Of Engineering',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #6d28d9;">Welcome to the Faculty! 👨‍🏫</h2>
                    <p>Hello ${teacherName},</p>
                    <p>Your faculty account has been created.</p>
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Your Login Credentials:</h3>
                        <p><strong>Email:</strong> ${teacherEmail}</p>
                        <p><strong>Password:</strong> ${password}</p>
                        <p><strong>Role:</strong> Teacher</p>
                    </div>
                    <p>Please login to the Teacher Portal to manage your classes.</p>
                </div>
            `
        });
        return true;
    } catch (error) {
        console.error('Email Service Error:', error);
        throw error;
    }
};
