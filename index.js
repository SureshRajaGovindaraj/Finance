const express = require('express');
const app = express();
const customerRoutes = require('./routes/customers');
require('./startup/db');

app.use(express.json());
app.use('/customers', customerRoutes);
app.use('/transactions', require('./routes/transactions'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));