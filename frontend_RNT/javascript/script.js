console.log("JS is connected");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const productsContainer = document.getElementById("products");
const cartContainer = document.getElementById("cart");
let currentCategory = 'candle'; //  track what the user is looking at

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


// 2. CORE LOGIC (Saving and Calculating)
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// 3. THE "BRIDGE" FUNCTIONS (Making JS talk to HTML)
window.updateQty = (index, change) => {
    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
    } else {
        cart.splice(index, 1);
    }
    saveCart();
    renderCart();
};

// NEW FUNCTION 
window.removeItem = (index) => {
    cart.splice(index, 1); // This removes the whole item line from the array
    saveCart();            // Saves the change
    renderCart();          // Re-draws the cart so the item disappears
};

window.filterBy = (category) => {
    //  Update the tracking variable immediately
    currentCategory = category;
    //  Refresh the product list
    renderCollection(category);
    //   Refresh the cart so the empty button text updates
    renderCart();
    document.querySelectorAll('.filter-link').forEach(link => {
        link.classList.remove('active');
        // Match the text to make sure the right link glows gold
        if (link.innerText.toLowerCase().includes(category)) {
            link.classList.add('active');
        }
    });
};

// 4. RENDERING FUNCTIONS (The "Expert" versions)
function renderCollection(category) {
    productsContainer.innerHTML = "";
    const filtered = products.filter(product => product.category === category);

    filtered.forEach((product) => {
        const article = document.createElement("article");
        article.className = "product-card";
        article.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="description">${product.description}</p>
            <p class="price">KES ${product.price.toLocaleString()}</p>
            <button class="add-btn">Add to Collection</button>
        `;

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

function renderCart() {
    if (!cartContainer) return;

    cartContainer.innerHTML = "";
    let totalItems = 0;


    // 1. Check if the cart is empty
    if (cart.length === 0) {
        // Set the specific label based on current category
        const label = currentCategory === 'candle' ? 'The Candle Atelier' : 'The Pillow Collection';

        cartContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 0;">
                <p style="font-family: 'Playfair Display'; font-style: italic; color: rgba(255,255,255,0.4);">
                    Your collection is currently empty.
                </p>
                <button onclick="window.filterBy('${currentCategory}'); document.getElementById('products').scrollIntoView({behavior: 'smooth'})" 
                        style="margin-top: 20px; font-size: 10px;">
                    Explore ${label}
                </button>
            </div>
        `;
        document.getElementById("total").style.display = "none";
        return;
    }

    // 2. If not empty, show items (Your existing loop)
    document.getElementById("total").style.display = "block";

    cart.forEach((item, index) => {
        totalItems += item.quantity;
        const div = document.createElement("div");
        div.className = "cart-item";
        div.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.05);";

        div.innerHTML = `
    <div style="text-align: left;">
        <span style="display: block; font-family: 'Playfair Display'; font-size: 1rem; letter-spacing: 1px;">${item.name}</span>
        <div style="display: flex; align-items: center; gap: 15px; margin-top: 5px;">
            <span style="color: #c9a45c; font-size: 0.85rem;">KES ${(item.price * item.quantity).toLocaleString()}</span>
            
            <span class="remove-link" onclick="removeItem(${index})">Remove</span>
        </div>
    </div>
    <div class="stepper" style="display: flex; align-items: center; gap: 15px;">
        <button class="adjust-btn" onclick="updateQty(${index}, -1)">−</button>
        <span style="font-size: 0.9rem; min-width: 20px; text-align: center;">${item.quantity}</span>
        <button class="adjust-btn" onclick="updateQty(${index}, 1)">+</button>
    </div>
`;
        cartContainer.appendChild(div);
    });

    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        cartCountElement.style.opacity = totalItems > 0 ? "1" : "0";
    }

    const totalDisplay = document.getElementById("total");
    if (totalDisplay) {
        totalDisplay.textContent = "Total: KES " + calculateTotal().toLocaleString();
    }
}

// 5. INITIALIZATION (Kickstart the site)
renderCollection('candle');
renderCart(); // Call this so the cart loads items from LocalStorage on refresh