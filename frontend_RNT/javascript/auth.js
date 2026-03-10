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