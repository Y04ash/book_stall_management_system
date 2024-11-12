import React, { useState,useEffect } from "react";
import "../css/Form.css"; // Ensure the CSS file is imported
import GeneralDetails from "./GeneralDetails";
import BooksForm from "./BooksForm";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
function Form() {
  const [data,setData]=useState()
  // State for all input fields
  const [isBooksForm, setIsBooksForm]=useState(false)

  const [formData, setFormData] = useState({
    campaignName:"",
    sellerName: "",
    location: "", 
    startDate:"", 
  });
  useEffect(()=>{
    const fetchWarehouseData= async ()=>{
      try {
        console.log("inside fetch data in react booksform")
        const response = await fetch('http://localhost:5000/Add-campaign', {method: "GET",
          credentials: "include", // Include credentials (cookies) in the request
          headers: {
            "Content-Type": "application/json",
          }}

        )
        

      const result = await response.json();
      console.log("Result:", result);
      

      // Check if the status is "ok" before updating the state
      if (result.status == 'ok') {
        
          setData(result.data);
      } else {
        
          console.error('Unexpected response format:', result);
      }
      } catch (error) {
        console.log(error)
      }
    }
    console.log("inside useeffect")
    fetchWarehouseData()
  },[])

  

  return (
    <>
    <Navbar />

    <div className="form-container">
      {
        isBooksForm ? 
        <BooksForm formData={formData} setFormData={setFormData} isBooksForm={isBooksForm} setIsBooksForm={setIsBooksForm} data={data} setData={setData} /> 
        : <GeneralDetails formData={formData} setFormData={setFormData} isBooksForm={isBooksForm} setIsBooksForm={setIsBooksForm} /> 
      }
      
    </div>
    <Footer/>
    </>
  );
}

export default Form;
