const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: Array,
    totalAmount: Number,
    userEmail: String,
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);