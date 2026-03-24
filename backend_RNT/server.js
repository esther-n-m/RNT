const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware to handle JSON data (essential for your POST requests later)
app.use(express.json());  // This allows the server to read POST data
app.use(cors());

const products = [
    {
        name: "Vanilla Scented Candle",
        category: "candle",
        description: "A soft vanilla scent that creates a calm, cozy atmosphere for evenings, self-care moments and unwinding after a long day.",
        price: 1200,
        image: "images/Vanilla_Scented_Candle.png"
    },

    {
        name: "Citrus Scented Candle",
        category: "candle",
        description: "A fresh citrus blend that energizes your space and helps you feel more focused and refreshed.",
        price: 1600,
        image: "images/Citrus_Scented_Candle.png"
    },

    {
        name: "Pine & Cinnamon Scented Candle",
        category: "candle",
        description: "A warm, woody scent with a hint of spice, perfect for creating a cozy, comforting vibe on cold or rainy days.",
        price: 1900,
        image: "images/Pine_&_Cinnamon_Scented_Candle.png"
    },

    {
        name: "Coconut & Sandalwood Scented Candle",
        category: "candle",
        description: "A rich, luxurious blend that makes your space feel premium, relaxing, and thoughtfully styled.",
        price: 2500,
        image: "images/Coconut_&_Sandalwood_Scented_Candle.png"
    },

    {
        name: "Lavender Scented Candle",
        category: "candle",
        description: "A gentle lavender aroma designed to reduce stress and help you relax before bed.",
        price: 1300,
        image: "images/Lavender_Scented_Candle.png"
    },

    {
        name: "Soft Throw Pillows",
        category: "pillow",
        description: "A simple, comfortable pillow that adds softness and warmth to your living room or bedroom.",
        price: 2000,
        image: "images/Soft_Throw_Pillow.png"
    },

    {
        name: "Knot Pillow",
        category: "pillow",
        description: "A modern accent pillow that adds character and comfort to your space without overwhelming your design.",
        price: 2100,
        image: "images/Knot_Pillow.png"
    },

    {
        name: "Sausage Pillow",
        category: "pillow",
        description: "A long, supportive cushion that combines comfort with a stylish, hotel-like feel.",
        price: 2200,
        image: "images/Sausage_Pillow.png"
    },

    {
        name: "Round Pillow",
        category: "pillow",
        description: "A plush round pillow that adds a cozy, relaxed touch to sofas, chairs, and reading corners.",
        price: 2300,
        image: "images/Round_Pillow.png"
    },

    {
        name: "Fringe Pillow",
        category: "pillow",
        description: "A decorative pillow with soft fringe details that brings texture and elegance to any room.",
        price: 2400,
        image: "images/Fringe_Pillow.png"
    },

    {
        name: "Geometric Pillow",
        category: "pillow",
        description: "A modern patterned pillow that adds visual interest and a clean, contemporary look to your space.",
        price: 2500,
        image: "images/Geometric_Pillow.png"
    }

];


//ROUTES

// 1.  FIRST GET ROUTE
// This is what happens when you visit http://localhost:3000/
app.get('/', (req, res) => {
    res.send('<h1>Welcome to RNT Atelier Backend</h1><p>The server is running successfully.</p>');
});

// 2. A ROUTE FOR YOUR PRODUCTS (Requirement: GET)
app.get('/api/products', (req, res) => {
    res.json(products);
});

// This is the LOGIN route (Requirement: POST - The "Secure One")
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    // Simple check for now
    if (email && password) {
        res.json({ success: true, message: "Logged in to RNT Atelier" });
    } else {
        res.status(400).json({ success: false, message: "Details required" });
    }
});

// 5. START SERVER (Opening the Shop)
app.listen(port, () => {
    console.log(`RNT Server is glowing at http://localhost:${port}`);
});

require('dotenv').config();
const mongoose = require('mongoose');

// Connect to the Cloud
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("RNT Atelier is now connected to the Cloud "))
    .catch(err => console.error("Cloud Connection Error:", err));


const User = require('./models/user');

// Professional "Register" Route (POST)
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Create a new user instance based on our Schema
        const newUser = new User({ 
            name, 
            email, 
            password 
        });

        // 2. Save the document to MongoDB Atlas
        await newUser.save();

        // 3. Respond with success
        res.status(201).json({ 
            success: true, 
            message: "Welcome to the RNT Atelier family!" 
        });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(400).json({ 
            success: false, 
            message: "Registration failed. This email may already be in use." 
        });
    }
});