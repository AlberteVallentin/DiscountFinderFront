import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect til login med return path
      navigate('/login', {
        state: { returnPath: location.pathname },
      });
    }
  }, [isAuthenticated, navigate, location]);

  // Render children kun hvis authenticated
  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
