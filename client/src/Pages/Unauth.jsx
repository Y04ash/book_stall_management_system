// Unauth.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/unauth.css'; // You can use this for custom styling

const Unauth = () => {
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate('/');
  };

  return (
    <div className="unauth-container">
      <div className="unauth-message">
        <h1>You are not authenticated!</h1>
        <p>Please log in to access this page.</p>
        <button className="login-btn" onClick={redirectToLogin}>Go to Login</button>
      </div>
    </div>
  );
};

export default Unauth;
