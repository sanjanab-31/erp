# Quick Start - Dynamic User Management

## 🎯 What You Need to Know

### **Admin Credentials (Pre-configured)**
```
Email: admin@eshwar.com
Password: admin123
```

### **Default Password for All New Users**
```
Password: password
```

## 🚀 Quick Test (2 Minutes)

### **Step 1: Add a Student**
1. Login as Admin (`admin@eshwar.com` / `admin123`)
2. Click **"Students"** in sidebar
3. Click **"Add Student"** button
4. Fill in:
   - Name: `John Doe`
   - Email: `john.doe@school.com`
   - Roll No: `10A-001`
   - Class: `Grade 10-A`
   - Parent Name: `Jane Doe`
5. Click **"Add Student"**
6. **Note the alert**: Shows login credentials

### **Step 2: Login as Student**
1. Click **Logout**
2. On login page, select **"Student"** tab
3. Enter:
   - Email: `john.doe@school.com`
   - Password: `password`
4. Click **"Sign in"**
5. ✅ **Student portal opens!**

### **Step 3: Add a Teacher**
1. Login as Admin again
2. Click **"Teachers"** in sidebar
3. Click **"Add Teacher"** button
4. Fill in:
   - Name: `Sarah Johnson`
   - Email: `sarah.j@school.com`
   - Employee ID: `T-101`
   - Department: `Mathematics`
   - Subject: `Algebra`
5. Click **"Add Teacher"**
6. **Note the credentials**

### **Step 4: Login as Teacher**
1. Logout
2. Select **"Teacher"** tab
3. Enter:
   - Email: `sarah.j@school.com`
   - Password: `password`
4. ✅ **Teacher portal opens!**

## 📋 Key Points

✅ **Only admin-added users can login**
✅ **Default password is always**: `password`
✅ **Email must be unique**
✅ **Users can only login with their assigned role**
✅ **Credentials shown immediately after adding user**

## ⚠️ Important Notes

- **Admin cannot be deleted**
- **Deactivated users cannot login**
- **Wrong role = Login fails**
- **Non-existent email = Login fails**

## 🔑 Login Credentials Format

### **Admin (Pre-configured)**
```
Email: admin@eshwar.com
Password: admin123
Role: Admin
```

### **Students (Admin-added)**
```
Email: [whatever admin entered]
Password: password
Role: Student
```

### **Teachers (Admin-added)**
```
Email: [whatever admin entered]
Password: password
Role: Teacher
```

## 🎨 Workflow

```
Admin Login → Add Student/Teacher → 
User gets credentials (Email + password) →
User can login → Portal opens
```

## 🔧 Troubleshooting

### **"User not found"**
→ Admin hasn't added this user yet

### **"Invalid password"**
→ Use `password` (default) or check if password was changed

### **"This account is registered as X, not Y"**
→ Select correct role tab on login page

### **"Account is deactivated"**
→ Contact admin to activate account

---

**Everything is ready to use!** 🎉

Just login as admin and start adding users!
