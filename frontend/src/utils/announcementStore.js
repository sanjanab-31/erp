


const STORAGE_KEY = 'erp_announcements';


const initializeDefaultData = () => {
    if (!localStorage.getItem(STORAGE_KEY)) {
        const defaultAnnouncements = [
            {
                id: 1,
                title: 'Welcome to New Academic Year 2024-25',
                description: 'We are excited to welcome all students, teachers, and parents to the new academic year. Let\'s make this year productive and successful!',
                targetAudience: 'All', 
                classes: [], 
                attachment: '',
                publishDate: new Date().toISOString(),
                createdBy: 'Admin',
                createdByName: 'John Admin',
                createdAt: new Date().toISOString(),
                status: 'Published' 
            },
            {
                id: 2,
                title: 'Parent-Teacher Meeting Scheduled',
                description: 'Parent-Teacher meeting is scheduled for next Saturday from 10 AM to 2 PM. Please mark your calendars and attend to discuss your child\'s progress.',
                targetAudience: 'Parents',
                classes: [],
                attachment: '',
                publishDate: new Date().toISOString(),
                createdBy: 'Admin',
                createdByName: 'John Admin',
                createdAt: new Date().toISOString(),
                status: 'Published'
            },
            {
                id: 3,
                title: 'Mid-Term Examination Schedule',
                description: 'Mid-term examinations will commence from next Monday. Students are advised to prepare well and follow the exam schedule shared with you.',
                targetAudience: 'Students',
                classes: [],
                attachment: '',
                publishDate: new Date().toISOString(),
                createdBy: 'Admin',
                createdByName: 'John Admin',
                createdAt: new Date().toISOString(),
                status: 'Published'
            }
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAnnouncements));
    }
};


export const getAllAnnouncements = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            initializeDefaultData();
            return JSON.parse(localStorage.getItem(STORAGE_KEY));
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Error getting announcements:', error);
        return [];
    }
};


export const addAnnouncement = (announcementData) => {
    try {
        const announcements = getAllAnnouncements();
        const newAnnouncement = {
            id: Date.now(),
            ...announcementData,
            createdAt: new Date().toISOString(),
            status: announcementData.status || 'Published'
        };
        announcements.unshift(newAnnouncement); 
        localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements));
        window.dispatchEvent(new Event('announcementsUpdated'));
        return newAnnouncement;
    } catch (error) {
        console.error('Error adding announcement:', error);
        throw error;
    }
};


export const updateAnnouncement = (id, updates) => {
    try {
        const announcements = getAllAnnouncements();
        const index = announcements.findIndex(a => a.id === id);
        if (index === -1) throw new Error('Announcement not found');

        announcements[index] = {
            ...announcements[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements));
        window.dispatchEvent(new Event('announcementsUpdated'));
        return announcements[index];
    } catch (error) {
        console.error('Error updating announcement:', error);
        throw error;
    }
};


export const deleteAnnouncement = (id) => {
    try {
        const announcements = getAllAnnouncements();
        const filtered = announcements.filter(a => a.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        window.dispatchEvent(new Event('announcementsUpdated'));
        return true;
    } catch (error) {
        console.error('Error deleting announcement:', error);
        throw error;
    }
};


export const archiveAnnouncement = (id) => {
    try {
        return updateAnnouncement(id, { status: 'Archived' });
    } catch (error) {
        console.error('Error archiving announcement:', error);
        throw error;
    }
};


export const unarchiveAnnouncement = (id) => {
    try {
        return updateAnnouncement(id, { status: 'Published' });
    } catch (error) {
        console.error('Error unarchiving announcement:', error);
        throw error;
    }
};


export const getAnnouncementsForAudience = (audience, userClass = null) => {
    const announcements = getAllAnnouncements();

    return announcements.filter(a => {
        
        if (a.status !== 'Published') return false;

        
        const audienceMatch = a.targetAudience === 'All' || a.targetAudience === audience;
        if (!audienceMatch) return false;

        
        if (a.classes && a.classes.length > 0 && userClass) {
            return a.classes.includes(userClass);
        }

        return true;
    });
};


export const getLatestAnnouncements = (audience, userClass = null, limit = 3) => {
    const announcements = getAnnouncementsForAudience(audience, userClass);
    return announcements.slice(0, limit);
};


export const autoArchiveOldAnnouncements = () => {
    try {
        const announcements = getAllAnnouncements();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        let updated = false;
        announcements.forEach((announcement, index) => {
            const publishDate = new Date(announcement.publishDate);
            if (publishDate < thirtyDaysAgo && announcement.status === 'Published') {
                announcements[index].status = 'Archived';
                updated = true;
            }
        });

        if (updated) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements));
            window.dispatchEvent(new Event('announcementsUpdated'));
        }
    } catch (error) {
        console.error('Error auto-archiving announcements:', error);
    }
};


export const subscribeToUpdates = (callback) => {
    const handler = () => {
        callback(getAllAnnouncements());
    };
    window.addEventListener('announcementsUpdated', handler);
    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) handler();
    });
    return () => {
        window.removeEventListener('announcementsUpdated', handler);
        window.removeEventListener('storage', handler);
    };
};


initializeDefaultData();


autoArchiveOldAnnouncements();

export default {
    getAllAnnouncements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    archiveAnnouncement,
    unarchiveAnnouncement,
    getAnnouncementsForAudience,
    getLatestAnnouncements,
    autoArchiveOldAnnouncements,
    subscribeToUpdates
};
