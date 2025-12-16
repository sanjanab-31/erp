# Academic Management System - Implementation Plan

## ✅ COMPLETED

### **1. Core Data Store (`academicStore.js`)**
- ✅ Course management (CRUD)
- ✅ Assignment management (max 2 per course)
- ✅ Submission tracking (Drive links)
- ✅ Grading system
- ✅ Exam marks (3 per course per student)
- ✅ Final marks calculation (25 + 75 = 100)
- ✅ Exam schedule management
- ✅ Course materials management
- ✅ Real-time synchronization
- ✅ Access control logic

## 🚧 TO BE IMPLEMENTED

### **2. Teacher Portal - Academic Management Page**

**Features Required:**
- [ ] View all courses taught by teacher
- [ ] Create new course
- [ ] For each course:
  - [ ] Upload assignments (max 2)
  - [ ] View student submissions
  - [ ] Grade submissions
  - [ ] Enter 3 exam marks per student
  - [ ] Upload course materials (Drive links)
  - [ ] View student final marks

**UI Components:**
- Course list with cards
- "Create Course" modal
- "Add Assignment" modal (with 2-assignment limit check)
- Submissions table with grading interface
- Exam marks entry form (3 fields per student)
- Course materials upload form
- Student marks overview table

**File to Create:**
`src/components/portals/teacher/AcademicManagement.jsx`

---

### **3. Student Portal - Courses & Marks Page**

**Features Required:**
- [ ] View all courses for student's class
- [ ] For each course:
  - [ ] View assignments
  - [ ] Submit assignment (Drive link)
  - [ ] View submission status
  - [ ] View assignment marks
  - [ ] View 3 exam marks
  - [ ] View final calculated marks (out of 100)
  - [ ] View exam schedules
  - [ ] Access course materials

**UI Components:**
- Course cards grid
- Assignment submission modal
- Marks display (Assignment: 25, Exam: 75, Total: 100)
- Exam schedule calendar
- Course materials list

**File to Create:**
`src/components/portals/student/CoursesAndMarks.jsx`

---

### **4. Parent Portal - Child's Academic Page**

**Features Required:**
- [ ] View child's courses
- [ ] For each course:
  - [ ] View assignment marks
  - [ ] View 3 exam marks
  - [ ] View final calculated marks
  - [ ] View exam schedules

**UI Components:**
- Course overview cards
- Marks breakdown table
- Exam schedule display
- Performance charts (optional)

**File to Create:**
`src/components/portals/parent/ChildAcademics.jsx`

---

### **5. Admin Portal - Exam Schedule Management**

**Features Required:**
- [ ] Create exam schedules
- [ ] Select class and course
- [ ] Set exam date, time, venue
- [ ] Add instructions
- [ ] View all schedules
- [ ] Edit/delete schedules

**UI Components:**
- Schedule creation form
- Class and course selectors
- Schedule calendar view
- Schedule list with filters

**File to Create:**
`src/components/portals/admin/ExamSchedules.jsx`

---

## 📋 IMPLEMENTATION PRIORITY

### **Phase 1: Teacher Portal (CRITICAL)**
1. Create `AcademicManagement.jsx`
2. Implement course creation
3. Implement assignment upload (2 max)
4. Implement submission viewing
5. Implement grading interface
6. Implement exam marks entry
7. Implement course materials upload

### **Phase 2: Student Portal (HIGH)**
1. Create `CoursesAndMarks.jsx`
2. Implement course viewing
3. Implement assignment submission
4. Implement marks viewing
5. Implement exam schedule viewing
6. Implement course materials access

### **Phase 3: Parent Portal (MEDIUM)**
1. Create `ChildAcademics.jsx`
2. Implement course viewing
3. Implement marks viewing
4. Implement exam schedule viewing

### **Phase 4: Admin Portal (MEDIUM)**
1. Create `ExamSchedules.jsx`
2. Implement schedule creation
3. Implement schedule management

---

## 🔧 TECHNICAL REQUIREMENTS

### **All Components Must:**
- ✅ Use `academicStore.js` for data management
- ✅ Subscribe to real-time updates
- ✅ Implement proper access control
- ✅ Show loading states
- ✅ Handle errors gracefully
- ✅ Support dark mode
- ✅ Be mobile responsive

### **Data Flow:**

```
Teacher Creates Course
    ↓
Teacher Uploads 2 Assignments
    ↓
Students Submit Assignments (Drive Links)
    ↓
Teacher Grades Submissions
    ↓
Teacher Enters 3 Exam Marks
    ↓
System Calculates Final Marks (25 + 75 = 100)
    ↓
Students/Parents View Marks
    ↓
Admin Creates Exam Schedules
    ↓
Students/Parents View Schedules
```

---

## 🎯 MARKS CALCULATION EXAMPLE

### **Example: Student "John Doe" in "Mathematics"**

**Assignment Marks:**
- Assignment 1: 85/100
- Assignment 2: 90/100
- Average: (85 + 90) / 2 = 87.5
- Scaled to 25: 87.5 × 0.25 = 21.875 ≈ **21.88/25**

**Exam Marks:**
- Exam 1: 80/100
- Exam 2: 85/100
- Exam 3: 90/100
- Total: 255/300
- Scaled to 75: (255/300) × 75 = **63.75/75**

**Final Total:**
- Assignment: 21.88
- Exam: 63.75
- **Total: 85.63/100**

---

## 📊 UI MOCKUP STRUCTURE

### **Teacher Academic Management**
```
┌─────────────────────────────────────────┐
│ My Courses                    [+ Create]│
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ Mathematics - Grade 10-A            │ │
│ │ ├─ Assignments (2/2)                │ │
│ │ ├─ Submissions (25 pending)         │ │
│ │ ├─ Exam Marks (30/30 entered)       │ │
│ │ └─ Materials (5 uploaded)           │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [View Details] [Add Assignment] [Marks]│
└─────────────────────────────────────────┘
```

### **Student Courses Page**
```
┌─────────────────────────────────────────┐
│ My Courses                              │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ Mathematics                         │ │
│ │ Teacher: Sarah Johnson              │ │
│ │                                     │ │
│ │ Assignments:                        │ │
│ │ ✓ Assignment 1: 85/100              │ │
│ │ ⏳ Assignment 2: Pending            │ │
│ │                                     │ │
│ │ Exams:                              │ │
│ │ Exam 1: 80/100                      │ │
│ │ Exam 2: 85/100                      │ │
│ │ Exam 3: 90/100                      │ │
│ │                                     │ │
│ │ Final Marks:                        │ │
│ │ Assignment: 21.88/25                │ │
│ │ Exam: 63.75/75                      │ │
│ │ Total: 85.63/100                    │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 🚀 NEXT STEPS

**I will now create:**

1. ✅ `academicStore.js` - DONE
2. 🔄 `teacher/AcademicManagement.jsx` - IN PROGRESS
3. ⏳ `student/CoursesAndMarks.jsx` - PENDING
4. ⏳ `parent/ChildAcademics.jsx` - PENDING
5. ⏳ `admin/ExamSchedules.jsx` - PENDING

**Estimated Time:**
- Teacher Portal: 30-40 minutes
- Student Portal: 20-30 minutes
- Parent Portal: 15-20 minutes
- Admin Portal: 15-20 minutes
- **Total: ~2 hours for complete implementation**

---

**Would you like me to proceed with creating all the UI components now?**

I'll create them one by one, starting with the Teacher Portal (most complex), then Student, Parent, and Admin portals.
