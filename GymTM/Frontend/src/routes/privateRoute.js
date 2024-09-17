import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { isAdminLoggedIn, isClientLoggedIn } = useAuth();

  if (role === 'admin' && !isAdminLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (role === 'client' && !isClientLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;
