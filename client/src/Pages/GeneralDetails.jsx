import React from 'react'
import "../App.css"
const GeneralDetails = ({ formData, setFormData, isBooksForm, setIsBooksForm }) => {

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };



  return (
  <div className="w-full bg-white p-0 m-0">
  <div className="max-w-none w-full bg-white rounded-lg  p-6 mb-4">
  
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Campaign Details</h1>
            <p className="text-gray-600 mt-2">
              Fill in the basic information for your campaign
            </p>
          </div>

            
            {/* Campaign Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="campaignName"
                value={formData.campaignName || ''}
                onChange={onChangeHandler}
                placeholder="Enter campaign title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                           transition-all duration-200"
                required
              />
            </div>
  
{/* date */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
      <input
      name="startDate"
        type="date"
        
                  className="w-full border border-gray-300  rounded px-3 py-2 focus:border-blue-400 focus:outline-none"
        value={formData.startDate || ''}
        onChange={onChangeHandler}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Seller Name</label>
      <input
        type="text"
        name="sellerName"
        className="w-full border border-gray-300 rounded px-3 py-2 focus:border-blue-400 focus:outline-none"
          placeholder='John Doe'
        value={formData.sellerName || ''}
        onChange={onChangeHandler}
      />
    </div>
  </div>


            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="location"
                value={formData.location || ''}
                onChange={onChangeHandler}
                placeholder="Enter campaign address"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                           transition-all duration-200 resize-none"
                required
              />
            </div>

        </div>
      </div>
    </div> 
  );
};

export default GeneralDetails;
