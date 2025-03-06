// client/src/pages/Admin/RequireAdmin.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAdmin = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // If not logged in or not admin, redirect to login
  if (!token || role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default RequireAdmin;
