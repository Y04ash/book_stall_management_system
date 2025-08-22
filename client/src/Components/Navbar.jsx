import React, { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaHome, FaCalendarAlt, FaPlus, FaBars, FaTimes } from "react-icons/fa"; 
import "../App.css";
import { TbBuildingWarehouse } from "react-icons/tb";
import maleImg from "../../images/male-removebg-preview1.png";
import femaleImg from "../../images/female-removebg-preview1.png";
import { BoltIcon } from "@heroicons/react/24/outline";
import { Navigate } from "react-router-dom";
const Navbar = () => {
  const [gender, setGender] = useState("");
  const [isOpen, setIsOpen] = useState(false); // state for mobile menu
const BASE_URL = import.meta.env.VITE_BASE_URL;
const navigate = Navigate();
  const handleAddCampaign = async (event) => {
    event.preventDefault();
    const response = await fetch(`${BASE_URL}/Add-campaign`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (response.ok) navigate("/Add-campaign");
  };
const handleInventory = async (event) => {
  event.preventDefault();
  const response = await fetch(`${BASE_URL}/getWarehouse`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (response.ok) navigate("/createWarehouse");
}
  const handleHome = async (event) => {
    event.preventDefault();
    const response = await fetch(`${BASE_URL}/home`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (response.ok) navigate("/home");
  };

  const handleCampaign = async (event) => {
    event.preventDefault();
    const response = await fetch(`${BASE_URL}/Campaign`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (response.ok) navigate("/Campaign");
  };

  const handleProfile = async (event) => {
    event.preventDefault();
    const response = await fetch(`${BASE_URL}/profile`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (response.ok) navigate("/profile");
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`${BASE_URL}/profile`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const result = await res.json();
        if (result.status === "ok") setGender(result.data.gender);
      }
    };
    fetchUser();
  }, []);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <BoltIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">
              SellSphere
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={handleHome}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
            >
              <FaHome className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={handleCampaign}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
            >
              <FaCalendarAlt className="w-4 h-4" />
              <span>Campaigns</span>
            </button>

            <button
              onClick={handleAddCampaign}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
            >
              <FaPlus className="w-4 h-4" />
              <span>Add Campaign</span>
            </button>
            <button
              onClick={handleInventory}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
            >
             
               <TbBuildingWarehouse className="w-4 h-4 "/>
              <span>Inventory</span>
            </button>
          </div>

          {/* Profile + Hamburger */}
          <div className="flex items-center space-x-4">
            <img
              onClick={handleProfile}
              src={
                gender === "Male"
                  ? maleImg
                  : gender === "Female"
                  ? femaleImg
                  : "https://via.placeholder.com/120"
              }
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
            />

            {/* Hamburger button (Mobile only) */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <button
            onClick={handleHome}
            className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-100"
          >
            <FaHome className="w-4 h-4 mr-2" /> Home
          </button>
          <button
            onClick={handleCampaign}
            className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-100"
          >
            <FaCalendarAlt className="w-4 h-4 mr-2" /> Campaigns
          </button>
          <button
            onClick={handleAddCampaign}
            className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-100"
          >
            <FaPlus className="w-4 h-4 mr-2" /> Add Campaign
          </button>
          <button
            onClick={handleInventory}
            className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-100"
          >
            <TbBuildingWarehouse className="w-4 h-4 mr-2"/>
             Inventory
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
