const mongoose = require('mongoose');

// Ensure mongoose-sequence is installed and imported correctly
try {
    const AutoIncrement = require('mongoose-sequence')(mongoose);

    // Define the customer schema and model
    const customerSchema = new mongoose.Schema({
        name: { type: String, required: true, unique: true },
        location: String,
        mobileNumber: { 
            type: Number, 
            required: true
        },
        alternateMobileNumber: { 
            type: Number
        },
        email: String,
        customer_id: { type: Number} // Auto-increment field
    });

    // Add auto-increment plugin for customer_id
    customerSchema.plugin(AutoIncrement, { inc_field: 'customer_id' });

    const Customer = mongoose.model('Customer', customerSchema);

    module.exports = Customer;
} catch (error) {
    console.error('Error loading mongoose-sequence:', error.message);
    throw error;
}
