// ===== Microbiology Research Lab - Complete JavaScript =====
// ===== All Features in One File =====

// ===== Configuration =====
const CONFIG = {
    // Lab Information
    LAB_NAME: 'Microbiology Research Lab',
    LAB_EMAIL: 'opashishytff@gmail.com',
    LAB_PHONE: '8418078994',
    LAB_ADDRESS: 'Research Building, Science Complex, University Campus, Delhi, India',
    
    // Admin Credentials
    ADMIN: {
        USERNAME: 'opashishyt',
        PASSWORD: 'Ashish@2006',
        SESSION_KEY: 'microbiology_lab_admin_session'
    },
    
    // API Endpoints
    PROJECTS_JSON: 'projects.json',
    TEAM_JSON: 'team.json',
    EQUIPMENT_JSON: 'equipment.json',
    
    // Features
    FEATURES: {
        DARK_MODE: true,
        NOTIFICATIONS: true,
        VIRTUAL_TOUR: true,
        SIMULATIONS: true,
        PWA: true
    },
    
    // Default Notifications
    DEFAULT_NOTIFICATIONS: [
        {
            id: 1,
            title: 'Welcome to Microbiology Lab',
            message: 'Explore our advanced research facilities and latest projects',
            time: 'Just now',
            read: false,
            type: 'info'
        },
        {
            id: 2,
            title: 'New Research Published',
            message: 'Antibiotic Resistance paper accepted in Journal of Medical Microbiology',
            time: '2 hours ago',
            read: false,
            type: 'success'
        },
        {
            id: 3,
            title: 'Lab Maintenance Scheduled',
            message: 'BSL-2 lab maintenance scheduled for tomorrow 10 AM - 2 PM',
            time: '1 day ago',
            read: false,
            type: 'warning'
        }
    ]
};

// ===== State Management =====
let state = {
    // Theme
    theme: localStorage.getItem('lab_theme') || 'light',
    
    // Data
    projects: [],
    filteredProjects: [],
    currentFilter: 'all',
    
    // Notifications
    notifications: JSON.parse(localStorage.getItem('lab_notifications')) || CONFIG.DEFAULT_NOTIFICATIONS,
    
    // UI State
    isLoading: false,
    isSearchOpen: false,
    isNotificationsOpen: false,
    isMobileMenuOpen: false
};

// ===== DOM Elements =====
const elements = {
    // Theme
    themeToggle: document.getElementById('themeToggle'),
    htmlElement: document.documentElement,
    
    // Navigation
    menuToggle: document.getElementById('menuToggle'),
    navLinks: document.querySelector('.nav-links'),
    
    // Search
    searchToggle: document.getElementById('searchToggle'),
    searchOverlay: document.getElementById('searchOverlay'),
    searchInput: document.getElementById('searchInput'),
    searchClose: document.getElementById('searchClose'),
    searchResults: document.getElementById('searchResults'),
    
    // Notifications
    notificationBtn: document.getElementById('notificationBtn'),
    notificationsPanel: document.getElementById('notificationsPanel'),
    notificationsList: document.getElementById('notificationsList'),
    markAllRead: document.getElementById('markAllRead'),
    notificationCount: document.querySelector('.notification-count'),
    
    // Research Projects
    projectsContainer: document.getElementById('projectsContainer'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    
    // Contact Form
    contactForm: document.getElementById('contactForm'),
    
    // Back to Top
    backToTop: document.getElementById('backToTop'),
    
    // Modals
    dashboardModal: document.getElementById('dashboardModal'),
    dataModal: document.getElementById('dataModal')
};

// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Initialize theme
        initTheme();
        
        // Load data
        await loadData();
        
        // Initialize UI components
        initComponents();
        
        // Initialize event listeners
        initEventListeners();
        
        // Initialize PWA
        initPWA();
        
        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loadingScreen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loadingScreen').style.display = 'none';
            }, 500);
        }, 1000);
        
        console.log('Microbiology Research Lab initialized successfully');
        
    } catch (error) {
        console.error('Initialization error:', error);
        showError('Failed to initialize website. Please refresh the page.');
    }
});

// ===== Theme Management =====
function initTheme() {
    // Set initial theme
    elements.htmlElement.setAttribute('data-theme', state.theme);
    
    // Update toggle button
    updateThemeToggle();
    
    // Initialize particles
    initParticles();
}

function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    elements.htmlElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('lab_theme', state.theme);
    updateThemeToggle();
    
    // Reinitialize particles for new theme
    initParticles();
}

function updateThemeToggle() {
    if (!elements.themeToggle) return;
    
    const sunIcon = elements.themeToggle.querySelector('.fa-sun');
    const moonIcon = elements.themeToggle.querySelector('.fa-moon');
    
    if (state.theme === 'light') {
        sunIcon.style.opacity = '1';
        moonIcon.style.opacity = '0';
    } else {
        sunIcon.style.opacity = '0';
        moonIcon.style.opacity = '1';
    }
}

// ===== Particles Background =====
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    // Clear existing particles
    particlesContainer.innerHTML = '';
    
    // Create canvas for particles
    const canvas = document.createElement('canvas');
    canvas.id = 'particlesCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    
    particlesContainer.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 100;
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 1 - 0.5,
            speedY: Math.random() * 1 - 0.5,
            color: state.theme === 'dark' ? '#4CAF50' : '#2E7D32'
        });
    }
    
    // Animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            
            // Draw connections
            particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(76, 175, 80, ${0.2 * (1 - distance/100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ===== Data Loading =====
async function loadData() {
    try {
        showLoading(true);
        
        // Load projects
        const projectsResponse = await fetch(CONFIG.PROJECTS_JSON);
        state.projects = await projectsResponse.json();
        state.filteredProjects = [...state.projects];
        
        // Display projects
        displayProjects();
        
        // Load team (optional)
        try {
            const teamResponse = await fetch(CONFIG.TEAM_JSON);
            const teamData = await teamResponse.json();
            // Team data can be used for search functionality
        } catch (error) {
            console.log('Team data not available');
        }
        
        // Update notification count
        updateNotificationCount();
        
    } catch (error) {
        console.error('Error loading data:', error);
        
        // Fallback data
        state.projects = getSampleProjects();
        state.filteredProjects = [...state.projects];
        displayProjects();
        
        showError('Using sample data. Could not load project data.');
        
    } finally {
        showLoading(false);
    }
}

// ===== Research Projects =====
function displayProjects() {
    if (!elements.projectsContainer) return;
    
    const projectsToShow = state.filteredProjects;
    
    if (projectsToShow.length === 0) {
        elements.projectsContainer.innerHTML = `
            <div class="no-projects">
                <i class="fas fa-flask fa-3x"></i>
                <h3>No Research Projects Found</h3>
                <p>No projects available in this category.</p>
                <button class="btn secondary-btn" onclick="resetFilters()">
                    <i class="fas fa-redo"></i> Show All Projects
                </button>
            </div>
        `;
        return;
    }
    
    elements.projectsContainer.innerHTML = projectsToShow.map(project => `
        <div class="project-card" data-category="${project.category}">
            <div class="project-image">
                <img src="${project.image}" alt="${escapeHtml(project.title)}" loading="lazy">
                <div class="project-badge ${project.status}">
                    ${project.status === 'completed' ? 'Completed' : 'Ongoing'}
                </div>
            </div>
            <div class="project-info">
                <h3>${escapeHtml(project.title)}</h3>
                <div class="project-tags">
                    ${(project.tags || []).map(tag => 
                        `<span class="project-tag">${escapeHtml(tag)}</span>`
                    ).join('')}
                </div>
                <p class="project-description">${escapeHtml(project.shortDescription)}</p>
                <div class="project-meta">
                    <span><i class="fas fa-user"></i> ${escapeHtml(project.principal_investigator || 'Lab Team')}</span>
                    <span><i class="fas fa-calendar"></i> ${project.start_date} - ${project.end_date}</span>
                </div>
                <button class="btn secondary-btn view-details-btn" onclick="viewProjectDetails(${project.id})" style="margin-top: 1rem; width: 100%;">
                    <i class="fas fa-info-circle"></i> View Details
                </button>
            </div>
        </div>
    `).join('');
}

function filterProjects(filter) {
    state.currentFilter = filter;
    
    if (filter === 'all') {
        state.filteredProjects = [...state.projects];
    } else {
        state.filteredProjects = state.projects.filter(
            project => project.category === filter
        );
    }
    
    // Update active filter button
    updateActiveFilterButton(filter);
    
    // Display filtered projects
    displayProjects();
    
    // Scroll to projects section if not visible
    if (!isElementInViewport(document.getElementById('research'))) {
        document.getElementById('research').scrollIntoView({ behavior: 'smooth' });
    }
}

function resetFilters() {
    filterProjects('all');
}

function updateActiveFilterButton(activeFilter) {
    elements.filterButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-filter') === activeFilter) {
            button.classList.add('active');
        }
    });
}

// ===== Project Details Modal =====
function viewProjectDetails(projectId) {
    const project = state.projects.find(p => p.id === projectId);
    
    if (!project) {
        showError('Project not found');
        return;
    }
    
    // Create modal HTML
    const modalHtml = `
        <div class="modal-overlay active" id="projectModal">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal('projectModal')" aria-label="Close modal">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-header">
                    <h2>${escapeHtml(project.title)}</h2>
                    <div class="modal-subtitle">
                        <span class="project-status ${project.status}">${project.status === 'completed' ? 'Completed' : 'Ongoing'}</span>
                        <span class="project-category">${project.category}</span>
                    </div>
                </div>
                <div class="modal-body">
                    <div class="modal-image">
                        <img src="${project.image}" alt="${escapeHtml(project.title)}">
                    </div>
                    <div class="modal-details">
                        <h3>Project Description</h3>
                        <p>${escapeHtml(project.fullDescription)}</p>
                        
                        <h3>Project Details</h3>
                        <ul>
                            ${(project.details || []).map(detail => 
                                `<li><i class="fas fa-check"></i> ${escapeHtml(detail)}</li>`
                            ).join('')}
                        </ul>
                        
                        <div class="project-info-grid">
                            <div class="info-item">
                                <strong><i class="fas fa-user"></i> Principal Investigator:</strong>
                                <span>${escapeHtml(project.principal_investigator || 'Lab Team')}</span>
                            </div>
                            <div class="info-item">
                                <strong><i class="fas fa-calendar"></i> Start Date:</strong>
                                <span>${project.start_date || 'Not specified'}</span>
                            </div>
                            <div class="info-item">
                                <strong><i class="fas fa-calendar"></i> End Date:</strong>
                                <span>${project.end_date || 'Ongoing'}</span>
                            </div>
                            <div class="info-item">
                                <strong><i class="fas fa-money-bill"></i> Funding Source:</strong>
                                <span>${escapeHtml(project.funding_source || 'Not specified')}</span>
                            </div>
                        </div>
                        
                        <div class="modal-tags">
                            ${(project.tags || []).map(tag => 
                                `<span class="modal-tag">${escapeHtml(tag)}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn primary-btn" onclick="closeModal('projectModal')">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// ===== Notifications System =====
function initNotifications() {
    updateNotificationsList();
    updateNotificationCount();
}

function updateNotificationsList() {
    if (!elements.notificationsList) return;
    
    elements.notificationsList.innerHTML = state.notifications.map(notification => `
        <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
            <div class="notification-icon ${notification.type}">
                <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="notification-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <span class="notification-time">${notification.time}</span>
            </div>
            <button class="notification-mark-read" onclick="markNotificationAsRead(${notification.id})">
                <i class="fas fa-check"></i>
            </button>
        </div>
    `).join('');
}

function getNotificationIcon(type) {
    const icons = {
        'info': 'info-circle',
        'success': 'check-circle',
        'warning': 'exclamation-triangle',
        'danger': 'exclamation-circle'
    };
    return icons[type] || 'bell';
}

function markNotificationAsRead(id) {
    const notification = state.notifications.find(n => n.id === id);
    if (notification) {
        notification.read = true;
        saveNotifications();
        updateNotificationsList();
        updateNotificationCount();
    }
}

function markAllNotificationsAsRead() {
    state.notifications.forEach(n => n.read = true);
    saveNotifications();
    updateNotificationsList();
    updateNotificationCount();
}

function updateNotificationCount() {
    const unreadCount = state.notifications.filter(n => !n.read).length;
    
    if (elements.notificationCount) {
        elements.notificationCount.textContent = unreadCount;
        elements.notificationCount.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

function saveNotifications() {
    localStorage.setItem('lab_notifications', JSON.stringify(state.notifications));
}

// ===== Search Functionality =====
function initSearch() {
    if (!elements.searchInput) return;
    
    elements.searchInput.addEventListener('input', debounce((e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 2) {
            elements.searchResults.innerHTML = '';
            return;
        }
        
        const results = searchData(query);
        displaySearchResults(results);
    }, 300));
}

function searchData(query) {
    const results = {
        projects: [],
        team: [],
        publications: []
    };
    
    // Search in projects
    results.projects = state.projects.filter(project => 
        project.title.toLowerCase().includes(query) ||
        project.shortDescription.toLowerCase().includes(query) ||
        (project.tags || []).some(tag => tag.toLowerCase().includes(query)) ||
        (project.principal_investigator || '').toLowerCase().includes(query)
    );
    
    return results;
}

function displaySearchResults(results) {
    if (!elements.searchResults) return;
    
    let html = '';
    
    if (results.projects.length > 0) {
        html += `<div class="search-category">
            <h4><i class="fas fa-flask"></i> Research Projects</h4>`;
        results.projects.forEach(project => {
            html += `<a href="#project-${project.id}" class="search-result" onclick="viewProjectDetails(${project.id}); closeSearch();">
                <span>${project.title}</span>
                <small>${project.principal_investigator}</small>
            </a>`;
        });
        html += `</div>`;
    }
    
    elements.searchResults.innerHTML = html || '<div class="no-results">No results found</div>';
}

// ===== UI Controls =====
function toggleSearch() {
    state.isSearchOpen = !state.isSearchOpen;
    
    if (elements.searchOverlay) {
        if (state.isSearchOpen) {
            elements.searchOverlay.classList.add('active');
            elements.searchInput.focus();
        } else {
            elements.searchOverlay.classList.remove('active');
            elements.searchInput.value = '';
            elements.searchResults.innerHTML = '';
        }
    }
}

function closeSearch() {
    state.isSearchOpen = false;
    if (elements.searchOverlay) {
        elements.searchOverlay.classList.remove('active');
        elements.searchInput.value = '';
        elements.searchResults.innerHTML = '';
    }
}

function toggleNotifications() {
    state.isNotificationsOpen = !state.isNotificationsOpen;
    
    if (elements.notificationsPanel) {
        if (state.isNotificationsOpen) {
            elements.notificationsPanel.classList.add('active');
        } else {
            elements.notificationsPanel.classList.remove('active');
        }
    }
}

function closeNotifications() {
    state.isNotificationsOpen = false;
    if (elements.notificationsPanel) {
        elements.notificationsPanel.classList.remove('active');
    }
}

function toggleMobileMenu() {
    state.isMobileMenuOpen = !state.isMobileMenuOpen;
    
    if (elements.navLinks && elements.menuToggle) {
        elements.navLinks.classList.toggle('active');
        elements.menuToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = state.isMobileMenuOpen ? 'hidden' : '';
    }
}

function closeMobileMenu() {
    state.isMobileMenuOpen = false;
    
    if (elements.navLinks && elements.menuToggle) {
        elements.navLinks.classList.remove('active');
        elements.menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== Contact Form =====
function initContactForm() {
    if (!elements.contactForm) return;
    
    elements.contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const formDataObj = Object.fromEntries(formData.entries());
        
        // Validate form
        if (!validateContactForm(formDataObj)) {
            return;
        }
        
        try {
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            
            // Simulate form submission
            await simulateFormSubmission(formDataObj);
            
            // Show success message
            showSuccess('Thank you for your message! We will contact you soon.');
            
            // Reset form
            form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            showError('Failed to send message. Please try again.');
            
        } finally {
            // Restore button state
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            submitButton.disabled = false;
        }
    });
}

function validateContactForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.subject || data.subject.trim().length < 5) {
        errors.push('Subject must be at least 5 characters long');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    if (errors.length > 0) {
        showError(errors.join('<br>'));
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Log form data to console
            console.log('Form submitted:', {
                ...data,
                timestamp: new Date().toISOString(),
                lab: CONFIG.LAB_NAME
            });
            
            // Simulate 10% chance of failure for demo
            if (Math.random() < 0.1) {
                reject(new Error('Simulated server error'));
            } else {
                resolve();
            }
        }, 1500);
    });
}

// ===== Dashboard Features =====
function openLiveDashboard() {
    if (elements.dashboardModal) {
        elements.dashboardModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeDashboard() {
    if (elements.dashboardModal) {
        elements.dashboardModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function openDataPortal() {
    if (elements.dataModal) {
        elements.dataModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeDataPortal() {
    if (elements.dataModal) {
        elements.dataModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== PWA Features =====
function initPWA() {
    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(() => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed:', err));
    }
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    // Handle offline/online events
    window.addEventListener('online', () => {
        showSuccess('You are back online');
    });
    
    window.addEventListener('offline', () => {
        showWarning('You are offline. Some features may be limited.');
    });
}

// ===== Event Listeners =====
function initEventListeners() {
    // Theme toggle
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Search controls
    if (elements.searchToggle) {
        elements.searchToggle.addEventListener('click', toggleSearch);
    }
    
    if (elements.searchClose) {
        elements.searchClose.addEventListener('click', closeSearch);
    }
    
    // Notifications controls
    if (elements.notificationBtn) {
        elements.notificationBtn.addEventListener('click', toggleNotifications);
    }
    
    if (elements.markAllRead) {
        elements.markAllRead.addEventListener('click', markAllNotificationsAsRead);
    }
    
    // Mobile menu
    if (elements.menuToggle) {
        elements.menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
        // Close search if clicking outside
        if (state.isSearchOpen && 
            !e.target.closest('.search-container') && 
            !e.target.closest('.search-toggle')) {
            closeSearch();
        }
        
        // Close notifications if clicking outside
        if (state.isNotificationsOpen && 
            !e.target.closest('.notifications-panel') && 
            !e.target.closest('.notification-btn')) {
            closeNotifications();
        }
        
        // Close mobile menu if clicking outside
        if (state.isMobileMenuOpen && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.menu-toggle')) {
            closeMobileMenu();
        }
    });
    
    // Filter buttons
    if (elements.filterButtons) {
        elements.filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                filterProjects(filter);
            });
        });
    }
    
    // Back to top button
    if (elements.backToTop) {
        elements.backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Initialize search
    initSearch();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize notifications
    initNotifications();
}

function handleScroll() {
    // Show/hide back to top button
    if (elements.backToTop) {
        if (window.scrollY > 300) {
            elements.backToTop.classList.add('visible');
        } else {
            elements.backToTop.classList.remove('visible');
        }
    }
    
    // Update active nav link
    updateActiveNavLink();
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

function handleKeyboardShortcuts(e) {
    // Escape key closes modals and menus
    if (e.key === 'Escape') {
        closeSearch();
        closeNotifications();
        closeMobileMenu();
        closeDashboard();
        closeDataPortal();
        closeModal('projectModal');
    }
    
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
    }
    
    // Ctrl/Cmd + / for focus search
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        elements.searchInput?.focus();
    }
}

// ===== Utility Functions =====
function showLoading(show) {
    state.isLoading = show;
    
    const loadingSpinner = document.querySelector('.loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.style.display = show ? 'flex' : 'none';
    }
    
    // Disable filter buttons while loading
    if (elements.filterButtons) {
        elements.filterButtons.forEach(button => {
            button.disabled = show;
        });
    }
}

function showSuccess(message) {
    showAlert(message, 'success');
}

function showError(message) {
    showAlert(message, 'error');
}

function showWarning(message) {
    showAlert(message, 'warning');
}

function showAlert(message, type) {
    // Remove existing alerts
    removeExistingAlerts();
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="alert-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(alert);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

function removeExistingAlerts() {
    document.querySelectorAll('.alert').forEach(alert => alert.remove());
}

function isElementInViewport(element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== Sample Data (Fallback) =====
function getSampleProjects() {
    return [
        {
            id: 1,
            title: "Antibiotic Resistance in Clinical Settings",
            shortDescription: "Comprehensive study of multi-drug resistant bacteria in hospital environments",
            fullDescription: "This extensive research focuses on identifying, characterizing, and understanding antibiotic-resistant bacterial strains in various hospital settings. We employ advanced genomic techniques to study resistance mechanisms and develop novel detection methods for early identification of resistant pathogens.",
            image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?ixlib=rb-4.0.3&auto=format&fit=crop&w=1032&q=80",
            tags: ["Antibiotic Resistance", "Clinical Microbiology", "Genomics", "Pathogen Research"],
            category: "ongoing",
            details: [
                "Systematic sample collection from ICU and surgical wards",
                "Isolation and identification of resistant bacterial strains",
                "Whole genome sequencing of resistant isolates",
                "Analysis of resistance genes and mobile genetic elements",
                "Development of rapid PCR-based detection assays"
            ],
            status: "active",
            start_date: "2023-01-15",
            end_date: "2024-12-31",
            principal_investigator: "Dr. Sarah Chen",
            funding_source: "National Institute of Health"
        },
        {
            id: 2,
            title: "Soil Microbial Ecology in Agriculture",
            shortDescription: "Analysis of microbial community dynamics in agricultural ecosystems",
            fullDescription: "This project investigates the diversity and function of microbial communities in different agricultural soil types. We study how microbial communities respond to various farming practices and their role in maintaining soil health and plant productivity.",
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1174&q=80",
            tags: ["Soil Microbiology", "Agriculture", "Microbial Ecology", "Sustainable Farming"],
            category: "completed",
            details: [
                "Soil sampling from organic and conventional farms",
                "Metagenomic sequencing of soil samples",
                "Functional gene analysis for nutrient cycling",
                "Microbial community structure analysis",
                "Correlation with soil chemical properties"
            ],
            status: "completed",
            start_date: "2022-03-01",
            end_date: "2023-02-28",
            principal_investigator: "Dr. Maria Rodriguez",
            funding_source: "Agricultural Research Council"
        },
        {
            id: 3,
            title: "Viral Pathogenesis Mechanisms",
            shortDescription: "Study of molecular mechanisms underlying viral infection and pathogenesis",
            fullDescription: "This research examines the molecular mechanisms of viral infection, focusing on respiratory viruses. We investigate virus-host interactions, immune evasion strategies, and develop potential therapeutic interventions.",
            image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1025&q=80",
            tags: ["Virology", "Pathogenesis", "Immunology", "Molecular Biology"],
            category: "ongoing",
            details: [
                "Virus isolation and propagation in cell culture",
                "Gene expression analysis during infection",
                "Host immune response profiling",
                "Drug screening for antiviral compounds",
                "Animal model development"
            ],
            status: "active",
            start_date: "2023-03-15",
            end_date: "2025-06-30",
            principal_investigator: "Dr. James Wilson",
            funding_source: "National Science Foundation"
        }
    ];
}

// ===== Initialize Components =====
function initComponents() {
    // Initialize all UI components
    initSearch();
    initNotifications();
    initContactForm();
}

// ===== Global Functions =====
// Make functions available globally
window.toggleTheme = toggleTheme;
window.filterProjects = filterProjects;
window.resetFilters = resetFilters;
window.viewProjectDetails = viewProjectDetails;
window.closeModal = closeModal;
window.markNotificationAsRead = markNotificationAsRead;
window.markAllNotificationsAsRead = markAllNotificationsAsRead;
window.openLiveDashboard = openLiveDashboard;
window.closeDashboard = closeDashboard;
window.openDataPortal = openDataPortal;
window.closeDataPortal = closeDataPortal;