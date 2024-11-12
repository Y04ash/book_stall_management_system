//TOTAL SALES AND TOTAL REVENUE IS NOT GETTING UPDATED IN DB AS THERE IS NO SUCH FUNC YET BUT IT CAN BE SEEN IN UI AS IT CALCULATED AND SHOWN
import React,{useState,useEffect} from "react";
import "../css/individualPostContainer.css";
import { useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
const Customers = ({ orderColumns, inventory, sales,customer,purchase,newPurchase,setNewPurchase }) => {
  const { campaignId } = useParams();
  const [newCustomer, setNewCustomer] = useState([])
  
  const parsedCampaignId = Number(campaignId);
  useEffect(() => {
    const campaignPurchases = purchase.filter((p) =>  p.campaignId === parsedCampaignId );
    setNewPurchase(campaignPurchases)
    
  }, [campaignId, purchase]);
  useEffect(()=>{
    console.log(`purcahse is ${campaignId} is `,newPurchase)
  },[newPurchase])
  
  useEffect(()=>{
    const customersForCampaign = customer.filter((cust) => {
      // Filter for all purchases by the current customer within the campaign
      const customerPurchases = newPurchase.filter((p) => p.customerId === cust.customerId);
      
      // Check if there is at least one purchase matching this customer
      return customerPurchases.length > 0;
    });
    setNewCustomer(customersForCampaign)
    // console.log(`customer list from ${campaignId}`, newCustomer)
  },[newPurchase,campaignId,customer])


  
  const custHistoryColumns = [
    {
      name: "ID",
      selector:  (row) => row.bookId,
      sortable: true,
    },
    {
      name: "Title",
      selector:  (row) => row.title,
      sortable: true,
    },
    {
      name: "Quantity",
      selector:  (row) => row.order,
      sortable: true,
    },

    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: "Total",
    selector: (row) => row.totalAmount,
    sortable: true,
    },
  ];

  const calculateTotal = (newPurchase, customerId)=>{
    const customerTotalPurchase = newPurchase.filter((p)=>p.customerId == customerId)
    console.log("customerTotalPurchase",customerTotalPurchase)
    let grandTotal = 0;
    const temp = customerTotalPurchase.map((r)=> grandTotal += r.totalAmount)
     return grandTotal
  }


// Define `flattenedPurchaseData` specifically for a particular `customerId`
const getCustomerPurchaseData = (customerId) => {
  return newPurchase
    .filter(purchase => purchase.customerId === customerId) // Only include purchases for this customer
    .flatMap(purchase => 
      (purchase.books || []).map(book => ({ // Ensure books is an array, even if empty
        customerId: purchase.customerId,
        campaignId: purchase.campaignId,
        bookId: book.bookId,
        title: book.title,
        order: book.order,
        price: book.price,
        totalAmount: book.price * book.order
      }))
    );
};
  

  
  return (
    <div className="customers_container">
      <h1>Customer Details</h1>

      {
        newCustomer.length===0 
        ? <h2>No customer Records yet</h2>
        : <div className="customer_details_outer">
       
        {newCustomer.map((cust) => {
          return (
            <div className="customer_order" key ={cust.customerId}>
              <div className="history_cust_general">
                <div className="history_cust_heading">
                  <h3 className="sales_id">Customer Id: {cust.customerId}</h3>
                  
                  <h3>Name: {cust.name}</h3>
                </div>
                <p className="history_cust_add">Address: {cust.address} </p>
                <div className="cust_other_details">
                  <p className="history_cust_phone">Phone Number: {cust.phoneNumber}</p>
                  <p className="history_cust_mail">Mail: {cust.email}</p>
                  <p className="history_cust_total">Total Amount: {calculateTotal(newPurchase, cust.customerId)}</p>
                </div>
              </div>
              <div className="cust_books_details">
              <DataTable
                columns={custHistoryColumns}
                data={getCustomerPurchaseData(cust.customerId)}
                pagination
              />

              </div>
            </div>
          );
        })}
      </div>
      }
      
    </div>
  );
};

export default Customers;
