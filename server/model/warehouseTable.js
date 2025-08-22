// const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-sequence')(mongoose);

// const warehouseSchema = new mongoose.Schema({
//     bookId: { type: Number, unique: true }, // Primary Key with auto-increment
//     title: { type: String, required: true },
//     author: { type: String, required: true },
//     price: { type:Number, required: true },
//     category: { type: String, required: true },
//     subCategory: { type: String, required: true },
//     stockQuantity: { type: Number, required: true }
// });

// // Apply auto-increment plugin to bookId
// warehouseSchema.plugin(AutoIncrement, { inc_field: 'bookId' });

// module.exports = mongoose.model('Warehouse', warehouseSchema);
// models/Warehouse.js
const mongoose = require('mongoose');

// Product Sub-schema
const productSchema = new mongoose.Schema({
    productId: { type: Number }, // sequential id inside the warehouse
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    subCategory: { type: String },
    stockQuantity: { type: Number, required: true, min: 0 },
    description: { type: String },

    condition: { 
        type: String, 
        enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
        default: 'New'
    },
    tags: { type: String,default: 'Rich' }, // Comma-separated tags
    isActive: { type: Boolean, default: true },
    addedAt: { type: Date, default: Date.now }
});

// Warehouse Schema
const warehouseSchema = new mongoose.Schema({

        userId: { 
        type: Number, 
        required: true, 
        ref: 'User',
        
    },
    // warehouseName: { 
    //     type: String, 
    //     required: true,
    //     default: 'My Warehouse'
    // },
    description: { type: String },
    products: [productSchema], // embedded array of products
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

// Auto-increment productId inside each warehouse
warehouseSchema.pre('save', function(next) {
    if (this.isModified('products')) {
        this.products.forEach((product, index) => {
            if (!product.productId) {
                product.productId = index + 1; // sequential inside warehouse
            }
        });
    }
    next();
});

module.exports = mongoose.model('Warehouse', warehouseSchema);
