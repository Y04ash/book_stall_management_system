// // TODO:
// // form validations to be done
// // form is gettig submitted after hitting enter
// // cash or upi option remaining

// version 3
import React, { useRef, useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import { ImCross, ImBin } from "react-icons/im";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import "../App.css";

const OrderDetails = () => {
  const nameRef = useRef("");
  const addRef = useRef("");
  const mailRef = useRef("");
  const phoneRef = useRef("");
  const { campaignId } = useParams();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Book search and order state
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [booksOrdered, setBooksOrdered] = useState([]);
  const [errInSubmission, setErrInSubmission] = useState(false);
  const [stockError, setStockError] = useState({}); // { [bookId]: "error message" }

  const [inventory, setInventory] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [purchase, setPurchase] = useState([]);
  const [campaign, setCampaign] = useState({});
  const [hasCampEnded, setHasCampEnded] = useState(false);

  // Calculate grand total
  const grandTotal = booksOrdered.reduce(
    (total, product) => total + product.price * product.order,
    0
  );
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
        } catch (err) {
          // console.log(err);
        }
      };
  
      fetchCampaign();
    }, [campaignId]);

  // Product search handler
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }
    // Suggest books not already in order
    const filtered = inventory.filter(
      (product) =>
        product.name.toLowerCase().includes(value.toLowerCase()) &&
        !booksOrdered.some((b) => b.productId === product.productId)
    );
    setSuggestions(filtered);
  };

  // Add product to order
  const handleAddProduct = (product) => {
    setBooksOrdered([
      ...booksOrdered,
      { ...product, order: 1 } // Start with quantity 1
    ]);
    setSearch("");
    setSuggestions([]);
    setStockError((prev) => ({ ...prev, [product.productId]: "" }));
  };

  // Increment order
  const handleIncrement = (productId) => {
    setBooksOrdered((prev) =>
      prev.map((b) => {
        if (b.productId === productId) {
          const inventoryProduct = inventory.find((inv) => inv.productId === productId);
          if (b.order + 1 > inventoryProduct.quantity) {
            setStockError((err) => ({
              ...err,
              [productId]: "Not enough stock available"
            }));
            return b;
          } else {
            setStockError((err) => ({ ...err, [productId]: "" }));
            return { ...b, order: b.order + 1 };
          }
        }
        return b;
      })
    );
  };

  // Decrement order
  const handleDecrement = (productId) => {
    setBooksOrdered((prev) =>
      prev
        .map((b) =>
          b.productId === productId
            ? { ...b, order: Math.max(1, b.order - 1) }
            : b
        )
        .filter((b) => b.order > 0)
    );
    setStockError((err) => ({ ...err, [productId]: "" }));
  };

  // Delete product from order
  const handleDelete = (productId) => {
    setBooksOrdered((prev) => prev.filter((b) => b.productId !== productId));
    setStockError((err) => ({ ...err, [productId]: "" }));
  };

  // Submit order
  const handleSubmitOrder = async (event) => {
    event.preventDefault();
    const finalCustomerOrder = {
      name: nameRef.current.value,
      phone: phoneRef.current.value,
      custAdd: addRef.current.value,
      mail: mailRef.current.value,
      products: booksOrdered,
      totalAmount: grandTotal,
    };
    const isAnyAttributeNull = Object.values(finalCustomerOrder).some(
      (v) => v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0)
    );
    if (!isAnyAttributeNull) {
      const response = await fetch(`${BASE_URL}/campaign/${campaignId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalCustomerOrder),
        credentials: "include",
      });
      if (response.ok) {
        // setCustomerOrder([]);
        nameRef.current.value = "";
        phoneRef.current.value = "";
        mailRef.current.value = "";
        addRef.current.value = "";
        setBooksOrdered([]);
      }
    } else {
      setErrInSubmission(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Details</h2>
        {/* Error Modal */}
        {errInSubmission && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <p>Error in Form Submission!</p>
            <ImCross className="cursor-pointer" onClick={() => setErrInSubmission(false)} />
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="space-y-6">
          {/* Customer Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  ref={nameRef}
                  placeholder="Enter customer name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  ref={phoneRef}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  ref={mailRef}
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  ref={addRef}
                  rows={3}
                  placeholder="Enter address"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Book Search and Selection */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Books to Order</h3>
            <div className="mb-4 relative">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Type book name..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-200 rounded-lg mt-1 w-full max-h-48 overflow-y-auto shadow-lg">
                  {suggestions.map((product) => (
                    <li
                      key={product.productId}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                      onClick={() => handleAddProduct(product)}
                    >
                      {product.name} <span className="text-xs text-gray-400">({product.quantity} in stock)</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Ordered Books Section */}
            {booksOrdered.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Title</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Stock</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Quantity</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Price</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Total</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {booksOrdered.map((product) => (
                      <tr key={product.productId} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-900 font-medium">{product.name}</td>
                        <td className="py-3 px-4 text-gray-600">{product.stock}</td>
                        <td className="py-3 px-4 text-gray-600">
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                              onClick={() => handleDecrement(product.productId)}
                              disabled={product.order <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-2">{product.order}</span>
                            <button
                              type="button"
                              className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                              onClick={() => handleIncrement(product.productId)}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          {stockError[product.productId] && (
                            <div className="text-xs text-red-500 mt-1">{stockError[product.productId]}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-600">₹{product.price}</td>
                        <td className="py-3 px-4 text-gray-900 font-medium">
                          ₹{product.price * product.order}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            className="p-1 rounded bg-red-100 hover:bg-red-200"
                            onClick={() => handleDelete(product.productId)}
                          >
                            <ImBin className="w-4 h-4 text-red-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Submit Section */}
          <div className="flex justify-between items-center bg-blue-50 rounded-lg p-6">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                Total: ₹{grandTotal.toLocaleString()}
              </p>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Submit Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderDetails;