// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider'; // Import your Auth context

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Access user from Auth context

  // If the user is not authenticated, redirect to the login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children; // Render children if authenticated
};

export default ProtectedRoute;
