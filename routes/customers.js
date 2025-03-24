const express = require('express');
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation
const Customer = require('../models/customer');
const router = express.Router();

// Get all customers
router.get('/allcustomers', async (req, res) => {
    const customers = await Customer.find();
    res.send(customers);
});

// Get a customer by any field
router.post('/getCustomerData', async (req, res) => {
    const query = req.body; // Use request body to build the query
    const customer = await Customer.findOne(query);
    if (!customer) return res.status(404).send('Customer not found');
    res.send(customer);
});

// Create a new customer
router.post('/', async (req, res) => {
    const customer = new Customer(req.body);
    await customer.save();
    res.send(customer);
});

// Update a customer
router.put('/update_customers', async (req, res) => {
    try {
        const { customer_id, ...updateData } = req.body; // Extract customer_id and update data from the body

        // Validate if customer_id is provided
        if (!customer_id) {
            return res.status(400).send('Missing customer ID');
        }

        // Find the customer by customer_id and update
        const customer = await Customer.findOneAndUpdate(
            { customer_id }, // Query by customer_id
            updateData,
            { new: true, runValidators: true } // Ensure validation and return updated document
        );
        if (!customer) return res.status(404).send('Customer not found');
        res.send(customer);
    } catch (error) {
        res.status(400).send(`Error updating customer: ${error.message}`);
    }
});

// Delete a customer
router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send('Customer not found');
    res.send(customer);
});

module.exports = router;
