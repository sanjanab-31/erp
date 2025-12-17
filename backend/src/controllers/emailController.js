import { sendStudentCredentials, sendTeacherCredentials, sendAnnouncementEmail, sendAnnouncementSMS } from '../services/emailService.js';

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

export const sendAnnouncement = async (req, res) => {
    try {
        const { recipients, title, description, attachment } = req.body;

        if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
            return res.status(400).json({ error: 'No recipients provided' });
        }

        console.log(`Sending announcement "${title}" to ${recipients.length} recipients...`);

        // Process in background (don't wait for all to finish to respond to client, 
        // OR wait if we want to confirm. Let's wait for a few, or fire and forget?
        // Better to wait for simplicity and confirmation, but limit concurrency if needed.
        // For this scale, Promise.all is fine.

        let emailCount = 0;
        let smsCount = 0;

        const promises = recipients.map(async (recipient) => {
            const { email, phone, name } = recipient;

            // Send Email
            if (email) {
                const sent = await sendAnnouncementEmail(email, name, title, description, attachment);
                if (sent) emailCount++;
            }

            // Send SMS
            if (phone) {
                const sent = await sendAnnouncementSMS(phone, title);
                if (sent) smsCount++;
            }
        });

        await Promise.all(promises);

        console.log(`Announcement sent. Emails: ${emailCount}, SMS: ${smsCount}`);

        res.status(200).json({
            success: true,
            message: `Announcement sent to ${recipients.length} recipients (Emails: ${emailCount}, SMS: ${smsCount})`
        });

    } catch (error) {
        console.error('Controller Error (Announcement):', error);
        res.status(500).json({ success: false, error: 'Failed to send announcement notifications' });
    }
};
