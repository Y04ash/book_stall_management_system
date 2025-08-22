
import React, { useState, useEffect } from "react";
import { Package, Users, ShoppingCart,TrendingUp } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Inventory from "./Inventory";
import Customers from "./Customers";
import OrderDetails from "./OrderDetails";
import Analytics from "./Analytics";
import { useParams } from "react-router-dom";
import "../App.css"
const ModernIndividualCampaign = () => {
  const { campaignId } = useParams();
  const [activeTab, setActiveTab] = useState("inventory");
  const [inventory, setInventory] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [purchase, setPurchase] = useState([]);
  const [campaign, setCampaign] = useState({});
  const [hasCampEnded, setHasCampEnded] = useState(false);
  const [error, setError] = useState("");
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  // Fetch data from backend
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`${BASE_URL}/campaign/${campaignId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (response!='ok') throw new Error("Campaign not found");

        const result = await response.json();
        setCustomer(result.data.customer);
        setPurchase(result.data.purchase);
        setCampaign(result.data.campaign);
        setHasCampEnded(result.data.campaign.camp_ended);
        const initInventory = result.data.campaign.products.map((row) => ({
          ...row,
          order: 0,
          total: 0,
        }));
        setInventory(initInventory);
        // console.log("init ", result.data.campaign);
      } catch (err) {
        // console.log(err);
      }
    };

    fetchCampaign();
  }, [campaignId]);

  const tabs = [
    { key: "inventory", label: "Inventory", icon: Package },
    { key: "customers", label: "Customers", icon: Users },
    { key: "analytics", label: "Analytics", icon: TrendingUp },
    // Only add orders tab if campaign not ended
    ...(!campaign.camp_ended ? [{ key: "orders", label: "Order Details", icon: ShoppingCart }] : []),
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="flex space-x-1 p-1">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === key
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "inventory" && (
            <Inventory inventory={inventory} setInventory={setInventory} error={error} setError={setError} hasCampEnded={hasCampEnded}setHasCampEnded={setHasCampEnded} purchase={purchase} />
          )}
          {activeTab === "customers" && (
            <Customers inventory={inventory} customer={customer} purchase={purchase} setPurchase={setPurchase} />
          )}
          {activeTab === "orders" && (
            <OrderDetails inventory={inventory} setInventory={setInventory} customer={customer} purchase={purchase} error={error} setError={setError} />
          )}

          {activeTab === "analytics" &&(
            <Analytics campaignId={campaignId} inventory={inventory} customer={customer} purchase={purchase} />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ModernIndividualCampaign;
