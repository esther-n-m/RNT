document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    // If they aren't logged in, send them away
    if (isLoggedIn !== "true") {
        window.location.href = "auth.html";
        return; 
    }

    const userName = localStorage.getItem("userName") || "Valued Client";
    document.querySelector('h1').innerText = `Welcome back, ${userName}`;
});

function performLogout() {
    // 1. Remove the "key card"
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    
    // 2. Now redirect
    window.location.href = "index.html";
}