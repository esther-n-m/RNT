

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

async function handleRegister(name, email, password) {
    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const result = await response.json();
        if (result.success) {
            alert("Registration successful! Please login.");
            switchTab('login');
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert("Registration failed. Server might be down.");
    }
}

//re-direct back to index.html
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form'); // Target the register form

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            handleLogin(email, password);
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Get values from the registration inputs
            const name = registerForm.querySelector('input[type="text"]').value;
            const email = registerForm.querySelector('input[type="email"]').value;
            const password = registerForm.querySelector('input[type="password"]').value;
            handleRegister(name, email, password);
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