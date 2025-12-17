


const STORAGE_KEY = 'erp_course_data';


const initializeDefaultData = () => {
    return [];
};


export const getAllCourses = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            const defaultData = initializeDefaultData();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
            return defaultData;
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Error getting courses:', error);
        return initializeDefaultData();
    }
};


export const addCourse = (courseData) => {
    try {
        console.log('Adding course with data:', courseData);
        const courses = getAllCourses();
        const newCourse = {
            id: Date.now(),
            teacherId: courseData.teacherId,
            teacherName: courseData.teacherName,
            courseName: courseData.courseName,
            subject: courseData.subject,
            class: courseData.class,
            description: courseData.description || '',
            materials: [],
            assignments: [],
            enrolledStudents: courseData.enrolledStudents || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        console.log('New course created:', newCourse);
        courses.push(newCourse);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
        console.log('Course saved to localStorage');

        
        window.dispatchEvent(new Event('coursesUpdated'));
        console.log('coursesUpdated event dispatched');

        return newCourse;
    } catch (error) {
        console.error('Error adding course:', error);
        throw error;
    }
};


export const updateCourse = (courseId, updates) => {
    try {
        const courses = getAllCourses();
        const index = courses.findIndex(c => c.id === courseId);

        if (index === -1) {
            throw new Error('Course not found');
        }

        courses[index] = {
            ...courses[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));

        
        window.dispatchEvent(new Event('coursesUpdated'));

        return courses[index];
    } catch (error) {
        console.error('Error updating course:', error);
        throw error;
    }
};


export const deleteCourse = (courseId) => {
    try {
        const courses = getAllCourses();
        const filteredCourses = courses.filter(c => c.id !== courseId);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCourses));

        
        window.dispatchEvent(new Event('coursesUpdated'));

        return true;
    } catch (error) {
        console.error('Error deleting course:', error);
        throw error;
    }
};


export const addCourseMaterial = (courseId, materialData) => {
    try {
        const courses = getAllCourses();
        const course = courses.find(c => c.id === courseId);

        if (!course) {
            throw new Error('Course not found');
        }

        const newMaterial = {
            id: Date.now(),
            title: materialData.title,
            description: materialData.description || '',
            link: materialData.link,
            type: materialData.type || 'link', 
            uploadedAt: new Date().toISOString()
        };

        course.materials.push(newMaterial);
        course.updatedAt = new Date().toISOString();

        const index = courses.findIndex(c => c.id === courseId);
        courses[index] = course;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));

        
        window.dispatchEvent(new Event('coursesUpdated'));

        return newMaterial;
    } catch (error) {
        console.error('Error adding course material:', error);
        throw error;
    }
};


export const deleteCourseMaterial = (courseId, materialId) => {
    try {
        const courses = getAllCourses();
        const course = courses.find(c => c.id === courseId);

        if (!course) {
            throw new Error('Course not found');
        }

        course.materials = course.materials.filter(m => m.id !== materialId);
        course.updatedAt = new Date().toISOString();

        const index = courses.findIndex(c => c.id === courseId);
        courses[index] = course;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));

        
        window.dispatchEvent(new Event('coursesUpdated'));

        return true;
    } catch (error) {
        console.error('Error deleting course material:', error);
        throw error;
    }
};


export const addAssignment = (courseId, assignmentData) => {
    try {
        const courses = getAllCourses();
        const course = courses.find(c => c.id === courseId);

        if (!course) {
            throw new Error('Course not found');
        }

        const newAssignment = {
            id: Date.now(),
            title: assignmentData.title,
            description: assignmentData.description || '',
            dueDate: assignmentData.dueDate,
            submissions: [],
            createdAt: new Date().toISOString()
        };

        course.assignments.push(newAssignment);
        course.updatedAt = new Date().toISOString();

        const index = courses.findIndex(c => c.id === courseId);
        courses[index] = course;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));

        
        window.dispatchEvent(new Event('coursesUpdated'));

        return newAssignment;
    } catch (error) {
        console.error('Error adding assignment:', error);
        throw error;
    }
};


export const deleteAssignment = (courseId, assignmentId) => {
    try {
        const courses = getAllCourses();
        const course = courses.find(c => c.id === courseId);

        if (!course) {
            throw new Error('Course not found');
        }

        course.assignments = course.assignments.filter(a => a.id !== assignmentId);
        course.updatedAt = new Date().toISOString();

        const index = courses.findIndex(c => c.id === courseId);
        courses[index] = course;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));

        
        window.dispatchEvent(new Event('coursesUpdated'));

        return true;
    } catch (error) {
        console.error('Error deleting assignment:', error);
        throw error;
    }
};


export const submitAssignment = (courseId, assignmentId, submissionData) => {
    try {
        const courses = getAllCourses();
        const course = courses.find(c => c.id === courseId);

        if (!course) {
            throw new Error('Course not found');
        }

        const assignment = course.assignments.find(a => a.id === assignmentId);

        if (!assignment) {
            throw new Error('Assignment not found');
        }

        
        const existingSubmissionIndex = assignment.submissions.findIndex(
            s => s.studentId === submissionData.studentId
        );

        const newSubmission = {
            id: Date.now(),
            studentId: submissionData.studentId,
            studentName: submissionData.studentName,
            link: submissionData.link,
            submittedAt: new Date().toISOString()
        };

        if (existingSubmissionIndex >= 0) {
            
            assignment.submissions[existingSubmissionIndex] = newSubmission;
        } else {
            
            assignment.submissions.push(newSubmission);
        }

        course.updatedAt = new Date().toISOString();

        const courseIndex = courses.findIndex(c => c.id === courseId);
        courses[courseIndex] = course;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));

        
        window.dispatchEvent(new Event('coursesUpdated'));

        return newSubmission;
    } catch (error) {
        console.error('Error submitting assignment:', error);
        throw error;
    }
};


export const getCoursesByTeacher = (teacherId) => {
    console.log('getCoursesByTeacher called with teacherId:', teacherId);
    const courses = getAllCourses();
    console.log('All courses in store:', courses);

    const filtered = courses.filter(c => {
        const match = c.teacherId.toString() === teacherId.toString();
        console.log(`Comparing course teacherId: ${c.teacherId} with ${teacherId} = ${match}`);
        return match;
    });

    console.log('Filtered courses for teacher:', filtered);
    return filtered;
};


export const getCoursesByClass = (className) => {
    console.log('getCoursesByClass called with className:', className);
    const courses = getAllCourses();
    console.log('All courses in store:', courses);

    const filtered = courses.filter(c => {
        const match = c.class === className;
        console.log(`Comparing course class: ${c.class} with ${className} = ${match}`);
        return match;
    });

    console.log('Filtered courses for class:', filtered);
    return filtered;
};


export const getCoursesForStudent = (studentId) => {
    const courses = getAllCourses();
    return courses.filter(c =>
        c.enrolledStudents.some(s => s.toString() === studentId.toString())
    );
};


export const subscribeToUpdates = (callback) => {
    const handler = () => callback(getAllCourses());
    window.addEventListener('coursesUpdated', handler);

    
    return () => window.removeEventListener('coursesUpdated', handler);
};

export default {
    getAllCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    addCourseMaterial,
    deleteCourseMaterial,
    addAssignment,
    deleteAssignment,
    submitAssignment,
    getCoursesByTeacher,
    getCoursesByClass,
    getCoursesForStudent,
    subscribeToUpdates
};
