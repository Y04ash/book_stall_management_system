// ProtectedRoute.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = Cookies.get('token');
  // console.log("all cookies ",Cookies.get())
  // console.log("doc cookies ",document.cookies)
  //   console.log("token from proteced route ",token)
  return token ? children : navigate("/unauth");
};

export default ProtectedRoute;
