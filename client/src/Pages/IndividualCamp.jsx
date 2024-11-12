import React, { useEffect, useState } from "react";

import Inventory from "./Inventory";
import Customers from "./Customers";
import OrderDetails from "./OrderDetails";
import "../css/individualPostContainer.css";
import { useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Campaign from "./Campaign";
const IndividuaPost = () => {


  const [individualPage, setIndividualPage] = useState("inventory");
  const [sales, setSales] = useState([]);
  const [inventory, setInventory] = useState([]);
 const [customerOrder, setCustomerOrder] = useState([]); // Only selected rows with input
  const [grandTotal, setGrandTotal] = useState(0);
  const [salesId, setSalesId] = useState(1);
  const [error, setError] = useState("");
  const [campEnded,setCampEnded]=useState(false)
  const { campaignId } = useParams();
  const [newPurchase,setNewPurchase] = useState([])
  const [customer,setCustomer]=useState([])
  const [purchase,setPurchase]=useState([])
  const [campaign,setCampaign]=useState({})

  useEffect(() => {
    console.log("in after de ", inventory);
  }, [inventory]);
  useEffect(() => {
    // setting the total
    setGrandTotal(inventory.reduce((sum, obj) => sum + obj.total, 0));
  }, [inventory]);

  // useEffect(()=>{
  //   console.log("customer data ",customerOrder)
  // },[customerOrder])

  useEffect(() => {
    const fetchCampaign = async () => {
      
      try {
          const response = await fetch(`http://localhost:5000/Campaign/${campaignId}`, {method:'GET',
            headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies for authentication
          });
          if (!response.ok) {
              throw new Error('Campaign not found');
          }
          const result = await response.json();
          console.log(result.data.campaign.books)

          setCustomer(result.data.customer)
          setPurchase(result.data.purchase)
          setCampaign(result.data.campaign)
          const inititalIventory =result.data.campaign.books.map((row)=>{
            return {
              ...row, order:0, total:0
            }
          })
          setInventory(inititalIventory)

      } catch (err) {
          console.log(err)
      } 
    };

    fetchCampaign();
}, [campaignId]);

  // Handle input change
  const handleInputChange = (event, rowId) => {
    const value = Number(event.target.value);
  
    // Check if input quantity exceeds available stock
    
    if (inventory.find((x) => x.bookId == rowId)?.quantity >= value) {
      setError(""); // Clear error if within stock limits
 
      const inventoryWithInput = inventory.map((r)=>r.bookId == rowId ? {...r,order: value, total : r.price * value  } : r)

      setInventory(inventoryWithInput)

    } else {
      setError("Order exceeds stock");
    }
  };
  

  const orderColumns = [
    {
      name: "ID",
      selector: (row) => row.bookId,
      sortable: true,
    },
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Stock",
      selector: (row) => row.quantity,
      sortable: true,
    },
    {
      name: "Quantity",
      cell: (row) =>(
        <input
            type="text"
            // value={row.quantity || ""}
            onChange={(event) => handleInputChange(event, row.bookId)}
            placeholder="Enter quantity"
          />
        
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: "Total",
      selector: (row) => row.total,
      sortable: true,
    },
  ];
  
  const handleInventory = () => {
    setIndividualPage("inventory");
  };
  const handleCustomers = () => {
    setIndividualPage("customers");
  };
  const handleOrder = () => {
    setIndividualPage("orderDetails");
  };
  return (
    <>
    <Navbar />

    <div className="individual_post_container">
      <div className="individual_btn">
       
        <button className="camp_btn inventory" onClick={handleInventory}>
          Inventory
        </button>
        <button className="camp_btn customer_list" onClick={handleCustomers}>
          Customers
        </button>
        { !(campaign.camp_ended) &&( <button className="camp_btn order_details" onClick={handleOrder}>
          Order Details
        </button> )}
        
      </div>

      {individualPage == "inventory" && (
        <Inventory
          orderColumns={orderColumns}
          inventory={inventory}
          sales={sales}
          setSales={setSales}
          newPurchase={newPurchase}
          purchase={purchase}
          setNewPurchase={setNewPurchase}
        />
      )}
      {individualPage == "customers" && (
        <Customers
          orderColumns={orderColumns}
          inventory={inventory}
          sales={sales}
          setSales={setSales}
          grandTotal={grandTotal}
          purchase={purchase}
          customer={customer}
          newPurchase={newPurchase}
          setNewPurchase={setNewPurchase}
        />
      )}

      
      {individualPage == "orderDetails" &&(
        <OrderDetails
          orderColumns={orderColumns}
          inventory={inventory}
          setInventory={setInventory}
          sales={sales}
          setSales={setSales}
          // handleRowSelected={handleRowSelected}
          customerOrder={customerOrder}
          setCustomerOrder={setCustomerOrder}
          grandTotal={grandTotal}
          salesId={salesId}
          setSalesId={setSalesId}
          error={error}
          setError={setError}
          customer={customer}
          setCustomer={setCustomer}
          purchase={purchase}
          setPurchase={setPurchase}
        />
      )}
    </div>
    <Footer />
    </>
  );
};

export default IndividuaPost;
