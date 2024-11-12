import React from "react";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa6";
import '../css/footer.css'
const Footer = () => {
  const handleAddCampaign =async (event)=>{
    event.preventDefault(); // Prevent default anchor behavior
  
    try {
      const response = await fetch("http://localhost:5000/Add-campaign", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies for authentication
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Campaign data:", result);
        // Optionally, redirect or update the UI here
        window.location.href = "/Add-campaign";
      } else {
        console.error("Failed to fetch campaign data:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  const handleHome=async (event)=>{
    event.preventDefault(); // Prevent default anchor behavior
  
    try {
      const response = await fetch("http://localhost:5000/home", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies for authentication
      });
  
      if (response.ok) {
        const result = await response.json();
        // Optionally, redirect or update the UI here
        window.location.href = "/home";
      } else {
        console.error("Failed to fetch campaign data:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  const handleCampaign =async (event)=>{
    event.preventDefault(); // Prevent default anchor behavior
  
    try {
      const response = await fetch("http://localhost:5000/Campaign", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies for authentication
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Campaign data:", result);
        // Optionally, redirect or update the UI here
        window.location.href = "/Campaign";
      } else {
        console.error("Failed to fetch campaign data:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  const handleLogout =async (event)=>{
    event.preventDefault(); // Prevent default anchor behavior
  
    try {
      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies for authentication
      });
  
      
      if (response.ok) {
        console.log("Logged out successfully");
        // Redirect to login or homepage after logout
        window.location.href = "/"; // Adjust path as needed
      } else {
        console.error("Failed to log out:", response.statusText);
      }
    } catch (error) {
      console.error("Error in logging out:", error);
    }
  }
  
  const handleProfile =async(event)=>{
    event.preventDefault(); // Prevent default anchor behavior
  
    try {
      const response = await fetch("http://localhost:5000/profile", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies for authentication
      });
      if (response.ok) {
        const result = await response.json()
        window.location.href = "/profile"; // Adjust path as needed
      } else {
        console.error("Failed to fetch pfp:", response.statusText);
      }
    } catch (error) {
      console.error("ERR to fetch pfp", error);
    }
  }
  return (
    <footer className="footer">
      <div className="footer1">
        <ul className="footer_links">
          <li>
            <a href="/home" onClick={handleHome}>Home</a>
          </li>
          <li>
            <a href="/Campaign" onClick={handleCampaign}>Campaigns</a>
          </li>
          <li>
            <a href="/Add-campaign" onClick={handleAddCampaign}>Add Campaign</a>
          </li>
          <li className="tabs">
            <a href="/profile" onClick={handleProfile}>Profile</a>
          </li>
        </ul>

        <div className="contact">Contact Us: +91 XXXXX XXXXX</div>
        <div className="mail">Email: mail@mail.com</div>
      </div>
      <div className="footer2">
      <FaInstagram />
      <FaTwitter />
      <FaFacebookF />
      </div>
    </footer>
  );
};

export default Footer;