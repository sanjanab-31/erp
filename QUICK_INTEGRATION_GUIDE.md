# Quick Integration Guide - Academic System

## 🚀 5-Minute Integration

### **Step 1: Teacher Dashboard**

Open `src/components/portals/teacher/TeacherDashboard.jsx`

**Add import:**
```javascript
import AcademicManagement from './AcademicManagement';
```

**Add to menuItems array:**
```javascript
{ icon: BookOpen, label: 'Academic Management' }
```

**Add to renderContent function:**
```javascript
case 'Academic Management':
    return <AcademicManagement darkMode={darkMode} />;
```

---

### **Step 2: Student Dashboard**

Open `src/components/portals/student/StudentDashboard.jsx`

**Add import:**
```javascript
import StudentCoursesPage from './StudentCoursesPage';
```

**Add to menuItems array:**
```javascript
{ icon: BookOpen, label: 'My Courses' }
```

**Add to renderContent function:**
```javascript
case 'My Courses':
    return <StudentCoursesPage darkMode={darkMode} />;
```

---

### **Step 3: Parent Dashboard**

Open `src/components/portals/parent/ParentDashboard.jsx`

**Add import:**
```javascript
import ParentChildAcademics from './ParentChildAcademics';
```

**Add to menuItems array:**
```javascript
{ icon: TrendingUp, label: 'Child Academics' }
```

**Add to renderContent function:**
```javascript
case 'Child Academics':
    return <ParentChildAcademics darkMode={darkMode} />;
```

---

### **Step 4: Admin Dashboard**

Open `src/components/portals/admin/AdminDashboard.jsx`

**Add import:**
```javascript
import AdminExamSchedules from './AdminExamSchedules';
```

**Add to menuItems array:**
```javascript
{ icon: Calendar, label: 'Exam Schedules' }
```

**Add to renderContent function:**
```javascript
case 'Exam Schedules':
    return <AdminExamSchedules darkMode={darkMode} />;
```

---

## ✅ That's It!

Your academic management system is now fully integrated!

### **Test It:**

1. **Login as Teacher** → Go to "Academic Management" → Create a course
2. **Login as Student** → Go to "My Courses" → View the course
3. **Login as Parent** → Go to "Child Academics" → View child's progress
4. **Login as Admin** → Go to "Exam Schedules" → Create a schedule

---

## 🎯 Quick Test Workflow

```
1. Teacher: Create course "Mathematics" for "Grade 10-A"
2. Teacher: Add 2 assignments
3. Student: Submit assignment via Drive link
4. Teacher: Grade submission (85/100)
5. Teacher: Enter exam marks (80, 85, 90)
6. Student: View final marks (should show calculated total)
7. Parent: View child's marks (should match student's view)
8. Admin: Create exam schedule
9. Student/Parent: View exam schedule
```

---

**Everything is ready!** 🎉
