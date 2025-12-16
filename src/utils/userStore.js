// User Management Store
// Manages all users (students, teachers, parents) added by admin

const STORAGE_KEY = 'erp_users';
const DEFAULT_PASSWORD = 'password';

// Initialize with admin user
const initializeDefaultUsers = () => {
    return {
        users: [
            {
                id: 'admin_1',
                email: 'admin@eshwar.com',
                password: 'admin123', // Admin has different password
                name: 'Admin User',
                role: 'admin',
                createdAt: new Date().toISOString(),
                createdBy: 'system',
                active: true
            }
        ]
    };
};

// Get all users
export const getAllUsers = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            const defaultData = initializeDefaultUsers();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
            return defaultData.users;
        }
        return JSON.parse(data).users;
    } catch (error) {
        console.error('Error getting users:', error);
        return initializeDefaultUsers().users;
    }
};

// Get user by email
export const getUserByEmail = (email) => {
    const users = getAllUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

// Get user by ID
export const getUserById = (id) => {
    const users = getAllUsers();
    return users.find(user => user.id === id);
};

// Authenticate user
export const authenticateUser = (email, password, role) => {
    const user = getUserByEmail(email);

    if (!user) {
        throw new Error('User not found. Please contact admin.');
    }

    if (!user.active) {
        throw new Error('Account is deactivated. Please contact admin.');
    }

    if (user.password !== password) {
        throw new Error('Invalid password');
    }

    if (user.role.toLowerCase() !== role.toLowerCase()) {
        throw new Error(`This account is registered as ${user.role}, not ${role}`);
    }

    return user;
};

// Add new student
export const addStudent = (studentData) => {
    try {
        const users = getAllUsers();

        // Check if email already exists
        if (getUserByEmail(studentData.email)) {
            throw new Error('Email already exists');
        }

        const newStudent = {
            id: `student_${Date.now()}`,
            email: studentData.email,
            password: DEFAULT_PASSWORD,
            name: studentData.name,
            role: 'student',
            class: studentData.class || '',
            rollNumber: studentData.rollNumber || '',
            parentEmail: studentData.parentEmail || '',
            phone: studentData.phone || '',
            address: studentData.address || '',
            dateOfBirth: studentData.dateOfBirth || '',
            createdAt: new Date().toISOString(),
            createdBy: studentData.createdBy || 'admin',
            active: true
        };

        users.push(newStudent);

        // Automatically create parent account if parent email is provided
        if (studentData.parentEmail && studentData.parentEmail.trim()) {
            const parentEmail = studentData.parentEmail.trim();

            // Check if parent account already exists
            const existingParent = getUserByEmail(parentEmail);

            if (!existingParent) {
                // Create new parent account
                const newParent = {
                    id: `parent_${Date.now()}`,
                    email: parentEmail,
                    password: DEFAULT_PASSWORD,
                    name: studentData.parentName || `Parent of ${studentData.name}`,
                    role: 'parent',
                    studentId: newStudent.id,
                    childName: studentData.name,
                    childClass: studentData.class || '',
                    relationship: 'Parent',
                    phone: studentData.phone || '',
                    address: studentData.address || '',
                    createdAt: new Date().toISOString(),
                    createdBy: studentData.createdBy || 'admin',
                    active: true
                };

                users.push(newParent);
            } else if (existingParent.role === 'parent') {
                // If parent exists, link this student to them
                // You can add multiple children support here if needed
                console.log(`Parent account already exists for ${parentEmail}`);
            }
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify({ users }));
        window.dispatchEvent(new Event('usersUpdated'));

        return newStudent;
    } catch (error) {
        console.error('Error adding student:', error);
        throw error;
    }
};

// Add new teacher
export const addTeacher = (teacherData) => {
    try {
        const users = getAllUsers();

        // Check if email already exists
        if (getUserByEmail(teacherData.email)) {
            throw new Error('Email already exists');
        }

        const newTeacher = {
            id: `teacher_${Date.now()}`,
            email: teacherData.email,
            password: DEFAULT_PASSWORD,
            name: teacherData.name,
            role: 'teacher',
            subject: teacherData.subject || '',
            department: teacherData.department || '',
            qualification: teacherData.qualification || '',
            phone: teacherData.phone || '',
            address: teacherData.address || '',
            dateOfBirth: teacherData.dateOfBirth || '',
            createdAt: new Date().toISOString(),
            createdBy: teacherData.createdBy || 'admin',
            active: true
        };

        users.push(newTeacher);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ users }));
        window.dispatchEvent(new Event('usersUpdated'));

        return newTeacher;
    } catch (error) {
        console.error('Error adding teacher:', error);
        throw error;
    }
};

// Add new parent
export const addParent = (parentData) => {
    try {
        const users = getAllUsers();

        // Check if email already exists
        if (getUserByEmail(parentData.email)) {
            throw new Error('Email already exists');
        }

        const newParent = {
            id: `parent_${Date.now()}`,
            email: parentData.email,
            password: DEFAULT_PASSWORD,
            name: parentData.name,
            role: 'parent',
            studentId: parentData.studentId || '',
            relationship: parentData.relationship || 'Parent',
            phone: parentData.phone || '',
            address: parentData.address || '',
            createdAt: new Date().toISOString(),
            createdBy: parentData.createdBy || 'admin',
            active: true
        };

        users.push(newParent);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ users }));
        window.dispatchEvent(new Event('usersUpdated'));

        return newParent;
    } catch (error) {
        console.error('Error adding parent:', error);
        throw error;
    }
};

// Update user
export const updateUser = (userId, updates) => {
    try {
        const users = getAllUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            throw new Error('User not found');
        }

        // Don't allow changing email to existing email
        if (updates.email && updates.email !== users[userIndex].email) {
            const existingUser = getUserByEmail(updates.email);
            if (existingUser && existingUser.id !== userId) {
                throw new Error('Email already exists');
            }
        }

        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ users }));
        window.dispatchEvent(new Event('usersUpdated'));

        return users[userIndex];
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// Delete user (soft delete - set active to false)
export const deleteUser = (userId) => {
    try {
        const users = getAllUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            throw new Error('User not found');
        }

        // Don't allow deleting admin
        if (users[userIndex].role === 'admin') {
            throw new Error('Cannot delete admin user');
        }

        users[userIndex].active = false;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ users }));
        window.dispatchEvent(new Event('usersUpdated'));

        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

// Permanently delete user
export const permanentlyDeleteUser = (userId) => {
    try {
        const users = getAllUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            throw new Error('User not found');
        }

        // Don't allow deleting admin
        if (users[userIndex].role === 'admin') {
            throw new Error('Cannot delete admin user');
        }

        users.splice(userIndex, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ users }));
        window.dispatchEvent(new Event('usersUpdated'));

        return true;
    } catch (error) {
        console.error('Error permanently deleting user:', error);
        throw error;
    }
};

// Activate user
export const activateUser = (userId) => {
    try {
        const users = getAllUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            throw new Error('User not found');
        }

        users[userIndex].active = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ users }));
        window.dispatchEvent(new Event('usersUpdated'));

        return users[userIndex];
    } catch (error) {
        console.error('Error activating user:', error);
        throw error;
    }
};

// Change password
export const changeUserPassword = (userId, newPassword) => {
    try {
        const users = getAllUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            throw new Error('User not found');
        }

        users[userIndex].password = newPassword;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ users }));
        window.dispatchEvent(new Event('usersUpdated'));

        return true;
    } catch (error) {
        console.error('Error changing password:', error);
        throw error;
    }
};

// Reset password to default
export const resetUserPassword = (userId) => {
    return changeUserPassword(userId, DEFAULT_PASSWORD);
};

// Get users by role
export const getUsersByRole = (role) => {
    const users = getAllUsers();
    return users.filter(u => u.role.toLowerCase() === role.toLowerCase());
};

// Get active users
export const getActiveUsers = () => {
    const users = getAllUsers();
    return users.filter(u => u.active);
};

// Get active users by role
export const getActiveUsersByRole = (role) => {
    const users = getAllUsers();
    return users.filter(u => u.role.toLowerCase() === role.toLowerCase() && u.active);
};

// Subscribe to user updates
export const subscribeToUserUpdates = (callback) => {
    const handler = () => callback(getAllUsers());
    window.addEventListener('usersUpdated', handler);

    // Return unsubscribe function
    return () => window.removeEventListener('usersUpdated', handler);
};

// Get statistics
export const getUserStatistics = () => {
    const users = getAllUsers();
    return {
        total: users.length,
        active: users.filter(u => u.active).length,
        inactive: users.filter(u => !u.active).length,
        students: users.filter(u => u.role === 'student').length,
        teachers: users.filter(u => u.role === 'teacher').length,
        parents: users.filter(u => u.role === 'parent').length,
        admins: users.filter(u => u.role === 'admin').length,
        activeStudents: users.filter(u => u.role === 'student' && u.active).length,
        activeTeachers: users.filter(u => u.role === 'teacher' && u.active).length,
        activeParents: users.filter(u => u.role === 'parent' && u.active).length
    };
};

export default {
    getAllUsers,
    getUserByEmail,
    getUserById,
    authenticateUser,
    addStudent,
    addTeacher,
    addParent,
    updateUser,
    deleteUser,
    permanentlyDeleteUser,
    activateUser,
    changeUserPassword,
    resetUserPassword,
    getUsersByRole,
    getActiveUsers,
    getActiveUsersByRole,
    subscribeToUserUpdates,
    getUserStatistics,
    DEFAULT_PASSWORD
};
