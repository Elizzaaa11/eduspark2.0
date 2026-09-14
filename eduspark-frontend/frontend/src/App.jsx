import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Placeholder dashboard pages (to be built next)
const StudentDashboard = () => <div style={{ color: '#fff', padding: 40, fontFamily: 'Outfit' }}>🎓 Student Dashboard — coming next!</div>;
const MentorDashboard = () => <div style={{ color: '#fff', padding: 40, fontFamily: 'Outfit' }}>🧑‍🏫 Mentor Dashboard — coming next!</div>;
const CentreDashboard = () => <div style={{ color: '#fff', padding: 40, fontFamily: 'Outfit' }}>🏫 Centre Dashboard — coming next!</div>;
const AdminDashboard = () => <div style={{ color: '#fff', padding: 40, fontFamily: 'Outfit' }}>🛡 Admin Dashboard — coming next!</div>;

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Public auth routes ── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* ── Protected role dashboards ── */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute roles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/*"
            element={
              <ProtectedRoute roles={['mentor']}>
                <MentorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/centre/*"
            element={
              <ProtectedRoute roles={['centre']}>
                <CentreDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ── Fallback ── */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
