import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Login from './components/auth/Login';
import ForgotPassword from './components/auth/ForgotPassword';
import StudentDashboard from './components/portals/student/StudentDashboard';
import TeacherDashboard from './components/portals/teacher/TeacherDashboard';
import AdminDashboard from './components/portals/admin/AdminDashboard';
import AdminOverview from './components/portals/admin/AdminOverview';
import ParentDashboard from './components/portals/parent/ParentDashboard';
import { isAuthenticated, getUserRole } from './utils/jwt';

// Parent Portal Pages
import ParentHome from './components/portals/parent/ParentHome';
import ParentAcademicProgressPage from './components/portals/parent/AcademicProgressPage';
import ParentAttendancePage from './components/portals/parent/AttendancePage';
import ParentFeeManagementPage from './components/portals/parent/FeeManagementPage';
import ParentTimetablePage from './components/portals/parent/TimetablePage';
import ParentLibraryPage from './components/portals/parent/LibraryPage';
import ParentAnnouncementsPage from './components/portals/parent/AnnouncementsPage';
import ParentSettingsPage from './components/portals/parent/SettingsPage';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/common/ToastContainer';
import NotFound from './components/common/NotFound';
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

// Teacher Portal Pages
import TeacherHome from './components/portals/teacher/TeacherHome';
import TeacherStudentsPage from './components/portals/teacher/StudentsPage';
import TeacherAttendancePage from './components/portals/teacher/AttendancePage';
import TeacherExamsPage from './components/portals/teacher/ExamsAndGradesPage';
import TeacherCoursesPage from './components/portals/teacher/CoursesPage';
import TeacherTimetablePage from './components/portals/teacher/TimetablePage';
import TeacherLibraryPage from './components/portals/teacher/LibraryPage';
import TeacherAnnouncementsPage from './components/portals/teacher/AnnouncementsPage';
import TeacherReportsPage from './components/portals/teacher/ReportsPage';
import TeacherSettingsPage from './components/portals/teacher/SettingsPage';

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
  const userRole = (getUserRole() || 'student').toLowerCase();

  const roleRoutes = {
    student: '/student/dashboard',
    teacher: '/teacher/dashboard',
    admin: '/admin/dashboard',
    parent: '/parent/dashboard'
  };

  const redirectPath = roleRoutes[userRole] || '/student/dashboard';

  return authenticated ? <Navigate to={redirectPath} replace /> : children;
};

const DashboardRouter = () => {
  const { role } = useParams();
  const storedRole = localStorage.getItem('userRole') || 'student';
  const userRole = (role || storedRole).toLowerCase();

  switch (userRole) {
    case 'student':
      return <Navigate to="/student/dashboard" replace />; // Redirect to explicit route
    case 'teacher':
      return <Navigate to="/teacher/dashboard" replace />;
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'parent':
      return <Navigate to="/parent/dashboard" replace />;
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
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentHome />} />
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

          {/* Teacher Routes */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<TeacherHome />} />
            <Route path="students" element={<TeacherStudentsPage />} />
            <Route path="attendance" element={<TeacherAttendancePage />} />
            <Route path="exams" element={<TeacherExamsPage />} />
            <Route path="courses" element={<TeacherCoursesPage />} />
            <Route path="timetable" element={<TeacherTimetablePage />} />
            <Route path="library" element={<TeacherLibraryPage />} />
            <Route path="announcements" element={<TeacherAnnouncementsPage />} />
            <Route path="reports" element={<TeacherReportsPage />} />
            <Route path="settings" element={<TeacherSettingsPage />} />
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

          {/* Parent Routes */}
          <Route
            path="/parent"
            element={
              <ProtectedRoute>
                <ParentDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ParentHome />} />
            <Route path="academic-progress" element={<ParentAcademicProgressPage />} />
            <Route path="attendance" element={<ParentAttendancePage />} />
            <Route path="fees" element={<ParentFeeManagementPage />} />
            <Route path="timetable" element={<ParentTimetablePage />} />
            <Route path="library" element={<ParentLibraryPage />} />
            <Route path="announcements" element={<ParentAnnouncementsPage />} />
            <Route path="settings" element={<ParentSettingsPage />} />
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

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
