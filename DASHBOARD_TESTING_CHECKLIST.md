# Real-Time Dashboard Testing Checklist

## 🧪 Testing Guide

Use this checklist to verify that all dashboards are working with real-time data.

---

## ✅ Admin Dashboard Tests

### Test 1: Student Count
- [ ] Open Admin Dashboard
- [ ] Note the "Total Students" count (should be 0 if no students added)
- [ ] Go to Admin > Students
- [ ] Add a new student
- [ ] Return to Dashboard
- [ ] Verify "Total Students" increased by 1
- [ ] Check status message shows "X active students"

### Test 2: Teacher Count
- [ ] Note the "Total Teachers" count
- [ ] Go to Admin > Teachers
- [ ] Add a new teacher
- [ ] Return to Dashboard
- [ ] Verify "Total Teachers" increased by 1
- [ ] Check status message shows "X active staff members"

### Test 3: Revenue
- [ ] Note the "Revenue" amount
- [ ] Go to Admin > Fees & Finance
- [ ] Add a fee for a student
- [ ] Make a payment
- [ ] Return to Dashboard
- [ ] Verify "Revenue" increased by payment amount
- [ ] Check status message shows collection rate

### Test 4: Attendance Rate
- [ ] Note the "Attendance" percentage
- [ ] Go to Admin > Attendance
- [ ] Mark attendance for students
- [ ] Return to Dashboard
- [ ] Verify "Attendance" percentage updated

---

## ✅ Teacher Dashboard Tests

### Test 1: Total Classes
- [ ] Open Teacher Dashboard (login as teacher@school.com)
- [ ] Note the "Total Classes" count
- [ ] Go to Teacher > Courses
- [ ] Create a new course
- [ ] Return to Dashboard
- [ ] Verify "Total Classes" increased by 1

### Test 2: Pending Assignments
- [ ] Note the "Pending Grading" count
- [ ] Login as a student
- [ ] Go to Student > My Courses
- [ ] Submit an assignment
- [ ] Login back as teacher
- [ ] Return to Dashboard
- [ ] Verify "Pending Grading" increased by 1

### Test 3: Today's Schedule
- [ ] Check "Today's Schedule" section
- [ ] Verify it shows your courses
- [ ] Verify times and rooms are displayed

### Test 4: Recent Submissions
- [ ] Check "Recent Submissions" section
- [ ] Verify it shows pending submissions
- [ ] Grade a submission
- [ ] Verify it updates to "graded" status

---

## ✅ Student Dashboard Tests

### Test 1: Attendance
- [ ] Open Student Dashboard (login as student@school.com)
- [ ] Note the "Attendance" percentage
- [ ] Login as admin/teacher
- [ ] Mark attendance for this student
- [ ] Login back as student
- [ ] Verify "Attendance" percentage updated

### Test 2: Current Grade
- [ ] Note the "Current Grade"
- [ ] Login as teacher
- [ ] Grade an assignment for this student
- [ ] Login back as student
- [ ] Verify "Current Grade" updated

### Test 3: Pending Assignments
- [ ] Note the "Assignments" count
- [ ] Go to Student > My Courses
- [ ] Submit an assignment
- [ ] Return to Dashboard
- [ ] Verify "Assignments" count updated

### Test 4: Recent Grades
- [ ] Check "Recent Grades" section
- [ ] Verify it shows your course grades
- [ ] Verify grades are calculated correctly

---

## ✅ Parent Dashboard Tests

### Test 1: Children List
- [ ] Open Parent Dashboard (login as parent@school.com)
- [ ] Check "Children" section
- [ ] Verify it shows all students (or your children)
- [ ] Verify each child shows:
  - [ ] Name
  - [ ] Class
  - [ ] Attendance %
  - [ ] Current Grade
  - [ ] Pending Fees
  - [ ] Upcoming Tests

### Test 2: Child Attendance
- [ ] Note a child's attendance %
- [ ] Login as admin/teacher
- [ ] Mark attendance for that child
- [ ] Login back as parent
- [ ] Verify child's attendance % updated

### Test 3: Child Grades
- [ ] Note a child's current grade
- [ ] Login as teacher
- [ ] Grade an assignment for that child
- [ ] Login back as parent
- [ ] Verify child's grade updated

### Test 4: Fee Status
- [ ] Check "Fee Status" section
- [ ] Note total, paid, and pending amounts
- [ ] Login as admin
- [ ] Add a fee for a child
- [ ] Login back as parent
- [ ] Verify fee status updated

---

## 🔄 Real-Time Update Tests

### Test 1: Multi-Portal Sync
- [ ] Open Admin Dashboard in one browser window
- [ ] Open Student Dashboard in another window
- [ ] Add a student in Admin portal
- [ ] Verify student count updates in Admin Dashboard
- [ ] Verify student data appears in Student Dashboard (if logged in as that student)

### Test 2: Instant Updates
- [ ] Open a dashboard
- [ ] Make a change in another portal (add student, mark attendance, etc.)
- [ ] Return to dashboard
- [ ] Verify update appears **without page refresh**

### Test 3: Subscription Cleanup
- [ ] Open a dashboard
- [ ] Navigate to another page
- [ ] Navigate back to dashboard
- [ ] Verify data loads correctly
- [ ] Verify no duplicate updates occur

---

## 📊 Data Verification

### Verify Calculations

#### Attendance Rate
```
Attendance % = (Present + Late) / Total Records × 100
```
- [ ] Verify calculation is correct

#### Current Grade
```
Grade = Average of all course final marks
A: 90+, B+: 80-89, B: 70-79, C: 60-69, D: <60
```
- [ ] Verify grade calculation is correct

#### Revenue
```
Revenue = Sum of all paid amounts from fees
```
- [ ] Verify revenue calculation is correct

#### Pending Assignments
```
Pending = Submissions with status 'submitted' (not graded)
```
- [ ] Verify count is correct

---

## 🐛 Edge Cases to Test

### Empty State
- [ ] Clear all data from stores
- [ ] Verify dashboards show 0 or "No data" messages
- [ ] Verify no errors in console

### Large Data
- [ ] Add 50+ students
- [ ] Add 20+ teachers
- [ ] Add 100+ attendance records
- [ ] Verify dashboards load quickly
- [ ] Verify calculations are correct

### Invalid Data
- [ ] Try accessing dashboard with invalid userId
- [ ] Verify graceful error handling
- [ ] Verify no crashes

---

## ✅ Success Criteria

All tests should pass with:
- ✅ No hardcoded default values
- ✅ Real-time updates without page refresh
- ✅ Accurate calculations
- ✅ No console errors
- ✅ Fast loading times
- ✅ Proper subscription cleanup

---

## 📝 Notes

- **Test Accounts**:
  - Admin: admin@school.com / admin123
  - Teacher: teacher@school.com / teacher123
  - Student: student@school.com / student123
  - Parent: parent@school.com / parent123

- **Data Stores**: All data is stored in localStorage
- **Real-Time**: Updates use event-driven architecture
- **No Refresh**: Changes appear instantly without page reload

---

**Last Updated**: December 16, 2025
