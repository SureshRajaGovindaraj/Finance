const mongoose = require('mongoose');

// Ensure mongoose-sequence is installed and imported correctly
try {
    const AutoIncrement = require('mongoose-sequence')(mongoose);

    // Define the customer schema and model
    const customerSchema = new mongoose.Schema({
        customerName: { type: String, required: true, unique: true },
        location: String,
        mobileNumber: { type: Number, required: true },
        alternateMobileNumber: { type: Number },
        email: String,
        customerId: { type: Number } // Auto-increment field
    });

    // Add auto-increment plugin for customerId
    customerSchema.plugin(AutoIncrement, { inc_field: 'customerId' });

    const Customer = mongoose.model('Customer', customerSchema);

    module.exports = Customer;
} catch (error) {
    console.error('Error loading mongoose-sequence:', error.message);
    throw error;
}
