
import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import "../App.css"
function Register() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phoneNo: '',
    address: '',
    city: '',
    email: '',
    password: '',
    gender:'',
    state: ''
  });
  const [popup, setPopup] = useState(null); 
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
const BASE_URL = import.meta.env.VITE_BASE_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('Form data submitted:', formData);
    try{

      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
        if (response.ok) {
          setPopup({ type: "success", message: "✅ Member Added Successfully!" });
        } else {
          setPopup({ type: "error", message: "❌ Something went wrong!" });}
    }catch (error) {
      setPopup({ type: "error", message: "❌ Something went wrong!" });
    }

       setTimeout(() => setPopup(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600 mt-2">Join BookStockPro and start managing your campaigns</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {errors.first_name && <span className="text-red-500 text-sm">{errors.first_name}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {errors.last_name && <span className="text-red-500 text-sm">{errors.last_name}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {errors.city && <span className="text-red-500 text-sm">{errors.city}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {errors.phoneNo && <span className="text-red-500 text-sm">{errors.phoneNo}</span>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}
            </div>
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
  <input
    type="text"
    name="state"
    value={formData.state}
    onChange={handleChange}
    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    required
  />
  {errors.state && <span className="text-red-500 text-sm">{errors.state}</span>}
</div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
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

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Create Account
            </button>
          </form>
<AnimatePresence>
        {popup && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className={`fixed top-5 right-5 px-6 py-3 rounded-xl shadow-lg text-white font-medium z-50 ${
              popup.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {popup.message}
          </motion.div>
        )}
      </AnimatePresence>
          <div className="mt-6 text-center">
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              onClick={() => window.location.href = "/login"}
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
