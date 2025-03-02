const express = require('express');
const mongoose = require('mongoose');
const { customerSchema } = require('./startup/db');
const app = express();
exports.app = app;
const port = 3000;

app.use(express.json());

const Customer = mongoose.model('Customer', customerSchema);

// Create a new customer
app.post('/customers', async (req, res) => {
    let customer = new Customer({
        name: req.body.name,
        location: req.body.location,
        mobileNumber: req.body.mobileNumber,
        alternateMobileNumber: req.body.alternateMobileNumber,
        email: req.body.email
    });
    customer = await customer.save();
    res.status(201).send(customer);
});

// Get all customers
app.get('/customers', async (req, res) => {
    const customers = await Customer.find();
    res.send(customers);
});

// Get a customer by ID
app.get('/customers/:name', async (req, res) => {
    const customer = await Customer.findById(req.params.name);
    if (!customer) return res.status(404).send('Customer not found');
    res.send(customer);
});

// Update a customer by ID
app.put('/customers/:name', async (req, res) => {
    const customer = await Customer.findByIdAndUpdate(req.params.name, {
        name: req.body.name,
        location: req.body.location,
        mobileNumber: req.body.mobileNumber,
        alternateMobileNumber: req.body.alternateMobileNumber,
        email: req.body.email
    }, { new: true });

    if (!customer) return res.status(404).send('Customer not found');
    res.send(customer);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});