const API_URL = import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/email` 
    : 'http://localhost:5000/api/email';

export const sendStudentCredentials = async (data) => {
    try {
        const response = await fetch(`${API_URL}/send-student-creds`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Server responded with ' + response.status);
        }

        return await response.json();
    } catch (error) {
        console.error('Email API Error (Student):', error);
        
        return { success: false, error: error.message };
    }
};

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
