import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const PAYMENT_SERVER_URL = 'http://localhost:4242';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const paymentApiInstance = axios.create({
    baseURL: PAYMENT_SERVER_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data?.message || error.message);
        return Promise.reject(error);
    }
);

export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    me: () => api.get('/auth/me'),
};

export const settingsApi = {
    get: (role) => api.get(`/settings/${role}`),
    update: (role, section, data) => api.put(`/settings/${role}/${section}`, data),
    forgotPassword: (data) => api.post('/auth/change-password', data),
};

export const studentApi = {
    getAll: (params) => api.get('/students', { params }),
    getByEmail: (email) => api.get(`/students/email/${email}`),
    getById: (id) => api.get(`/students/${id}`),
    create: (data) => api.post('/students', data),
    update: (id, data) => api.put(`/students/${id}`, data),
    delete: (id) => api.delete(`/students/${id}`),
    getStats: () => api.get('/students/stats'),
};

export const teacherApi = {
    getAll: (params) => api.get('/teachers', { params }),
    getById: (id) => api.get(`/teachers/${id}`),
    create: (data) => api.post('/teachers', data),
    update: (id, data) => api.put(`/teachers/${id}`, data),
    delete: (id) => api.delete(`/teachers/${id}`),
    getStats: () => api.get('/teachers/stats'),
};

export const announcementApi = {
    getAll: (params) => api.get('/communication/announcements', { params }),
    create: (data) => api.post('/communication/announcements', data),
    update: (id, data) => api.put(`/communication/announcements/${id}`, data),
    delete: (id) => api.delete(`/communication/announcements/${id}`),
    archive: (id) => api.put(`/communication/announcements/${id}/archive`),
    sendNotification: (data) => api.post('/email/send-announcement', data),
};

export const emailApi = {
    sendStudentCredentials: (data) => api.post('/email/send-student-creds', data),
    sendTeacherCredentials: (data) => api.post('/email/send-teacher-creds', data),
};

export const feeApi = {
    getAll: (params) => api.get('/fees', { params }),
    create: (data) => api.post('/fees', data),
    update: (id, data) => api.put(`/fees/${id}`, data),
    getStats: () => api.get('/fees/stats'),
};

export const libraryApi = {
    getAllBooks: (params) => api.get('/library/books', { params }),
    createBook: (data) => api.post('/library/books', data),
    updateBook: (id, data) => api.put(`/library/books/${id}`, data),
    deleteBook: (id) => api.delete(`/library/books/${id}`),
    getAllIssues: (params) => api.get('/library/issues', { params }),
    issueBook: (data) => api.post('/library/issues', data),
    returnBook: (id, data) => api.put(`/library/issues/${id}/return`, data),
    getStats: () => api.get('/library/stats'),
    getSettings: () => api.get('/library/settings'),
    updateSettings: (data) => api.put('/library/settings', data),
    updateIssueStatus: (id, status) => api.put(`/library/issues/${id}/status`, { status }),
};

export const attendanceApi = {
    getAll: (params) => api.get('/attendance', { params }),
    mark: (data) => api.post('/attendance', data),
    markBulk: (data) => api.post('/attendance/bulk', data),
    getStats: (date) => api.get('/attendance/stats', { params: { date } }),
    getByStudent: (studentId, params) => api.get(`/attendance/student/${studentId}`, { params }),
};

export const teacherAttendanceApi = {
    getAll: (date) => api.get('/teacher-attendance', { params: { date } }),
    markBulk: (data) => api.post('/teacher-attendance/bulk', data),
    getStats: (date) => api.get('/teacher-attendance/stats', { params: { date } }),
};

export const courseApi = {
    getAll: (params) => api.get('/courses', { params }),
    create: (data) => api.post('/courses', data),
};

export const examApi = {
    getAll: (params) => api.get('/exams', { params }),
    create: (data) => api.post('/exams', data),
    update: (id, data) => api.put(`/exams/${id}`, data),
    delete: (id) => api.delete(`/exams/${id}`),
    getStats: () => api.get('/exams/stats'),
};

export const resultApi = {
    getAll: (params) => api.get('/results', { params }),
    getByStudent: (studentId) => api.get(`/students/${studentId}/results`),
    save: (data) => api.post('/results', data),
    update: (id, data) => api.put(`/results/${id}`, data),
};

export const assignmentApi = {
    getAll: (params) => api.get('/assignments', { params }),
    create: (data) => api.post('/assignments', data),
    update: (id, data) => api.put(`/assignments/${id}`, data),
    delete: (id) => api.delete(`/assignments/${id}`),
    getSubmissions: (assignmentId) => api.get(`/submissions/assignment/${assignmentId}`),
    gradeSubmission: (id, data) => api.put(`/submissions/${id}/grade`, data),
    createSubmission: (data) => api.post(`/submissions`, data)
};

export const timetableApi = {
    getTeacherTimetables: () => api.get('/timetable/teachers'),
    getClassTimetables: () => api.get('/timetable/classes'),
    getClass: (className) => api.get(`/timetable/class/${className}`),
    saveTeacherTimetable: (data) => api.post('/timetable/teachers', data),
    saveClassTimetable: (data) => api.post('/timetable/classes', data),
    deleteTeacherTimetable: (id) => api.delete(`/timetable/teachers/${id}`),
    deleteClassTimetable: (id) => api.delete(`/timetable/classes/${id}`),
};

export const communicationApi = {
    getConversations: (params) => api.get('/communication/conversations', { params }),
    getMessages: (conversationId) => api.get(`/communication/conversations/${conversationId}/messages`),
    sendMessage: (data) => api.post('/communication/messages', data),
    markAsRead: (conversationId) => api.post(`/communication/conversations/${conversationId}/read`),
    getAnnouncements: (params) => api.get('/communication/announcements', { params }),
    createAnnouncement: (data) => api.post('/communication/announcements', data),
    getNotifications: (params) => api.get('/communication/notifications', { params }),
    markNotificationRead: (id) => api.post(`/communication/notifications/${id}/read`),
    getUnreadCounts: (params) => api.get('/communication/unread-counts', { params }),
};

export const paymentApi = {
    createCheckoutSession: (data) => paymentApiInstance.post('/create-checkout-session', data),
    getCheckoutSession: (sessionId) => paymentApiInstance.get(`/checkout-session/${sessionId}`),
};

export default api;

