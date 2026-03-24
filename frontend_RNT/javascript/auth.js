

async function handleLogin(email, password) {
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST', // The Secure One
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.success) {
            localStorage.setItem("isLoggedIn", "true");
            // Also save the username if returned by the server
            if (result.user) localStorage.setItem("userName", result.user.name);
            window.location.href = "account.html";
        } else {
            alert(result.message || "Access Denied: Check your credentials.");
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("Could not connect to the server. Is your backend running?");
    }
}

//re-direct back to index.html
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // 1. Get the values from the inputs
            const emailInput = loginForm.querySelector('input[type="email"]');
            const passwordInput = loginForm.querySelector('input[type="password"]');
            
            const email = emailInput ? emailInput.value : "";
            const password = passwordInput ? passwordInput.value : "";

            // 2. Call the new handleLogin function instead of the old localStorage logic
            handleLogin(email, password);
        });
    }
});

function switchTab(type) {
 //console.log("Switching to:", type); // This helps us debug in the browser console

    // 1. Get all elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');

    // 2. Logic for Switching
    if (type === 'register') {
        // Show Register
        registerForm.classList.add('active');
        registerTab.classList.add('active');
        registerTab.setAttribute('aria-selected', 'true');
        
        // Hide Login
        loginForm.classList.remove('active');
        loginTab.classList.remove('active');
        loginTab.setAttribute('aria-selected', 'false');
    } else {
        // Show Login
        loginForm.classList.add('active');
        loginTab.classList.add('active');
        loginTab.setAttribute('aria-selected', 'true');
        
        // Hide Register
        registerForm.classList.remove('active');
        registerTab.classList.remove('active');
        registerTab.setAttribute('aria-selected', 'false');
    }
}