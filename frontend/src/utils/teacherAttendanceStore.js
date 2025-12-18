

const STORAGE_KEY = 'erp_teacher_attendance_data';

const initializeDefaultData = () => {
    return [];
};

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

export const markAttendance = (attendanceData) => {
    try {
        const allAttendance = getAllAttendance();
        const { date, teacherId, status, markedBy } = attendanceData;

        const existingIndex = allAttendance.findIndex(
            a => a.date === date && a.teacherId === teacherId
        );

        const newRecord = {
            id: existingIndex >= 0 ? allAttendance[existingIndex].id : Date.now(),
            date,
            teacherId,
            status, 
            markedBy,
            markedAt: new Date().toISOString()
        };

        if (existingIndex >= 0) {
            
            allAttendance[existingIndex] = newRecord;
        } else {
            
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

export const bulkMarkAttendance = (attendanceList) => {
    try {
        const allAttendance = getAllAttendance();
        const date = attendanceList[0]?.date;

        if (!date) return;

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

export const getAttendanceByDate = (date) => {
    const allAttendance = getAllAttendance();
    return allAttendance.filter(a => a.date === date);
};

export const getAttendanceByTeacher = (teacherId) => {
    const allAttendance = getAllAttendance();
    return allAttendance.filter(a => a.teacherId === teacherId);
};

export const getAttendanceStats = (date, totalTeachers = 0) => {
    const attendance = getAttendanceByDate(date);

    const present = attendance.filter(a => a.status === 'Present').length;
    const absent = attendance.filter(a => a.status === 'Absent').length;
    const late = attendance.filter(a => a.status === 'Late').length;

    return {
        total: attendance.length, 
        present,
        absent,
        late,
        unmarked: Math.max(0, totalTeachers - attendance.length)
    };
};

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
