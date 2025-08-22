
// INVENTORY (modern styled)
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ImCross } from "react-icons/im";
import { IndianRupee , TrendingUp } from "lucide-react";
import "../App.css"
import { useNavigate } from "react-router-dom";
const Inventory = () => {
  const [revenue, setRevenue] = useState(0);
  const [totalSale, setTotalSale] = useState(0);
  const[confirmation,setConfirmation]= useState(false)
  const { campaignId } = useParams();
  const parsedCampaignId = Number(campaignId);
  // const [campaignPurchase, setCampaignPurchase] = useState([]);
  // fetching camp details
const navigate = useNavigate()
    const [inventory, setInventory] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [purchase, setPurchase] = useState([]);
    const [campaign, setCampaign] = useState({});
    const [hasCampEnded, setHasCampEnded] = useState(false);
 const BASE_URL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
      const fetchCampaign = async () => {
        try {
          const response = await fetch(`${BASE_URL}/campaign/${campaignId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          if (!response.ok) throw new Error("Campaign not found");
  
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
          // console.log("curr inv",inventory)
        //   if (Array.isArray(purchase)) {
        //     // const campaignPurchases = purchase;
        //     const rev = purchase.reduce((acc, r) => acc + r.totalAmount, 0);
        //     const sales = purchase.reduce(
        //       (acc, r) => acc + r.books.reduce((bookAcc, b) => bookAcc + b.order, 0),
        //       0
        //   );
        //   setRevenue(rev);
        //   setTotalSale(sales);
        // } else {
        //   setRevenue(0);
        //   setTotalSale(0);
        // }
        } catch (err) {
          // console.log(err);
        }
      };
  
      fetchCampaign();
    }, [campaignId]);
  
 useEffect(() => {
  if (Array.isArray(purchase)) {
    const campaignPurchases = purchase
    const rev = campaignPurchases.reduce((acc, r) => acc + r.totalAmount, 0);
    const sales = campaignPurchases.reduce(
      (acc, r) => acc + r.products.reduce((bookAcc, b) => bookAcc + b.order, 0),
      0
    );
    setRevenue(rev);
    setTotalSale(sales);
  } else {
    setRevenue(0);
    setTotalSale(0);
  }
}, [purchase, parsedCampaignId]);
 
const handleUpdateData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/Campaign/${campaignId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalSale, revenue }),
        credentials: "include",
      });
      if (response.ok) {
        navigate(`/Campaign/${campaignId}`);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <IndianRupee  className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">₹{revenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Books Sold</p>
            <p className="text-2xl font-bold text-gray-900">{totalSale}</p>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Current Inventory</h2>
          {
            !hasCampEnded && (

          <button
            onClick={() => setConfirmation(true)}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium"
          >
            End Campaign
          </button>
            )
          }
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Title</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Stock</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Price</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((pro) => (
                <tr
                  key={pro.productId}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="py-3 px-4 text-gray-900">{pro.productId}</td>
                  <td className="py-3 px-4 text-gray-900 font-medium">{pro.name}</td>
                  <td className="py-3 px-4 text-gray-600">{pro.quantity}</td>
                  <td className="py-3 px-4 text-gray-600">₹{pro.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">End Campaign</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to end this campaign? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setConfirmation(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateData}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                End Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
