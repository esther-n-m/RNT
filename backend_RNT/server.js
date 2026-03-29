require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const User = require('./models/user');
const Product = require('./models/product');
const Order = require('./models/order');
const crypto = require('crypto');

const app = express();
const port = 3000;
const path = require('path');

// Middleware to handle JSON data (essential for your POST requests later)
app.use(express.json());  // This allows the server to read POST data
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// This tells the server: "If someone asks for a file in /images, give it to them!"
app.use('/images', express.static('images'));
app.use(express.static(path.join(__dirname, '..', 'frontend_RNT')));


const nodemailer = require('nodemailer');

// Seting up the "Postman" (Transporter)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, //  Gmail address
        pass: process.env.EMAIL_PASS  //  Gmail "App Password"
    }
});

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

// 1.  FIRST GET ROUTE
// This is what happens when you visit http://localhost:3000/
app.get('/', (req, res) => {
    res.send('<h1> RNT Atelier Backend</h1>');
});

app.get('/api/seed-products', async (req, res) => {
    try {
        
        await Product.deleteMany({});

        const startProducts = [
    {
        name: "Vanilla Scented Candle",
        category: "candle",
        description: "A soft vanilla scent that creates a calm, cozy atmosphere for evenings, self-care moments and unwinding after a long day.",
        price: 1200,
        image: "/images/Vanilla_Scented_Candle.png"
    },

    {
        name: "Citrus Scented Candle",
        category: "candle",
        description: "A fresh citrus blend that energizes your space and helps you feel more focused and refreshed.",
        price: 1600,
        image: "/images/Citrus_Scented_Candle.png"
    },

    {
        name: "Pine & Cinnamon Scented Candle",
        category: "candle",
        description: "A warm, woody scent with a hint of spice, perfect for creating a cozy, comforting vibe on cold or rainy days.",
        price: 1900,
        image: "/images/Pine_&_Cinnamon_Scented_Candle.png"
    },

    {
        name: "Coconut & Sandalwood Scented Candle",
        category: "candle",
        description: "A rich, luxurious blend that makes your space feel premium, relaxing, and thoughtfully styled.",
        price: 2500,
        image: "/images/Coconut_&_Sandalwood_Scented_Candle.png"
    },

    {
        name: "Lavender Scented Candle",
        category: "candle",
        description: "A gentle lavender aroma designed to reduce stress and help you relax before bed.",
        price: 1300,
        image: "/images/Lavender_Scented_Candle.png"
    },

    {
        name: "Soft Throw Pillows",
        category: "pillow",
        description: "A simple, comfortable pillow that adds softness and warmth to your living room or bedroom.",
        price: 2000,
        image: "/images/Soft_Throw_Pillow.png"
    },

    {
        name: "Knot Pillow",
        category: "pillow",
        description: "A modern accent pillow that adds character and comfort to your space without overwhelming your design.",
        price: 2100,
        image: "/images/Knot_Pillow.png"
    },

    {
        name: "Sausage Pillow",
        category: "pillow",
        description: "A long, supportive cushion that combines comfort with a stylish, hotel-like feel.",
        price: 2200,
        image: "/images/Sausage_Pillow.png"
    },

    {
        name: "Round Pillow",
        category: "pillow",
        description: "A plush round pillow that adds a cozy, relaxed touch to sofas, chairs, and reading corners.",
        price: 2300,
        image: "/images/Round_Pillow.png"
    },

    {
        name: "Fringe Pillow",
        category: "pillow",
        description: "A decorative pillow with soft fringe details that brings texture and elegance to any room.",
        price: 2400,
        image: "/images/Fringe_Pillow.png"
    },

    {
        name: "Geometric Pillow",
        category: "pillow",
        description: "A modern patterned pillow that adds visual interest and a clean, contemporary look to your space.",
        price: 2500,
        image: "/images/Geometric_Pillow.png"
    }

];

        await Product.insertMany(startProducts);
        res.send("<h1>RNT Atelier Success</h1><p>Your full collection is now live in the Atlas Cloud! </p>");
    } catch (error) {
        console.error("Seeding Error:", error);
        res.status(500).send("Error seeding database: " + error.message);
    }
});
//ROUTES

// Products Route
app.get('/api/products', async (req, res) => {
    try {
        const allProducts = await Product.find(); 
        res.json(allProducts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching the collection" });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const foundUser = await User.findOne({ email: email.toLowerCase(), password: password });
        if (foundUser) {
            res.json({ success: true, user: { name: foundUser.name }, message: "Welcome back!" });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Register Route
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // NEW: Validation Check
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Please fill in all fields (Name, Email, and Password)." 
            });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ success: true, message: "Welcome to the family!" });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(400).json({ success: false, message: "Registration failed. Email might already exist." });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const { items, totalAmount, userEmail } = req.body;
        const newOrder = new Order({ items, totalAmount, userEmail });
        await newOrder.save();

        // EMAIL LOGIC , send email to owner when order is placed
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'owner@rntatelier.com', // Put your email here
            subject: 'New Order Received!',
            text: `New order from ${userEmail}.\nTotal: KES ${totalAmount}\nItems: ${items.map(i => i.name).join(', ')}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.log("Email error:", error);
            else console.log("Email sent: " + info.response);
        });

        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// Get orders for a specific user , order history in account page
app.get('/api/orders/:email', async (req, res) => {
    try {
        const userOrders = await Order.find({ userEmail: req.params.email });
        res.json(userOrders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching history" });
    }
});

// ADMIN ROUTE: Get all orders for the shop owner
app.get('/api/admin/orders', async (req, res) => {
    try {
        // .sort({ createdAt: -1 }) ensures the newest orders appear at the top
        const allOrders = await Order.find().sort({ createdAt: -1 });
        res.json(allOrders);
    } catch (error) {
        console.error("Admin Fetch Error:", error);
        res.status(500).json({ message: "Error fetching orders" });
    }
});

// ROUTE 1: Request a reset (Sends the email)
app.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "No account with that email exists." });

        // Create a unique token
        const token = crypto.randomBytes(20).toString('hex');
        
        // Save token to user (Expires in 1 hour)
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + (24 * 60 * 60 * 1000);
        await user.save();

        const resetUrl = `http://127.0.0.1:5500/frontend_RNT/reset-password.html?token=${token}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'RNT Atelier | Password Reset',
            text: `You requested a password reset. Click the link below to set a new one:\n\n${resetUrl}\n\nIf you didn't request this, ignore this email.`
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) return res.status(500).json({ message: "Error sending email." });
            res.json({ success: true, message: "Check your email for the reset link!" });
        });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

// ROUTE 2: Update the password (The final step)
app.post('/api/reset-password/:token', async (req, res) => {
    try {
        const { password } = req.body;
        
        // FIND THE USER
        const user = await User.findOne({
            resetPasswordToken: req.params.token
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Token is invalid." });
        }

        // CHECK EXPIRATION MANUALLY
        console.log("Current Time:", new Date());
        console.log("Token Expires At:", user.resetPasswordExpires);

        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ success: false, message: "Token has expired." });
        }

        // UPDATE PASSWORD
        user.password = password; 
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ success: true, message: "Password updated successfully!" });
    } catch (error) {
        console.error("Reset Error:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
});

// 5. START SERVER (Opening the Shop)
app.listen(port, () => {
    console.log(`RNT Server is glowing at http://localhost:${port}`);
});
