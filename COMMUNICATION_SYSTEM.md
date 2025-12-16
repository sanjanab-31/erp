# Communication System - Real-Time Implementation

## Overview
A comprehensive real-time communication system has been implemented across all four portals (Student, Teacher, Parent, Admin). Users can now send messages, create announcements, and receive notifications in real-time.

## What Was Implemented

### 1. **Communication Store** (`src/utils/communicationStore.js`)
   A centralized data management system that handles:
   - **Direct Messages**: One-on-one conversations between users
   - **Announcements**: Broadcast messages to groups or all users
   - **Notifications**: System notifications for various events
   - **Real-time Synchronization**: Instant updates across all portals

### 2. **Unified Communication Component** (`src/components/portals/shared/CommunicationPage.jsx`)
   A single, reusable component that works across all portals with:
   - **Three Tabs**: Messages, Announcements, Notifications
   - **Real-time Updates**: Auto-refreshes when data changes
   - **Search Functionality**: Find conversations quickly
   - **Unread Counts**: Track unread items
   - **Modal Forms**: Create new messages and announcements

### 3. **Portal-Specific Implementations**
   - **Student** (`src/components/portals/student/CommunicationCenter.jsx`)
   - **Teacher** (`src/components/portals/teacher/CommunicationPage.jsx`)
   - **Parent** (`src/components/portals/parent/CommunicationPage.jsx`)
   - **Admin** (`src/components/portals/admin/CommunicationPage.jsx`)

## Features

### ✅ **Direct Messaging**
- **Send Messages**: Click "New" button to compose a message
- **Real-time Delivery**: Messages appear instantly
- **Conversation View**: See full message history
- **Read Receipts**: Track message status
- **Search**: Find conversations by name
- **Unread Indicators**: Visual badges for unread messages

### ✅ **Announcements**
- **Create Announcements** (Admin/Teacher only):
  - Set title and content
  - Choose recipients (All, Students, Teachers, Parents)
  - Set priority (High, Medium, Low)
  - Categorize (Academic, Event, General)
- **View Announcements**: All users can see relevant announcements
- **Priority Badges**: Visual indicators for importance
- **Timestamp**: See when announcements were posted

### ✅ **Notifications**
- **System Notifications**: Automated alerts for:
  - Assignment grades
  - Fee reminders
  - Attendance alerts
  - New course materials
- **Click to Mark Read**: Tap notification to mark as read
- **Unread Indicators**: Blue dot for unread items
- **Time Stamps**: Relative time display (e.g., "2h ago")

### ✅ **Real-Time Synchronization**
- **Auto-Updates**: Changes sync instantly across all open tabs
- **Event-Driven**: Uses browser events for real-time updates
- **Persistent Storage**: Data saved in localStorage
- **Cross-Portal**: Messages sent from one portal appear in another

## How to Use

### **Sending a Message**

1. **Navigate to Communication Center**
2. **Click "New" button** in Messages tab
3. **Fill in the form**:
   - Recipient ID (e.g., `teacher_1`, `student_1`, `parent_1`)
   - Subject (optional)
   - Message text
4. **Click "Send Message"**
5. **Message appears instantly** in both sender and recipient portals

### **Creating an Announcement** (Admin/Teacher Only)

1. **Go to Announcements tab**
2. **Click "New Announcement"**
3. **Fill in the form**:
   - Title
   - Content
   - Recipients (All, Students, Teachers, Parents)
   - Priority (High, Medium, Low)
4. **Click "Create Announcement"**
5. **Announcement appears** for all selected recipients

### **Viewing Notifications**

1. **Go to Notifications tab**
2. **See all system notifications**
3. **Click any notification** to mark as read
4. **Unread count updates** automatically

## User IDs and Roles

The system uses the following ID format:
- **Students**: `student_1`, `student_2`, etc.
- **Teachers**: `teacher_1`, `teacher_2`, etc.
- **Parents**: `parent_1`, `parent_2`, etc.
- **Admin**: `admin_1`

## Communication Flow

### **Student → Teacher**
```
Student Portal → New Message → Recipient: teacher_1 → Send
Teacher Portal → Messages Tab → See new message (real-time)
```

### **Teacher → Parent**
```
Teacher Portal → New Message → Recipient: parent_1 → Send
Parent Portal → Messages Tab → See new message (real-time)
```

### **Admin → All**
```
Admin Portal → New Announcement → Recipients: All → Create
All Portals → Announcements Tab → See announcement (real-time)
```

### **Parent → Teacher**
```
Parent Portal → New Message → Recipient: teacher_1 → Send
Teacher Portal → Messages Tab → See new message (real-time)
```

## Data Structure

### **Message Object**
```javascript
{
    id: 1,
    conversationId: 'conv_1',
    senderId: 'student_1',
    senderName: 'Mike Wilson',
    senderRole: 'student',
    recipientId: 'teacher_1',
    recipientName: 'Sarah Johnson',
    recipientRole: 'teacher',
    subject: 'Question about homework',
    text: 'Can you explain problem 5?',
    timestamp: '2025-12-16T08:30:00Z',
    read: false,
    type: 'direct'
}
```

### **Announcement Object**
```javascript
{
    id: 1,
    title: 'Mid-term Exam Schedule',
    content: 'Exams will be held from Dec 20-25',
    authorId: 'admin_1',
    authorName: 'Admin',
    authorRole: 'admin',
    recipients: 'all', // or 'students', 'teachers', 'parents'
    priority: 'high', // or 'medium', 'low'
    category: 'Academic',
    timestamp: '2025-12-16T09:00:00Z',
    read: []
}
```

### **Notification Object**
```javascript
{
    id: 1,
    userId: 'student_1',
    title: 'Assignment Graded',
    message: 'Your Math assignment has been graded. Score: 92/100',
    type: 'grade',
    timestamp: '2025-12-16T08:00:00Z',
    read: false,
    link: '/grades'
}
```

## API Functions

### **Communication Store Functions**

```javascript
// Send a message
sendMessage({
    recipientId: 'teacher_1',
    recipientName: 'Sarah Johnson',
    recipientRole: 'teacher',
    subject: 'Question',
    text: 'Hello!',
    type: 'direct'
});

// Get user conversations
const conversations = getUserConversations();

// Get messages for a conversation
const messages = getConversationMessages('conv_1');

// Mark conversation as read
markConversationAsRead('conv_1');

// Create announcement
createAnnouncement({
    title: 'Important Notice',
    content: 'Please read this',
    recipients: 'all',
    priority: 'high',
    category: 'General'
});

// Get announcements
const announcements = getUserAnnouncements();

// Get notifications
const notifications = getUserNotifications();

// Get unread counts
const counts = getUnreadCounts();
// Returns: { messages: 3, announcements: 1, notifications: 2, total: 6 }

// Subscribe to real-time updates
const unsubscribe = subscribeToCommunicationUpdates((data) => {
    console.log('Communications updated:', data);
});
```

## Testing the System

### **Test Scenario 1: Student → Teacher Message**
1. Open Student Portal
2. Go to Communication Center → Messages
3. Click "New" button
4. Enter:
   - Recipient ID: `teacher_1`
   - Subject: "Test Message"
   - Message: "Hello Teacher!"
5. Click "Send Message"
6. Open Teacher Portal (or refresh if already open)
7. See the message appear in real-time

### **Test Scenario 2: Admin Announcement**
1. Open Admin Portal
2. Go to Communication Center → Announcements
3. Click "New Announcement"
4. Enter:
   - Title: "School Holiday"
   - Content: "School will be closed tomorrow"
   - Recipients: "All"
   - Priority: "High"
5. Click "Create Announcement"
6. Open any other portal
7. See the announcement appear in Announcements tab

### **Test Scenario 3: Real-Time Sync**
1. Open Student Portal in one browser tab
2. Open Teacher Portal in another tab
3. Send a message from Student to Teacher
4. Watch it appear instantly in Teacher portal
5. Reply from Teacher portal
6. Watch reply appear in Student portal

## Benefits

✅ **Real-Time Communication** - Messages appear instantly
✅ **Cross-Portal Messaging** - Students, Teachers, Parents, Admin can all communicate
✅ **Persistent Data** - All messages saved in localStorage
✅ **Unread Tracking** - Know exactly what you haven't read
✅ **Search Functionality** - Find conversations quickly
✅ **Announcements** - Broadcast to specific groups
✅ **Notifications** - System-generated alerts
✅ **Clean UI** - Intuitive, modern interface
✅ **Mobile Responsive** - Works on all devices
✅ **Dark Mode Support** - Respects user preferences

## Future Enhancements (Optional)

- File attachments in messages
- Group conversations (multiple participants)
- Message reactions (like, heart, etc.)
- Typing indicators
- Online/offline status
- Message search within conversations
- Export conversation history
- Push notifications (browser notifications)
- Email notifications
- Message scheduling
- Auto-delete old messages
- Message encryption

---

**All communication features are now fully functional with real-time synchronization across all portals!** 🎉

## Quick Reference

**Student Portal**: Can message Teachers and Parents
**Teacher Portal**: Can message Students, Parents, and create Announcements
**Parent Portal**: Can message Teachers
**Admin Portal**: Can message everyone and create Announcements for all groups

**Storage Key**: `erp_communications`
**Event Name**: `communicationsUpdated`
