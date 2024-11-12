// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('token');
  console.log("all cookies ",Cookies.get())
  console.log("doc cookies ",document.cookies)
    console.log("token from proteced route ",token)
  return token ? children : <Navigate to="/unauth" />;
};

export default ProtectedRoute;
