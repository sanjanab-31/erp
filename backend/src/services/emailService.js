import nodemailer from 'nodemailer';
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

// Twilio Client Setup
let twilioClient;
try {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    } else {
        console.warn('Twilio credentials missing. SMS features will be disabled.');
    }
} catch (error) {
    console.error('Error initializing Twilio client:', error);
}

const sendSMS = async (phone, message) => {
    if (!twilioClient) {
        console.log(`[SMS MOCK] (Twilio not configured) Sending to ${phone}: ${message}`);
        return false;
    }

    try {
        await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });
        return true;
    } catch (error) {
        console.error(`Twilio SMS Failed to ${phone}:`, error.message);
        return false;
    }
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD?.replace(/\s+/g, '') // Handle App Password spaces
    }
});

export const sendStudentCredentials = async (studentEmail, password, studentName, parentEmail = null) => {
    // Sender with Name
    const fromAddress = `"Sri Eshwar College Of Engineering" <${process.env.SMTP_EMAIL}>`;

    try {
        // 1. Email to Student
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

        // 2. Email to Parent (if provided)
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

export const sendAnnouncementEmail = async (recipientEmail, recipientName, title, description, attachment) => {
    try {
        const fromAddress = `"Sri Eshwar College Of Engineering" <${process.env.SMTP_EMAIL}>`;

        await transporter.sendMail({
            from: fromAddress,
            to: recipientEmail,
            subject: `📢 ${title}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #6d28d9;">New Announcement</h2>
                    <p>Hello ${recipientName},</p>
                    <p>A new announcement has been posted:</p>
                    
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #4b5563;">${title}</h3>
                        <p style="white-space: pre-wrap;">${description}</p>
                        ${attachment ? `<p><a href="${attachment}" style="color: #6d28d9;">View Attachment</a></p>` : ''}
                    </div>

                    <p>Please check the portal for more details.</p>
                </div>
            `
        });
        return true;
    } catch (error) {
        console.error('Email Service Error (Announcement):', error);
        // Don't throw here, just log failure so other emails can proceed
        return false;
    }
};

export const sendAnnouncementSMS = async (phone, title) => {
    // Keep it short for SMS
    const message = `ERP Alert: ${title.substring(0, 30)}${title.length > 30 ? '...' : ''}. Check portal for details.`;
    return sendSMS(phone, message);
};
