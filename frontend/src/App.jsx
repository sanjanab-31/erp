import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import StudentDashboard from './components/portals/student/StudentDashboard';
import TeacherDashboard from './components/portals/teacher/TeacherDashboard';
import AdminDashboard from './components/portals/admin/AdminDashboard';
import AdminOverview from './components/portals/admin/AdminOverview';
import ParentDashboard from './components/portals/parent/ParentDashboard';
import { isAuthenticated, getUserRole } from './utils/jwt';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/common/ToastContainer';
import './App.css';

// Student Portal Pages
import StudentHome from './components/portals/student/StudentHome';
import AttendancePage from './components/portals/student/AttendancePage';
import FeePage from './components/portals/student/FeePage';
import ExamsAndGrades from './components/portals/student/ExamsAndGrades';
import CoursesPage from './components/portals/student/CoursesPage';
import TimetablePage from './components/portals/student/TimetablePage';
import LibraryPage from './components/portals/student/LibraryPage';
import SettingsPage from './components/portals/student/SettingsPage';
import AnnouncementsPage from './components/portals/student/AnnouncementsPage';
import ReportsPage from './components/portals/student/ReportsPage';

// Admin Portal Pages
import Students from './components/portals/admin/Students';
import Teachers from './components/portals/admin/Teachers';
import AdminExamSchedules from './components/portals/admin/AdminExamSchedules';
import FeesAndFinancePage from './components/portals/admin/FeesAndFinancePage';
import AdminAttendancePage from './components/portals/admin/AttendancePage';
import AdminCoursesPage from './components/portals/admin/CoursesPage';
import AdminTimetablePage from './components/portals/admin/TimetablePage';
import AdminLibraryPage from './components/portals/admin/LibraryPage';
import AdminAnnouncementsPage from './components/portals/admin/AnnouncementsPage';
import AdminReportsPage from './components/portals/admin/ReportsPage';
import AdminSettingsPage from './components/portals/admin/SettingsPage';

const ProtectedRoute = ({ children }) => {
  const authenticated = isAuthenticated();
  return authenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const authenticated = isAuthenticated();
  const userRole = getUserRole() || 'student';
  return authenticated ? <Navigate to={`/dashboard/${userRole.toLowerCase()}`} replace /> : children;
};

const DashboardRouter = () => {
  const { role } = useParams();
  const storedRole = localStorage.getItem('userRole') || 'student';
  const userRole = (role || storedRole).toLowerCase();

  switch (userRole) {
    case 'student':
      return <Navigate to="/dashboard/student" replace />; // Redirect to explicit route
    case 'teacher':
      return <TeacherDashboard />;
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'parent':
      return <ParentDashboard />;
    default:
      return <StudentDashboard />;
  }
};

function App() {
  return (
    <ToastProvider>
      <Router>
        <ToastContainer />
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/dashboard/student"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentHome />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="fees" element={<FeePage />} />
            <Route path="exams" element={<ExamsAndGrades />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="timetable" element={<TimetablePage />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminOverview />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="attendance" element={<AdminAttendancePage />} />
            <Route path="courses" element={<AdminCoursesPage />} />
            <Route path="fees" element={<FeesAndFinancePage />} />
            <Route path="timetable" element={<AdminTimetablePage />} />
            <Route path="exams" element={<AdminExamSchedules />} />
            <Route path="library" element={<AdminLibraryPage />} />
            <Route path="announcements" element={<AdminAnnouncementsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Fallback/Legacy Wrapper for other roles (Teacher, Parent, Student) */}
          <Route
            path="/dashboard/:role"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
