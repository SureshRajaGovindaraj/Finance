const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let customers = [];

// Create a new customer
app.post('/customers', (req, res) => {
    const customer = {
        id: customers.length + 1,
        name: req.body.name,
        location: req.body.location,
        mobileNumber: req.body.mobileNumber,
        alternateMobileNumber: req.body.alternateMobileNumber,
        email: req.body.email
    };
    customers.push(customer);
    res.status(201).send(customer);
});

// Get all customers
app.get('/customers', (req, res) => {
    res.send(customers);
});

// Get a customer by ID
app.get('/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer) return res.status(404).send('Customer not found');
    res.send(customer);
});

// Update a customer by ID
app.put('/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer) return res.status(404).send('Customer not found');

    customer.name = req.body.name;
    customer.location = req.body.location;
    customer.mobileNumber = req.body.mobileNumber;
    customer.alternateMobileNumber = req.body.alternateMobileNumber;
    customer.email = req.body.email;
    res.send(customer);
});

// Delete a customer by ID
app.delete('/customers/:id', (req, res) => {
    const customerIndex = customers.findIndex(c => c.id === parseInt(req.params.id));
    if (customerIndex === -1) return res.status(404).send('Customer not found');

    const deletedCustomer = customers.splice(customerIndex, 1);
    res.send(deletedCustomer);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});