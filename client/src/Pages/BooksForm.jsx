// TODO:
// SINCE THE CATEGORY, SUBCATEGORY, BOOK TITLE WHICH ARE STATIC FIELD THAT ARE ALSO GETTING ADDED IN CAMPAIGN TABLE , ITS ALTERNATIVE IS TO RENDER IT FROM BOOKS TABLE TO AVOID REDUNDANCY
// FORM WILL GET SUBMIT IF THE INPUT IS GREATER THAN STOCK VALUE BUT NOT WITH THE VALUE GREATER THAN STOCKVALUE 
import React, { useState, useEffect, useCallback } from "react";
import DataTable from "react-data-table-component";
import { IoChevronBack } from "react-icons/io5";
import { ImCross } from "react-icons/im";
const MemoizedDataTable = React.memo(DataTable);

const BooksForm = ({ formData, setFormData, isBooksForm, setIsBooksForm, data }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [records, setRecords] = useState(data);
  const [allRecords,setAllRecords] = useState(data)
  const [error, setError] = useState("");
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [errInSubmission,setErrInSubmission] = useState(false)

  useEffect(()=>{
    const temp = data.map((r)=> 
      {
        return {...r,quantity:0}
      } )
    setRecords(temp)
    setAllRecords(temp)
  },[data])
  // Filter data
  const handleFilter = useCallback((event) => {
    const searchText = event.target.value.toLowerCase();

    // new if else
    if (searchText === '') {
      // Restore the full list if search is cleared
      setRecords(allRecords);
    } else {
      // Filter the list based on the search term
      const filteredData = allRecords.filter((row) => row.title.toLowerCase().includes(searchText));
      setRecords(filteredData);
    }
  }, [allRecords]);




  useEffect(()=>{
    console.log(records)
  },[records])
  // Handle input change
  const handleInputChange = (event, rowId) => {
      const value = Number(event.target.value);
      const row = records.find((r) => r.bookId === rowId);

  

      // new if else
      if (row && row.stockQuantity >= value) {
        setError("");
        // Update both arrays
        const updatedAllRecords = allRecords.map((rec) => 
          rec.bookId === rowId ? { ...rec, quantity: value } : rec
        );
        setAllRecords(updatedAllRecords);
        
        // Also update the filtered list based on search
        setRecords(updatedAllRecords.filter((rec) => 
          records.some((r) => r.bookId === rec.bookId)
        ));
      } else {
        setError("Not enough in stock!");
      }
    

    }
    


  // Table columns
  const columns = [
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
      selector: (row) => row.stockQuantity,
      sortable: true,
    },
    {
      name: "Quantity",
      cell: (row) =>(

        <input
          type="number"
          value={row.quantity|| ""}
          onChange={(event) => handleInputChange(event, row.bookId)}
          placeholder="Enter quantity"
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];
  const summaryColumns = [
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
      selector: (row) => row.stockQuantity,
      sortable: true,
    },
    {
      name: "Quantity",
      selector: (row) =>row.quantity,
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];

  const handleOrderSummary = (recs)=> recs.filter((r)=> r.quantity>0)
  // handle submit button 
  const handleSubmitButton = async ()=>{
    try {
      
      const temp = allRecords.filter((r)=>r.quantity>0)
      setSelectedRows(temp)
      const newCamp = { ...formData, books: temp }; // Adjusted to include selected rows
      console.log("newCamp",newCamp);
      const isAnyAttributeNull = Object.values(newCamp).some(value => value === null || value === undefined || value === '');

      if(!isAnyAttributeNull)
      {
        const response = await fetch("http://localhost:5000/Add-campaign", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCamp),
          credentials: "include", 
        });
        if(response.ok)
        {
          setIsSubmitClicked(true);
        }else{
          setErrInSubmission(true)
        }
      }else{
        setErrInSubmission(true)
      }
    } catch (error) {
      console.log("Error occurred while submitting:", error);
    }
      
    }
    
    // handle cross click
    
    const handleCorssClick = ()=>{
    setIsSubmitClicked(false);
    setErrInSubmission(false)

  }

  const handleAddCampaign =async (event)=>{
    event.preventDefault(); // Prevent default anchor behavior
  
    try {
      const response = await fetch("http://localhost:5000/add-campaign", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies for authentication
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Campaign data:", result);
        window.location.href = "/Add-campaign";
        // Optionally, redirect or update the UI here
      } else {
        console.error("Failed to fetch campaign data:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  return (
    <div className="books_form">
      <IoChevronBack className="back_btn" onClick={() => setIsBooksForm(false)} />
      <div className="books_form_title">
        <h1>Select books</h1>
      </div>
      <div className="secondary_message">
        <span className="error_div">{error}</span>
         <div className="text-end">
          <input type="text" placeholder="Search Books..." onChange={handleFilter} />
        </div> 
      </div>
      <MemoizedDataTable
        title="Book List with Stock and Input"
        columns={columns}
        data={records}
        fixedHeader
        pagination
        // onSelectedRowsChange={handleRowSelected}
      />
      <div className="summary_title">
        <h1>Order Summary</h1>
      </div>
      <MemoizedDataTable title="Order" columns={summaryColumns} data={handleOrderSummary(allRecords)} />
      {isSubmitClicked && (
        <div className="success_div">
          <ImCross className='cross' onClick={handleCorssClick}/>
          <h1 className="success">Success!</h1>
          <button className="ok_btn" onClick={handleAddCampaign} >
            OK
          </button>
        </div>
      )}
      {
        errInSubmission && (
          <div className="sub_err_div">
          <ImCross className='sub_cross' onClick={handleCorssClick}/>
          <p className="sub_err">Error in Form!</p>
          
        </div>
        )
      }
      <div className="genral_details_inbooks_form">
        <button className="final-submit-btn"  onClick={handleSubmitButton}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default BooksForm;
