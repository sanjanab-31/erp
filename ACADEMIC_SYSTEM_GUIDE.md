# Academic Management System - Implementation Guide

## Overview
A comprehensive academic management system has been implemented with the following features:

### **Teacher Portal**
- Create and manage courses
- Upload exactly 2 assignments per course
- View student submissions (Drive links)
- Grade assignments
- Enter 3 exam marks per student per course
- Upload course materials

### **Student Portal**
- View assigned courses
- Submit assignments via Drive links
- View assignment marks
- View exam marks (3 exams)
- View final calculated marks (Assignment 25 + Exam 75 = 100)
- View exam schedules
- Access course materials

### **Parent Portal**
- View child's courses
- View assignment marks
- View exam marks
- View final calculated scores
- View exam schedules

### **Admin Portal**
- Create class-wise and course-wise exam schedules
- Schedules auto-visible in student and parent portals

## Marks Calculation Logic

### **Assignment Marks (25 marks)**
```
1. Teacher uploads 2 assignments per course
2. Students submit via Drive links
3. Teacher grades each submission (out of 100)
4. Calculation:
   - Add both assignment marks
   - Divide by 2 (average)
   - Multiply by 0.25
   - Result: Assignment marks out of 25
```

### **Exam Marks (75 marks)**
```
1. Teacher enters 3 exam marks per student (each out of 100)
2. Calculation:
   - Add all 3 exam marks
   - Divide by 300 (total possible)
   - Multiply by 75
   - Result: Exam marks out of 75
```

### **Final Total (100 marks)**
```
Final Total = Assignment Marks (25) + Exam Marks (75)
```

## Access Control

### **Teachers Can:**
- ✅ Create courses for their classes
- ✅ Upload max 2 assignments per course
- ✅ View submissions for their courses only
- ✅ Grade submissions
- ✅ Enter 3 exam marks per student
- ✅ Upload course materials
- ❌ Cannot access other teachers' courses

### **Students Can:**
- ✅ View courses for their class
- ✅ Submit assignments via Drive links
- ✅ View their marks
- ✅ View exam schedules for their class
- ✅ Access course materials
- ❌ Cannot submit for other students
- ❌ Cannot view other students' marks

### **Parents Can:**
- ✅ View their child's courses
- ✅ View their child's marks
- ✅ View exam schedules for child's class
- ❌ Cannot view other children's data

### **Admin Can:**
- ✅ Create exam schedules for all classes
- ✅ View all academic data
- ❌ Cannot enter marks (teacher's job)

## Data Structure

### **Course**
```javascript
{
    id: "course_123",
    name: "Mathematics",
    code: "MATH101",
    class: "Grade 10-A",
    description: "Advanced Mathematics",
    teacherId: "teacher_1",
    teacherName: "Sarah Johnson",
    createdAt: "2025-12-16T09:00:00Z",
    active: true
}
```

### **Assignment**
```javascript
{
    id: "assignment_123",
    courseId: "course_123",
    title: "Algebra Assignment 1",
    description: "Solve problems 1-10",
    dueDate: "2025-12-25",
    maxMarks: 100,
    createdAt: "2025-12-16T09:00:00Z",
    createdBy: "teacher_1"
}
```

### **Submission**
```javascript
{
    id: "submission_123",
    assignmentId: "assignment_123",
    courseId: "course_123",
    studentId: "student_1",
    studentName: "John Doe",
    driveLink: "https://drive.google.com/...",
    submittedAt: "2025-12-20T10:00:00Z",
    status: "graded", // submitted, graded
    marks: 85,
    feedback: "Good work!",
    gradedAt: "2025-12-21T10:00:00Z"
}
```

### **Exam Marks**
```javascript
{
    id: "marks_123",
    courseId: "course_123",
    studentId: "student_1",
    studentName: "John Doe",
    exam1: 80,
    exam2: 85,
    exam3: 90,
    enteredBy: "teacher_1",
    enteredAt: "2025-12-16T09:00:00Z"
}
```

### **Final Marks (Calculated)**
```javascript
{
    studentId: "student_1",
    courseId: "course_123",
    courseName: "Mathematics",
    courseCode: "MATH101",
    assignmentMarks: 21.25, // out of 25
    examMarks: 63.75, // out of 75
    finalTotal: 85.00, // out of 100
    assignmentCount: 2,
    examScores: {
        exam1: 80,
        exam2: 85,
        exam3: 90
    }
}
```

### **Exam Schedule**
```javascript
{
    id: "schedule_123",
    courseId: "course_123",
    courseName: "Mathematics",
    class: "Grade 10-A",
    examName: "Mid-term Exam",
    examDate: "2025-12-25",
    startTime: "09:00",
    endTime: "11:00",
    venue: "Room 101",
    instructions: "Bring calculator",
    createdBy: "admin_1",
    createdAt: "2025-12-16T09:00:00Z"
}
```

### **Course Material**
```javascript
{
    id: "material_123",
    courseId: "course_123",
    title: "Chapter 1 Notes",
    description: "Introduction to Algebra",
    link: "https://drive.google.com/...",
    type: "drive", // link, drive, document
    uploadedBy: "teacher_1",
    uploadedAt: "2025-12-16T09:00:00Z"
}
```

## Real-Time Synchronization

All updates are synchronized in real-time across all portals:

```javascript
// Subscribe to updates
subscribeToAcademicUpdates((data) => {
    // Auto-refresh when data changes
    console.log('Academic data updated:', data);
});
```

### **Events that trigger sync:**
- ✅ Course created
- ✅ Assignment uploaded
- ✅ Student submits assignment
- ✅ Teacher grades submission
- ✅ Teacher enters exam marks
- ✅ Admin creates exam schedule
- ✅ Teacher uploads course material

## Storage

All academic data is stored in:
```
localStorage key: 'erp_academic_data'
```

## API Functions

### **Courses**
- `createCourse(data)` - Create new course
- `getCoursesByTeacher(teacherId)` - Get teacher's courses
- `getCoursesByClass(className)` - Get class courses
- `updateCourse(id, data)` - Update course
- `deleteCourse(id)` - Delete course

### **Assignments**
- `createAssignment(data)` - Create assignment (max 2 per course)
- `getAssignmentsByCourse(courseId)` - Get course assignments
- `updateAssignment(id, data)` - Update assignment
- `deleteAssignment(id)` - Delete assignment

### **Submissions**
- `submitAssignment(data)` - Submit assignment
- `getSubmissionsByAssignment(assignmentId)` - Get all submissions
- `getSubmissionsByStudent(studentId)` - Get student submissions
- `getSubmission(studentId, assignmentId)` - Get specific submission
- `gradeSubmission(id, marks, feedback)` - Grade submission

### **Exam Marks**
- `enterExamMarks(data)` - Enter 3 exam marks
- `getExamMarksByCourse(courseId)` - Get course exam marks
- `getExamMarksByStudent(studentId)` - Get student exam marks
- `getStudentCourseMarks(studentId, courseId)` - Get specific marks

### **Final Marks**
- `calculateFinalMarks(studentId, courseId)` - Calculate final marks
- `getStudentFinalMarks(studentId)` - Get all final marks for student

### **Exam Schedules**
- `createExamSchedule(data)` - Create exam schedule
- `getExamSchedulesByClass(className)` - Get class schedules
- `getExamSchedulesByCourse(courseId)` - Get course schedules
- `updateExamSchedule(id, data)` - Update schedule
- `deleteExamSchedule(id)` - Delete schedule

### **Course Materials**
- `uploadCourseMaterial(data)` - Upload material
- `getCourseMaterials(courseId)` - Get course materials
- `deleteCourseMaterial(id)` - Delete material

## Next Steps

The following components need to be created:

1. **Teacher Portal:**
   - Academic Management Page (courses, assignments, grading)
   
2. **Student Portal:**
   - Courses Page (view courses, submit assignments, view marks)
   
3. **Parent Portal:**
   - Child's Academic Page (view marks, schedules)
   
4. **Admin Portal:**
   - Exam Schedule Management Page

All components will use the `academicStore.js` for data management and real-time synchronization.

---

**Status: Core Store Created ✅**

Next: Creating portal-specific UI components...
