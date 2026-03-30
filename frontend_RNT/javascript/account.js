document.addEventListener('DOMContentLoaded', () => {
    // 1. SECURITY CHECK: If they aren't logged in, send them to login page
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    if (isLoggedIn !== "true") {
        window.location.href = "auth.html";
        return; 
    }

    // 2. PERSONALIZATION: Get the name and update the UI
    // We try to find 'welcome-message' first, otherwise fall back to h1
    const userName = localStorage.getItem("userName") || "Valued Client";
    const welcomeElement = document.getElementById("welcome-message") || document.querySelector('h1');
    
    if (welcomeElement) {
        welcomeElement.innerText = `Welcome back, ${userName}`;
    }
});

// 3. LOGOUT LOGIC
function performLogout() {
    // Clear the session data
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    
    // Send back to home
    window.location.href = "index.html";
}

async function loadOrderHistory() {
    const email = localStorage.getItem("userEmail");
    const historyContainer = document.getElementById("order-history-list"); // Ensure this ID exists in HTML

    if (!email) return;

    try {
        const response = await fetch(`https://rnt-backend.onrender.com/api/orders/${email}`);
        const orders = await response.json();

        if (orders.length === 0) {
            historyContainer.innerHTML = "<p>Your collection history is empty.</p>";
            return;
        }

        historyContainer.innerHTML = orders.map(order => `
            <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <p>Order Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
                <p>Total: KES ${order.totalAmount}</p>
                <p>Status: ${order.status}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error("History error:", error);
    }
}

// Run this when the page opens
document.addEventListener('DOMContentLoaded', loadOrderHistory);