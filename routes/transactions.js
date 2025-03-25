const express = require('express');
const Transaction = require('../models/transaction');
const Customer = require('../models/customer');
const router = express.Router();
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

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

// Calculate total credit, debit, and difference with cashBalance
router.get('/calculate/:customerName', async (req, res) => {
    try {
        const { customerName } = req.params;

        // Find the customer by customerName
        const customer = await Customer.findOne({ customerName });
        if (!customer) return res.status(404).send('Customer not found');

        const customerId = customer.customerId;

        // Fetch all transactions for the customer
        const transactions = await Transaction.find({ customerId });

        // Calculate total credit, debit, and cashBalance
        const totalCredit = transactions.reduce((sum, txn) => sum + txn.credit, 0);
        const totalDebit = transactions.reduce((sum, txn) => sum + txn.debit, 0);
        const lastTransaction = transactions[transactions.length - 1];
        const cashBalance = lastTransaction?.cashBalance || 0;
 
        // Calculate the difference
        const difference = totalCredit - totalDebit - cashBalance;
 
        res.send({
            customerName,
            totalCredit,
            totalDebit,
            cashBalance,
            difference
        });
    } catch (error) {
        res.status(500).send(`Error calculating totals: ${error.message}`);
    }
});

// Delete a transaction by transactionId
router.delete('/delete/:transactionId', async (req, res) => {
    try {
        const { transactionId } = req.params;

        // Find and delete the transaction by transactionId
        const transaction = await Transaction.findOneAndDelete({ transactionId });
        if (!transaction) return res.status(404).send('Transaction not found');

        res.send({ message: 'Transaction deleted successfully', transaction });
    } catch (error) {
        res.status(500).send(`Error deleting transaction: ${error.message}`);
    }
});

module.exports = router;
