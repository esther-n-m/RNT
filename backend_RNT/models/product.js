const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true }, // 'candle' or 'pillow'
    image: String,
    description: String,
    stock: { type: Number, default: 10 }
});

module.exports = mongoose.model('product', productSchema);