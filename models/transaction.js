const mongoose = require('mongoose');

// Define the transaction schema and model
const transactionSchema = new mongoose.Schema({
    customerId: { type: Number, required: true, ref: 'Customer' }, // Reference to Customer schema
    customerName: { type: String, required: true }, // Customer name
    lastUpdated: { type: String, required: true }, // Format: dd-mm-yyyy, hh:mm:ss
    credit: { type: Number, default: 0 }, // Credit amount
    debit: { type: Number, default: 0 }, // Debit amount
    balance: { type: Number, required: true }, // Remaining balance
    cashBalance : { type: Number, required: true } // Remaining cash balance
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
