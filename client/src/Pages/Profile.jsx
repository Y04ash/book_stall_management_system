import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../css/profile.css";
import { ImCross } from "react-icons/im";
const Profile = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phoneNo: "",
    address: "",
    city: "",
    email: "",
    new_password: "", // Field for the new password
  });
  const [errors, setErrors] = useState({});
  const [reNewPass, setReNewPass] = useState(undefined)
  const [pfpUpdated,setPfpUpdated]= useState(false)
  const [err,setErr]=  useState(false)
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("http://localhost:5000/profile", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.status === "ok") {
          setFormData(result.data);
        } else {
          console.error("Unexpected response format:", result);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = { ...formData };
    if (!formData.new_password) {
      delete updatedData.new_password;
    }
     
    const response = await fetch("http://localhost:5000/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updatedData),
    });
    if(response.ok)
    {
    setPfpUpdated(true)
    setErr(false)
    }
    else{
    setErr(true)
    setPfpUpdated(false)
    }
     
  };

  // handle logout
  const handleLogout = async (event) => {
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
        setIsLogedIn(false);
      } else {
        console.error("Failed to log out:", response.statusText);
      }
    } catch (error) {
      console.error("Error in logging out:", error);
    }
  };
  const handleCorssClick=()=>{
    setErr(false)
    setPfpUpdated(false)
   
  }
 
  return (
    <>
      <Navbar />
      <section className="profile_section">
        {
          err && (
            <div className="error_pfp_div">
              <p>Something went wrong!</p>
              <ImCross className='sub_cross' onClick={handleCorssClick}/>
            </div>
          )
        }
        {
          pfpUpdated && (
            <div className="update_success">
              <p>Profile Updated Successfully</p>
              <ImCross className='sub_cross' onClick={handleCorssClick}/>
            </div>
          )
        }
        <h1>Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="names">
            <div>
              <label>First Name:</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
              {errors.first_name && <span>{errors.first_name}</span>}
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
              {errors.last_name && <span>{errors.last_name}</span>}
            </div>
          </div>

          <div className="cityNphone">
            <div>
              <label>City:</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
              {errors.city && <span>{errors.city}</span>}
            </div>
            <div>
              <label>Phone Number:</label>
              <input
                type="text"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
              />
              {errors.phone && <span>{errors.phone}</span>}
            </div>
          </div>

          <div>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && <span>{errors.address}</span>}
          </div>

          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span>{errors.email}</span>}
          </div>

          <div>
            <label>New Password:</label>
            <input
              type="password"
              name="new_password"
              placeholder="New Password"
              onChange={handleChange}
            />
            {errors.new_password && <span>{errors.new_password}</span>}
          </div>
       
          <div className="pfp_btn">
            <button type="submit" className="update_btn">Update</button>
            <a href="/" className="logout_a" onClick={handleLogout}>
              <button className="logout">Logout</button>
            </a>
          </div>
        </form>
      </section>
      <Footer />
    </>
  );
};

export default Profile;
