const express = require('express');

const app = express();

app.get('', (re, res) => {
    res.json('Welcome to TPSS')
})
app.post('/split-payments/compute', (req, res) => {
    const { id, currency, customerEmail, splitInfo } = req.body;
    let { amount } = req.body;
    
 })


app.listen(9000, () => {
    console.log('listening on http://localhost:9000');
})