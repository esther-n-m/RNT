console.log("JS is connected");

let cart = [];

const products = [
    {
        name: "Vanilla Scented Candle",
        description: "A soft vanilla scent that creates a calm, cozy atmosphere for evenings, self-care moments and unwinding after a long day.",
        price: 1200
    },

    {
        name: "Citrus Scented Candle",
        description: "A fresh citrus blend that energizes your space and helps you feel more focused and refreshed.",
        price:  1600
    },

    {
        name: "Pine & Cinnamon Scented Candle",
        description: "A warm, woody scent with a hint of spice, perfect for creating a cozy, comforting vibe on cold or rainy days.",
        price: 1900
    },

    {
        name: "Coconut & Sandalwood Scented Candle",
        description: "A rich, luxurious blend that makes your space feel premium, relaxing, and thoughtfully styled.",
        price: 2500
    },

    {
        name: "Lavender Scented Candle",
        description: "A gentle lavender aroma designed to reduce stress and help you relax before bed.",
        price: 1300
    },

    {
        name: "Soft Throw Pillows",
        description: "A simple, comfortable pillow that adds softness and warmth to your living room or bedroom.",
        price: 2000
    },

    {
        name: "Knot Pillow",
        description: "A modern accent pillow that adds character and comfort to your space without overwhelming your design.",
        price: 2100
    },

    {
        name: "Sausage Pillow",
        description: "A long, supportive cushion that combines comfort with a stylish, hotel-like feel.",
        price: 2200
    },

    {
        name: "Round Pillow",
        description: "A plush round pillow that adds a cozy, relaxed touch to sofas, chairs, and reading corners.",
        price: 2300
    },

    {
        name: "Fringe Pillow",
        description: "A decorative pillow with soft fringe details that brings texture and elegance to any room.",
        price: 2400
    },

    {
        name: "Geometric Pillow",
        description: "A modern patterned pillow that adds visual interest and a clean, contemporary look to your space.",
        price: 2500
    }

];

const productsContainer = document.getElementById("products");

if (!productsContainer) {
  console.error("Products container not found");
}


const cartContainer = document.getElementById("cart");

if (!cartContainer) {
    console.error("Cart container not found");
}


products.forEach(product => {
    const article = document.createElement("article");
    
    const h3 = document.createElement("h3");
    h3.textContent= product.name;

    const description = document.createElement("p");
    description.textContent = product.description;

    const price = document.createElement("p");
    price.textContent = "KES" + product.price;

    const button = document.createElement("button");
    button.textContent = "Add to Cart";

    button.addEventListener("click", () => {
    cart.push(product);
    console.log(cart);
    });


    article.appendChild(h3);
    article.appendChild(description);
    article.appendChild(price);
    article.appendChild(button);

    productsContainer.appendChild(article);
})


