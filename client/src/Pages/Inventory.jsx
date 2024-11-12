import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import "../css/individualPostContainer.css";
import { useParams } from "react-router-dom";
import { ImCross } from "react-icons/im";

const Inventory = ({ orderColumns, inventory, newPurchase, setNewPurchase, purchase }) => {
  const [revenue, setRevenue] = useState(0);
  const [totalSale, setTotalSale] = useState(0);
  const [totalPurchase, setTotalPurchase] = useState(purchase);
  const { campaignId } = useParams();
  const parsedCampaignId = Number(campaignId);
const [confirmation,setConfirmation]= useState(false)
  useEffect(() => {
    const campaignPurchases = purchase.filter((p) => p.campaignId === parsedCampaignId);
    setTotalPurchase(campaignPurchases);

    // Calculate revenue and sales when totalPurchase updates
    const calculateRevenue = (totalPurchase) => {
      const rev = totalPurchase.reduce((acc, r) => acc + r.totalAmount, 0);
      setRevenue(rev);
    };

    const calculateSales = (totalPurchase) => {
      const sales = totalPurchase.reduce((acc, r) => {
        const bookSales = r.books.reduce((bookAcc, book) => bookAcc + book.order, 0);
        return acc + bookSales;
      }, 0);
      setTotalSale(sales);
    };

    calculateRevenue(campaignPurchases);
    calculateSales(campaignPurchases);
  }, [purchase, parsedCampaignId]);

  const inventoryColumns = [
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
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
    },
  ];

  const handleEndCampaign = ()=>{
    setConfirmation(true)
  }
  const handleCorssClick = ()=>{
    setConfirmation(false)
  }
  const handleUpdateData=async()=>{
    try {
      const response = await fetch(`http://localhost:5000/Campaign/${campaignId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({totalSale,revenue}),
        credentials: "include", // Include cookies for authentication
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // "Campaign updated successfully"


        window.location.href=`/Campaign/${campaignId}`
    } else {
        console.log("Failed to update campaign");
    }
      
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="inventory">
      <h1>Inventory for today</h1>
      {
        confirmation && (
          <div className="confirmation_div">
            <h1>End Campaign</h1>
            <button className="yes" onClick={handleUpdateData}>YES</button>
            <ImCross className="confirmation_cross" onClick={handleCorssClick}/>
          </div>
        )
      }
      <div className="total_revenue">
        <h3 className="revenue_title">
          Total Revenue: Rs.{" "}
          <span className="revenue" style={{ display: "inline", color: "black", fontSize: "1.2rem" }}>
            {revenue}
          </span>
        </h3>
      </div>
      <div className="total_sales">
        <h3 className="revenue_sales">
          Total Books Sold:{" "}
          <span className="revenue" style={{ display: "inline", color: "black", fontSize: "1.2rem" }}>
            {totalSale}
          </span>
        </h3>
      </div>
      <button className="end_camp" onClick={handleEndCampaign}>End Campaign</button>

      <div className="inventory_data_table_outer">
        <DataTable
          columns={inventoryColumns}
          data={inventory}
          fixedHeader
          pagination
        />
      </div>
    </div>
  );
};

export default Inventory;
