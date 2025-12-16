# Real-Time Course Management System

## 🎯 Overview

The Course Management System provides complete real-time synchronization between Teacher and Student portals. Teachers create courses, upload materials, post assignments, and view submissions. Students view courses, access materials, and submit assignments. All updates sync instantly across portals.

---

## ✨ Features

### Teacher Portal - Course Management
- ✅ **Create Courses** - Create courses for subjects they teach
- ✅ **Auto-Enrollment** - Students automatically enrolled based on class
- ✅ **Upload Materials** - Share Google Drive links, documents, external resources
- ✅ **Create Assignments** - Post assignments with title, description, due date
- ✅ **View Submissions** - See all student submissions with links
- ✅ **Delete Content** - Remove courses, materials, or assignments
- ✅ **Real-time Sync** - Instant updates to student portal

### Student Portal - Course Access
- ✅ **View Courses** - See courses from assigned teachers
- ✅ **Access Materials** - View all course materials
- ✅ **View Assignments** - See all posted assignments
- ✅ **Submit Work** - Submit via Google Drive or external links
- ✅ **Track Status** - See submission status and overdue assignments
- ✅ **Real-time Sync** - Instant updates from teacher portal

---

## 🔄 How Real-Time Sync Works

```
Teacher creates course
        ↓
Saved to localStorage
        ↓
Event 'coursesUpdated' dispatched
        ↓
Student portal listening
        ↓
Course appears instantly
        ↓
Student submits assignment
        ↓
Event 'coursesUpdated' dispatched
        ↓
Teacher portal updates
        ↓
No page refresh needed!
```

---

## 📊 Data Structure

### Course Object
```javascript
{
    id: 1234567890,
    teacherId: "123",
    teacherName: "Sarah Johnson",
    courseName: "Advanced Mathematics",
    subject: "Mathematics",
    class: "Grade 10-A",
    description: "Advanced math concepts",
    materials: [...],
    assignments: [...],
    enrolledStudents: [101, 102, 103],
    createdAt: "2025-12-15T10:00:00Z",
    updatedAt: "2025-12-15T10:00:00Z"
}
```

### Material Object
```javascript
{
    id: 1234567891,
    title: "Chapter 1 Notes",
    description: "Introduction to Algebra",
    link: "https://drive.google.com/...",
    type: "drive", // 'link', 'drive', 'document'
    uploadedAt: "2025-12-15T10:00:00Z"
}
```

### Assignment Object
```javascript
{
    id: 1234567892,
    title: "Chapter 1 Assignment",
    description: "Solve problems 1-10",
    dueDate: "2025-12-20",
    submissions: [...],
    createdAt: "2025-12-15T10:00:00Z"
}
```

### Submission Object
```javascript
{
    id: 1234567893,
    studentId: "101",
    studentName: "John Doe",
    link: "https://drive.google.com/...",
    submittedAt: "2025-12-15T10:00:00Z"
}
```

---

## 🎨 Teacher Portal Features

### Create Course

**Steps:**
1. Click **"Create New Course"**
2. Enter **Course Name** (e.g., "Advanced Mathematics")
3. Enter **Subject** (e.g., "Mathematics")
4. Select **Class** (e.g., "Grade 10-A")
5. Add **Description** (optional)
6. Click **"Create Course"**
7. Students in that class are automatically enrolled!
8. Course appears in student portal instantly!

**Auto-Enrollment:**
- All students in the selected class are automatically enrolled
- No manual student selection needed
- Students see course immediately

### Upload Course Material

**Steps:**
1. Select a course
2. Click **"Add Material"**
3. Enter **Title** (e.g., "Chapter 1 Notes")
4. Select **Type**:
   - External Link
   - Google Drive Link
   - Document Link
5. Enter **Link** (URL)
6. Add **Description** (optional)
7. Click **"Add Material"**
8. Material appears in student portal instantly!

**Material Types:**
- **External Link**: Any website URL
- **Google Drive**: Google Drive file/folder link
- **Document**: Google Docs, Sheets, Slides, etc.

### Create Assignment

**Steps:**
1. Select a course
2. Click **"Create Assignment"**
3. Enter **Title** (e.g., "Chapter 1 Assignment")
4. Select **Due Date**
5. Add **Description** (instructions)
6. Click **"Create Assignment"**
7. Assignment appears in student portal instantly!

**Assignment Features:**
- Title and description
- Due date
- Submission tracking
- View all student submissions

### View Submissions

**What Teachers See:**
- Student name
- Submission link
- Submission date
- Click to view submission

**Submission Count:**
- Shows "X Submissions" for each assignment
- Expands to show all submissions
- Click link to view student work

---

## 👨‍🎓 Student Portal Features

### View Courses

**What Students See:**
- All courses for their class
- Teacher name
- Subject
- Number of materials and assignments

**Course Selection:**
- Click on a course to view details
- See all materials and assignments
- Submit assignments

### Access Materials

**What Students See:**
- Material title
- Description
- Link to open
- Upload date

**Opening Materials:**
- Click "Open Material" to view
- Opens in new tab
- Works with Drive, Docs, external links

### View Assignments

**What Students See:**
- Assignment title
- Description
- Due date
- Submission status
- Overdue indicator

**Assignment Status:**
- 🟢 **Submitted** - Green badge with checkmark
- 🔴 **Overdue** - Red badge if past due date
- ⚪ **Pending** - No badge, "Submit" button visible

### Submit Assignment

**Steps:**
1. Click **"Submit"** on an assignment
2. Upload file to Google Drive
3. Get shareable link from Drive
4. Paste link in submission form
5. Click **"Submit"**
6. Submission appears in teacher portal instantly!

**Submission Options:**
- Google Drive link (recommended)
- Any external file link
- Document sharing link

**After Submission:**
- Green "Submitted" badge appears
- Can view submission link
- Shows submission date
- Cannot resubmit (updates existing)

---

## 📝 Usage Guide

### For Teachers

#### Creating a Course
1. Go to **Teacher Portal** → **Courses**
2. Click **"Create New Course"**
3. Fill in details:
   - Course Name: "Advanced Mathematics"
   - Subject: "Mathematics"
   - Class: "Grade 10-A"
   - Description: "Advanced math concepts for Grade 10"
4. Click **"Create Course"**
5. Course created! ✅
6. All Grade 10-A students can now see it!

#### Uploading Materials
1. Select your course
2. Click **"Add Material"**
3. Fill in details:
   - Title: "Chapter 1 Notes"
   - Type: "Google Drive Link"
   - Link: "https://drive.google.com/file/d/..."
   - Description: "Introduction to Algebra"
4. Click **"Add Material"**
5. Material uploaded! ✅
6. Students can access it immediately!

#### Creating Assignments
1. Select your course
2. Click **"Create Assignment"**
3. Fill in details:
   - Title: "Chapter 1 Assignment"
   - Due Date: "2025-12-20"
   - Description: "Solve problems 1-10 from textbook"
4. Click **"Create Assignment"**
5. Assignment posted! ✅
6. Students can see and submit it!

#### Viewing Submissions
1. Select your course
2. Scroll to assignment
3. See submission count (e.g., "5 Submissions")
4. Expand to see all submissions
5. Click "View" to open student work
6. Review and grade!

### For Students

#### Viewing Courses
1. Go to **Student Portal** → **Courses**
2. See all courses for your class
3. Click on a course to view details
4. See teacher name, materials, assignments

#### Accessing Materials
1. Select a course
2. Scroll to "Course Materials"
3. Click **"Open Material"** on any item
4. Material opens in new tab
5. Study and learn!

#### Submitting Assignments
1. Select a course
2. Scroll to "Assignments"
3. Find assignment to submit
4. Click **"Submit"** button
5. Upload your work to Google Drive
6. Share link (make sure it's accessible)
7. Paste link in submission form
8. Click **"Submit"**
9. Done! ✅

**Google Drive Steps:**
1. Upload file to Google Drive
2. Right-click file → Share
3. Change to "Anyone with the link"
4. Copy link
5. Paste in submission form

---

## 🔐 Access Control

### Teacher Access
- ✅ Can only manage their own courses
- ✅ Can only see their own course submissions
- ✅ Cannot access other teachers' courses
- ✅ Can delete their own content

### Student Access
- ✅ Can only view courses for their class
- ✅ Can only submit to their enrolled courses
- ✅ Cannot see other students' submissions
- ✅ Cannot delete or edit content

---

## 💡 Best Practices

### For Teachers
- ✅ Create courses at start of term
- ✅ Upload materials before class
- ✅ Set realistic due dates for assignments
- ✅ Check submissions regularly
- ✅ Provide clear assignment instructions
- ✅ Use Google Drive for easy sharing

### For Students
- ✅ Check courses regularly for new materials
- ✅ Submit assignments before due date
- ✅ Use Google Drive for submissions
- ✅ Make sure links are accessible
- ✅ Keep track of due dates
- ✅ Ask teacher if confused

---

## 🎯 Key Features

### Auto-Enrollment
- Students automatically enrolled based on class
- No manual enrollment needed
- Works seamlessly

### Real-Time Sync
- All changes sync instantly
- No page refresh needed
- Teacher creates → Student sees
- Student submits → Teacher sees

### Submission Tracking
- See who submitted
- See submission date
- View submission links
- Track completion rate

### Overdue Detection
- Automatic overdue detection
- Red badge for overdue assignments
- Helps students stay on track

---

## 🐛 Troubleshooting

### Course not showing in student portal?
1. Check if course class matches student class
2. Verify teacher created the course
3. Refresh the page
4. Check browser console for errors

### Material link not working?
1. Check if link is correct
2. Verify link is accessible
3. Try opening in new tab
4. Check Google Drive sharing settings

### Cannot submit assignment?
1. Check if link is valid URL
2. Verify Google Drive link is shared
3. Make sure assignment isn't deleted
4. Check browser console for errors

### Submission not showing in teacher portal?
1. Verify submission was successful
2. Refresh teacher portal
3. Check if student is enrolled
4. Check browser console for errors

---

## 🚀 Future Enhancements

- Backend API integration
- Database storage
- File upload support
- Grading system
- Comments on submissions
- Assignment rubrics
- Due date reminders
- Email notifications
- Bulk operations
- Course templates
- Analytics dashboard
- Student progress tracking

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review browser console errors
3. Contact development team

**Last Updated:** December 15, 2025
