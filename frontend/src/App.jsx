import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import StudentDashboard from './components/portals/student/StudentDashboard';
import TeacherDashboard from './components/portals/teacher/TeacherDashboard';
import AdminDashboard from './components/portals/admin/AdminDashboard';
import ParentDashboard from './components/portals/parent/ParentDashboard';
import { isAuthenticated, getUserRole } from './utils/jwt';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/common/ToastContainer';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const authenticated = isAuthenticated();
  return authenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const authenticated = isAuthenticated();
  const userRole = getUserRole() || 'student';
  return authenticated ? <Navigate to={`/dashboard/${userRole.toLowerCase()}`} replace /> : children;
};

import { useParams } from 'react-router-dom';

const DashboardRouter = () => {
  const { role } = useParams();
  const storedRole = localStorage.getItem('userRole') || 'student';
  const userRole = (role || storedRole).toLowerCase();

  switch (userRole) {
    case 'student':
      return <StudentDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'admin':
      return <AdminDashboard />;
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
