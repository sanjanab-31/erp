import nodemailer from 'nodemailer';
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

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
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD?.replace(/\s+/g, '')
    },
    tls: {
        rejectUnauthorized: false
    },
    family: 4, // Force IPv4 to avoid IPv6 connection issues
    logger: true, // Log to console
    debug: true, // Include SMTP traffic in logs
    connectionTimeout: 10000, // 10 seconds timeout
    greetingTimeout: 10000
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
        console.error('Email Service Error (Student):', error.message);
        // Do not throw error to prevent controller from failing response
        return false;
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
        console.error('Email Service Error (Teacher):', error.message);
        return false;
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
        console.error('Email Service Error (Announcement):', error.message);

        return false;
    }
};

export const sendAnnouncementSMS = async (phone, title) => {

    const message = `ERP Alert: ${title.substring(0, 30)}${title.length > 30 ? '...' : ''}. Check portal for details.`;
    return sendSMS(phone, message);
};

export const sendPasswordResetEmail = async (userEmail, userName, resetToken) => {
    try {
        const fromAddress = `"Sri Eshwar College Of Engineering" <${process.env.SMTP_EMAIL}>`;
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

        await transporter.sendMail({
            from: fromAddress,
            to: userEmail,
            subject: 'Password Reset Request - Sri Eshwar College Of Engineering',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #6d28d9;">Password Reset Request</h2>
                    <p>Hello ${userName || 'User'},</p>
                    <p>We received a request to reset your password. Click the button below to reset it:</p>
                    
                    <div style="margin: 30px 0; text-align: center;">
                        <a href="${resetLink}" 
                           style="background-color: #6d28d9; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>

                    <p>Or copy and paste this link into your browser:</p>
                    <p style="background: #f3f4f6; padding: 10px; border-radius: 5px; word-break: break-all;">
                        ${resetLink}
                    </p>

                    <p style="color: #ef4444; margin-top: 20px;">
                        <strong>⚠️ This link will expire in 1 hour.</strong>
                    </p>

                    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                        If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                    </p>
                </div>
            `
        });
        return true;
    } catch (error) {
        console.error('Email Service Error (Password Reset):', error.message);
        return false;
    }
};
