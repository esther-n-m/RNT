// checkout.js
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const itemsContainer = document.getElementById("checkout-items");

function renderCheckoutSummary() {
    if (cart.length === 0) {
        window.location.href = "index.html"; // Redirect back if cart is empty
        return;
    }

    let total = 0;
    itemsContainer.innerHTML = "";

    cart.forEach(item => {
        total += item.price * item.quantity;
        itemsContainer.innerHTML += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 0.9rem;">
                <span>${item.name} (x${item.quantity})</span>
                <span>KES ${(item.price * item.quantity).toLocaleString()}</span>
            </div>
        `;
    });

    document.getElementById("checkout-subtotal").textContent = `KES ${total.toLocaleString()}`;
    document.getElementById("checkout-total").textContent = `KES ${total.toLocaleString()}`;
}

renderCheckoutSummary();