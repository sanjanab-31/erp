// Centralized Teacher Attendance Data Store
// This provides real-time attendance synchronization for Teacher records

const STORAGE_KEY = 'erp_teacher_attendance_data';

// Initialize with default data if empty
const initializeDefaultData = () => {
    return [];
};

// Get all attendance records
export const getAllAttendance = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            const defaultData = initializeDefaultData();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
            return defaultData;
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Error getting teacher attendance:', error);
        return initializeDefaultData();
    }
};

// Mark attendance for a specific teacher and date (Single)
export const markAttendance = (attendanceData) => {
    try {
        const allAttendance = getAllAttendance();
        const { date, teacherId, status, markedBy } = attendanceData;

        // Check if attendance already exists for this teacher on this date
        const existingIndex = allAttendance.findIndex(
            a => a.date === date && a.teacherId === teacherId
        );

        const newRecord = {
            id: existingIndex >= 0 ? allAttendance[existingIndex].id : Date.now(),
            date,
            teacherId,
            status, // 'Present', 'Absent', 'Late'
            markedBy,
            markedAt: new Date().toISOString()
        };

        if (existingIndex >= 0) {
            // Update existing record
            allAttendance[existingIndex] = newRecord;
        } else {
            // Add new record
            allAttendance.push(newRecord);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(allAttendance));
        window.dispatchEvent(new Event('teacherAttendanceUpdated'));

        return newRecord;
    } catch (error) {
        console.error('Error marking teacher attendance:', error);
        throw error;
    }
};

// Bulk mark attendance for teachers
export const bulkMarkAttendance = (attendanceList) => {
    try {
        const allAttendance = getAllAttendance();
        const date = attendanceList[0]?.date;

        if (!date) return;

        // Create a map of existing attendance for this date for quick lookup
        const otherDatesAttendance = allAttendance.filter(a => a.date !== date);
        const existingDateAttendance = allAttendance.filter(a => a.date === date);

        const newRecords = attendanceList.map(record => {
            const existing = existingDateAttendance.find(a => a.teacherId === record.teacherId);
            return {
                id: existing ? existing.id : Date.now() + Math.random(),
                ...record,
                markedAt: new Date().toISOString()
            };
        });

        // Merge: Keep other dates, replace current date's records with new ones (or merge if partial? 
        // Logic: Usually "Save" overwrites for that day/list. 
        // But to be safe lets just upsert based on the list provided, retaining ones not in the list if any?
        // Requirement says "Attendance is saved only after clicking Save". 
        // It implies the state in UI is the source of truth for that day.

        // Let's go with: Remove old records for these specific teachers on this date, add new ones.
        // Actually, simpler: Filter out records for (date + teacherIds in list), then push new ones.

        const teacherIdsToUpdate = attendanceList.map(a => a.teacherId);

        const keptAttendance = allAttendance.filter(a =>
            !(a.date === date && teacherIdsToUpdate.includes(a.teacherId))
        );

        const finalAttendance = [...keptAttendance, ...newRecords];

        localStorage.setItem(STORAGE_KEY, JSON.stringify(finalAttendance));
        window.dispatchEvent(new Event('teacherAttendanceUpdated'));

        return newRecords;
    } catch (error) {
        console.error('Error bulk marking teacher attendance:', error);
        throw error;
    }
};

// Get attendance for a specific date
export const getAttendanceByDate = (date) => {
    const allAttendance = getAllAttendance();
    return allAttendance.filter(a => a.date === date);
};

// Get attendance for a specific teacher
export const getAttendanceByTeacher = (teacherId) => {
    const allAttendance = getAllAttendance();
    return allAttendance.filter(a => a.teacherId === teacherId);
};

// Get attendance statistics for a date
export const getAttendanceStats = (date) => {
    const attendance = getAttendanceByDate(date);

    return {
        total: attendance.length,
        present: attendance.filter(a => a.status === 'Present').length,
        absent: attendance.filter(a => a.status === 'Absent').length,
        late: attendance.filter(a => a.status === 'Late').length
    };
};

// Subscribe to real-time updates
export const subscribeToUpdates = (callback) => {
    const handler = () => callback(getAllAttendance());
    window.addEventListener('teacherAttendanceUpdated', handler);
    return () => window.removeEventListener('teacherAttendanceUpdated', handler);
};

export default {
    getAllAttendance,
    markAttendance,
    bulkMarkAttendance,
    getAttendanceByDate,
    getAttendanceByTeacher,
    getAttendanceStats,
    subscribeToUpdates
};
