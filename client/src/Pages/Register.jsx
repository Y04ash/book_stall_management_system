import React, { useState } from 'react';
import '../css/Register.css'
function Register() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name:'',
    phoneNo: '',
    address:'',
    city:'',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  
  // Basic form validation
  //   const validate = () => {
    //     const newErrors = {};
    //     if (!formData.name) newErrors.name = 'Name is required';
    //     if (!formData.phone || !/^\d{10}$/.test(formData.phoneNo)) newErrors.phoneNo = 'Valid 10-digit phone number is required';
    //     if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    //     if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    //   };
    
    // Handle form field changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };
  // Handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault();
   
      console.log('Form data submitted:', formData);
      // Submit data to backend here
        
      const response = await fetch(`http://localhost:5000/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    });
    
  };

  return (
    <div className='register_div'>
      <div className="registration_form">

      <h2>Register</h2>
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
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span>{errors.password}</span>}
        </div>

        <button type="submit">Register</button>
      </form>
      </div>
    </div>
  );
}

export default Register;
