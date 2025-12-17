import Course from '../models/coursemodel.js';
import Assignment from '../models/assignmentmodel.js';
import Material from '../models/materialmodel.js';

export const getAllCourses = async (req, res) => {
    try {
        const { teacherId, class: className } = req.query;
        let filter = {};

        if (teacherId) {
            filter.teacherId = teacherId;
        }
        if (className) {
            filter.class = className;
        }

        const courses = await Course.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findOne({ id });

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Deep fetch related assignments and materials
        // Assuming assignmentModel and materialModel have a 'courseId' field matching course.id
        const assignments = await Assignment.find({ courseId: id });
        const materials = await Material.find({ courseId: id });

        const courseData = {
            ...course.toObject(),
            assignments,
            materials
        };

        res.json({ success: true, data: courseData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createCourse = async (req, res) => {
    try {
        const newCourse = await Course.create({
            id: Date.now(),
            ...req.body,
            createdAt: new Date(),
            active: true
        });
        res.status(201).json({ success: true, data: newCourse });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findOneAndUpdate({ id }, req.body, { new: true });

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        res.json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findOneAndDelete({ id });

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        res.json({ success: true, message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
