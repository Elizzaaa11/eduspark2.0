import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — wraps pages that require authentication.
 * Optionally restrict to specific roles via the `roles` prop.
 *
 * Usage:
 *   <ProtectedRoute>              — any authenticated user
 *   <ProtectedRoute roles={['student']}> — only students
 */
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Still hydrating from localStorage
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <span className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
      </div>
    );
  }

  // Not logged in → redirect to login, preserve intended path
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but wrong role
  if (roles && !roles.includes(user.role)) {
    const fallback = {
      student: '/student',
      mentor: '/mentor',
      centre: '/centre',
      admin: '/admin',
    };
    return <Navigate to={fallback[user.role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
