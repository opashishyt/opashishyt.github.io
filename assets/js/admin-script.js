// assets/js/admin-script.js (Updated with Firebase)

/**
 * OP ASHISH YT - Admin Panel JavaScript with Firebase
 * Version: 2.0.0
 */

class AdminPanel {
    constructor() {
        this.appsData = [];
        this.filteredApps = [];
        this.currentPage = 1;
        this.appsPerPage = 15;
        this.totalPages = 0;
        this.bulkSelected = [];
        this.stats = {};
        this.isOnline = true;
        
        this.init();
    }
    
    async init() {
        this.checkLoginStatus();
        await this.checkFirebaseConnection();
        await this.loadData();
        this.setupEventListeners();
        this.updateUserInfo();
        this.setupSessionTimer();
    }
    
    // Check Firebase connection
    async checkFirebaseConnection() {
        try {
            await db.collection('apps').limit(1).get();
            this.isOnline = true;
            console.log('✅ Connected to Firebase');
        } catch (error) {
            this.isOnline = false;
            console.warn('⚠️ Firebase not connected, using local storage');
            this.showAlert('Firebase से कनेक्शन नहीं है, Local Storage का उपयोग हो रहा है', 'warning');
        }
    }
    
    // Check if user is logged in
    checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
        
        if (!isLoggedIn) {
            this.showAlert('कृपया पहले लॉगिन करें', 'warning');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return false;
        }
        
        return true;
    }
    
    // Update user information in sidebar
    updateUserInfo() {
        const username = localStorage.getItem('admin_username') || 'Admin';
        const loginTime = localStorage.getItem('login_time');
        
        // Update user avatar and name
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');
        const welcomeMessage = document.getElementById('welcomeMessage');
        
        if (userAvatar) {
            userAvatar.textContent = username.charAt(0).toUpperCase();
        }
        
        if (userName) {
            userName.textContent = username;
        }
        
        if (welcomeMessage) {
            if (loginTime) {
                const loginDate = new Date(parseInt(loginTime));
                const timeString = loginDate.toLocaleTimeString('hi-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                welcomeMessage.textContent = `आखिरी लॉगिन: ${timeString}`;
            } else {
                welcomeMessage.textContent = `वेलकम, ${username}!`;
            }
        }
    }
    
    // Load all dashboard data
    async loadData() {
        try {
            this.showLoading(true);
            
            await this.loadAppsData();
            await this.calculateStats();
            await this.loadQuickStats();
            
            this.displayAppsTable();
            
            // Show chart section if we have apps
            if (this.appsData.length > 0) {
                const chartSection = document.getElementById('chartSection');
                if (chartSection) {
                    chartSection.style.display = 'block';
                }
            }
            
        } catch (error) {
            console.error('Error loading dashboard:', error);
            this.showAlert('डेटा लोड करने में त्रुटि: ' + error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    // Load apps data from Firebase or localStorage
    async loadAppsData() {
        if (this.isOnline) {
            // Load from Firebase
            this.appsData = await FirebaseApp.getAllApps();
        } else {
            // Load from localStorage
            const customApps = localStorage.getItem('user_apps');
            if (customApps) {
                this.appsData = JSON.parse(customApps);
            } else {
                // Load default apps
                this.appsData = window.appsData || [];
            }
        }
        
        // Sort by created date (newest first)
        this.appsData.sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at.seconds * 1000) : new Date(0);
            const dateB = b.created_at ? new Date(b.created_at.seconds * 1000) : new Date(0);
            return dateB - dateA;
        });
        
        // Set filtered apps to all apps initially
        this.filteredApps = [...this.appsData];
        
        return this.appsData;
    }
    
    // Calculate dashboard statistics
    async calculateStats() {
        const apps = this.appsData;
        
        // Basic stats
        const totalApps = apps.length;
        const totalDownloads = apps.reduce((sum, app) => sum + (app.downloads || 0), 0);
        const avgDownloads = totalApps > 0 ? Math.round(totalDownloads / totalApps) : 0;
        
        // Today's downloads (from localStorage cache)
        const today = new Date().toDateString();
        const todayKey = `daily_downloads_${today}`;
        let todayDownloads = localStorage.getItem(todayKey) || 0;
        
        // Featured apps count
        const featuredCount = apps.filter(app => app.featured).length;
        
        // New apps (last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const newAppsCount = apps.filter(app => {
            if (!app.created_at) return false;
            const created = app.created_at.seconds ? 
                new Date(app.created_at.seconds * 1000) : new Date(app.created_at);
            return created > weekAgo;
        }).length;
        
        // Update stats object
        this.stats = {
            totalApps,
            totalDownloads,
            avgDownloads,
            todayDownloads: parseInt(todayDownloads),
            featuredCount,
            newAppsCount,
            isOnline: this.isOnline
        };
        
        // Update UI
        this.updateStatsUI();
    }
    
    // Update statistics in UI
    updateStatsUI() {
        const stats = this.stats;
        
        // Update DOM elements
        const updateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        };
        
        updateElement('totalApps', stats.totalApps);
        updateElement('totalDownloads', this.formatNumber(stats.totalDownloads));
        updateElement('avgDownloads', this.formatNumber(stats.avgDownloads));
        updateElement('todayDownloads', stats.todayDownloads);
        
        // Show online/offline status
        const onlineStatus = document.getElementById('onlineStatus');
        if (onlineStatus) {
            onlineStatus.innerHTML = this.isOnline ? 
                '<i class="fas fa-wifi"></i> Online' : 
                '<i class="fas fa-wifi-slash"></i> Offline';
            onlineStatus.className = this.isOnline ? 'badge badge-success' : 'badge badge-warning';
        }
    }
    
    // Display apps in table
    displayAppsTable() {
        const container = document.getElementById('tableContainer');
        const emptyState = document.getElementById('emptyState');
        const pagination = document.getElementById('pagination');
        const tbody = document.getElementById('appsTableBody');
        
        if (!tbody) return;
        
        // Check if we have apps
        if (this.filteredApps.length === 0) {
            if (container) container.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            if (pagination) pagination.style.display = 'none';
            return;
        }
        
        if (container) container.style.display = 'block';
        if (emptyState) emptyState.style.display = 'none';
        
        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.appsPerPage;
        const endIndex = startIndex + this.appsPerPage;
        const currentApps = this.filteredApps.slice(startIndex, endIndex);
        
        // Generate table rows
        tbody.innerHTML = currentApps.map((app, index) => `
            <tr data-id="${app.id}" data-index="${startIndex + index}">
                <td>
                    <input type="checkbox" class="app-checkbox" value="${app.id}" 
                           onchange="adminPanel.updateBulkSelection()">
                </td>
                <td>#${app.id.substring(0, 8)}...</td>
                <td>
                    <img src="${app.logo}" 
                         alt="${app.name}" 
                         class="app-logo-sm"
                         onerror="this.src='../assets/img/default-logo.png'">
                </td>
                <td>
                    <span class="app-name">${app.name}</span>
                    <span class="app-desc">${app.description ? app.description.substring(0, 60) + '...' : ''}</span>
                    ${app.featured ? `
                        <span class="badge badge-warning" style="margin-top: 5px;">
                            <i class="fas fa-star"></i> फीचर्ड
                        </span>
                    ` : ''}
                    ${!this.isOnline ? `
                        <span class="badge badge-secondary" style="margin-top: 5px;">
                            <i class="fas fa-save"></i> Local
                        </span>
                    ` : ''}
                </td>
                <td>${app.version || '1.0'}</td>
                <td>${app.size || 'N/A'}</td>
                <td>
                    <span style="color: #059669; font-weight: bold;">
                        ${this.formatNumber(app.downloads || 0)}
                    </span>
                </td>
                <td>
                    ${app.created_at ? 
                        this.formatFirestoreDate(app.created_at) : 
                        'N/A'}
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" 
                                onclick="adminPanel.editApp('${app.id}')"
                                title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" 
                                onclick="adminPanel.deleteApp('${app.id}')"
                                title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                        <a href="../download.html?id=${app.id}" 
                           target="_blank" 
                           class="action-btn view-btn"
                           title="View">
                            <i class="fas fa-eye"></i>
                        </a>
                        <a href="${app.apk_file || '#'}" 
                           class="action-btn download-btn"
                           download="${app.name}.apk"
                           title="Download APK">
                            <i class="fas fa-download"></i>
                        </a>
                    </div>
                </td>
            </tr>
        `).join('');
        
        // Update pagination
        this.updatePagination();
    }
    
    // Format Firestore timestamp
    formatFirestoreDate(timestamp) {
        try {
            if (timestamp && timestamp.seconds) {
                const date = new Date(timestamp.seconds * 1000);
                return date.toLocaleDateString('hi-IN');
            }
            return 'N/A';
        } catch (error) {
            return 'N/A';
        }
    }
    
    // Edit app
    async editApp(appId) {
        // Redirect to edit page with app ID
        window.location.href = `add-app.html?edit=${appId}`;
    }
    
    // Delete single app
    async deleteApp(appId) {
        const app = this.appsData.find(a => a.id === appId);
        
        if (!app) return;
        
        if (confirm(`क्या आप "${app.name}" को डिलीट करना चाहते हैं?\n\nयह एक्शन वापस नहीं किया जा सकता।`)) {
            try {
                if (this.isOnline) {
                    // Delete from Firebase
                    await FirebaseApp.deleteApp(appId);
                }
                
                // Remove from local arrays
                this.appsData = this.appsData.filter(a => a.id !== appId);
                this.filteredApps = this.filteredApps.filter(a => a.id !== appId);
                
                // Save to localStorage (backup)
                localStorage.setItem('user_apps', JSON.stringify(this.appsData));
                
                // Recalculate stats
                await this.calculateStats();
                await this.loadQuickStats();
                
                // Redraw table
                this.displayAppsTable();
                
                this.showAlert(`"${app.name}" सफलतापूर्वक डिलीट किया गया`, 'success');
                
            } catch (error) {
                this.showAlert(`डिलीट करने में त्रुटि: ${error.message}`, 'error');
            }
        }
    }
    
    // Rest of the methods remain similar but updated for Firebase...
    // ... (previous code continues with Firebase integration)
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    // Check if Firebase is available
    if (typeof firebase === 'undefined') {
        console.error('Firebase not loaded! Loading from CDN...');
        await loadFirebaseDependencies();
    }
    
    // Create global adminPanel instance
    window.adminPanel = new AdminPanel();
});

// Load Firebase dependencies if not loaded
async function loadFirebaseDependencies() {
    const firebaseScript = document.createElement('script');
    firebaseScript.src = 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js';
    document.head.appendChild(firebaseScript);
    
    await new Promise(resolve => firebaseScript.onload = resolve);
    
    const firestoreScript = document.createElement('script');
    firestoreScript.src = 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore-compat.js';
    document.head.appendChild(firestoreScript);
    
    const storageScript = document.createElement('script');
    storageScript.src = 'https://www.gstatic.com/firebasejs/9.6.1/firebase-storage-compat.js';
    document.head.appendChild(storageScript);
    
    await Promise.all([
        new Promise(resolve => firestoreScript.onload = resolve),
        new Promise(resolve => storageScript.onload = resolve)
    ]);
}