
// export default Campaign;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Calendar, MapPin, Eye } from "lucide-react";
import "../App.css"
const Campaign = () => {
  const [campaignList, setCampaignList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
const BASE_URL = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(`${BASE_URL}/Campaign`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        if (result.status === "ok") {
          setCampaignList(result.data);
        } else {
          console.error("Unexpected response format:", result);
        }
      } catch (error) {
        // console.log(error);
      }
    };

    fetchCampaigns();
  }, []);

  // format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // dd/mm/yyyy
  }

  // filter campaigns
  const filteredCampaigns = campaignList.filter((camp) =>
    camp.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    camp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(camp.campaignId).includes(searchTerm)
  );

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Campaign History</h1>
            <p className="text-gray-600">Manage and view all your campaigns</p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name, location, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Campaigns */}
          {filteredCampaigns.length === 0 ? (
            <div className="text-center text-gray-500 text-lg">No campaigns yet</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((camp) => (
                <Link
                  to={`/Campaign/${camp.campaignId}`}
                  key={camp.campaignId}
                  className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 cursor-pointer ${
                    camp.camp_ended ? "opacity-75" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {camp.campaignName}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        camp.camp_ended
                          ? "bg-gray-100 text-gray-600"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {camp.camp_ended ? "Ended" : "Active"}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>ID: {camp.campaignId}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{camp.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(camp.startDate)}</span>
                    </div>
                  </div>

                  <button className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200 font-medium flex items-center justify-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Campaign;
