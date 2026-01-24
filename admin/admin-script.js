// Admin Credentials
const ADMIN_CREDENTIALS = {
    id: 'opashishyt',
    password: 'Ashish@2006'
};

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('adminLoginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('adminPassword');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('adminUsername').value.trim();
            const password = document.getElementById('adminPassword').value;
            
            if (username === ADMIN_CREDENTIALS.id && password === ADMIN_CREDENTIALS.password) {
                localStorage.setItem('admin_logged_in', 'true');
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid credentials');
            }
        });
    }
});