
// export default Profile;
import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { ImCross } from "react-icons/im";
import { Check, User, Phone, Mail, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // animation
import "../App.css";
import maleImg from "../../images/male-removebg-preview1.png";
import femaleImg from "../../images/female-removebg-preview1.png";
const Profile = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phoneNo: "",
    address: "",
    city: "",
    email: "",
    new_password: "",
    gender: "",
  });

  const [pfpUpdated, setPfpUpdated] = useState(false);
  const [err, setErr] = useState(false);
const BASE_URL = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/profile`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        if (result.status === "ok") {
          setFormData(result.data);
        }
      } catch (error) {
        console.error(error);
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
    if (!formData.new_password) delete updatedData.new_password;

    const response = await fetch(`${BASE_URL}/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      setPfpUpdated(true);
      setErr(false);
      setTimeout(() => setPfpUpdated(false), 3000);
    } else {
      setErr(true);
      setPfpUpdated(false);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error in logging out:", error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
        <div className="w-full max-w-6xl mx-auto px-6">
          {/* Error Alert */}
          {err && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between shadow-sm">
              <span>Something went wrong!</span>
              <ImCross className="cursor-pointer" onClick={() => setErr(false)} />
            </div>
          )}

          {/* Success Pop with animation */}
          <AnimatePresence>
            {pfpUpdated && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
                className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50"
              >
                <div className="bg-gradient-to-r from-green-100 via-white to-blue-100 border border-green-200 text-green-800 px-6 py-4 rounded-xl shadow-lg flex items-center space-x-2">
                  <Check className="w-6 h-6 text-green-600" />
                  <span className="font-medium">Profile updated successfully!</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Profile Header */}
          <div
            className="rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6 mb-8"
            style={{
              background:
                "radial-gradient(circle at 18.7% 37.8%, rgb(250, 250, 250) 0%, rgb(225, 234, 238) 90%)",
            }}
          >
            {/* Profile Image */}
            <div className="flex-shrink-0">
  <img
    src={
      formData.gender === "Male"
        ? maleImg
        : formData.gender === "Female"
        ? femaleImg
        : "https://via.placeholder.com/120"

    }
    alt="Profile"
    className="w-28 h-28 rounded-full object-cover object-center border-4 shadow-md"
  />
</div>

            {/* Profile Info */}
            <div className="flex flex-col space-y-2">
              <h2 className="text-3xl font-bold text-blue-800">
                {formData.first_name} {formData.last_name}
              </h2>
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-blue-600" />{" "}
                {formData.phoneNo || "Not provided"}
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-green-600" />{" "}
                {formData.city || "Not provided"}
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-red-600" />{" "}
                {formData.email || "Not provided"}
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* City & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <div className="flex items-center gap-6">
                  {["Male", "Female", "Other"].map((g) => (
                    <label key={g} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={handleChange}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="new_password"
                  placeholder="Enter new password"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Update Profile
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 bg-red-50 text-red-600 py-3 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium"
                >
                  Logout
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
