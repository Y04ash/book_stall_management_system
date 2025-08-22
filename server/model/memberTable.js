const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
   
const memberSchema = new mongoose.Schema({
    userId: { type: Number, unique: true }, // Primary key with auto-increment
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phoneNo: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed passwords
    address:{type:String, required:true},
    city:{type:String, required:true},
    state:{type:String, required:true},
    gender:{type:String, enum: ['Male', 'Female', 'Other'], required: true},
    role: { 
        type: String, 
        enum: ['admin', 'member'], 
        default: 'member' 
    }, // Role-based access
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Apply auto-increment plugin to userId
memberSchema.plugin(AutoIncrement, { inc_field: 'userId' });

module.exports = mongoose.model('Member', memberSchema);
