


const STORAGE_KEY = 'erp_students_data';


const initializeDefaultData = () => {
    return [];
};


export const getAllStudents = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            const defaultData = initializeDefaultData();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
            return defaultData;
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Error getting students:', error);
        return initializeDefaultData();
    }
};


export const addStudent = (student) => {
    try {
        const students = getAllStudents();
        const newStudent = {
            ...student,
            id: Date.now(), 
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        students.push(newStudent);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(students));

        
        window.dispatchEvent(new Event('studentsUpdated'));

        return newStudent;
    } catch (error) {
        console.error('Error adding student:', error);
        throw error;
    }
};


export const updateStudent = (id, updates) => {
    try {
        const students = getAllStudents();
        const index = students.findIndex(s => s.id === id);

        if (index === -1) {
            throw new Error('Student not found');
        }

        students[index] = {
            ...students[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(students));

        
        window.dispatchEvent(new Event('studentsUpdated'));

        return students[index];
    } catch (error) {
        console.error('Error updating student:', error);
        throw error;
    }
};


export const deleteStudent = (id) => {
    try {
        const students = getAllStudents();
        const filteredStudents = students.filter(s => s.id !== id);

        if (students.length === filteredStudents.length) {
            throw new Error('Student not found');
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredStudents));

        
        window.dispatchEvent(new Event('studentsUpdated'));

        return true;
    } catch (error) {
        console.error('Error deleting student:', error);
        throw error;
    }
};


export const searchStudents = (query) => {
    const students = getAllStudents();
    const lowerQuery = query.toLowerCase();

    return students.filter(student =>
        student.name.toLowerCase().includes(lowerQuery) ||
        student.rollNo.toLowerCase().includes(lowerQuery) ||
        student.email.toLowerCase().includes(lowerQuery) ||
        student.class.toLowerCase().includes(lowerQuery)
    );
};


export const filterByClass = (className) => {
    const students = getAllStudents();
    if (className === 'All Classes' || !className) {
        return students;
    }
    return students.filter(student => student.class === className);
};


export const filterByStatus = (status) => {
    const students = getAllStudents();
    if (status === 'All' || !status) {
        return students;
    }
    return students.filter(student => student.status.toLowerCase() === status.toLowerCase());
};


export const getStudentById = (id) => {
    const students = getAllStudents();
    return students.find(s => s.id === id);
};


export const getStudentStats = () => {
    const students = getAllStudents();

    return {
        total: students.length,
        active: students.filter(s => s.status === 'Active').length,
        inactive: students.filter(s => s.status === 'Inactive').length,
        warning: students.filter(s => s.status === 'Warning').length,
        avgAttendance: students.length > 0
            ? Math.round(students.reduce((acc, s) => acc + (s.attendance || 0), 0) / students.length)
            : 0
    };
};


export const subscribeToUpdates = (callback) => {
    const handler = () => callback(getAllStudents());
    window.addEventListener('studentsUpdated', handler);

    
    return () => window.removeEventListener('studentsUpdated', handler);
};

export default {
    getAllStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    searchStudents,
    filterByClass,
    filterByStatus,
    getStudentById,
    getStudentStats,
    subscribeToUpdates
};
