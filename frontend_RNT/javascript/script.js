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
    //  Update the tracking variable immediately
    currentCategory = category;
    //  Refresh the product list
    //renderCollection(category); no longer exists
    loadProductsFromServer(category); //  server-loading function 
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

//find the product details from the data your server sent and add them to your cart.
function addToCart(productName) {
    // We fetch the latest products from the server to ensure we have the right price
    fetch('http://localhost:3000/api/products')
        .then(res => res.json())
        .then(products => {
            const product = products.find(p => p.name === productName);
            
            if (product) {
                const existingItem = cart.find(item => item.name === productName);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({ ...product, quantity: 1 });
                }
                
                saveCart();
                renderCart();
                openCart(); // Automatically show the drawer
            }
        });
}

function renderCollectionWithData(productsToDisplay) {
    if (!productsContainer) return;
    productsContainer.innerHTML = "";

    productsToDisplay.forEach((product) => {
        const article = document.createElement("article");
        article.className = "product-card";
        
        article.innerHTML = `
            <a href="product.html?name=${encodeURIComponent(product.name)}" style="text-decoration: none; color: inherit;">
                <img src="${product.image}" alt="${product.name}">
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
                        onclick="window.location.href = 'checkout.html';" 
                        style="width: 100%; background: #c9a45c; color: #0b0b0e; padding: 18px; border: none; text-transform: uppercase; letter-spacing: 3px; font-weight: bold; cursor: pointer; font-size: 0.75rem; transition: 0.3s;">
                    Proceed to Checkout
                </button>
            </div>
        `;
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