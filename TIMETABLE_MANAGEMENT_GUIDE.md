# Real-Time Timetable Management System

## 🎯 Overview

The Timetable Management System provides complete real-time synchronization across all portals. Admin creates timetables for teachers and classes, which automatically appear in Teacher, Student, and Parent portals without page refresh.

---

## ✨ Features

### Admin Portal - Create & Manage Timetables
- ✅ **Create Teacher Timetables** - Assign schedules to individual teachers
- ✅ **Create Class Timetables** - Assign schedules to student classes
- ✅ **Weekly Grid View** - Fill entire week at once (Monday-Friday, 7 time slots)
- ✅ **Edit Timetables** - Modify existing schedules
- ✅ **Delete Timetables** - Remove schedules
- ✅ **Real-time Stats** - View total teacher/class timetables
- ✅ **Individual Cell Editing** - Edit subject and room for each period

### Teacher Portal - View Own Timetable
- ✅ **View Schedule** - See timetable created by Admin
- ✅ **Weekly Grid** - Full week view with all periods
- ✅ **Real-time Sync** - Auto-updates when Admin makes changes
- ✅ **Statistics** - Total periods, today's classes
- ✅ **Color-coded** - Easy-to-read schedule

### Student Portal - View Class Timetable
- ✅ **View Class Schedule** - See timetable for their class
- ✅ **Weekly Grid** - Full week view
- ✅ **Real-time Sync** - Auto-updates when Admin makes changes
- ✅ **Statistics** - Total periods, today's classes, subjects
- ✅ **Subject Legend** - Color-coded subjects

### Parent Portal - View Child's Timetable
- ✅ **View Child's Schedule** - See child's class timetable
- ✅ **Weekly Grid** - Full week view
- ✅ **Real-time Sync** - Auto-updates when Admin makes changes
- ✅ **Statistics** - Total periods, today's classes, subjects
- ✅ **Subject Legend** - Color-coded subjects

---

## 🔄 How Real-Time Sync Works

```
Admin creates/edits timetable
        ↓
Saved to localStorage
        ↓
Custom event 'timetableUpdated' dispatched
        ↓
All portals listening for event
        ↓
Teacher/Student/Parent portals update automatically
        ↓
No page refresh needed!
```

---

## 📊 Timetable Data Structure

### Teacher Timetable
```javascript
{
    id: 1234567890,
    teacherId: "123",
    teacherName: "Sarah Johnson",
    schedule: [
        {
            day: "Monday",
            time: "09:00-10:00",
            subject: "Mathematics",
            room: "101"
        },
        // ... more periods
    ],
    createdAt: "2025-12-15T10:00:00Z",
    updatedAt: "2025-12-15T10:00:00Z"
}
```

### Class Timetable
```javascript
{
    id: 1234567890,
    className: "Grade 10-A",
    schedule: [
        {
            day: "Monday",
            time: "09:00-10:00",
            subject: "Mathematics",
            room: "101"
        },
        // ... more periods
    ],
    createdAt: "2025-12-15T10:00:00Z",
    updatedAt: "2025-12-15T10:00:00Z"
}
```

---

## 🎨 Admin Portal Features

### Create Timetable

#### Weekly Grid Interface
- **Days**: Monday to Friday (5 columns)
- **Time Slots**: 09:00-16:00 (7 rows, 1 hour each)
- **Total Cells**: 35 (5 days × 7 time slots)

#### Each Cell Has:
- **Subject** input field
- **Room** input field
- Can be left empty

#### Steps:
1. Click **"Create Timetable"**
2. Select **Teacher** or **Class** from dropdown
3. Fill in the **weekly grid**:
   - Type subject name (e.g., "Mathematics")
   - Type room number (e.g., "101")
4. Click **"Save Timetable"**
5. Done! Syncs to all portals instantly!

### Edit Timetable

1. Click **Edit** button on existing timetable
2. Grid loads with **current data pre-filled**
3. **Modify any cell** you want
4. Click **"Save Timetable"**
5. Changes sync instantly!

### Delete Timetable

1. Click **Delete** button
2. Confirm deletion
3. Timetable removed from all portals

---

## 📝 Usage Guide

### For Admins

#### Creating Teacher Timetable
1. Go to **Admin Portal** → **Timetable**
2. Toggle to **"Teacher Timetables"**
3. Click **"Create Timetable"**
4. Select **Teacher** from dropdown
5. Fill in weekly grid with subjects and rooms
6. Click **"Save Timetable"**
7. Teacher sees it instantly in their portal!

#### Creating Class Timetable
1. Go to **Admin Portal** → **Timetable**
2. Toggle to **"Class Timetables"**
3. Click **"Create Timetable"**
4. Select **Class** from dropdown
5. Fill in weekly grid with subjects and rooms
6. Click **"Save Timetable"**
7. Students and parents see it instantly!

### For Teachers

#### Viewing Timetable
1. Go to **Teacher Portal** → **Timetable**
2. See your weekly schedule
3. View statistics (total periods, today's classes)
4. Auto-updates when Admin makes changes

### For Students

#### Viewing Timetable
1. Go to **Student Portal** → **Timetable**
2. See your class schedule
3. View statistics and subject legend
4. Auto-updates when Admin makes changes

### For Parents

#### Viewing Child's Timetable
1. Go to **Parent Portal** → **Timetable**
2. See child's class schedule
3. View statistics and subject legend
4. Auto-updates when Admin makes changes

---

## 🕐 Time Slots

### Available Time Slots
1. **09:00 - 10:00** (9:00 AM - 10:00 AM)
2. **10:00 - 11:00** (10:00 AM - 11:00 AM)
3. **11:00 - 12:00** (11:00 AM - 12:00 PM)
4. **12:00 - 13:00** (12:00 PM - 1:00 PM)
5. **13:00 - 14:00** (1:00 PM - 2:00 PM)
6. **14:00 - 15:00** (2:00 PM - 3:00 PM)
7. **15:00 - 16:00** (3:00 PM - 4:00 PM)

### Working Days
- Monday
- Tuesday
- Wednesday
- Thursday
- Friday

---

## 🎯 Example Workflow

### Scenario: Admin Creates Class Timetable for Grade 10-A

1. **Admin logs in** → Goes to Timetable page
2. **Toggles to** "Class Timetables"
3. **Clicks** "Create Timetable"
4. **Selects** "Grade 10-A" from dropdown
5. **Fills grid**:
   - Monday 09:00-10:00: Mathematics, Room 101
   - Monday 10:00-11:00: Physics, Room 102
   - Tuesday 09:00-10:00: Chemistry, Room 103
   - ... (fills more cells)
6. **Clicks** "Save Timetable"
7. **Success!** Timetable created

### What Happens Next:

**Students in Grade 10-A:**
- Open Student Portal → Timetable
- See their schedule immediately
- No refresh needed!

**Parents of Grade 10-A students:**
- Open Parent Portal → Timetable
- See child's schedule immediately
- No refresh needed!

---

## 🔐 Data Persistence

### Storage
- **Location**: Browser localStorage
- **Key**: `erp_timetable_data`
- **Format**: JSON object with teachers and students arrays
- **Persistence**: Survives page refreshes

### Data Structure in localStorage
```javascript
{
    teachers: [
        { id, teacherId, teacherName, schedule, createdAt, updatedAt },
        // ... more teacher timetables
    ],
    students: [
        { id, className, schedule, createdAt, updatedAt },
        // ... more class timetables
    ]
}
```

---

## 🎨 UI/UX Features

### Admin Portal
- **Toggle View**: Switch between Teacher/Class timetables
- **Weekly Grid**: See entire week at once
- **Inline Editing**: Edit cells directly in grid
- **Pre-fill on Edit**: Existing data loads automatically
- **Empty State**: Clear message when no timetables exist

### Teacher/Student/Parent Portals
- **Weekly Grid**: Full week view
- **Today Highlight**: Current day highlighted
- **Color-coded Subjects**: Different colors for each subject
- **Statistics Cards**: Quick overview of schedule
- **Empty State**: Message when no timetable assigned
- **Real-time Badge**: Info note about auto-sync

---

## 🛠️ Technical Implementation

### File Structure
```
src/
├── utils/
│   └── timetableStore.js           # Timetable data store
└── components/
    └── portals/
        ├── admin/
        │   └── TimetablePage.jsx        # Admin create/edit
        ├── teacher/
        │   └── TimetablePage.jsx        # Teacher view
        ├── student/
        │   └── TimetablePage.jsx        # Student view
        └── parent/
            └── TimetablePage.jsx        # Parent view
```

### Key Functions (timetableStore.js)

```javascript
saveTeacherTimetable(teacherId, data)    // Save teacher timetable
saveClassTimetable(className, data)      // Save class timetable
getTeacherTimetable(teacherId)           // Get teacher timetable
getClassTimetable(className)             // Get class timetable
getAllTeacherTimetables()                // Get all teacher timetables
getAllClassTimetables()                  // Get all class timetables
deleteTeacherTimetable(teacherId)        // Delete teacher timetable
deleteClassTimetable(className)          // Delete class timetable
subscribeToUpdates(callback)             // Real-time updates
getTimetableStats()                      // Get statistics
```

---

## 🐛 Troubleshooting

### Timetable not showing in Teacher portal?
1. Check if Admin has created timetable for that teacher
2. Verify teacher ID matches
3. Refresh the page
4. Check browser console for errors

### Timetable not showing in Student portal?
1. Check if Admin has created timetable for student's class
2. Verify student's class is correct
3. Refresh the page
4. Check browser console for errors

### Timetable not showing in Parent portal?
1. Check if child's class has timetable
2. Verify parent-child link is correct
3. Refresh the page
4. Check browser console for errors

### Changes not syncing?
1. Ensure you clicked "Save Timetable"
2. Check browser console for errors
3. Verify localStorage is enabled
4. Try refreshing all portals

### Grid not loading old data when editing?
1. Check browser console logs
2. Verify timetable exists in localStorage
3. Check if time format matches (HH:MM-HH:MM)
4. Try creating a new timetable

---

## 🎯 Best Practices

### For Admins
- ✅ Create timetables at the start of term
- ✅ Review before saving
- ✅ Use consistent room numbering
- ✅ Fill all required periods
- ✅ Update promptly when changes occur

### For Teachers
- ✅ Check timetable regularly
- ✅ Report discrepancies to Admin
- ✅ Note room numbers for classes

### For Students/Parents
- ✅ Check timetable weekly
- ✅ Note room numbers
- ✅ Report issues to Admin

---

## 🚀 Future Enhancements

- Backend API integration
- Database storage
- Timetable conflicts detection
- Bulk import/export
- PDF generation
- Email notifications
- Mobile app support
- Multiple timetables per teacher
- Substitute teacher management
- Room availability checking

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review browser console errors
3. Contact development team

**Last Updated:** December 15, 2025
