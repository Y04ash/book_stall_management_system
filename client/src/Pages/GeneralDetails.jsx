import React from 'react'
import '../css/Form.css'
import { useState } from 'react';
const GeneralDetails = ({formData,setFormData,isBooksForm,setIsBooksForm,}) => {



      // Handler for text, date, and time changes
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    console.log(event.target);
    setFormData({
      ...formData,
      [name]: value, // Update the corresponding state field
    });

    console.log(name, value); // Log the name and value of the field
  };

  
  const onSubmitHandler = (event) => {
    event.preventDefault(); // Prevent page reload on form submission
    setIsBooksForm(true)
    console.log("Form submitted with data:", formData);
  };
  return (
    <div className="general_details">

 
    <div className="form_heading">
      <h1>
        Campaign Details
        </h1>
    </div>

      
      <div className="input_field">
        <h1 className="heading">Campaign Title<span style={{color:"red", fontFamily: "sans-serif",display:"inline"}}>*</span> </h1>
        <input
          className="form-control"
          onChange={onChangeHandler}
          name="campaignName"
          value={formData.campaignTitle}
          placeholder="Campaign Title"
        />
 </div>
      <div className="input_field">
        <h1 className="heading">CDate<span style={{color:"red", fontFamily: "sans-serif",display:"inline"}}>*</span> </h1>
        <input
          className="form-control"
          type="date"
          onChange={onChangeHandler}
          name="startDate"
          value={formData.startDate}
        />
      </div>
    
     
    
    


      <div className="input_field">
        <h1 className="heading">Seller's Name<span style={{color:"red", fontFamily: "sans-serif",display:"inline"}}>*</span></h1>
        <input
          className="form-control"
          onChange={onChangeHandler}
          name="sellerName"
          value={formData.sellerName}
          placeholder="Seller's Name"
        />

      </div>
 
      

      

      

      <div className="input_field">
        <h1 className="heading">Address<span style={{color:"red", fontFamily: "sans-serif",display:"inline"}}>*</span></h1>
        <textarea
          rows={4}
          type="text-area"
          className="form-control"
          onChange={onChangeHandler}
          name="location"
          value={formData.location}
          placeholder="Address"
        />
      </div>
      <div className="input_field">

      <button className="submit-btn" onClick={onSubmitHandler}>
        Next
      </button>
      </div>
     
  

      <br />
      </div>
  )
}

export default GeneralDetails