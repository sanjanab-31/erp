

export const logAdminActivity = (type, title, description) => {
    try {
        const activityLog = JSON.parse(localStorage.getItem('adminActivityLog') || '[]');

        const newActivity = {
            id: Date.now(),
            type: type, 
            title: title,
            description: description,
            time: getTimeAgo(new Date()),
            timestamp: new Date().toISOString()
        };

        const updatedLog = [newActivity, ...activityLog].slice(0, 50);

        localStorage.setItem('adminActivityLog', JSON.stringify(updatedLog));

        window.dispatchEvent(new CustomEvent('adminActivityAdded', { detail: newActivity }));
    } catch (error) {
        console.error('Error logging admin activity:', error);
    }
};

const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
};

export const initializeActivityLog = () => {
    const activityLog = JSON.parse(localStorage.getItem('adminActivityLog') || '[]');

    if (activityLog.length === 0) {
        const defaultActivities = [
            {
                id: Date.now(),
                type: 'info',
                title: 'System initialized',
                description: 'Admin dashboard is ready',
                time: 'Just now',
                timestamp: new Date().toISOString()
            }
        ];

        localStorage.setItem('adminActivityLog', JSON.stringify(defaultActivities));
    }
};
