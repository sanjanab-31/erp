// Centralized Settings Data Store
// This provides real-time settings synchronization across all portals

const STORAGE_KEYS = {
    STUDENT: 'erp_student_settings',
    TEACHER: 'erp_teacher_settings',
    PARENT: 'erp_parent_settings',
    ADMIN: 'erp_admin_settings'
};

// Initialize default settings for each portal
const initializeDefaultSettings = (portal) => {
    const commonSettings = {
        notifications: {
            emailNotifications: true,
            pushNotifications: true,
            smsNotifications: false
        },
        security: {
            twoFactorAuth: false,
            lastPasswordChange: new Date().toISOString()
        },
        updatedAt: new Date().toISOString()
    };

    switch (portal) {
        case 'student':
            return {
                profile: {
                    fullName: 'Mike Wilson',
                    email: 'student@school.com',
                    phone: '+1 (555) 000-0000',
                    role: 'Student',
                    address: '',
                    bio: ''
                },
                notifications: {
                    ...commonSettings.notifications,
                    assignmentReminders: true,
                    gradeUpdates: true,
                    attendanceAlerts: false,
                    transportUpdates: true,
                    libraryReminders: true,
                    feeReminders: true
                },
                appearance: {
                    theme: 'light',
                    fontSize: 'medium',
                    language: 'English'
                },
                preferences: {
                    defaultPage: 'Dashboard',
                    itemsPerPage: 20,
                    dateFormat: 'MM/DD/YYYY',
                    timeFormat: '12-hour'
                },
                ...commonSettings
            };

        case 'teacher':
            return {
                profile: {
                    name: 'Sarah Johnson',
                    email: 'sarah.johnson@school.com',
                    phone: '+1 234-567-8900',
                    address: '123 Education Street, City, State 12345',
                    dateOfBirth: '1985-05-15',
                    employeeId: 'TCH-2024-001',
                    department: 'Mathematics',
                    qualification: 'M.Sc. Mathematics',
                    experience: '10 years'
                },
                notifications: {
                    ...commonSettings.notifications,
                    assignmentReminders: true,
                    gradeUpdates: true,
                    attendanceAlerts: true,
                    parentMessages: true,
                    systemUpdates: false
                },
                preferences: {
                    language: 'English',
                    timezone: 'UTC-5 (EST)',
                    dateFormat: 'MM/DD/YYYY',
                    theme: 'System Default'
                },
                ...commonSettings
            };

        case 'parent':
            return {
                profile: {
                    name: 'John Parent',
                    email: 'john.parent@email.com',
                    phone: '+1 234-567-8900',
                    address: '123 Main Street, City, State',
                    relationship: 'Father'
                },
                notifications: {
                    ...commonSettings.notifications,
                    gradeUpdates: true,
                    attendanceAlerts: true,
                    feeReminders: true,
                    eventNotifications: true
                },
                ...commonSettings
            };

        case 'admin':
            return {
                general: {
                    schoolName: 'ABC International School',
                    email: 'admin@abcschool.com',
                    phone: '+1 234-567-8900',
                    address: '123 Education Street, City, State',
                    timezone: 'UTC-5 (EST)',
                    language: 'English',
                    currency: 'USD'
                },
                notifications: {
                    ...commonSettings.notifications,
                    systemUpdates: true
                },
                ...commonSettings
            };

        default:
            return commonSettings;
    }
};

// Get settings for a specific portal
export const getSettings = (portal) => {
    try {
        const storageKey = STORAGE_KEYS[portal.toUpperCase()];
        if (!storageKey) {
            throw new Error(`Invalid portal: ${portal}`);
        }

        const data = localStorage.getItem(storageKey);
        if (!data) {
            const defaultSettings = initializeDefaultSettings(portal);
            localStorage.setItem(storageKey, JSON.stringify(defaultSettings));
            return defaultSettings;
        }
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error getting ${portal} settings:`, error);
        return initializeDefaultSettings(portal);
    }
};

// Update settings for a specific portal
export const updateSettings = (portal, updates) => {
    try {
        const storageKey = STORAGE_KEYS[portal.toUpperCase()];
        if (!storageKey) {
            throw new Error(`Invalid portal: ${portal}`);
        }

        const currentSettings = getSettings(portal);
        const updatedSettings = {
            ...currentSettings,
            ...updates,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(storageKey, JSON.stringify(updatedSettings));

        // Trigger storage event for real-time updates
        window.dispatchEvent(new CustomEvent('settingsUpdated', {
            detail: { portal, settings: updatedSettings }
        }));

        return updatedSettings;
    } catch (error) {
        console.error(`Error updating ${portal} settings:`, error);
        throw error;
    }
};

// Update specific section of settings
export const updateSettingsSection = (portal, section, data) => {
    try {
        const currentSettings = getSettings(portal);
        const updatedSettings = {
            ...currentSettings,
            [section]: {
                ...currentSettings[section],
                ...data
            },
            updatedAt: new Date().toISOString()
        };

        const storageKey = STORAGE_KEYS[portal.toUpperCase()];
        localStorage.setItem(storageKey, JSON.stringify(updatedSettings));

        // Trigger storage event for real-time updates
        window.dispatchEvent(new CustomEvent('settingsUpdated', {
            detail: { portal, section, settings: updatedSettings }
        }));

        return updatedSettings;
    } catch (error) {
        console.error(`Error updating ${portal} ${section} settings:`, error);
        throw error;
    }
};

// Change password
export const changePassword = (portal, currentPassword, newPassword) => {
    try {
        // In a real application, you would validate the current password
        // and hash the new password before storing
        const currentSettings = getSettings(portal);
        const updatedSettings = {
            ...currentSettings,
            security: {
                ...currentSettings.security,
                lastPasswordChange: new Date().toISOString()
            },
            updatedAt: new Date().toISOString()
        };

        const storageKey = STORAGE_KEYS[portal.toUpperCase()];
        localStorage.setItem(storageKey, JSON.stringify(updatedSettings));

        // Trigger storage event for real-time updates
        window.dispatchEvent(new CustomEvent('settingsUpdated', {
            detail: { portal, section: 'security', settings: updatedSettings }
        }));

        return { success: true, message: 'Password updated successfully!' };
    } catch (error) {
        console.error(`Error changing ${portal} password:`, error);
        throw error;
    }
};

// Reset settings to default
export const resetSettings = (portal) => {
    try {
        const defaultSettings = initializeDefaultSettings(portal);
        const storageKey = STORAGE_KEYS[portal.toUpperCase()];
        localStorage.setItem(storageKey, JSON.stringify(defaultSettings));

        // Trigger storage event for real-time updates
        window.dispatchEvent(new CustomEvent('settingsUpdated', {
            detail: { portal, settings: defaultSettings }
        }));

        return defaultSettings;
    } catch (error) {
        console.error(`Error resetting ${portal} settings:`, error);
        throw error;
    }
};

// Subscribe to real-time settings updates
export const subscribeToSettingsUpdates = (portal, callback) => {
    const handler = (event) => {
        if (event.detail.portal === portal) {
            callback(event.detail.settings);
        }
    };
    window.addEventListener('settingsUpdated', handler);

    // Return unsubscribe function
    return () => window.removeEventListener('settingsUpdated', handler);
};

export default {
    getSettings,
    updateSettings,
    updateSettingsSection,
    changePassword,
    resetSettings,
    subscribeToSettingsUpdates
};
