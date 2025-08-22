
// export default BooksForm;
import React, { useState, useEffect, useCallback } from "react";
import { IoChevronBack } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import "../App.css"
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
const BooksForm = ({ formData, setFormData, isBooksForm, setIsBooksForm, data }) => {
  // const [records, setRecords] = useState([]);
  // const [allRecords, setAllRecords] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
const [searchText, setSearchText] = useState("");
  const [error, setError] = useState("");
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [errInSubmission, setErrInSubmission] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;
    const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const navigate = useNavigate(); 
  useEffect(() => {
    if(Array.isArray(data) && data.length > 0) {
      const temp = data.map((r) => ({ ...r, quantity: 0 }));
      // setRecords(temp);
      setAllRecords(temp);
    }
  }, [data]);

  // Search
  // const handleFilter = useCallback((event) => {
  //   const searchText = event.target.value.toLowerCase();
  //   if (searchText === "") {
  //     setRecords(allRecords);
  //   } else {
  //     setRecords(allRecords.filter((row) => row.title.toLowerCase().includes(searchText)));
  //   }
  // }, [allRecords]);
const handleFilter = useCallback((event) => {
  setSearchText(event.target.value.toLowerCase());
}, []);
  // Handle Quantity
  const handleInputChange = (event, rowId) => {
    const value = Number(event.target.value);
    const row = allRecords.find((r) => r.productId === rowId);

    if (row && row.stockQuantity >= value) {
      setError("");
      const updatedAllRecords = allRecords.map((rec) =>
        rec.productId === rowId ? { ...rec, quantity: value } : rec
      );
      setAllRecords(updatedAllRecords);
      // setRecords(updatedAllRecords.filter((rec) =>
      //   records.some((r) => r.bookId === rec.bookId)
      // ));
    } else {
      setError("Not enough in stock!");
    }
  };

  // Order Summary
  const orderSummary = allRecords.filter((r) => r.quantity > 0);
// handle submit
const handleSubmit = async (e) => {
  e.preventDefault();
  // Prepare the data to send
  const payload = {
    ...formData, // campaignName, startDate, sellerName, location, etc.
    products: orderSummary, // Array of { bookId, quantity }
  };
  // console.log("payload is ",payload)

  try {
    const response = await fetch(`${BASE_URL}/Add-campaign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // if you use cookies/auth
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.status === "ok") {
      // Success: show a message, reset form, or redirect
      // isSubmitClicked(true);
      // Optionally reset form or navigate
      navigate("/campaign");
      
    } 
  } catch (error) {
    alert("Network or server error: " + error.message);
  }
};

  // Pagination logic
  // const pageCount = Math.ceil(records.length / itemsPerPage);
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
  // const paginatedRecords = records.slice(
  //   currentPage * itemsPerPage,
  //   currentPage * itemsPerPage + itemsPerPage
  // );
  const filteredRecords = allRecords.filter((row) =>
  row.name.toLowerCase().includes(searchText)
);

const pageCount = Math.ceil(filteredRecords.length / itemsPerPage);
const paginatedRecords = filteredRecords.slice(
  currentPage * itemsPerPage,
  currentPage * itemsPerPage + itemsPerPage
);
  return (
    // <div className=" w-full bg-white p-0 m-0 ">
      <div className="max-w-none w-full bg-white rounded-lg shadow mb-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {/* Header */}

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search books..."
                onChange={handleFilter}
                className="w-full pl-4 pr-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>


            {/* pagition */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Books</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Title</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.map((row) => (
                  <tr key={row.productId} className="border-b border-gray-100 hover:bg-white transition-colors duration-200">
                    <td className="py-3 px-4 text-gray-900">{row.productId}</td>
                    <td className="py-3 px-4 text-gray-900 font-medium">{row.name}</td>
                    <td className="py-3 px-4 text-gray-600">{row.stockQuantity}</td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        max={row.stockQuantity}
                        value={row.quantity || ""}
                        onChange={(e) => handleInputChange(e, row.productId)}
                        placeholder="0"
                        className="w-20 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"pagination flex space-x-2"}
              activeClassName={"bg-blue-600 text-white px-3 py-1 rounded"}
              pageClassName={"px-3 py-1 rounded border border-gray-300"}
              previousClassName={"px-3 py-1 rounded border border-gray-300"}
              nextClassName={"px-3 py-1 rounded border border-gray-300"}
              breakClassName={"px-3 py-1"}
              forcePage={currentPage}
            />
          </div>
        </div>

          {/* Order Summary */}
          {orderSummary.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-blue-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Title</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderSummary.map((row) => (
                      <tr key={row.productId} className="border-b border-blue-100">
                        <td className="py-3 px-4 text-gray-900">{row.productId}</td>
                        <td className="py-3 px-4 text-gray-900 font-medium">{row.name}</td>
                        <td className="py-3 px-4 text-gray-600">{row.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-center">
  <button
    onClick={handleSubmit}
    className="w-[8rem] bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
  >
    Submit
  </button>
</div>


          {/* Success Modal */}
          {isSubmitClicked && (
            <div className="mt-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">
              ✅ Campaign submitted successfully!
            </div>
          )}
          {errInSubmission && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
              ❌ Error in submission
            </div>
          )}
        </div>
      </div>
    // </div>
  );
};

export default BooksForm;
