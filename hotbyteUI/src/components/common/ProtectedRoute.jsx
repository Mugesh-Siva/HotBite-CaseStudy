// ProtectedRoute - wraps routes that require authentication
// Redirects to /login if user is not authenticated
// Optionally checks for specific role

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login, preserving where they wanted to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check: if a specific role is required
  if (requiredRole && user?.roleName !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
