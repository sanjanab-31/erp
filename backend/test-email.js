import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

console.log('Testing Email Configuration...');
console.log('SMTP_EMAIL:', process.env.SMTP_EMAIL);
console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '******' : '(missing)');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD?.replace(/\s+/g, '') // Remove spaces from App Password
    }
});

const testMail = async () => {
    try {
        console.log('Attempting to send test email to self...');
        const info = await transporter.sendMail({
            from: process.env.SMTP_EMAIL,
            to: process.env.SMTP_EMAIL, // Send to self to verify
            subject: 'Test Email from ERP System',
            text: 'If you see this, email configuration is working correctly!'
        });
        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('❌ Email Failed:', error.message);
        
        if (error.code === 'EAUTH') {
            console.log('\n--- 🛑 AUTHENTICATION ERROR DETECTED ---');
            console.log('The password provided was rejected by Google.');
            
            const passLength = process.env.SMTP_PASSWORD?.replace(/\s+/g, '').length || 0;
            console.log(`Your provided password length: ${passLength} characters.`);
            
            if (passLength !== 16) {
                console.log('⚠️ A Google App Password is exactly 16 characters long.');
                console.log('   It looks like you might be using your regular login password.');
            }
            
            if (process.env.SMTP_EMAIL.includes('.ac.in') || process.env.SMTP_EMAIL.includes('.edu')) {
                console.log('\n⚠️ SCHOOL/ORGANIZATION ACCOUNT DETECTED');
                console.log('   You are using an educational email (@sece.ac.in).');
                console.log('   School administrators often BLOCK "App Passwords" or "Less Secure Apps".');
                console.log('   👉 TRY A PERSONAL @GMAIL.COM ACCOUNT to verify the system works.');
            }
        }
    }
};

testMail();
