console.log("JS is connected");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

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
        price:  1600,
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
        image:"images/Coconut_&_Sandalwood_Scented_Candle.png"
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

const productsContainer = document.getElementById("products");

if (!productsContainer) {
  console.error("Products container not found");
}


const cartContainer = document.getElementById("cart");

if (!cartContainer) {
    console.error("Cart container not found");
}


function renderCollection(category) {
    // 1. Clear the container so we don't just keep appending
    productsContainer.innerHTML = "";

    // 2. Filter products based on the choice (candle or pillow)
    const filtered = products.filter(product => product.category === category);

    // 3. Loop through the filtered list
    filtered.forEach((product) => {
        const article = document.createElement("article");
        
        // Add a class for styling
        article.className = "product-card";

        article.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="description">${product.description}</p>
            <p class="price">KES ${product.price.toLocaleString()}</p>
            <button class="add-btn">Add to Collection</button>
        `;

        // 4. Add the Click Event to the button inside this article
        article.querySelector(".add-btn").addEventListener("click", () => {
            const existing = cart.find(item => item.name === product.name);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            saveCart();
            renderCart();
        });

        productsContainer.appendChild(article);
    });
}

// 5. Make the filter function available to the HTML buttons
window.filterBy = (category) => {
    renderCollection(category);
    
    // Luxury Touch: Update the active state of the buttons
    document.querySelectorAll('.filter-link').forEach(link => {
        link.classList.remove('active');
        if(link.innerText.toLowerCase().includes(category)) {
            link.classList.add('active');
        }
    });
};

// 6. Initial Load: Show candles by default
renderCollection('candle');
renderFeaturedProducts();

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}


function renderCart() {
    cartContainer.innerHTML = "";
    let totalItems = 0;

    cart.forEach((item, index) => {
        totalItems += item.quantity;
        
        const div = document.createElement("div");
        div.className = "cart-item";
        div.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #2a2a35;";

        // Luxury Stepper: [ - 1 + ]
        div.innerHTML = `
            <div style="text-align: left;">
                <span style="display: block; font-family: 'Playfair Display'; font-size: 1.1rem;">${item.name}</span>
                <span style="color: #c9a45c; font-size: 0.9rem;">KES ${(item.price * item.quantity).toLocaleString()}</span>
            </div>
            <div class="stepper" style="display: flex; align-items: center; gap: 15px;">
                <button class="adjust-btn" onclick="updateQty(${index}, -1)">−</button>
                <span style="font-size: 0.9rem; width: 20px; text-align: center;">${item.quantity}</span>
                <button class="adjust-btn" onclick="updateQty(${index}, 1)">+</button>
            </div>
        `;

        cartContainer.appendChild(div);
    });

    // Update Top Shopping Bag
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        cartCountElement.style.opacity = totalItems > 0 ? "1" : "0";
    }

    document.getElementById("total").textContent = "Total: KES " + calculateTotal().toLocaleString();
}

// Global function to handle + and -
window.updateQty = (index, change) => {
    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
    } else {
        cart.splice(index, 1);
    }
    saveCart();
    renderCart();
};

function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

renderCart();
