// src/Pages/Login.jsx
import React, { useState } from "react";
import "../css/Login.css"; // For styling, create this file later

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [credValid,setCredValid] = useState(true)
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here (e.g., API call)
    const credentials = {
      email,
      password,
    };
    const response = await fetch("http://localhost:5000/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      credentials: "include", 
    });

    if (!response.ok) {
      // Redirect to /home on successful login
      // window.location.href = "/"
      setCredValid(false)
      setIsLogedIn(false)
      const errorData = await response.json();
      console.error(errorData.message);
    } else{
      setCredValid(true)
      window.location.href = "/home";
      const response = await fetch("http://localhost:5000/home", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
      });
      setIsLogedIn(true)

    }

    console.log(
      "Email:",
      email,
      "Password:",
      password
    );
  };

  return (
    <div className="logIn_outer">
    {
      !credValid && (
      <div className="invalid_cred_container">
        <p>Invalid Credentials</p>
      </div>)
    }
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {/* <label className="remember-me">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          Remember Me
        </label> */}
        <button type="submit" className="login-button">
          Login
        </button>
        {/* <a href="#" className="forgot-password">
          Forgot Password?
        </a> */}
      </form>
    </div>
    </div>
  );
};

export default Login;
