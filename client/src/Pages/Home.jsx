import React, { useState,useEffect } from "react";
import "../css/home.css";
import { MdCampaign } from "react-icons/md";
import AddCampaignButton from "../Components/AddCampaignButton";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
const Home = () => {
  const [recentCamps, setRecentCamps] = useState([])
  const navigate = useNavigate();
  useState(()=>{
    const recent= async ()=>{
      try {
        const response = await fetch('http://localhost:5000/home', {method:'GET',credentials: "include", headers: { "Content-Type": "application/json" },})
      //   if (!response.ok) {
      //     throw new Error(`HTTP error! status: ${response.status}`);
      // }
      if(response.ok)
      {
        const result = await response.json();
        // Check if the status is "ok" before updating the state
        if (result.status === "ok") {
          setRecentCamps(result.data);
        } else {
          console.log("unexpected err occured")
        }
      }else{
        navigate('/unauth');
      }
      } catch (error) {
        console.log(error)
      }
    }
    // console.log("inside useeffect")
    recent()
  },[])
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
    <section className="home" id="home">
      <div className="home_title">
        <h1 className="home_title_h1">
          Welcome to <span className="bookstock">BookStockPro!</span> <br />{" "}
          Your bookstore, Your way! Managed perfectly!
        </h1>
      </div>
      {/* <div className="home_campaign_wrapper"> */}


      <h1 className="latest_campaign_title">Recent Campaigns</h1>

      {
        recentCamps.length==0 ? <h1 style={{color:"black"}}> No Campaigns yet</h1>:
      <div className="campaign_cover">
        {/* <Slider {...settings}> */}
        {
        recentCamps.map((camp) => {
          return (
            <Link to={`/Campaign/${camp.campaignId}`} key={camp.campaignId} className="latest_campaign">
            <div  className="latest_campaign_div">
            <h1>{camp.campaignName}</h1>
              <p>Id: {camp.campaignId}</p>
              <p>Location: {camp.location}</p>
              <p>Date: {formatDate(camp.startDate)}</p>

              <button className="repo_btn">Read More</button>
            </div>
            </Link>
          );
        })}
        {/* </Slider> */}
      </div>
      }
      {/* </div> */}

      <div className="add_campaign_wrapper">
        <h1 className="add_campaign_title">Start your new campaign now</h1>
        <p className="add_campaign_para">Want to start your latest idea? Start building a campaign tailored to your goals. Click the 'Add Campaign' button to get started.</p>

        <AddCampaignButton />
      </div>
    </section>
    <Footer/>
    </>
  );
};

export default Home;
