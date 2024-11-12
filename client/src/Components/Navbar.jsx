import React ,{useState}from "react";
import "../css/styles.css";
import { CgProfile } from "react-icons/cg";

const Navbar = () => {

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
      // setIsLogedIn(true)
      // Optionally, redirect or update the UI here
      window.location.href = "/Add-campaign";
      // const res = await fetch("http://localhost:5000/Add-campaign",{
      //   method:"GET",
      //   headers: { "Content-Type": "application/json" },
      // credentials: "include", // Include cookies for authentication

      // })
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
      setIsLogedIn(true)
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
      setIsLogedIn(true)
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
      setIsLogedIn(false)
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
    // <div className="nav_outer">
      <nav className="nav">
        <div className="logo_title">
          <div className="logo"></div>
          <a href="/home" onClick={handleHome} className="site-title">
            Book Stock Pro
          </a>
        </div>
        <ul>
          <li className="tabs">
            <a href="/home" onClick={handleHome}>Home</a>
          </li>
          <li className="tabs">
            <a href="/Campaign" onClick={handleCampaign}>Campaign</a>
          </li>
          <li className="tabs">
            <a onClick={handleAddCampaign}>Add Campaign</a>
          </li>
          {/* <li className="tabs">
            <a href="/Login">Login</a>
          </li> */}
        

          <li className="tabs">
            <a href="/profile" onClick={handleProfile}><CgProfile className="pfp_logo"/></a>
          </li>
          {/* <li className="tabs">
            <a href="/" onClick={handleLogout}>LogOut</a>
          </li> */}
          

           
        </ul>
      </nav>
    // </div>
  );
};

export default Navbar;
