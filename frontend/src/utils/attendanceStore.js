


const STORAGE_KEY = 'erp_attendance_data';


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
        console.error('Error getting attendance:', error);
        return initializeDefaultData();
    }
};


export const markAttendance = (attendanceData) => {
    try {
        const allAttendance = getAllAttendance();
        const { date, studentId, status, markedBy } = attendanceData;

        
        const existingIndex = allAttendance.findIndex(
            a => a.date === date && a.studentId === studentId
        );

        const newRecord = {
            id: existingIndex >= 0 ? allAttendance[existingIndex].id : Date.now(),
            date,
            studentId,
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

        
        window.dispatchEvent(new Event('attendanceUpdated'));

        return newRecord;
    } catch (error) {
        console.error('Error marking attendance:', error);
        throw error;
    }
};


export const bulkMarkAttendance = (attendanceList) => {
    try {
        const allAttendance = getAllAttendance();
        const date = attendanceList[0]?.date;

        
        const filteredAttendance = allAttendance.filter(a => a.date !== date);

        
        const newRecords = attendanceList.map(record => ({
            id: Date.now() + Math.random(),
            ...record,
            markedAt: new Date().toISOString()
        }));

        const updatedAttendance = [...filteredAttendance, ...newRecords];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAttendance));

        
        window.dispatchEvent(new Event('attendanceUpdated'));

        return newRecords;
    } catch (error) {
        console.error('Error bulk marking attendance:', error);
        throw error;
    }
};


export const getAttendanceByDate = (date) => {
    const allAttendance = getAllAttendance();
    return allAttendance.filter(a => a.date === date);
};


export const getAttendanceByStudent = (studentId) => {
    const allAttendance = getAllAttendance();
    return allAttendance.filter(a => a.studentId === studentId);
};


export const getAttendanceByDateRange = (startDate, endDate) => {
    const allAttendance = getAllAttendance();
    return allAttendance.filter(a => a.date >= startDate && a.date <= endDate);
};


export const calculateAttendancePercentage = (studentId, startDate = null, endDate = null) => {
    let attendance;

    if (startDate && endDate) {
        attendance = getAttendanceByDateRange(startDate, endDate).filter(a => a.studentId === studentId);
    } else {
        attendance = getAttendanceByStudent(studentId);
    }

    if (attendance.length === 0) return 0;

    const presentCount = attendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
    return Math.round((presentCount / attendance.length) * 100);
};


export const getAttendanceStats = (date) => {
    const attendance = getAttendanceByDate(date);

    return {
        total: attendance.length,
        present: attendance.filter(a => a.status === 'Present').length,
        absent: attendance.filter(a => a.status === 'Absent').length,
        late: attendance.filter(a => a.status === 'Late').length,
        excused: attendance.filter(a => a.status === 'Excused').length
    };
};


export const getOverallAttendanceStats = () => {
    const allAttendance = getAllAttendance();

    return {
        totalRecords: allAttendance.length,
        present: allAttendance.filter(a => a.status === 'Present').length,
        absent: allAttendance.filter(a => a.status === 'Absent').length,
        late: allAttendance.filter(a => a.status === 'Late').length,
        excused: allAttendance.filter(a => a.status === 'Excused').length
    };
};


export const deleteAttendance = (id) => {
    try {
        const allAttendance = getAllAttendance();
        const filteredAttendance = allAttendance.filter(a => a.id !== id);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredAttendance));

        
        window.dispatchEvent(new Event('attendanceUpdated'));

        return true;
    } catch (error) {
        console.error('Error deleting attendance:', error);
        throw error;
    }
};


export const subscribeToUpdates = (callback) => {
    const handler = () => callback(getAllAttendance());
    window.addEventListener('attendanceUpdated', handler);

    
    return () => window.removeEventListener('attendanceUpdated', handler);
};

export default {
    getAllAttendance,
    markAttendance,
    bulkMarkAttendance,
    getAttendanceByDate,
    getAttendanceByStudent,
    getAttendanceByDateRange,
    calculateAttendancePercentage,
    getAttendanceStats,
    getOverallAttendanceStats,
    deleteAttendance,
    subscribeToUpdates
};
