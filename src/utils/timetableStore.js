// Centralized Timetable Data Store
// This provides real-time timetable synchronization across Admin, Teacher, Student, and Parent portals

const STORAGE_KEY = 'erp_timetable_data';

// Initialize with default data if empty
const initializeDefaultData = () => {
    return {
        teachers: [],  // Teacher timetables
        students: []   // Student timetables (by class)
    };
};

// Get all timetables
export const getAllTimetables = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            const defaultData = initializeDefaultData();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
            return defaultData;
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Error getting timetables:', error);
        return initializeDefaultData();
    }
};

// Add or update teacher timetable
export const saveTeacherTimetable = (teacherId, timetableData) => {
    try {
        const allTimetables = getAllTimetables();
        const existingIndex = allTimetables.teachers.findIndex(t => t.teacherId === teacherId);

        const timetableEntry = {
            id: existingIndex >= 0 ? allTimetables.teachers[existingIndex].id : Date.now(),
            teacherId,
            teacherName: timetableData.teacherName,
            schedule: timetableData.schedule, // Array of schedule entries
            createdAt: existingIndex >= 0 ? allTimetables.teachers[existingIndex].createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (existingIndex >= 0) {
            allTimetables.teachers[existingIndex] = timetableEntry;
        } else {
            allTimetables.teachers.push(timetableEntry);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(allTimetables));

        // Trigger storage event for real-time updates
        window.dispatchEvent(new Event('timetableUpdated'));

        return timetableEntry;
    } catch (error) {
        console.error('Error saving teacher timetable:', error);
        throw error;
    }
};

// Add or update student/class timetable
export const saveClassTimetable = (className, timetableData) => {
    try {
        const allTimetables = getAllTimetables();
        const existingIndex = allTimetables.students.findIndex(t => t.className === className);

        const timetableEntry = {
            id: existingIndex >= 0 ? allTimetables.students[existingIndex].id : Date.now(),
            className,
            schedule: timetableData.schedule, // Array of schedule entries
            createdAt: existingIndex >= 0 ? allTimetables.students[existingIndex].createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (existingIndex >= 0) {
            allTimetables.students[existingIndex] = timetableEntry;
        } else {
            allTimetables.students.push(timetableEntry);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(allTimetables));

        // Trigger storage event for real-time updates
        window.dispatchEvent(new Event('timetableUpdated'));

        return timetableEntry;
    } catch (error) {
        console.error('Error saving class timetable:', error);
        throw error;
    }
};

// Get teacher timetable by teacher ID
export const getTeacherTimetable = (teacherId) => {
    const allTimetables = getAllTimetables();
    return allTimetables.teachers.find(t => t.teacherId === teacherId);
};

// Get class timetable by class name
export const getClassTimetable = (className) => {
    const allTimetables = getAllTimetables();
    return allTimetables.students.find(t => t.className === className);
};

// Get all teacher timetables
export const getAllTeacherTimetables = () => {
    const allTimetables = getAllTimetables();
    return allTimetables.teachers;
};

// Get all class timetables
export const getAllClassTimetables = () => {
    const allTimetables = getAllTimetables();
    return allTimetables.students;
};

// Delete teacher timetable
export const deleteTeacherTimetable = (teacherId) => {
    try {
        const allTimetables = getAllTimetables();
        allTimetables.teachers = allTimetables.teachers.filter(t => t.teacherId !== teacherId);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(allTimetables));

        // Trigger storage event for real-time updates
        window.dispatchEvent(new Event('timetableUpdated'));

        return true;
    } catch (error) {
        console.error('Error deleting teacher timetable:', error);
        throw error;
    }
};

// Delete class timetable
export const deleteClassTimetable = (className) => {
    try {
        const allTimetables = getAllTimetables();
        allTimetables.students = allTimetables.students.filter(t => t.className !== className);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(allTimetables));

        // Trigger storage event for real-time updates
        window.dispatchEvent(new Event('timetableUpdated'));

        return true;
    } catch (error) {
        console.error('Error deleting class timetable:', error);
        throw error;
    }
};

// Get timetable statistics
export const getTimetableStats = () => {
    const allTimetables = getAllTimetables();

    return {
        totalTeachers: allTimetables.teachers.length,
        totalClasses: allTimetables.students.length
    };
};

// Subscribe to real-time updates
export const subscribeToUpdates = (callback) => {
    const handler = () => callback(getAllTimetables());
    window.addEventListener('timetableUpdated', handler);

    // Return unsubscribe function
    return () => window.removeEventListener('timetableUpdated', handler);
};

// Helper function to get schedule for a specific day
export const getScheduleForDay = (schedule, day) => {
    if (!schedule || !Array.isArray(schedule)) return [];
    return schedule.filter(entry => entry.day === day);
};

// Helper function to format time
export const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
};

export default {
    getAllTimetables,
    saveTeacherTimetable,
    saveClassTimetable,
    getTeacherTimetable,
    getClassTimetable,
    getAllTeacherTimetables,
    getAllClassTimetables,
    deleteTeacherTimetable,
    deleteClassTimetable,
    getTimetableStats,
    subscribeToUpdates,
    getScheduleForDay,
    formatTime
};
