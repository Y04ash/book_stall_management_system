const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const warehouseSchema = new mongoose.Schema({
    bookId: { type: Number, unique: true }, // Primary Key with auto-increment
    title: { type: String, required: true },
    author: { type: String, required: true },
    price: { type:Number, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    stockQuantity: { type: Number, required: true }
});

// Apply auto-increment plugin to bookId
warehouseSchema.plugin(AutoIncrement, { inc_field: 'bookId' });

module.exports = mongoose.model('Warehouse', warehouseSchema);
