// TODO:
// form validations to be done
// form is gettig submitted after hitting enter
// cash or upi option remaining

import React, { useEffect, useRef,useState } from "react";
import "../css/individualPostContainer.css";
import DataTable from "react-data-table-component";
import { useParams } from "react-router-dom";
import { ImCross } from "react-icons/im";
const OrderDetails = ({
  orderColumns,
  inventory,
  setCustomerOrder,
  sales,
  setSales,
  grandTotal,
  error,
}) => {
  const nameRef = useRef("");
  const addRef = useRef("");
  const mailRef = useRef("");
  const phoneRef = useRef(0);
  const { campaignId } = useParams();
  const [toRefresh,setToRefresh] = useState(false)
  const [errInSubmission,setErrInSubmission] = useState(false)


  const  handleSubmitOrder = async(event) => {
    event.preventDefault();

    const temp =inventory.filter((row)=> row.order>0)
    
    // final customer data with books , customer, total details
    const finalCustomerOrder = {
      name: nameRef.current.value,
      phone: phoneRef.current.value,
      custAdd: addRef.current.value,
      mail: mailRef.current.value,
      books: temp,
      totalAmount: grandTotal,
    };

    const isAnyAttributeNull = Object.values(finalCustomerOrder).some(value => value === null || value === undefined || value === '');

    console.log("final customer order",finalCustomerOrder)

    if(!isAnyAttributeNull)
    {
      // sending data to server
      const response = await fetch(`http://localhost:5000/Campaign/${campaignId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalCustomerOrder),
        credentials: "include", // Include cookies for authentication
      });

      if(response.ok)
      {
        errInSubmission(false)
      }
      // setting customer books array to null
      setCustomerOrder([]);
  
      // setting input field value to none
      nameRef.current.value = "";
      phoneRef.current.value = "";
      mailRef.current.value = "";
      addRef.current.value = "";
    }else{
      setErrInSubmission(true)
    }
  
  
  };

  // handle cross btn
  const handleCorssClick = ()=>{
    setErrInSubmission(false)

  }

  return (
    <div className="order_detials_container">
      <h1>Order Details</h1>
      {
        errInSubmission && (
          <div className="sub_err_div">
          <ImCross className='sub_cross' onClick={handleCorssClick}/>
          <p className="sub_err">Error in Form!</p>
          
        </div>
        )
      }
      <div className="customer_form_container">
        <form className="customer_form" onSubmit={handleSubmitOrder}>
          <div className="gen_details_container">
            <div>
            <label htmlFor="name">Name<span style={{color:"red", fontFamily: "sans-serif", display:"inline"}}>*</span> :  </label>
            <input
              type="text"
              name="name"
              ref={nameRef}
              className="cust_name"
            />
            </div>

              <div>

              
            <label htmlFor="phone">Contact Number<span style={{color:"red", fontFamily: "sans-serif", display:"inline"}}>*</span> :  </label>
            <input
              type="number"
              name="phone"
              ref={phoneRef}
              className="cust_phone"
            />
              </div>

              <div>
            <label htmlFor="gmail" className="gmail">
              Mail<span style={{color:"red", fontFamily: "sans-serif", display:"inline"}}>*</span> :  
            </label>
            <input
              type="mail"
              ref={mailRef}
              name="mail"
              className="cust_email"
            />
            </div>
            <br />
            <div>
            <label htmlFor="cust_add">Address<span style={{color:"red", fontFamily: "sans-serif", display:"inline"}}>*</span> :  </label>
            <textarea
              type="text"
              className="cust_add"
              ref={addRef}
              name="custAdd"
            />
            </div>
          </div>
          <div className="error_div">{error}</div>
          <div className="inventory_data_table_outer">
            <DataTable
              columns={orderColumns}
              data={inventory}
              fixedHeader:true
              pagination
              // onSelectedRowsChange={handleRowSelected}
            />
          </div>
          <div className="submit_order_outer">

          <button className="submit_order" onClick={handleSubmitOrder}>
            Submit
          </button>
          <div className="total_amt">Total: {grandTotal} Rs</div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderDetails;
