const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const campaignSchema = new mongoose.Schema({
    campaignId: { type: Number, unique: true }, // Primary Key with auto-increment
    userId: { 
        type: Number, 
        required: true, 
        
    },
    sellerName:{type: String, required:true},
    campaignName: { type: String, required: true },
    location: { type: String, required: true },
    startDate: { type: Date, required: true },
    totalSales: { type: mongoose.Schema.Types.Decimal128, default: null }, // Nullable
    totalBooksSold: { type: Number, default: null }, // Nullable
    books: [
        {
            bookId: { type: Number, required: true, ref: 'Warehouse' }, // References bookId in Warehouse schema
            quantity: { type: Number, required: true }, // Quantity of each book needed for the campaign
            price: { type: Number }, // Field to store the price of the book
           title: { type: String }, // Field to store the title of the book
           category: { type: String }, // Field to store the category of the book
           subCategory: { type: String }, // Field to store the sub-category of the book

        }
    ],
    camp_ended:{
        type: Boolean,  
        default: false 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Apply auto-increment plugin to campaignId
campaignSchema.plugin(AutoIncrement, { inc_field: 'campaignId' });

module.exports = mongoose.model('Campaign', campaignSchema);
