// Academic Management Store
// Manages courses, assignments, marks, and exam schedules

const STORAGE_KEY = 'erp_academic_data';

// Initialize default data
const initializeDefaultData = () => {
    return {
        courses: [],
        assignments: [],
        submissions: [],
        marks: [],
        examSchedules: [],
        courseMaterials: []
    };
};

// Get all academic data
export const getAllAcademicData = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            const defaultData = initializeDefaultData();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
            return defaultData;
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Error getting academic data:', error);
        return initializeDefaultData();
    }
};

// Save academic data
const saveAcademicData = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('academicDataUpdated'));
};

// ==================== COURSES ====================

// Create course (Teacher only)
export const createCourse = (courseData) => {
    try {
        const data = getAllAcademicData();
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

        const newCourse = {
            id: `course_${Date.now()}`,
            name: courseData.name,
            code: courseData.code,
            class: courseData.class,
            description: courseData.description || '',
            teacherId: currentUser.id || courseData.teacherId,
            teacherName: currentUser.name || courseData.teacherName,
            createdAt: new Date().toISOString(),
            active: true
        };

        data.courses.push(newCourse);
        saveAcademicData(data);

        return newCourse;
    } catch (error) {
        console.error('Error creating course:', error);
        throw error;
    }
};

// Get courses by teacher
export const getCoursesByTeacher = (teacherId) => {
    const data = getAllAcademicData();
    return data.courses.filter(c => c.teacherId === teacherId && c.active);
};

// Get courses by class
export const getCoursesByClass = (className) => {
    const data = getAllAcademicData();
    return data.courses.filter(c => c.class === className && c.active);
};

// Get course by ID
export const getCourseById = (courseId) => {
    const data = getAllAcademicData();
    return data.courses.find(c => c.id === courseId);
};

// Update course
export const updateCourse = (courseId, updates) => {
    try {
        const data = getAllAcademicData();
        const courseIndex = data.courses.findIndex(c => c.id === courseId);

        if (courseIndex === -1) {
            throw new Error('Course not found');
        }

        data.courses[courseIndex] = { ...data.courses[courseIndex], ...updates };
        saveAcademicData(data);

        return data.courses[courseIndex];
    } catch (error) {
        console.error('Error updating course:', error);
        throw error;
    }
};

// Delete course
export const deleteCourse = (courseId) => {
    try {
        const data = getAllAcademicData();
        const courseIndex = data.courses.findIndex(c => c.id === courseId);

        if (courseIndex === -1) {
            throw new Error('Course not found');
        }

        data.courses[courseIndex].active = false;
        saveAcademicData(data);

        return true;
    } catch (error) {
        console.error('Error deleting course:', error);
        throw error;
    }
};

// ==================== ASSIGNMENTS ====================

// Create assignment (Max 2 per course)
export const createAssignment = (assignmentData) => {
    try {
        const data = getAllAcademicData();

        // Check if course already has 2 assignments
        const courseAssignments = data.assignments.filter(a => a.courseId === assignmentData.courseId);
        if (courseAssignments.length >= 2) {
            throw new Error('Maximum 2 assignments per course allowed');
        }

        const newAssignment = {
            id: `assignment_${Date.now()}`,
            courseId: assignmentData.courseId,
            title: assignmentData.title,
            description: assignmentData.description || '',
            dueDate: assignmentData.dueDate,
            maxMarks: assignmentData.maxMarks || 100,
            createdAt: new Date().toISOString(),
            createdBy: assignmentData.createdBy
        };

        data.assignments.push(newAssignment);
        saveAcademicData(data);

        return newAssignment;
    } catch (error) {
        console.error('Error creating assignment:', error);
        throw error;
    }
};

// Get assignments by course
export const getAssignmentsByCourse = (courseId) => {
    const data = getAllAcademicData();
    return data.assignments.filter(a => a.courseId === courseId);
};

// Update assignment
export const updateAssignment = (assignmentId, updates) => {
    try {
        const data = getAllAcademicData();
        const assignmentIndex = data.assignments.findIndex(a => a.id === assignmentId);

        if (assignmentIndex === -1) {
            throw new Error('Assignment not found');
        }

        data.assignments[assignmentIndex] = { ...data.assignments[assignmentIndex], ...updates };
        saveAcademicData(data);

        return data.assignments[assignmentIndex];
    } catch (error) {
        console.error('Error updating assignment:', error);
        throw error;
    }
};

// Delete assignment
export const deleteAssignment = (assignmentId) => {
    try {
        const data = getAllAcademicData();
        const assignmentIndex = data.assignments.findIndex(a => a.id === assignmentId);

        if (assignmentIndex === -1) {
            throw new Error('Assignment not found');
        }

        data.assignments.splice(assignmentIndex, 1);
        saveAcademicData(data);

        return true;
    } catch (error) {
        console.error('Error deleting assignment:', error);
        throw error;
    }
};

// ==================== SUBMISSIONS ====================

// Submit assignment (Student)
export const submitAssignment = (submissionData) => {
    try {
        const data = getAllAcademicData();

        // Check if already submitted
        const existingSubmission = data.submissions.find(
            s => s.assignmentId === submissionData.assignmentId && s.studentId === submissionData.studentId
        );

        if (existingSubmission) {
            // Update existing submission
            existingSubmission.driveLink = submissionData.driveLink;
            existingSubmission.submittedAt = new Date().toISOString();
            existingSubmission.status = 'submitted';
        } else {
            // Create new submission
            const newSubmission = {
                id: `submission_${Date.now()}`,
                assignmentId: submissionData.assignmentId,
                courseId: submissionData.courseId,
                studentId: submissionData.studentId,
                studentName: submissionData.studentName,
                driveLink: submissionData.driveLink,
                submittedAt: new Date().toISOString(),
                status: 'submitted',
                marks: null,
                feedback: ''
            };

            data.submissions.push(newSubmission);
        }

        saveAcademicData(data);
        return true;
    } catch (error) {
        console.error('Error submitting assignment:', error);
        throw error;
    }
};

// Get submissions by assignment
export const getSubmissionsByAssignment = (assignmentId) => {
    const data = getAllAcademicData();
    return data.submissions.filter(s => s.assignmentId === assignmentId);
};

// Get submissions by student
export const getSubmissionsByStudent = (studentId) => {
    const data = getAllAcademicData();
    return data.submissions.filter(s => s.studentId === studentId);
};

// Get submission by student and assignment
export const getSubmission = (studentId, assignmentId) => {
    const data = getAllAcademicData();
    return data.submissions.find(s => s.studentId === studentId && s.assignmentId === assignmentId);
};

// Grade submission (Teacher)
export const gradeSubmission = (submissionId, marks, feedback = '') => {
    try {
        const data = getAllAcademicData();
        const submissionIndex = data.submissions.findIndex(s => s.id === submissionId);

        if (submissionIndex === -1) {
            throw new Error('Submission not found');
        }

        data.submissions[submissionIndex].marks = marks;
        data.submissions[submissionIndex].feedback = feedback;
        data.submissions[submissionIndex].status = 'graded';
        data.submissions[submissionIndex].gradedAt = new Date().toISOString();

        saveAcademicData(data);

        return data.submissions[submissionIndex];
    } catch (error) {
        console.error('Error grading submission:', error);
        throw error;
    }
};

// ==================== MARKS (EXAMS) ====================

// Enter exam marks (Teacher) - 3 exams per course per student
export const enterExamMarks = (marksData) => {
    try {
        const data = getAllAcademicData();

        const newMarks = {
            id: `marks_${Date.now()}`,
            courseId: marksData.courseId,
            studentId: marksData.studentId,
            studentName: marksData.studentName,
            exam1: marksData.exam1 || 0,
            exam2: marksData.exam2 || 0,
            exam3: marksData.exam3 || 0,
            enteredBy: marksData.enteredBy,
            enteredAt: new Date().toISOString()
        };

        // Check if marks already exist
        const existingMarksIndex = data.marks.findIndex(
            m => m.courseId === marksData.courseId && m.studentId === marksData.studentId
        );

        if (existingMarksIndex >= 0) {
            data.marks[existingMarksIndex] = { ...data.marks[existingMarksIndex], ...newMarks };
        } else {
            data.marks.push(newMarks);
        }

        saveAcademicData(data);

        return newMarks;
    } catch (error) {
        console.error('Error entering exam marks:', error);
        throw error;
    }
};

// Get exam marks by course
export const getExamMarksByCourse = (courseId) => {
    const data = getAllAcademicData();
    return data.marks.filter(m => m.courseId === courseId);
};

// Get exam marks by student
export const getExamMarksByStudent = (studentId) => {
    const data = getAllAcademicData();
    return data.marks.filter(m => m.studentId === studentId);
};

// Get student marks for a course
export const getStudentCourseMarks = (studentId, courseId) => {
    const data = getAllAcademicData();
    return data.marks.find(m => m.studentId === studentId && m.courseId === courseId);
};

// ==================== FINAL MARKS CALCULATION ====================

// Calculate final marks for a student in a course
export const calculateFinalMarks = (studentId, courseId) => {
    const data = getAllAcademicData();

    // Get assignment submissions
    const courseAssignments = data.assignments.filter(a => a.courseId === courseId);
    const submissions = data.submissions.filter(
        s => s.studentId === studentId && s.courseId === courseId && s.marks !== null
    );

    // Calculate assignment marks (out of 25)
    let assignmentTotal = 0;
    let assignmentCount = 0;

    submissions.forEach(sub => {
        if (sub.marks !== null) {
            assignmentTotal += parseFloat(sub.marks);
            assignmentCount++;
        }
    });

    // Scale to 25 marks
    const assignmentMarks = assignmentCount > 0 ? (assignmentTotal / assignmentCount) * 0.25 : 0;

    // Get exam marks
    const examMarks = data.marks.find(m => m.studentId === studentId && m.courseId === courseId);

    // Calculate exam total (out of 75)
    let examTotal = 0;
    if (examMarks) {
        const totalExamMarks = (examMarks.exam1 || 0) + (examMarks.exam2 || 0) + (examMarks.exam3 || 0);
        examTotal = (totalExamMarks / 300) * 75; // Scale to 75 marks (assuming each exam is out of 100)
    }

    // Final total
    const finalTotal = assignmentMarks + examTotal;

    return {
        studentId,
        courseId,
        assignmentMarks: parseFloat(assignmentMarks.toFixed(2)),
        examMarks: parseFloat(examTotal.toFixed(2)),
        finalTotal: parseFloat(finalTotal.toFixed(2)),
        assignmentCount,
        examScores: examMarks ? {
            exam1: examMarks.exam1 || 0,
            exam2: examMarks.exam2 || 0,
            exam3: examMarks.exam3 || 0
        } : null
    };
};

// Get all final marks for a student
export const getStudentFinalMarks = (studentId) => {
    const data = getAllAcademicData();
    const studentCourses = new Set();

    // Get all courses student has submissions or marks for
    data.submissions.filter(s => s.studentId === studentId).forEach(s => studentCourses.add(s.courseId));
    data.marks.filter(m => m.studentId === studentId).forEach(m => studentCourses.add(m.courseId));

    const finalMarks = [];
    studentCourses.forEach(courseId => {
        const course = data.courses.find(c => c.id === courseId);
        if (course) {
            const marks = calculateFinalMarks(studentId, courseId);
            finalMarks.push({
                ...marks,
                courseName: course.name,
                courseCode: course.code
            });
        }
    });

    return finalMarks;
};

// ==================== EXAM SCHEDULES ====================

// Create exam schedule (Admin only)
export const createExamSchedule = (scheduleData) => {
    try {
        const data = getAllAcademicData();

        const newSchedule = {
            id: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            courseId: scheduleData.courseId || '',
            courseName: scheduleData.courseName || '',
            subject: scheduleData.subject || scheduleData.courseName || '', // Added subject
            class: scheduleData.class,
            examName: scheduleData.examName,
            examDate: scheduleData.examDate,
            startTime: scheduleData.startTime,
            endTime: scheduleData.endTime,
            venue: scheduleData.venue || '',
            instructions: scheduleData.instructions || '',
            createdBy: scheduleData.createdBy,
            createdAt: new Date().toISOString()
        };

        data.examSchedules.push(newSchedule);
        saveAcademicData(data);

        return newSchedule;
    } catch (error) {
        console.error('Error creating exam schedule:', error);
        throw error;
    }
};

// Create multiple exam schedules (Bulk)
export const createBulkExamSchedules = (schedulesData) => {
    try {
        const data = getAllAcademicData();
        const newSchedules = schedulesData.map(scheduleData => ({
            id: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            courseId: scheduleData.courseId || '',
            courseName: scheduleData.courseName || '',
            subject: scheduleData.subject || scheduleData.courseName || '',
            class: scheduleData.class,
            examName: scheduleData.examName,
            examDate: scheduleData.examDate,
            startTime: scheduleData.startTime,
            endTime: scheduleData.endTime,
            venue: scheduleData.venue || '',
            instructions: scheduleData.instructions || '',
            createdBy: scheduleData.createdBy,
            createdAt: new Date().toISOString()
        }));

        data.examSchedules.push(...newSchedules);
        saveAcademicData(data);

        return newSchedules;
    } catch (error) {
        console.error('Error creating bulk exam schedules:', error);
        throw error;
    }
};

// Get exam schedules by class
export const getExamSchedulesByClass = (className) => {
    const data = getAllAcademicData();
    return data.examSchedules.filter(s => s.class === className)
        .sort((a, b) => new Date(a.examDate) - new Date(b.examDate));
};

// Get exam schedules by course
export const getExamSchedulesByCourse = (courseId) => {
    const data = getAllAcademicData();
    return data.examSchedules.filter(s => s.courseId === courseId)
        .sort((a, b) => new Date(a.examDate) - new Date(b.examDate));
};

// Update exam schedule
export const updateExamSchedule = (scheduleId, updates) => {
    try {
        const data = getAllAcademicData();
        const scheduleIndex = data.examSchedules.findIndex(s => s.id === scheduleId);

        if (scheduleIndex === -1) {
            throw new Error('Exam schedule not found');
        }

        data.examSchedules[scheduleIndex] = { ...data.examSchedules[scheduleIndex], ...updates };
        saveAcademicData(data);

        return data.examSchedules[scheduleIndex];
    } catch (error) {
        console.error('Error updating exam schedule:', error);
        throw error;
    }
};

// Delete exam schedule
export const deleteExamSchedule = (scheduleId) => {
    try {
        const data = getAllAcademicData();
        const scheduleIndex = data.examSchedules.findIndex(s => s.id === scheduleId);

        if (scheduleIndex === -1) {
            throw new Error('Exam schedule not found');
        }

        data.examSchedules.splice(scheduleIndex, 1);
        saveAcademicData(data);

        return true;
    } catch (error) {
        console.error('Error deleting exam schedule:', error);
        throw error;
    }
};

// ==================== COURSE MATERIALS ====================

// Upload course material (Teacher)
export const uploadCourseMaterial = (materialData) => {
    try {
        const data = getAllAcademicData();

        const newMaterial = {
            id: `material_${Date.now()}`,
            courseId: materialData.courseId,
            title: materialData.title,
            description: materialData.description || '',
            link: materialData.link,
            type: materialData.type || 'link', // link, drive, document
            uploadedBy: materialData.uploadedBy,
            uploadedAt: new Date().toISOString()
        };

        data.courseMaterials.push(newMaterial);
        saveAcademicData(data);

        return newMaterial;
    } catch (error) {
        console.error('Error uploading course material:', error);
        throw error;
    }
};

// Get course materials
export const getCourseMaterials = (courseId) => {
    const data = getAllAcademicData();
    return data.courseMaterials.filter(m => m.courseId === courseId)
        .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
};

// Delete course material
export const deleteCourseMaterial = (materialId) => {
    try {
        const data = getAllAcademicData();
        const materialIndex = data.courseMaterials.findIndex(m => m.id === materialId);

        if (materialIndex === -1) {
            throw new Error('Course material not found');
        }

        data.courseMaterials.splice(materialIndex, 1);
        saveAcademicData(data);

        return true;
    } catch (error) {
        console.error('Error deleting course material:', error);
        throw error;
    }
};

// ==================== SUBSCRIBE TO UPDATES ====================

export const subscribeToAcademicUpdates = (callback) => {
    const handler = () => callback(getAllAcademicData());
    window.addEventListener('academicDataUpdated', handler);

    return () => window.removeEventListener('academicDataUpdated', handler);
};

// ==================== STATISTICS ====================

export const getAcademicStatistics = () => {
    const data = getAllAcademicData();

    return {
        totalCourses: data.courses.filter(c => c.active).length,
        totalAssignments: data.assignments.length,
        totalSubmissions: data.submissions.length,
        pendingGrading: data.submissions.filter(s => s.status === 'submitted').length,
        gradedSubmissions: data.submissions.filter(s => s.status === 'graded').length,
        totalExamSchedules: data.examSchedules.length,
        totalCourseMaterials: data.courseMaterials.length
    };
};

export default {
    // Courses
    createCourse,
    getCoursesByTeacher,
    getCoursesByClass,
    getCourseById,
    updateCourse,
    deleteCourse,

    // Assignments
    createAssignment,
    getAssignmentsByCourse,
    updateAssignment,
    deleteAssignment,

    // Submissions
    submitAssignment,
    getSubmissionsByAssignment,
    getSubmissionsByStudent,
    getSubmission,
    gradeSubmission,

    // Exam Marks
    enterExamMarks,
    getExamMarksByCourse,
    getExamMarksByStudent,
    getStudentCourseMarks,

    // Final Marks
    calculateFinalMarks,
    getStudentFinalMarks,

    // Exam Schedules
    createExamSchedule,
    createBulkExamSchedules,
    getExamSchedulesByClass,
    getExamSchedulesByCourse,
    updateExamSchedule,
    deleteExamSchedule,

    // Course Materials
    uploadCourseMaterial,
    getCourseMaterials,
    deleteCourseMaterial,

    // Utils
    subscribeToAcademicUpdates,
    getAcademicStatistics,
    getAllAcademicData
};
