
// CUSTOMERS (modern styled)
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import { Clock } from "lucide-react";
import { Trash } from 'lucide-react';
import { ImCross, ImBin } from "react-icons/im";
import "../App.css";
const Customers = () => {
  const { campaignId } = useParams();
  const [newCustomer, setNewCustomer] = useState([]);
  const parsedCampaignId = Number(campaignId);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [inventory, setInventory] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [purchase, setPurchase] = useState([]);

  const [campaign, setCampaign] = useState({});
  const [hasCampEnded, setHasCampEnded] = useState(false);

  // function to fetch data of camp
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
      } catch (err) {
        // console.log(err);
      }
    };

  // useEffect(() => {
  //   if (Array.isArray(purchase)) {
  //     const campaignPurchases = purchase

  //     // Only update if actually different
  //     if (JSON.stringify(campaignPurchases) !== JSON.stringify(purchase)) {
  //       setPurchase(campaignPurchases);
  //     }
  //   } else {
  //     if (purchase?.length) {
  //       setPurchase([]);
  //     }
  //   }
  // }, [purchase]);  // ✅ include newPurchase
  // fetch camp data
  useEffect(() => {

    fetchCampaign();
  }, [campaignId]);

  useEffect(() => {
    if (Array.isArray(customer) && Array.isArray(purchase)) {
      const customersForCampaign = customer.filter((cust) =>
        purchase.some((p) => p.customerId === cust.customerId)
      );

      if (
        JSON.stringify(customersForCampaign) !== JSON.stringify(newCustomer)
      ) {
        setNewCustomer(customersForCampaign);
      }
    } else {
      if (newCustomer?.length) {
        setNewCustomer([]);
      }
    }
  }, [customer, purchase]); // ✅ include newCustomer
  // Only run when customer or newPurchase changes

  // delte purchase
const handleDeletePurchase = async (purchaseId) => {
  try {
    const response = await fetch(`${BASE_URL}/purchase/${purchaseId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (response.ok) {
      // Optionally refresh purchases or update state here
          fetchCampaign();
    }
  } catch (err) {
    console.error("Failed to delete purchase:", err);
  }
};

  const calculateTotal = (purchase, customerId) => {
    return purchase
      .filter((p) => p.customerId === customerId)
      .reduce((sum, r) => sum + r.totalAmount, 0);
  };

  const getCustomerPurchaseData = (customerId) => {
    return purchase
      .filter((p) => p.customerId === customerId)
      .flatMap((purchase) =>
        (purchase.books || []).map((book) => ({
          bookId: book.bookId,
          title: book.title,
          order: book.order,
          price: book.price,
          totalAmount: book.price * book.order,
        }))
      );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Customer Details
        </h2>

        {newCustomer.length === 0 ? (
          <h2 className="text-gray-500">No customer records yet</h2>
        ) : (
          newCustomer.map((cust) => (
            <div
              key={cust.customerId}
              className="border border-gray-200 rounded-lg p-6 mb-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Customer ID: {cust.customerId}
                  </h3>
                  <p className="text-gray-600">{cust.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    ₹
                    {calculateTotal(purchase, cust.customerId).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Total Amount</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{cust.address}</span>
                </div>
                <div className="flex items-center space-x-2 jjustify-self-start lg:justify-self-end ">
                  <Phone className="w-4 h-4" />
                  <span>{cust.phoneNumber}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{cust.email}</span>
                </div>
                <div className="flex items-center space-x-2 jjustify-self-start lg:justify-self-end">
                  <Clock className="w-4 h-4" />
                  <span>
                    {cust.updatedAt
                      ? new Date(cust.updatedAt).toLocaleDateString("en-GB")
                      : ""}
                  </span>
                </div>
              </div>

              {/* Purchase History */}

              {/*  */}
              <div className="bg-gray-50 rounded-lg p-4">
  {/* <h4 className="font-medium text-gray-900 mb-3">
    Purchase History
  </h4> */}
  {purchase
    .filter((p) => p.customerId === cust.customerId)
    .map((p) => (
      <div key={p.purchaseId} className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold jjustify-self-start ">Purchase #{p.purchaseId}</span>

            {/* <Trash
  className="w-5 h-5 inline-block mr-1 text-red-600 cursor-pointer transition-transform duration-150 hover:scale-125 hover:font-bold"
  onClick={() => handleDeletePurchase(p.purchaseId)}
/> */}
 <ImBin className="w-4 h-4 text-red-600  hover:scale-125 hover:font-bold" onClick={() => handleDeletePurchase(p.purchaseId)}/>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm mb-2">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left m-2">Book Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {p.products.map((pro, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className=" py-2 text-gray-900">{pro.name}</td>
                  <td className="py-2 text-gray-600 text-center">{pro.order}</td>
                  <td className="py-2 text-gray-600 text-center">₹{pro.price}</td>
                  <td className="py-2 text-gray-900 font-medium text-center">
                    ₹{pro.price * pro.order}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ))}
</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Customers;
