import React, { useState,useEffect } from "react";
import "../css/Form.css"; // Ensure the CSS file is imported
import GeneralDetails from "./GeneralDetails";
import BooksForm from "./BooksForm";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../App.css"
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
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  useEffect(()=>{
    const fetchWarehouseData= async ()=>{
      try {
        // console.log("inside fetch data in react booksform")
        const response = await fetch(`${BASE_URL}/Add-campaign`, {method: "GET",
          credentials: "include", // Include credentials (cookies) in the request
          headers: {
            "Content-Type": "application/json",
          }}

        )
        
      const result = await response.json();
      // console.log("Result:", result);
      
      // Check if the status is "ok" before updating the state
      if (result.status == 'ok') {
        // console.log("result data",result.data)
          setData(result.data);
      } else {
        
          // console.error('Unexpected response format:', result);
      }
      } catch (error) {
        // console.log(error)
      }
    }
    // console.log("inside useeffect")
    fetchWarehouseData()
  },[])

  

  return (
    <>
    <Navbar />

    <div className="form-container">
      <GeneralDetails formData={formData} setFormData={setFormData} isBooksForm={isBooksForm} setIsBooksForm={setIsBooksForm} /> 
      <BooksForm formData={formData} setFormData={setFormData} isBooksForm={isBooksForm} setIsBooksForm={setIsBooksForm} data={data} setData={setData} /> 
      
    </div>
    <Footer/>
    </>
  );
}

export default Form;
