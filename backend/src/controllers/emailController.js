import { sendStudentCredentials, sendTeacherCredentials } from '../services/emailService.js';

export const sendStudentCreds = async (req, res) => {
    try {
        const { email, password, name, parentEmail } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        await sendStudentCredentials(email, password, name, parentEmail);
        res.status(200).json({ success: true, message: 'Emails sent successfully to Student ' + (parentEmail ? 'and Parent' : '') });
    } catch (error) {
        console.error('Controller Error:', error);
        res.status(500).json({ success: false, error: 'Failed to send emails' });
    }
};

export const sendTeacherCreds = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        await sendTeacherCredentials(email, password, name);
        res.status(200).json({ success: true, message: 'Email sent successfully to Teacher' });
    } catch (error) {
        console.error('Controller Error:', error);
        res.status(500).json({ success: false, error: 'Failed to send email' });
    }
};
