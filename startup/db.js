const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/finance', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

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
    email: String
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
