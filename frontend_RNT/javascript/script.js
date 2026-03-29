console.log("JS is connected");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const productsContainer = document.getElementById("products");
const cartContainer = document.getElementById("cart");
let currentCategory = 'candle'; //  track what the user is looking at



// 2. CORE LOGIC (Saving and Calculating)
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// 3. THE "BRIDGE" FUNCTIONS (Making JS talk to HTML)

// Toggle Drawer Functions
const openCart = () => {
    document.getElementById("cart-drawer").classList.add("active");
    document.getElementById("cart-overlay").classList.add("active");
};

const closeCart = () => {
    document.getElementById("cart-drawer").classList.remove("active");
    document.getElementById("cart-overlay").classList.remove("active");
};

// Listen for clicks on the Bag Icon and the X Close button
document.getElementById("cart-icon-container").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
// Add this so clicking the DARK AREA also closes the cart (very luxury!)
document.getElementById("cart-overlay").addEventListener("click", closeCart);

// AUTOMATION: Open the cart automatically when a user adds an item
// Find your 'Add to Collection' logic and add openCart() inside the click listener


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
    currentCategory = category;
    
    // Get the products we already saved to the vault
    const products = JSON.parse(localStorage.getItem("currentProducts")) || [];
    
    if (products.length > 0) {
        // Just filter the data we already have!
        const filtered = products.filter(p => p.category === category);
        renderCollectionWithData(filtered);
    } else {
        // If the vault is empty (first time), then ask the server
        loadProductsFromServer(category);
    }

    renderCart();
    
    // UI: Update the gold glow on the links
    document.querySelectorAll('.filter-link').forEach(link => {
        link.classList.remove('active');
        if (link.innerText.toLowerCase().includes(category)) {
            link.classList.add('active');
        }
    });
};

function addToCart(productName) {
    // Optimization: Find the product in the local container instead of fetching the whole DB again
    const productsOnPage = JSON.parse(localStorage.getItem("currentProducts")) || [];
    const product = productsOnPage.find(p => p.name === productName);

    if (product) {
        const existingItem = cart.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        renderCart();
        openCart();
    }
}

function renderCollectionWithData(productsToDisplay) {
    if (!productsContainer) return;
    productsContainer.innerHTML = "";

    // 1. Define the backend address
    const serverURL = "http://localhost:3000";

    productsToDisplay.forEach((product) => {
        const article = document.createElement("article");
        article.className = "product-card";
        
        // 2. Combine the server URL with the image path from the database
        //const fullImagePath = `${serverURL}${product.image}`;
        //handles image path errors
        const cleanImagePath = product.image.startsWith('/') ? product.image : `/${product.image}`;
        const fullImagePath = `${serverURL}${cleanImagePath}`;

        article.innerHTML = `
            <a href="product.html?name=${encodeURIComponent(product.name)}" style="text-decoration: none; color: inherit;">
                <img src="${fullImagePath}" alt="${product.name}">
                <h3>${product.name}</h3>
            </a>
            <p class="description">${product.description}</p>
            <p class="price">KES ${product.price.toLocaleString()}</p>
            <button class="add-btn" onclick="addToCart('${product.name}')">Add to Collection</button>
        `;
        productsContainer.appendChild(article);
    });
}

// 4. RENDERING FUNCTIONS (The "Expert" versions)
async function loadProductsFromServer(category) {
    try {
        // This is the GET request your lecturer asked for
        const response = await fetch('http://localhost:3000/api/products');
        const products = await response.json();

        localStorage.setItem("currentProducts", JSON.stringify(products));
        
        // Now filter and render using the data from the backend
        const filtered = products.filter(p => p.category === category);
        renderCollectionWithData(filtered); 
    } catch (error) {
        console.error("The Atelier server is offline:", error);
    }
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
        totalDisplay.innerHTML = `
            <div style="border-top: 1px solid rgba(201, 164, 92, 0.3); margin-top: 30px; padding-top: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                    <span style="text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem; color: rgba(255,255,255,0.6);">Subtotal</span>
                    <span style="color: #c9a45c; font-weight: 600; font-size: 1.1rem;">KES ${calculateTotal().toLocaleString()}</span>
                </div>
                <button class="checkout-btn" 
        onclick="processCheckout()" 
        style="width: 100%; background: #c9a45c; color: #0b0b0e; padding: 18px; border: none; text-transform: uppercase; letter-spacing: 3px; font-weight: bold; cursor: pointer; font-size: 0.75rem; transition: 0.3s;">
    Finalize Collection
</button>
            </div>
        `;
    }
}

async function processCheckout() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) return alert("Your collection is empty!");

    // CHECK: Is the user logged in?
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    if (isLoggedIn !== "true") {
        alert("Please sign in to your Atelier account to finalize your collection.");
        window.location.href = 'login.html'; // Send them to login
        return; // Stop the function here
    }

    // If they ARE logged in, proceed with the order
    const orderData = {
        items: cart,
        totalAmount: calculateTotal(),
        userEmail: localStorage.getItem("userEmail") || "Member" 
    };

    try {
        const response = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();
        if (result.success) {
            alert("Order confirmed! Your candles are being prepared. 🕯️");
            localStorage.removeItem("cart");
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error("Checkout error:", error);
    }
}

// 5. INITIALIZATION (The "Brain" of the page)
document.addEventListener('DOMContentLoaded', () => {
    if (productsContainer) {
    // This tells the frontend to ask the backend for data immediately
    loadProductsFromServer('candle');
}
    
    // 2. Load the cart from LocalStorage
    renderCart(); 

    // 3. Handle the Login -> My Account Swap
    const authLink = document.getElementById('auth-link');
    if (authLink) {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (isLoggedIn === "true") {
            authLink.innerText = "My Account";
            authLink.href = "account.html";
            
            authLink.removeAttribute("target"); 
        }
    }
});