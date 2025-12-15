# School ERP Portal System

## Overview
This School ERP system features **four separate portal dashboards**, each tailored for different user roles:
- **Student Portal** - For students to track their academic progress
- **Teacher Portal** - For teachers to manage classes and grading
- **Admin Portal** - For administrators to oversee the entire system
- **Parent Portal** - For parents to monitor their children's progress

## Portal Structure

```
src/components/portals/
├── student/
│   ├── StudentDashboard.jsx
│   └── index.js
├── teacher/
│   ├── TeacherDashboard.jsx
│   └── index.js
├── admin/
│   ├── AdminDashboard.jsx
│   └── index.js
└── parent/
    ├── ParentDashboard.jsx
    └── index.js
```

## Features

### 🎓 Student Portal Dashboard
The Student Portal matches the exact UI from your uploaded image with:

**Stats Cards:**
- **Attendance**: Real-time attendance percentage with progress bar (starts at 95%)
- **Current Grade**: Overall grade performance (starts at 'A')
- **Assignments**: Number of pending submissions (starts at 3)
- **Library Books**: Currently issued books count (starts at 2)

**Main Sections:**
- **Upcoming Assignments**: Shows assignments with due dates and urgency indicators
  - Math Assignment - Due tomorrow (urgent)
  - Physics Lab Report - Due in 3 days
- **Recent Grades**: Displays recent assessment results
  - Mathematics: Mid-term exam - Grade A
  - Physics: Quiz 3 - Grade B+

**Navigation Menu:**
- Dashboard
- Attendance
- Exams & Grade
- Courses
- Fees & Finance
- Timetable
- Communication
- Library
- Transport
- Settings

### 👨‍🏫 Teacher Portal Dashboard
**Stats Cards:**
- Total Classes (5)
- Total Students (120)
- Pending Grading (8 assignments)
- Today's Classes (3)

**Main Sections:**
- Today's Schedule with class timings and room numbers
- Recent Submissions with grading status

### 👔 Admin Portal Dashboard
**Stats Cards:**
- Total Students (1,250)
- Total Teachers (85)
- Total Revenue ($125,000)
- Attendance Rate (92%)

**Main Sections:**
- Quick Stats with percentage changes
- Recent Activities (enrollments, payments, staff updates)

### 👨‍👩‍👧 Parent Portal Dashboard
**Stats Cards (Per Child):**
- Child's Attendance (95%)
- Current Grade (A)
- Pending Fees ($0)
- Upcoming Tests (2)

**Main Sections:**
- Recent Activities of child
- Upcoming Events (Parent-Teacher meetings, exams)

## Real-Time Functionality

All dashboards feature **real-time data updates**:

1. **Initial State**: All counters start at 0 or default values
2. **Real-Time Updates**: Data automatically updates every 5 seconds via `useEffect` hook
3. **Dynamic Counts**: When you add data (assignments, grades, etc.), counts will update in real-time

### How Real-Time Works:
```javascript
useEffect(() => {
  const interval = setInterval(() => {
    // Updates dashboard data every 5 seconds
    setDashboardData(prev => ({ ...prev }));
  }, 5000);
  return () => clearInterval(interval);
}, []);
```

## Common Features Across All Portals

### 🎨 UI Features:
- **Dark Mode Toggle**: Switch between light and dark themes
- **Search Functionality**: Search across the portal
- **Notifications**: Bell icon with notification counter
- **Responsive Design**: Works on all screen sizes
- **Breadcrumb Navigation**: Shows current location
- **User Profile**: Displays user info in sidebar

### 🎨 Design System:
- **Color Schemes**:
  - Student: Blue gradient
  - Teacher: Green gradient
  - Admin: Purple gradient
  - Parent: Orange gradient
- **Icons**: Lucide React icons throughout
- **Typography**: Clean, modern font hierarchy
- **Spacing**: Consistent padding and margins
- **Cards**: Rounded corners with subtle shadows

## Login Credentials

Use these credentials to test each portal:

### Student Portal
- Email: `student@eshwar.com`
- Password: `student123`

### Teacher Portal
- Email: `teacher@eshwar.com`
- Password: `teacher123`

### Admin Portal
- Email: `admin@eshwar.com`
- Password: `admin123`

### Parent Portal
- Email: `parent@eshwar.com`
- Password: `parent123`

## Routing

The app automatically routes users to their appropriate portal based on their role:

```
/login → Authentication
/dashboard/student → Student Portal
/dashboard/teacher → Teacher Portal
/dashboard/admin → Admin Portal
/dashboard/parent → Parent Portal
```

## Adding Real Data

To connect real data to the dashboards:

1. **Replace Mock Data**: Update the `dashboardData` state in each component
2. **API Integration**: Add API calls in the `useEffect` hook
3. **State Management**: Consider using Context API or Redux for global state
4. **Backend Connection**: Connect to your backend API endpoints

Example:
```javascript
useEffect(() => {
  const fetchData = async () => {
    const response = await fetch('/api/student/dashboard');
    const data = await response.json();
    setDashboardData(data);
  };
  fetchData();
  const interval = setInterval(fetchData, 5000);
  return () => clearInterval(interval);
}, []);
```

## Customization

### Adding New Stats Cards:
```javascript
<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-sm font-medium text-gray-600">Your Stat</h3>
    <Icon className="w-5 h-5 text-gray-400" />
  </div>
  <p className="text-3xl font-bold text-gray-900">{value}</p>
  <p className="text-sm text-gray-500 mt-2">Description</p>
</div>
```

### Adding New Menu Items:
```javascript
const menuItems = [
  { icon: YourIcon, label: 'New Section' },
  // ... other items
];
```

## Tech Stack

- **React 19.2.0**: UI framework
- **React Router DOM 7.10.1**: Routing
- **Tailwind CSS 4.1.18**: Styling
- **Lucide React 0.561.0**: Icons
- **Vite 7.2.4**: Build tool

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Next Steps

1. **Backend Integration**: Connect to your backend API
2. **Database**: Set up database for persistent storage
3. **Authentication**: Implement proper JWT authentication
4. **Additional Pages**: Add more pages for each menu item
5. **Real-time Updates**: Implement WebSocket for live updates
6. **Notifications**: Add notification system
7. **Reports**: Generate PDF reports
8. **Analytics**: Add charts and graphs

## File Organization

Each portal is completely independent and can be developed separately:
- Add new components in the respective portal folder
- Share common components in `src/components/shared/`
- Keep portal-specific logic within each portal folder

## Support

For questions or issues, refer to:
- React Documentation: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Lucide Icons: https://lucide.dev
- React Router: https://reactrouter.com
