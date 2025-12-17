


const STORAGE_KEY = 'erp_teachers_data';


const initializeDefaultData = () => {
    return [];
};


export const getAllTeachers = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            const defaultData = initializeDefaultData();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
            return defaultData;
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Error getting teachers:', error);
        return initializeDefaultData();
    }
};


export const addTeacher = (teacher) => {
    try {
        const teachers = getAllTeachers();
        const newTeacher = {
            ...teacher,
            id: Date.now(), 
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        teachers.push(newTeacher);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));

        
        window.dispatchEvent(new Event('teachersUpdated'));

        return newTeacher;
    } catch (error) {
        console.error('Error adding teacher:', error);
        throw error;
    }
};


export const updateTeacher = (id, updates) => {
    try {
        const teachers = getAllTeachers();
        const index = teachers.findIndex(t => t.id === id);

        if (index === -1) {
            throw new Error('Teacher not found');
        }

        teachers[index] = {
            ...teachers[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));

        
        window.dispatchEvent(new Event('teachersUpdated'));

        return teachers[index];
    } catch (error) {
        console.error('Error updating teacher:', error);
        throw error;
    }
};


export const deleteTeacher = (id) => {
    try {
        const teachers = getAllTeachers();
        const filteredTeachers = teachers.filter(t => t.id !== id);

        if (teachers.length === filteredTeachers.length) {
            throw new Error('Teacher not found');
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTeachers));

        
        window.dispatchEvent(new Event('teachersUpdated'));

        return true;
    } catch (error) {
        console.error('Error deleting teacher:', error);
        throw error;
    }
};


export const searchTeachers = (query) => {
    const teachers = getAllTeachers();
    const lowerQuery = query.toLowerCase();

    return teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(lowerQuery) ||
        teacher.employeeId.toLowerCase().includes(lowerQuery) ||
        teacher.email.toLowerCase().includes(lowerQuery) ||
        (teacher.subject && teacher.subject.toLowerCase().includes(lowerQuery))
    );
};


export const filterByDepartment = (department) => {
    const teachers = getAllTeachers();
    if (department === 'All Departments' || !department) {
        return teachers;
    }
    return teachers.filter(teacher => teacher.department === department);
};


export const filterByStatus = (status) => {
    const teachers = getAllTeachers();
    if (status === 'All' || !status) {
        return teachers;
    }
    return teachers.filter(teacher => teacher.status.toLowerCase() === status.toLowerCase());
};


export const getTeacherById = (id) => {
    const teachers = getAllTeachers();
    return teachers.find(t => t.id === id);
};


export const getTeacherStats = () => {
    const teachers = getAllTeachers();

    return {
        total: teachers.length,
        active: teachers.filter(t => t.status === 'Active').length,
        inactive: teachers.filter(t => t.status === 'Inactive').length,
        onLeave: teachers.filter(t => t.status === 'On Leave').length
    };
};


export const subscribeToUpdates = (callback) => {
    const handler = () => callback(getAllTeachers());
    window.addEventListener('teachersUpdated', handler);

    
    return () => window.removeEventListener('teachersUpdated', handler);
};

export default {
    getAllTeachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    searchTeachers,
    filterByDepartment,
    filterByStatus,
    getTeacherById,
    getTeacherStats,
    subscribeToUpdates
};
