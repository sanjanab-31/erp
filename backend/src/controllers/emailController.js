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

import Student from '../models/studentmodel.js';
import Teacher from '../models/teachermodel.js';
import Parent from '../models/parentmodel.js';

export const sendAnnouncement = async (req, res) => {
    try {
        const { targetAudience, classes, recipients: providedRecipients, title, description, attachment } = req.body;

        let recipients = providedRecipients || [];

        // If targetAudience is provided, fetch users from DB
        if (targetAudience && (!recipients || recipients.length === 0)) {
            console.log(`Fetching recipients for audience: ${targetAudience}`);

            if (targetAudience === 'Students' || targetAudience === 'All') {
                const query = {};
                // Filter by class if provided and not empty
                if (classes && Array.isArray(classes) && classes.length > 0) {
                    // Assuming 'grade' or 'class' field exists. Based on Student model, usually 'className' or 'grade'.
                    // Let's assume 'className' based on common patterns or fetch all and filter.
                    // 'class' is the field name in studentmodel.js
                    query.class = { $in: classes };
                }
                const students = await Student.find(query).select('email phone name');
                recipients = [...recipients, ...students.map(s => ({ email: s.email, phone: s.phone, name: s.name, role: 'Student' }))];
            }

            if (targetAudience === 'Teachers' || targetAudience === 'All') {
                const teachers = await Teacher.find({}).select('email phone name');
                recipients = [...recipients, ...teachers.map(t => ({ email: t.email, phone: t.phone, name: t.name, role: 'Teacher' }))];
            }

            if (targetAudience === 'Parents' || targetAudience === 'All') {
                // Parents usually don't have classes directly associated in simplified models, 
                // but we could filter by their children's classes if we had a complex query.
                // For now, fetch all parents if Audience is Parents/All.
                const parents = await Parent.find({}).select('email phone name');
                recipients = [...recipients, ...parents.map(p => ({ email: p.email, phone: p.phone, name: p.name, role: 'Parent' }))];
            }
        }

        if (!recipients || recipients.length === 0) {
            return res.status(400).json({ error: 'No recipients found for the selected audience.' });
        }

        // Remove duplicates based on email
        recipients = recipients.filter((v, i, a) => a.findIndex(t => (t.email === v.email)) === i);

        recipients = recipients.filter((v, i, a) => a.findIndex(t => (t.email === v.email)) === i);

        // Calculate Role Breakdown for logging
        const roleCounts = recipients.reduce((acc, curr) => {
            acc[curr.role] = (acc[curr.role] || 0) + 1;
            return acc;
        }, {});

        console.log(`\n========== 📢 BROADCAST START ==========`);
        console.log(`Title: "${title}"`);
        console.log(`Target: ${recipients.length} recipients`);
        console.log(`Breakdown: ${JSON.stringify(roleCounts)}`);

        let emailCount = 0;
        let smsCount = 0;

        const promises = recipients.map(async (recipient) => {
            const { email, phone, name } = recipient;

            if (email) {
                const sent = await sendAnnouncementEmail(email, name, title, description, attachment);
                if (sent) emailCount++;
            }

            if (phone) {
                const sent = await sendAnnouncementSMS(phone, title);
                if (sent) smsCount++;
            }
        });

        await Promise.all(promises);

        console.log(`✅ Broadcast Complete. Emails: ${emailCount}, SMS: ${smsCount}`);
        console.log(`========== 🚀 BROADCAST END ===========\n`);
        console.log(`========== 🚀 BROADCAST END ===========\n`);

        res.status(200).json({
            success: true,
            message: `Announcement sent to ${recipients.length} recipients (Emails: ${emailCount}, SMS: ${smsCount})`
        });

    } catch (error) {
        console.error('Controller Error (Announcement):', error);
        res.status(500).json({ success: false, error: 'Failed to send announcement notifications' });
    }
};
