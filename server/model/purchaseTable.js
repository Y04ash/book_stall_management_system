const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const purchaseSchema = new mongoose.Schema({
    purchaseId: { type: Number, unique: true }, // Primary Key with auto-increment
    campaignId: { 
        type: Number, 
        required: true, 
       // ref: 'Campaign' // References campaign_id in Campaigns collection
    },
    customerId: { 
        type: Number, 
        required: true, 
       // ref: 'Customer' // References customer_id in Customers collection
    },
    books:[
        {
        bookId: { type: Number,required: true }, // References bookId in Warehouse schema
        order: { type: Number, required: true }, // Quantity of each book needed for the campaign
        price: { type: Number }, // Field to store the price of the book
        title: { type: String }, // Field to store the title of the book
        category: { type: String }, // Field to store the category of the book
        subCategory: { type: String }, // Field to store the sub-category of the book

       }
    ],
    totalAmount: { type: Number, required: true }, // Total cost of purchase
    purchaseDate: { type: Date, default: Date.now } // Timestamp of the purchase
});

// Apply auto-increment plugin to purchaseId
purchaseSchema.plugin(AutoIncrement, { inc_field: 'purchaseId' });

module.exports = mongoose.model('Purchase', purchaseSchema);
