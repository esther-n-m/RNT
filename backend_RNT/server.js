const express = require('express');
const app = express();
const port = 3000;

// Middleware to handle JSON data (essential for your POST requests later)
app.use(express.json());

// 1. YOUR FIRST GET ROUTE
// This is what happens when you visit http://localhost:3000/
app.get('/', (req, res) => {
    res.send('<h1>Welcome to RNT Atelier Backend</h1><p>The server is running successfully.</p>');
});

// 2. A ROUTE FOR YOUR PRODUCTS (Requirement: GET)
app.get('/api/products', (req, res) => {
    // For now, we send a simple message. Later, we will send your actual candle list.
    res.json({
        message: "This is a GET request. Here is where your candles will appear."
    });
});

// 3. START THE SERVER
app.listen(port, () => {
    console.log(`RNT Server is glowing at http://localhost:${port}`);
});