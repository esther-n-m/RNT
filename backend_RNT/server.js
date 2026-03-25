const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3000;


const User = require('./models/user');
const Product = require('./models/product');

// Middleware to handle JSON data (essential for your POST requests later)
app.use(express.json());  // This allows the server to read POST data
app.use(cors());

/*
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
*/

// DB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("RNT Atelier is now connected to the Cloud "))
    .catch(err => console.error("Cloud Connection Error:", err));

//ROUTES

// 1.  FIRST GET ROUTE
// This is what happens when you visit http://localhost:3000/
app.get('/', (req, res) => {
    res.send('<h1> RNT Atelier Backend</h1>');
});

// 2. A ROUTE FOR YOUR PRODUCTS (Requirement: GET)
app.get('/api/products', async (req, res) => {
    try {
        const allProducts = await Product.find(); // Fetches everything from MongoDB
        res.json(allProducts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching the collection" });
    }
});

//  LOGIN route 
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase(), password: password });
        if (user) {
            res.json({ success: true, user: { name: user.name }, message: "Welcome back!" });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ success: true, message: "Welcome to the family!" });
    } catch (error) {
        res.status(400).json({ success: false, message: "Email already exists." });
    }
});

// 5. START SERVER (Opening the Shop)
app.listen(port, () => {
    console.log(`RNT Server is glowing at http://localhost:${port}`);
});
