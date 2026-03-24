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