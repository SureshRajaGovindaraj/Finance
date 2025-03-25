const express = require('express');
const Transaction = require('../models/transaction');
const Customer = require('../models/customer');
const router = express.Router();

// Credit transaction
router.post('/credit', async (req, res) => {
    try {
        const { customerName, amount } = req.body;

        // Validate input
        if (!customerName || !amount || amount <= 0) {
            return res.status(400).send('Invalid customer name or amount');
        }

        // Find the customer by customerName
        const customer = await Customer.findOne({ customerName });
        if (!customer) return res.status(404).send('Customer not found');

        // Ensure customerId is treated as a Number
        const customerId = customer.customerId;

        // Calculate new balance and cash balance
        const lastTransaction = await Transaction.findOne({ customerId }).sort({ _id: -1 });
        const newBalance = (lastTransaction?.balance || 0) + amount;
        const newCashBalance = (lastTransaction?.cashBalance || 0) + amount;

        // Create a new transaction
        const transaction = new Transaction({
            customerId,
            customerName: customer.customerName,
            lastUpdated: new Date().toLocaleString('en-GB'), // Format: dd-mm-yyyy, hh:mm:ss
            credit: amount,
            debit: 0,
            balance: newBalance,
            cashBalance: newCashBalance
        });

        await transaction.save();
        res.send(transaction);
    } catch (error) {
        res.status(500).send(`Error processing credit transaction: ${error.message}`);
    }
});

router.get("/alltransactions", async (req, res) => {
    const transactions = await Transaction.find();
    res.send(transactions);
});

// Debit transaction
router.post('/debit', async (req, res) => {
    try {
        const { customerName, amount } = req.body;

        // Validate input
        if (!customerName || !amount || amount <= 0) {
            return res.status(400).send('Invalid customer name or amount');
        }

        // Find the customer by customerName
        const customer = await Customer.findOne({ customerName });
        if (!customer) return res.status(404).send('Customer not found');
        const customerId = customer.customerId;

        // Calculate new balance
        const lastTransaction = await Transaction.findOne({ customerId }).sort({ _id: -1 });
        const currentBalance = lastTransaction?.balance || 0;
        const currentCashBalance = lastTransaction?.cashBalance || 0;

        if (amount > currentBalance) {
            return res.status(400).send('Insufficient balance');
        }

        if (amount > currentCashBalance) {
            return res.status(400).send('Insufficient cash balance');
        }

        const newBalance = currentBalance - amount;
        const newCashBalance = currentCashBalance - amount;

        // Create a new transaction
        const transaction = new Transaction({
            customerId,
            customerName: customer.customerName,
            lastUpdated: new Date().toLocaleString('en-GB'), // Format: dd-mm-yyyy, hh:mm:ss
            credit: 0,
            debit: amount,
            balance: newBalance,
            cashBalance: newCashBalance
        });

        await transaction.save();
        res.send(transaction);
    } catch (error) {
        res.status(500).send(`Error processing debit transaction: ${error.message}`);
    }
});

module.exports = router;
