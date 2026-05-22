import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const PublicRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const redirectTarget = location.state?.from || '/';

  if (isAuthenticated) {
    return <Navigate to={redirectTarget} replace />;
  }

  return children;
};

export default PublicRoute;
