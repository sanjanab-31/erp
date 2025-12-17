import Settings from '../models/settingsModel.js';

export const getSettings = async (req, res) => {
    try {
        const { userId } = req.params;
        let settings = await Settings.findOne({ userId: Number(userId) });

        if (!settings) {
            // Return default settings if not found
            settings = {
                userId: Number(userId),
                role: 'user', // Defaults
                theme: 'light',
                notifications: { email: true, push: true, sms: false },
                dashboardLayout: {}
            };
        }

        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;

        const settings = await Settings.findOneAndUpdate(
            { userId: Number(userId) },
            { ...updates, updatedAt: new Date() },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const resetSettings = async (req, res) => {
    try {
        const { userId } = req.params;
        await Settings.findOneAndDelete({ userId: Number(userId) });
        res.json({ success: true, message: 'Settings reset to default' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
