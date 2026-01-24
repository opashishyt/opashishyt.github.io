// Main Portfolio Website Script

// DOM Elements
let currentUser = null;
let projects = [];
let categories = [];
let currentCategory = 'All';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initAuth();
    loadProjects();
    initContactForm();
    initNewsletter();
    initBackToTop();
    initModals();
    checkUserSession();
    
    // Load user data
    loadUserData();
});

// Navigation Functions
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const navbar = document.querySelector('.navbar');
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times');
            navLinks.classList.toggle('active');
            
            // Close other menus
            if (authButtons) authButtons.classList.remove('active');
            if (userMenu) userMenu.classList.remove('active');
        });
    }
    
    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (menuToggle) {
                menuToggle.querySelector('i').classList.remove('fa-times');
                menuToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
}

// Authentication Functions
function initAuth() {
    // Login form submission
    const loginForm = document.getElementById('userLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Signup form submission
    const signupForm = document.getElementById('userSignupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup();
        });
        
        // Password strength checker
        const passwordInput = document.getElementById('signupPassword');
        if (passwordInput) {
            passwordInput.addEventListener('input', function() {
                checkPasswordStrength(this.value);
            });
        }
    }
}

function checkUserSession() {
    const session = localStorage.getItem('portfolio_user_session');
    if (session) {
        currentUser = JSON.parse(session);
        updateAuthUI();
    }
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('portfolio_users') || '[]');
    const pendingUsers = JSON.parse(localStorage.getItem('portfolio_pending_users') || '[]');
    
    // Check if user exists and is verified
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        if (user.status === 'pending') {
            showNotification('Your account is pending approval by admin. Please wait for verification.', 'warning');
            return;
        }
        
        // Set current user
        currentUser = user;
        
        // Save session
        const sessionData = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone
        };
        
        if (rememberMe) {
            localStorage.setItem('portfolio_user_session', JSON.stringify(sessionData));
        } else {
            sessionStorage.setItem('portfolio_user_session', JSON.stringify(sessionData));
        }
        
        // Update UI
        updateAuthUI();
        
        // Close modal and show success message
        closeModal('loginModal');
        showNotification('Login successful! Welcome back ' + user.name, 'success');
        
    } else {
        // Check if user is in pending list
        const pendingUser = pendingUsers.find(u => u.email === email && u.password === password);
        if (pendingUser) {
            showNotification('Your account is pending approval by admin. Please wait for verification.', 'warning');
        } else {
            showNotification('Invalid email or password. Please try again.', 'error');
        }
    }
}

function handleSignup() {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validation
    if (!name || !email || !phone || !password || !confirmPassword) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showNotification('Please agree to the Terms & Conditions', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (!validatePhone(phone)) {
        showNotification('Please enter a valid phone number', 'error');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('portfolio_users') || '[]');
    const pendingUsers = JSON.parse(localStorage.getItem('portfolio_pending_users') || '[]');
    
    if (users.some(u => u.email === email) || pendingUsers.some(u => u.email === email)) {
        showNotification('Email already registered. Please use a different email or login.', 'error');
        return;
    }
    
    // Create new user (pending approval)
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        password: password,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Add to pending users
    pendingUsers.push(newUser);
    localStorage.setItem('portfolio_pending_users', JSON.stringify(pendingUsers));
    
    // Show success message
    showNotification('Account created successfully! Your account is pending approval by admin. You will be able to login once approved.', 'success');
    
    // Reset form and close modal
    document.getElementById('userSignupForm').reset();
    closeModal('signupModal');
    
    // Notify admin (in real app, this would be an API call)
    notifyAdminNewUser(newUser);
}

function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userInitials = document.getElementById('userInitials');
    const userAvatar = document.getElementById('userAvatar');
    
    if (currentUser) {
        // User is logged in
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
        if (userName) userName.textContent = currentUser.name;
        if (userEmail) userEmail.textContent = currentUser.email;
        
        // Set user initials
        if (userInitials && currentUser.name) {
            const initials = currentUser.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase();
            userInitials.textContent = initials.substring(0, 2);
        }
        
        // Update avatar with first letter
        if (userAvatar && currentUser.name) {
            const firstLetter = currentUser.name.charAt(0).toUpperCase();
            userAvatar.textContent = firstLetter;
        }
    } else {
        // User is not logged in
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }
}

function logout() {
    // Clear session
    currentUser = null;
    localStorage.removeItem('portfolio_user_session');
    sessionStorage.removeItem('portfolio_user_session');
    
    // Update UI
    updateAuthUI();
    
    // Show logout message
    showNotification('Logged out successfully', 'success');
}

function checkPasswordStrength(password) {
    const strengthBar = document.getElementById('passwordStrength');
    if (!strengthBar) return;
    
    let strength = 0;
    let color = '#e74c3c'; // Red
    
    // Check length
    if (password.length >= 8) strength += 25;
    
    // Check for lowercase
    if (/[a-z]/.test(password)) strength += 25;
    
    // Check for uppercase
    if (/[A-Z]/.test(password)) strength += 25;
    
    // Check for numbers
    if (/[0-9]/.test(password)) strength += 25;
    
    // Update strength bar
    strengthBar.style.width = strength + '%';
    
    // Update color based on strength
    if (strength < 50) {
        color = '#e74c3c'; // Red
    } else if (strength < 75) {
        color = '#f39c12'; // Orange
    } else {
        color = '#2ecc71'; // Green
    }
    
    strengthBar.style.backgroundColor = color;
}

// Projects Functions
async function loadProjects() {
    try {
        const response = await fetch('project.json');
        if (!response.ok) throw new Error('Failed to load projects');
        
        const data = await response.json();
        projects = data.projects || [];
        categories = data.categories || ['All'];
        
        // Display categories
        displayCategories();
        
        // Display projects
        displayProjects(projects);
        
        // Setup search
        setupProjectSearch();
        
    } catch (error) {
        console.error('Error loading projects:', error);
        showNotification('Failed to load research projects. Please try again later.', 'error');
        
        // Show loading error
        const loading = document.getElementById('loading');
        if (loading) {
            loading.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error Loading Research</h3>
                    <p>${error.message}</p>
                    <button onclick="loadProjects()" class="btn btn-primary">
                        <i class="fas fa-redo"></i> Try Again
                    </button>
                </div>
            `;
        }
    }
}

function displayCategories() {
    const categoryFilters = document.getElementById('categoryFilters');
    if (!categoryFilters) return;
    
    let categoriesHTML = '';
    
    categories.forEach(category => {
        const isActive = category === currentCategory ? 'active' : '';
        categoriesHTML += `
            <button class="category-btn ${isActive}" onclick="filterByCategory('${category}')">
                ${category}
            </button>
        `;
    });
    
    categoryFilters.innerHTML = categoriesHTML;
}

function filterByCategory(category) {
    currentCategory = category;
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === category) {
            btn.classList.add('active');
        }
    });
    
    // Filter projects
    let filtered = projects;
    if (category !== 'All') {
        filtered = projects.filter(project => project.category === category);
    }
    
    // Apply search filter if any
    const searchInput = document.getElementById('projectSearch');
    if (searchInput && searchInput.value.trim()) {
        filtered = filterProjectsBySearch(filtered, searchInput.value.trim());
    }
    
    displayProjects(filtered);
}

function setupProjectSearch() {
    const searchInput = document.getElementById('projectSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();
        filterProjects(searchTerm);
    });
}

function filterProjects(searchTerm) {
    let filtered = projects;
    
    // Apply category filter
    if (currentCategory !== 'All') {
        filtered = filtered.filter(project => project.category === currentCategory);
    }
    
    // Apply search filter
    if (searchTerm) {
        filtered = filterProjectsBySearch(filtered, searchTerm);
    }
    
    displayProjects(filtered);
}

function filterProjectsBySearch(projectsList, searchTerm) {
    return projectsList.filter(project => {
        const searchInTitle = project.title.toLowerCase().includes(searchTerm);
        const searchInDesc = project.description.toLowerCase().includes(searchTerm);
        const searchInTech = project.technologies.some(tech => 
            tech.toLowerCase().includes(searchTerm)
        );
        const searchInCategory = project.category.toLowerCase().includes(searchTerm);
        
        return searchInTitle || searchInDesc || searchInTech || searchInCategory;
    });
}

function displayProjects(projectsList) {
    const projectsGrid = document.getElementById('projectsGrid');
    const loading = document.getElementById('loading');
    const noResults = document.getElementById('noResults');
    
    if (!projectsGrid) return;
    
    // Hide loading
    if (loading) loading.style.display = 'none';
    
    // Check if there are results
    if (projectsList.length === 0) {
        projectsGrid.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }
    
    // Hide no results message
    if (noResults) noResults.style.display = 'none';
    
    // Create projects HTML
    let projectsHTML = '';
    
    projectsList.forEach(project => {
        projectsHTML += createProjectCard(project);
    });
    
    projectsGrid.innerHTML = projectsHTML;
    
    // Add click event to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', function() {
            const projectId = this.dataset.id;
            openProjectModal(projectId);
        });
    });
}

function createProjectCard(project) {
    const statusClass = project.status ? project.status.toLowerCase().replace(' ', '-') : 'completed';
    const statusText = project.status || 'Completed';
    
    return `
        <div class="project-card" data-id="${project.id}">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <div class="project-status ${statusClass}">
                    ${statusText}
                </div>
            </div>
            <div class="project-content">
                <div class="project-category">${project.category}</div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-technologies">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-actions">
                    <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); openProjectModal(${project.id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            </div>
        </div>
    `;
}

function openProjectModal(projectId) {
    const project = projects.find(p => p.id == projectId);
    if (!project) return;
    
    const modalBody = document.getElementById('projectModalBody');
    const statusClass = project.status ? project.status.toLowerCase().replace(' ', '-') : 'completed';
    
    modalBody.innerHTML = `
        <div class="project-modal-content">
            <div class="project-modal-header">
                <div class="project-modal-category">${project.category}</div>
                <h2>${project.title}</h2>
                <div class="project-modal-meta">
                    <span><i class="fas fa-calendar"></i> ${project.year}</span>
                    <span class="project-modal-status ${statusClass}">
                        <i class="fas fa-circle"></i> ${project.status || 'Completed'}
                    </span>
                </div>
            </div>
            
            <div class="project-modal-image">
                <img src="${project.image}" alt="${project.title}">
            </div>
            
            <div class="project-modal-details">
                <div class="project-modal-section">
                    <h3><i class="fas fa-info-circle"></i> Research Description</h3>
                    <p>${project.description}</p>
                </div>
                
                <div class="project-modal-section">
                    <h3><i class="fas fa-flask"></i> Techniques Used</h3>
                    <div class="project-modal-tech">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
                
                <div class="project-modal-section">
                    <h3><i class="fas fa-star"></i> Key Features</h3>
                    <ul class="project-modal-features">
                        ${project.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                    </ul>
                </div>
                
                ${project.challenges ? `
                    <div class="project-modal-section">
                        <h3><i class="fas fa-exclamation-triangle"></i> Challenges & Solutions</h3>
                        <p>${project.challenges}</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .project-modal-content {
            padding: 20px;
        }
        .project-modal-header {
            margin-bottom: 2rem;
        }
        .project-modal-category {
            color: var(--primary-color);
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
        }
        .project-modal-header h2 {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: var(--dark-color);
        }
        .project-modal-meta {
            display: flex;
            gap: 1.5rem;
            color: var(--text-light);
            font-size: 0.9rem;
        }
        .project-modal-status {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .project-modal-status.completed {
            color: var(--success-color);
        }
        .project-modal-status.in-progress {
            color: var(--warning-color);
        }
        .project-modal-image {
            margin-bottom: 2rem;
        }
        .project-modal-image img {
            width: 100%;
            border-radius: var(--radius);
            max-height: 400px;
            object-fit: cover;
        }
        .project-modal-section {
            margin-bottom: 2rem;
        }
        .project-modal-section h3 {
            font-size: 1.25rem;
            margin-bottom: 1rem;
            color: var(--dark-color);
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .project-modal-tech {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        .project-modal-features {
            list-style: none;
            padding-left: 0;
        }
        .project-modal-features li {
            margin-bottom: 0.5rem;
            padding-left: 1.5rem;
            position: relative;
        }
        .project-modal-features li:before {
            content: "✓";
            color: var(--success-color);
            position: absolute;
            left: 0;
            font-weight: bold;
        }
    `;
    
    // Remove existing style if any
    const existingStyle = document.querySelector('#projectModalStyle');
    if (existingStyle) existingStyle.remove();
    
    style.id = 'projectModalStyle';
    document.head.appendChild(style);
    
    // Show modal
    showModal('projectModal');
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmailInput').value.trim();
        const subject = document.getElementById('contactSubject').value.trim();
        const message = document.getElementById('contactMessage').value.trim();
        
        // Validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill all fields', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Save message to localStorage (in real app, this would be API call)
        const messages = JSON.parse(localStorage.getItem('portfolio_contact_messages') || '[]');
        messages.push({
            id: Date.now(),
            name: name,
            email: email,
            subject: subject,
            message: message,
            date: new Date().toISOString(),
            read: false
        });
        
        localStorage.setItem('portfolio_contact_messages', JSON.stringify(messages));
        
        // Simulate API delay
        setTimeout(() => {
            showNotification('Message sent successfully! I will get back to you soon.', 'success');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Newsletter
function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!email || !validateEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Save subscription
        const subscriptions = JSON.parse(localStorage.getItem('portfolio_newsletter_subscriptions') || '[]');
        
        if (subscriptions.some(sub => sub.email === email)) {
            showNotification('You are already subscribed to our newsletter!', 'info');
        } else {
            subscriptions.push({
                email: email,
                date: new Date().toISOString()
            });
            
            localStorage.setItem('portfolio_newsletter_subscriptions', JSON.stringify(subscriptions));
            showNotification('Thank you for subscribing to research updates!', 'success');
        }
        
        emailInput.value = '';
    });
}

// Back to Top
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Modal Functions
function initModals() {
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

function showLoginModal() {
    showModal('loginModal');
}

function showSignupModal() {
    showModal('signupModal');
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Close button
    const closeBtn = notification.querySelector('.close-notification');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// Utility Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function notifyAdminNewUser(user) {
    // In a real application, this would send an email or notification to admin
    console.log('New user registration:', user);
    
    // For demo, we'll just log it
    const adminNotifications = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
    adminNotifications.push({
        type: 'new_user',
        user: user,
        date: new Date().toISOString(),
        read: false
    });
    localStorage.setItem('admin_notifications', JSON.stringify(adminNotifications));
}

function loadUserData() {
    // Load user data from localStorage or use defaults
    const userData = JSON.parse(localStorage.getItem('portfolio_user_data')) || {
        fullName: 'Ashish Pratap',
        email: 'opashishytff@gmail.com',
        phone: '+91 84180 78994',
        location: 'New Delhi, India',
        education: 'B.sc Microbiology',
        experience: '2 Years Research'
    };
    
    // Update UI with user data
    document.getElementById('userFullName').textContent = userData.fullName;
    document.getElementById('userEmailId').textContent = userData.email;
    document.getElementById('userPhone').textContent = userData.phone;
    document.getElementById('userLocation').textContent = userData.location;
    document.getElementById('userEducation').textContent = userData.education;
    document.getElementById('userExperience').textContent = userData.experience;
    document.getElementById('contactEmail').textContent = userData.email;
    document.getElementById('contactPhone').textContent = userData.phone;
    document.getElementById('contactLocation').textContent = userData.location;
}

// Make functions available globally
window.showLoginModal = showLoginModal;
window.showSignupModal = showSignupModal;
window.closeModal = closeModal;
window.logout = logout;
window.filterByCategory = filterByCategory;
window.openProjectModal = openProjectModal;