// assets/js/script.js (Updated with Firebase)

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (menuBtn) {
                        menuBtn.querySelector('i').classList.remove('fa-times');
                        menuBtn.querySelector('i').classList.add('fa-bars');
                    }
                }
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const menuBtn = document.getElementById('menuBtn');
        const navLinks = document.getElementById('navLinks');
        
        if (menuBtn && navLinks && navLinks.classList.contains('active')) {
            if (!menuBtn.contains(event.target) && !navLinks.contains(event.target)) {
                navLinks.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
});

// Utility functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num;
}

// Get URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const paramsObj = {};
    
    for (const [key, value] of params) {
        paramsObj[key] = value;
    }
    
    return paramsObj;
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Load apps from Firebase or localStorage
async function loadAppsData() {
    try {
        // Check if Firebase is available
        if (typeof FirebaseApp !== 'undefined') {
            const apps = await FirebaseApp.getAllApps();
            if (apps.length > 0) {
                return apps;
            }
        }
        
        // Fallback to localStorage
        const customApps = localStorage.getItem('user_apps');
        if (customApps) {
            return JSON.parse(customApps);
        }
        
        // Fallback to default apps
        return window.appsData || [];
        
    } catch (error) {
        console.error('Error loading apps:', error);
        
        // Return cached data
        const cachedApps = localStorage.getItem('cached_apps');
        if (cachedApps) {
            return JSON.parse(cachedApps);
        }
        
        return window.appsData || [];
    }
}

// Make functions available globally
window.formatNumber = formatNumber;
window.getUrlParams = getUrlParams;
window.formatFileSize = formatFileSize;
window.loadAppsData = loadAppsData;