# ERP Frontend

Frontend application for the ERP Management System built with React and Vite.

## 📁 Project Structure

```
frontend/
├── public/             # Static assets
├── src/
│   ├── assets/        # Images, fonts, etc.
│   ├── components/    # React components
│   │   ├── auth/     # Authentication components
│   │   └── portals/  # Portal-specific components
│   │       ├── admin/
│   │       ├── teacher/
│   │       ├── student/
│   │       └── parent/
│   ├── utils/         # Utility functions and stores
│   ├── App.jsx        # Main App component
│   ├── App.css        # App styles
│   ├── index.css      # Global styles
│   └── main.jsx       # Entry point
├── .env               # Environment variables
├── index.html         # HTML template
├── package.json
└── vite.config.js     # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Update the `.env` file with your Firebase configuration

### Running the Application

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

The application will start on `http://localhost:5173` (default Vite port)

## 👥 User Portals

The application includes four different portals:

1. **Admin Portal** - Manage students, teachers, courses, and system settings
2. **Teacher Portal** - Manage courses, assignments, grades, and student communication
3. **Student Portal** - View courses, assignments, grades, timetable, and library
4. **Parent Portal** - Monitor child's academic progress, attendance, and fees

## 🔧 Technologies

- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Routing
- **Firebase** - Backend services (Authentication, Firestore)
- **Tailwind CSS** - Styling framework

## 🔐 Demo Credentials

### Admin
- Email: `admin@school.com`
- Password: `admin123`

### Teacher
- Email: `teacher@school.com`
- Password: `teacher123`

### Student
- Email: `student@school.com`
- Password: `student123`

### Parent
- Email: `parent@school.com`
- Password: `parent123`

## 📝 License

ISC
