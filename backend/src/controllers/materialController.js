import Material from '../models/materialmodel.js';

export const getMaterialsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const materials = await Material.find({ courseId: Number(courseId) });
        res.json({ success: true, data: materials });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createMaterial = async (req, res) => {
    try {
        const newMaterial = await Material.create({
            id: Date.now(),
            ...req.body,
            uploadedAt: new Date()
        });
        res.status(201).json({ success: true, data: newMaterial });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const material = await Material.findOneAndDelete({ id });

        if (!material) {
            return res.status(404).json({ success: false, message: 'Material not found' });
        }

        res.json({ success: true, message: 'Material deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
