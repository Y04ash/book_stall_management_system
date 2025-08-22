
// version 2
import React, { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import { 
  Pencil, 
  Trash2, 
  Save, 
  X, 
  Plus, 
  Search, 
  Upload, 
  Package, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff
} from "lucide-react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

export default function WarehousePage() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [editingProductId, setEditingProductId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    stockQuantity: "",
    price: "",
    description: "",
    category: "",
    subCategory: "",
    tags: ""
  });

  // Fetch warehouse on page load
  useEffect(() => {
    fetchWarehouse();
  }, []);

  const fetchWarehouse = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/getWarehouse`, { credentials: "include" });
      const data = await res.json();
      // console.log("Fetched warehouse:", data);
      setWarehouses(data.data ? [data.data] : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      
      // console.log("Uploaded file:", file);
      const reader = new FileReader();
      reader.onload = (evt) => {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        // console.log("sheet", sheet);
        setProducts((prev) => [...prev, ...sheet]);
            e.target.value = null;
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      // console.log("Error reading file:", error);
    }
  };

  const handleAddProduct = () => {
    setProducts([...products, { 
      name: "", 
      stockQuantity: "", 
      description: "", 
      subCategory: "", 
      tags: "", 
      category: "", 
      price: "" 
    }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/createWarehouse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ products }),
      });
      const result = await response.json();
      if (result.status === "ok") {
        alert("Warehouse saved/updated!");
        fetchWarehouse();
        setProducts([]); // Clear form after successful save
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (product) => {
    setEditingProductId(product.productId);
    setEditForm({
      name: product.name || "",
      stockQuantity: product.stockQuantity || "",
      price: product.price || "",
      description: product.description || "",
      category: product.category || "",
      subCategory: product.subCategory || "",
      tags: product.tags || ""
    });
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setEditForm({
      name: "",
      stockQuantity: "",
      price: "",
      description: "",
      category: "",
      subCategory: "",
      tags: ""
    });
  };

  const saveEdit = async (productId) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/updateProduct/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      });

      const data = await res.json();

      if (data.status === "ok") {
        alert("Product updated!");
        setEditingProductId(null);
        fetchWarehouse();
      } else {
        alert(data.message || "Failed to update product");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating product");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/deleteProduct/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        // alert("Product deleted successfully");
        fetchWarehouse();
      } else {
        alert(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Server error while deleting product");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search logic
  const filteredProducts = useMemo(() => {
    if (!warehouses[0]?.products) return [];
    
    return warehouses[0].products.filter((product) => {
      // Helper function to safely convert to string for searching
      const safeToString = (value) => {
        if (value === null || value === undefined) return '';
        if (Array.isArray(value)) return value.join(' ').toLowerCase();
        return String(value).toLowerCase();
      };

      const searchLower = searchTerm.toLowerCase();
      
      const matchesSearch = 
        safeToString(product.name).includes(searchLower) ||
        safeToString(product.description).includes(searchLower) ||
        safeToString(product.category).includes(searchLower) ||
        safeToString(product.subCategory).includes(searchLower) ||
        safeToString(product.tags).includes(searchLower) ||
        String(product.productId || '').includes(searchLower) ||
        String(product.price || '').includes(searchLower) ||
        String(product.stockQuantity || '').includes(searchLower);
      
      const matchesCategory = selectedCategory === "" || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [warehouses, searchTerm, selectedCategory]);

  // Pagination logic
// Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Get unique categories for filter
  const categories = useMemo(() => {
    if (!warehouses[0]?.products) return [];
    return [...new Set(warehouses[0].products.map(p => p.category).filter(Boolean))];
  }, [warehouses]);

  const removeProduct = (index) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
  };

  return (
    <>
 <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Processing...</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Package className="text-white" size={24} />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Warehouse Management
              </h1>
            </div>
            <p className="text-gray-600 ml-16">Manage your inventory with ease</p>
          </div>
        </div>

        {/* Add Products Section */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Plus className="text-blue-500" size={20} />
              Add New Products
            </h2>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <button
                onClick={handleAddProduct}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-medium flex items-center gap-2"
              >
                <Plus size={18} />
                Add Product
              </button>
              
              <div className="relative">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Upload size={18} />
                  Import Excel/CSV
                </label>
              </div>
            </div>

            {/* Product Input Grid */}
            {products.length > 0 && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-medium text-gray-700">Product Details</h3>
                <div className="bg-gray-50 rounded-xl p-4 max-h-96 overflow-y-auto">
                  {products.map((p, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 p-4 bg-white rounded-lg border border-gray-200 last:mb-0">
                      <input
                        type="text"
                        placeholder="Product Name"
                        value={p.name || ""}
                        onChange={(e) => handleChange(i, "name", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      <input
                        type="number"
                        placeholder="stockQuantity"
                        value={p.stockQuantity || ""}
                        onChange={(e) => handleChange(i, "stockQuantity", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={p.price || ""}
                        onChange={(e) => handleChange(i, "price", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      <input
                        type="text"
                        placeholder="Category"
                        value={p.category || ""}
                        onChange={(e) => handleChange(i, "category", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      <input
                        type="text"
                        placeholder="Subcategory"
                        value={p.subCategory || ""}
                        onChange={(e) => handleChange(i, "subCategory", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={p.description || ""}
                        onChange={(e) => handleChange(i, "description", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      <input
                        type="text"
                        placeholder="Tags (comma separated)"
                        value={p.tags || ""}
                        onChange={(e) => handleChange(i, "tags", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      <button
                        onClick={() => removeProduct(i)}
                        className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <X size={16} />
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {products.length > 0 && (
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-medium"
              >
                Save to Warehouse
              </button>
            )}
          </div>
        </div>

        {/* Inventory Table */}
        {warehouses.length > 0 && warehouses[0]?.products?.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Eye className="text-blue-500" size={20} />
                Current Inventory ({filteredProducts.length} items)
              </h2>
              
              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full sm:w-64"
                  />
                </div>
                
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white min-w-32"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full bg-white">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Description</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedProducts.map((product) => (
                    <tr key={product.productId} className="hover:bg-gray-50 transition-colors duration-150">
                      {editingProductId === product.productId ? (
                        <>
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                            {product.productId}
                          </td>
                          <td className="px-4 py-3">
                            <input
                              value={editForm.name}
                              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                              placeholder="Name"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={editForm.stockQuantity}
                              onChange={(e) => setEditForm({...editForm, stockQuantity: e.target.value})}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                              placeholder="Qty"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={editForm.price}
                              onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                              placeholder="Price"
                            />
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <input
                              value={editForm.category}
                              onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                              placeholder="Category"
                            />
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <input
                              value={editForm.description}
                              onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                              placeholder="Description"
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => saveEdit(product.productId)} 
                                className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-200 shadow-sm"
                                title="Save"
                              >
                                <Save size={16} />
                              </button>
                              <button 
                                onClick={cancelEdit} 
                                className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 shadow-sm"
                                title="Cancel"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                            {product.productId}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                            {product.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {product.stockQuantity}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                            ₹{product.price}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell max-w-xs truncate">
                            {product.description}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => startEdit(product)} 
                                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-sm"
                                title="Edit"
                              >
                                <Pencil size={16} />
                              </button>
                              <button 
                                onClick={() => deleteProduct(product.productId)} 
                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Showing {Math.min(startIndex + 1, filteredProducts.length)} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
                  </span>
                  {/* <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                  </select> */}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => {
                      const page = i + 1;
                      
                      // Show first page, last page, current page, and pages around current page
                      const showPage = 
                        page === 1 || 
                        page === totalPages || 
                        Math.abs(page - currentPage) <= 1;
                      
                      if (!showPage && totalPages > 5) {
                        // Show ellipsis for gaps
                        if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <span key={page} className="px-2 py-2 text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      }
                      
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                            currentPage === page
                              ? 'bg-blue-500 text-white'
                              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {warehouses.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Package className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-6">Start by adding your first product to create your warehouse inventory.</p>
            <button
              onClick={handleAddProduct}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-medium inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Add First Product
            </button>
          </div>
        )}
      </div>
    </div>
 <Footer/>
       </>
  );
}