// search filter in camapign page

import React, { useState,useEffect } from "react";
import "../css/campaign.css";
import { Link } from 'react-router-dom';
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
const Campaign = () => {
  const [campaignList,setCampaignList] = useState([])
 
  useEffect(()=>{
    const fetchWarehouseData= async ()=>{
      try {
        console.log("inside fetch data in react campaign")
        const response = await fetch('http://localhost:5000/Campaign', {method:'GET',
          headers: { "Content-Type": "application/json" },
      credentials: "include", // Include cookies for authentication
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Result:", result);

      // Check if the status is "ok" before updating the state
      if (result.status === "ok") {
          setCampaignList(result.data);
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


  // format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}


  return (
    <>
    <Navbar />

    <div className="campaign_section">
      <h2 className="campaign_title">Campaign History</h2>
      <div className="search_section">
        <form action="" className="search_form">
          {/* <input type="text" placeholder="Search..." className="search_bar" /> */}
        </form>
      </div>
      <div className="campaign_history_outer">

      {
        campaignList.length == 0 ? <h1>No Campaigns yet</h1> :(

      <div className="campaign_history">
        {campaignList.map((camp) => {
          return (
            <Link to={`/Campaign/${camp.campaignId}`} key={camp.campaignId} className={ camp.camp_ended? 'camp_post ended' : 'camp_post active'}>
            <div  className='camp_title'>
              <div className="camp_title">
                <h3>{camp.campaignName}</h3>
              </div>
              <div className="camp_body">
                <ul> 
                  <li className="occasion">Camp ID:{camp.campaignId}</li>
                  <li className="address">Address: {camp.location}</li>
                  <li className="camp_date">Date: {formatDate(camp.startDate)}</li>
                </ul>
              <button className="read_more"  >
                <p >Read More</p>
              </button>
              </div>
            </div>
            </Link>
          );
        })}


      </div>
        )
      }
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Campaign;
