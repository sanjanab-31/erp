// Authentication utility functions

export const isAuthenticated = () => {
    return localStorage.getItem('isAuthenticated') === 'true';
};

export const getUserRole = () => {
    return localStorage.getItem('userRole') || null;
};

export const getUserEmail = () => {
    return localStorage.getItem('userEmail') || null;
};

export const getUserName = () => {
    return localStorage.getItem('userName') || null;
};

export const login = (email, role) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', role);
    localStorage.setItem('userEmail', email);
};

export const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
};

export const checkCredentials = (email, password) => {
    const demoCredentials = [
        { role: 'Admin', email: 'admin@school.com', password: 'admin123' },
        { role: 'Teacher', email: 'teacher@school.com', password: 'teacher123' },
        { role: 'Student', email: 'student@school.com', password: 'student123' },
        { role: 'Parent', email: 'parent@school.com', password: 'parent123' }
    ];

    return demoCredentials.find(
        cred => cred.email === email && cred.password === password
    );
};
