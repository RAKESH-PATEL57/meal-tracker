import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    // You could show a loading spinner here
    return <div>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;