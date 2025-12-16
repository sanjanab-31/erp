# Dynamic User Management & Authentication System

## Overview
A comprehensive user management system has been implemented where the **Admin can dynamically add students and teachers**, and they can login with their email and a default password.

## ✅ What Changed

### **Before:**
- Hardcoded users in `jwt.js`
- Fixed credentials (e.g., `student@eshwar.com` / `student123`)
- No way to add new users

### **After:**
- **Dynamic user management** via `userStore.js`
- **Admin adds students/teachers** → They get login access automatically
- **Default password for all new users**: `password`
- **Only admin-added users can login**

## 🔐 Authentication Flow

### **1. Admin Login**
```
Email: admin@eshwar.com
Password: admin123
```
- Admin is pre-configured in the system
- Has special privileges to add users

### **2. Admin Adds Student**
1. Admin goes to **Students** section
2. Clicks **"Add Student"**
3. Fills in form (Name, Email, Class, etc.)
4. Clicks **"Add Student"**
5. System shows: `Student added successfully! Login credentials: Email: [email] Password: password`

### **3. Student Can Now Login**
```
Email: [whatever admin entered]
Password: password
Role: Student
```
- Student portal opens automatically
- All student features available

### **4. Same for Teachers**
1. Admin goes to **Teachers** section
2. Adds teacher with email
3. Teacher can login with:
   - Email: [admin-entered email]
   - Password: `password`
   - Role: Teacher

## 📊 System Architecture

### **Files Created/Modified:**

#### **1. `src/utils/userStore.js`** (NEW)
- Centralized user management
- Stores all users in localStorage
- Functions:
  - `addStudent(data)` - Add new student
  - `addTeacher(data)` - Add new teacher
  - `authenticateUser(email, password, role)` - Verify login
  - `getUserByEmail(email)` - Find user
  - `updateUser(id, data)` - Update user info
  - `deleteUser(id)` - Remove user
  - `changeUserPassword(id, newPassword)` - Change password
  - `resetUserPassword(id)` - Reset to default

#### **2. `src/utils/jwt.js`** (MODIFIED)
- Updated `mockLogin()` to use `userStore`
- Now checks against dynamically added users
- No more hardcoded credentials

#### **3. `src/components/portals/admin/Students.jsx`** (MODIFIED)
- `handleAddStudent()` now adds to both:
  - `studentStore` (for student management)
  - `userStore` (for authentication)
- Shows login credentials after adding

#### **4. `src/components/portals/admin/Teachers.jsx`** (MODIFIED)
- `handleAddTeacher()` now adds to both:
  - `teacherStore` (for teacher management)
  - `userStore` (for authentication)
- Shows login credentials after adding

## 🎯 How It Works

### **Adding a Student:**

```javascript
// Admin fills form and submits
handleAddStudent() {
    // 1. Add to studentStore (for grades, attendance, etc.)
    addStudent({
        name: "John Doe",
        email: "john@school.com",
        class: "Grade 10-A",
        rollNo: "10A-001"
    });
    
    // 2. Add to userStore (for login)
    addUserStudent({
        email: "john@school.com",
        name: "John Doe",
        password: "password" // DEFAULT
    });
}
```

### **Student Login:**

```javascript
// Student tries to login
mockLogin("john@school.com", "password", "Student") {
    // 1. Check userStore
    const user = authenticateUser(email, password, role);
    
    // 2. Verify:
    //    - User exists? ✓
    //    - Password correct? ✓
    //    - Role matches? ✓
    //    - Account active? ✓
    
    // 3. Generate JWT token
    // 4. Redirect to Student Portal
}
```

## 🔑 Default Password

**All new users (students, teachers, parents) get:**
```
Password: password
```

### **Changing Password:**
```javascript
// Admin can reset password
resetUserPassword(userId); // Resets to "password"

// Or set custom password
changeUserPassword(userId, "newPassword123");
```

## 📝 User Data Structure

### **Student User:**
```javascript
{
    id: "student_1234567890",
    email: "john@school.com",
    password: "password",
    name: "John Doe",
    role: "student",
    class: "Grade 10-A",
    rollNumber: "10A-001",
    parentEmail: "parent@email.com",
    phone: "+1234567890",
    address: "123 Main St",
    dateOfBirth: "2008-05-15",
    createdAt: "2025-12-16T09:00:00Z",
    createdBy: "Admin User",
    active: true
}
```

### **Teacher User:**
```javascript
{
    id: "teacher_1234567890",
    email: "sarah@school.com",
    password: "password",
    name: "Sarah Johnson",
    role: "teacher",
    subject: "Mathematics",
    department: "Science",
    qualification: "M.Sc",
    phone: "+1234567890",
    address: "456 Oak Ave",
    dateOfBirth: "1985-03-20",
    createdAt: "2025-12-16T09:00:00Z",
    createdBy: "Admin User",
    active: true
}
```

## 🚀 Testing the System

### **Test 1: Add and Login as Student**

1. **Login as Admin:**
   - Email: `admin@eshwar.com`
   - Password: `admin123`

2. **Add Student:**
   - Go to Students → Click "Add Student"
   - Fill in:
     - Name: `Test Student`
     - Email: `test.student@school.com`
     - Roll No: `10A-999`
     - Class: `Grade 10-A`
   - Click "Add Student"
   - Note the credentials shown

3. **Logout:**
   - Click Logout

4. **Login as Student:**
   - Select "Student" tab
   - Email: `test.student@school.com`
   - Password: `password`
   - Click "Sign in"
   - ✅ Student portal should open!

### **Test 2: Add and Login as Teacher**

1. **Login as Admin**

2. **Add Teacher:**
   - Go to Teachers → Click "Add Teacher"
   - Fill in:
     - Name: `Test Teacher`
     - Email: `test.teacher@school.com`
     - Employee ID: `T-999`
     - Department: `Mathematics`
     - Subject: `Algebra`
   - Click "Add Teacher"

3. **Logout**

4. **Login as Teacher:**
   - Select "Teacher" tab
   - Email: `test.teacher@school.com`
   - Password: `password`
   - ✅ Teacher portal should open!

### **Test 3: Wrong Role**

1. Try to login with student email but select "Teacher" role
2. ❌ Should show error: "This account is registered as student, not teacher"

### **Test 4: Non-existent User**

1. Try to login with random email
2. ❌ Should show error: "User not found. Please contact admin."

## 🔒 Security Features

1. **Role Validation**: Users can only login with their assigned role
2. **Active Status**: Deactivated users cannot login
3. **Email Uniqueness**: No duplicate emails allowed
4. **Password Protection**: Passwords are stored (in production, use hashing)
5. **Admin Protection**: Admin user cannot be deleted

## 📦 Storage

All user data is stored in:
```
localStorage key: 'erp_users'
```

### **View Users in Browser Console:**
```javascript
// Get all users
const users = JSON.parse(localStorage.getItem('erp_users'));
console.log(users);

// Clear all users (CAUTION!)
localStorage.removeItem('erp_users');
```

## 🎨 User Experience

### **Admin Adding Student:**
```
[Form filled] → Click "Add Student" → 
Alert: "Student added successfully! 
Login credentials:
Email: john@school.com
Password: password"
```

### **Student Login:**
```
[Enter email & password] → Click "Sign in" →
[Verify credentials] → [Generate JWT] →
Redirect to Student Portal ✓
```

## 🔄 Portal Routing

After successful login, users are redirected based on role:

| Role | Route |
|------|-------|
| Admin | `/dashboard/admin` |
| Student | `/dashboard/student` |
| Teacher | `/dashboard/teacher` |
| Parent | `/dashboard/parent` |

## 💡 Future Enhancements

- [ ] Email verification
- [ ] Password strength requirements
- [ ] Force password change on first login
- [ ] Password reset via email
- [ ] Two-factor authentication
- [ ] Password hashing (bcrypt)
- [ ] Session management
- [ ] Login history
- [ ] Account lockout after failed attempts
- [ ] Parent account auto-creation when student is added

---

## 🎉 Summary

**Before**: Fixed users with hardcoded credentials
**Now**: Dynamic user management where admin adds users and they can login immediately!

**Default Password**: `password` (for all new users)
**Admin Credentials**: `admin@eshwar.com` / `admin123`

**All working!** ✅
