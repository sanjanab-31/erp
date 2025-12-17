const API_URL = 'http://localhost:5000/api/email';

/**
 * Send credentials to Student and optionally Parent
 * @param {Object} data - { email, password, name, parentEmail }
 */
export const sendStudentCredentials = async (data) => {
    try {
        const response = await fetch(`${API_URL}/send-student-creds`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add Authorization header if needed later
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Server responded with ' + response.status);
        }

        return await response.json();
    } catch (error) {
        console.error('Email API Error (Student):', error);
        // Don't throw, just return failure so UI doesn't crash
        return { success: false, error: error.message };
    }
};

/**
 * Send credentials to Teacher
 * @param {Object} data - { email, password, name }
 */
export const sendTeacherCredentials = async (data) => {
    try {
        const response = await fetch(`${API_URL}/send-teacher-creds`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Server responded with ' + response.status);
        }

        return await response.json();
    } catch (error) {
        console.error('Email API Error (Teacher):', error);
        return { success: false, error: error.message };
    }
};
