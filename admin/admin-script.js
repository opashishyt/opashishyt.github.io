// Admin Panel JavaScript

// Admin Credentials (Never show in frontend - for demo only)
const ADMIN_CREDENTIALS = {
    id: 'opashishyt',
    password: 'Ashish@2006'
};

// Current Admin User
let currentAdmin = null;

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on login page or dashboard
    const isLoginPage = window.location.pathname.includes('/admin/') && 
                       !window.location.pathname.includes('/admin/dashboard.html');
    
    if (isLoginPage) {
        initAdminLogin();
    } else {
        checkAdminAuth();
        initAdminDashboard();
    }
});

// Admin Login Functions
function initAdminLogin() {
    const loginForm = document.getElementById('adminLoginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('adminPassword');
    
    // Toggle password visibility
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }
    
    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAdminLogin();
        });
    }
}

function handleAdminLogin() {
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;
    const rememberMe = document.getElementById('rememberAdmin').checked;
    
    // Check credentials
    if (username === ADMIN_CREDENTIALS.id && password === ADMIN_CREDENTIALS.password) {
        // Create admin session
        currentAdmin = {
            id: ADMIN_CREDENTIALS.id,
            name: 'Admin',
            loginTime: new Date().toISOString()
        };
        
        // Save session
        if (rememberMe) {
            localStorage.setItem('admin_session', JSON.stringify(currentAdmin));
        } else {
            sessionStorage.setItem('admin_session', JSON.stringify(currentAdmin));
        }
        
        // Log admin activity
        logAdminActivity('login', 'Admin logged in');
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
        
    } else {
        showAdminNotification('Invalid admin credentials', 'error');
    }
}

// Check Admin Authentication
function checkAdminAuth() {
    const session = localStorage.getItem('admin_session') || sessionStorage.getItem('admin_session');
    
    if (!session) {
        // Redirect to login page
        window.location.href = 'index.html';
        return;
    }
    
    try {
        currentAdmin = JSON.parse(session);
        
        // Verify session is not expired (24 hours)
        const loginTime = new Date(currentAdmin.loginTime);
        const now = new Date();
        const hoursDiff = Math.abs(now - loginTime) / 36e5;
        
        if (hoursDiff > 24) {
            // Session expired
            localStorage.removeItem('admin_session');
            sessionStorage.removeItem('admin_session');
            window.location.href = 'index.html';
            return;
        }
        
        // Update last activity
        currentAdmin.lastActivity = new Date().toISOString();
        if (localStorage.getItem('admin_session')) {
            localStorage.setItem('admin_session', JSON.stringify(currentAdmin));
        } else {
            sessionStorage.setItem('admin_session', JSON.stringify(currentAdmin));
        }
        
    } catch (error) {
        console.error('Error parsing admin session:', error);
        window.location.href = 'index.html';
    }
}

// Admin Dashboard Functions
function initAdminDashboard() {
    // Load dashboard data
    loadDashboardStats();
    loadPendingUsers();
    loadProjects();
    loadContactMessages();
    loadWebsiteSettings();
    
    // Setup event listeners
    setupAdminEventListeners();
    
    // Display admin info
    displayAdminInfo();
}

function displayAdminInfo() {
    const adminName = document.querySelector('.admin-user-info h3');
    if (adminName && currentAdmin) {
        adminName.textContent = currentAdmin.name;
    }
}

function loadDashboardStats() {
    // Load users
    const users = JSON.parse(localStorage.getItem('portfolio_users') || '[]');
    const pendingUsers = JSON.parse(localStorage.getItem('portfolio_pending_users') || '[]');
    
    // Load projects
    fetch('../project.json')
        .then(response => response.json())
        .then(data => {
            const projects = data.projects || [];
            
            // Load messages
            const messages = JSON.parse(localStorage.getItem('portfolio_contact_messages') || '[]');
            
            // Load visitors (simulated)
            const visitors = JSON.parse(localStorage.getItem('portfolio_visitors') || '0');
            
            // Update stats
            document.getElementById('totalUsers').textContent = users.length;
            document.getElementById('totalProjects').textContent = projects.length;
            document.getElementById('totalMessages').textContent = messages.length;
            document.getElementById('totalVisitors').textContent = visitors || '1,234';
            
            // Update pending users count
            document.getElementById('pendingUsersCount').textContent = pendingUsers.length;
            
            // Update latest projects
            updateLatestProjects(projects.slice(0, 5));
            
            // Update recent messages
            updateRecentMessages(messages.slice(0, 5));
        })
        .catch(error => {
            console.error('Error loading dashboard stats:', error);
        });
}

function loadPendingUsers() {
    const pendingUsers = JSON.parse(localStorage.getItem('portfolio_pending_users') || '[]');
    const tbody = document.getElementById('pendingUsersTable');
    
    if (!tbody) return;
    
    if (pendingUsers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No pending users</td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    
    pendingUsers.forEach(user => {
        html += `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                <td class="admin-table-actions">
                    <button class="admin-btn admin-btn-approve" onclick="approveUser(${user.id})">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="admin-btn admin-btn-reject" onclick="rejectUser(${user.id})">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function approveUser(userId) {
    const pendingUsers = JSON.parse(localStorage.getItem('portfolio_pending_users') || '[]');
    const users = JSON.parse(localStorage.getItem('portfolio_users') || '[]');
    
    const userIndex = pendingUsers.findIndex(u => u.id == userId);
    
    if (userIndex !== -1) {
        const user = pendingUsers[userIndex];
        user.status = 'active';
        user.approvedAt = new Date().toISOString();
        user.approvedBy = currentAdmin.id;
        
        // Add to approved users
        users.push(user);
        
        // Remove from pending
        pendingUsers.splice(userIndex, 1);
        
        // Save to localStorage
        localStorage.setItem('portfolio_pending_users', JSON.stringify(pendingUsers));
        localStorage.setItem('portfolio_users', JSON.stringify(users));
        
        // Log activity
        logAdminActivity('user_approval', `Approved user: ${user.email}`);
        
        // Show notification
        showAdminNotification('User approved successfully', 'success');
        
        // Reload data
        loadDashboardStats();
        loadPendingUsers();
    }
}

function rejectUser(userId) {
    const pendingUsers = JSON.parse(localStorage.getItem('portfolio_pending_users') || '[]');
    
    const userIndex = pendingUsers.findIndex(u => u.id == userId);
    
    if (userIndex !== -1) {
        const user = pendingUsers[userIndex];
        
        // Remove from pending
        pendingUsers.splice(userIndex, 1);
        
        // Save to localStorage
        localStorage.setItem('portfolio_pending_users', JSON.stringify(pendingUsers));
        
        // Log activity
        logAdminActivity('user_rejection', `Rejected user: ${user.email}`);
        
        // Show notification
        showAdminNotification('User rejected successfully', 'success');
        
        // Reload data
        loadDashboardStats();
        loadPendingUsers();
    }
}

function loadProjects() {
    fetch('../project.json')
        .then(response => response.json())
        .then(data => {
            const projects = data.projects || [];
            const tbody = document.getElementById('projectsTable');
            
            if (!tbody) return;
            
            if (projects.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center">No projects found</td>
                    </tr>
                `;
                return;
            }
            
            let html = '';
            
            projects.slice(0, 10).forEach(project => {
                html += `
                    <tr>
                        <td>${project.title}</td>
                        <td>${project.category}</td>
                        <td>${project.status || 'Completed'}</td>
                        <td>${project.year}</td>
                        <td class="admin-table-actions">
                            <button class="admin-btn admin-btn-edit" onclick="editProject(${project.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="admin-btn admin-btn-delete" onclick="deleteProject(${project.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </td>
                    </tr>
                `;
            });
            
            tbody.innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading projects:', error);
        });
}

function loadContactMessages() {
    const messages = JSON.parse(localStorage.getItem('portfolio_contact_messages') || '[]');
    const tbody = document.getElementById('messagesTable');
    
    if (!tbody) return;
    
    if (messages.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No messages found</td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    
    messages.slice(0, 10).forEach(message => {
        html += `
            <tr>
                <td>${message.name}</td>
                <td>${message.email}</td>
                <td>${message.subject}</td>
                <td>${new Date(message.date).toLocaleDateString()}</td>
                <td class="admin-table-actions">
                    <button class="admin-btn admin-btn-edit" onclick="viewMessage(${message.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="admin-btn admin-btn-delete" onclick="deleteMessage(${message.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function loadWebsiteSettings() {
    const settings = JSON.parse(localStorage.getItem('portfolio_settings') || '{}');
    
    // Load current settings into form
    document.getElementById('siteTitle').value = settings.siteTitle || 'Ashish Portfolio';
    document.getElementById('siteEmail').value = settings.siteEmail || 'ashish.kumar@portfolio.com';
    document.getElementById('sitePhone').value = settings.sitePhone || '+91 98765 43210';
    document.getElementById('siteLocation').value = settings.siteLocation || 'New Delhi, India';
    document.getElementById('siteDescription').value = settings.siteDescription || 'Creating amazing digital experiences with passion and precision';
}

function setupAdminEventListeners() {
    // Logout button
    const logoutBtn = document.querySelector('.admin-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            handleAdminLogout();
        });
    }
    
    // Save settings form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveWebsiteSettings();
        });
    }
    
    // Logo upload
    const logoUpload = document.getElementById('logoUpload');
    if (logoUpload) {
        logoUpload.addEventListener('change', function(e) {
            handleLogoUpload(e.target.files[0]);
        });
    }
    
    // Profile image upload
    const profileUpload = document.getElementById('profileUpload');
    if (profileUpload) {
        profileUpload.addEventListener('change', function(e) {
            handleProfileUpload(e.target.files[0]);
        });
    }
    
    // Add project form
    const addProjectForm = document.getElementById('addProjectForm');
    if (addProjectForm) {
        addProjectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewProject();
        });
    }
    
    // Search functionality
    const searchInputs = document.querySelectorAll('.admin-search input');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const tableId = this.closest('.admin-table-container').querySelector('tbody').id;
            searchTable(tableId, this.value);
        });
    });
}

function handleAdminLogout() {
    // Clear admin session
    localStorage.removeItem('admin_session');
    sessionStorage.removeItem('admin_session');
    
    // Log activity
    logAdminActivity('logout', 'Admin logged out');
    
    // Redirect to login page
    window.location.href = 'index.html';
}

function saveWebsiteSettings() {
    const settings = {
        siteTitle: document.getElementById('siteTitle').value,
        siteEmail: document.getElementById('siteEmail').value,
        sitePhone: document.getElementById('sitePhone').value,
        siteLocation: document.getElementById('siteLocation').value,
        siteDescription: document.getElementById('siteDescription').value,
        updatedAt: new Date().toISOString(),
        updatedBy: currentAdmin.id
    };
    
    // Save to localStorage
    localStorage.setItem('portfolio_settings', JSON.stringify(settings));
    
    // Log activity
    logAdminActivity('settings_update', 'Updated website settings');
    
    // Show notification
    showAdminNotification('Settings saved successfully', 'success');
    
    // Update main website data
    updateMainWebsiteData(settings);
}

function handleLogoUpload(file) {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showAdminNotification('Please upload an image file', 'error');
        return;
    }
    
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
        showAdminNotification('Image size should be less than 2MB', 'error');
        return;
    }
    
    // In a real application, you would upload to server
    // For demo, we'll create a data URL
    const reader = new FileReader();
    
    reader.onload = function(e) {
        // Save logo data
        const logoData = {
            dataUrl: e.target.result,
            filename: file.name,
            uploadedAt: new Date().toISOString()
        };
        
        localStorage.setItem('portfolio_logo', JSON.stringify(logoData));
        
        // Log activity
        logAdminActivity('logo_update', 'Updated website logo');
        
        // Show notification
        showAdminNotification('Logo uploaded successfully', 'success');
        
        // Update preview
        const logoPreview = document.getElementById('logoPreview');
        if (logoPreview) {
            logoPreview.src = e.target.result;
            logoPreview.style.display = 'block';
        }
    };
    
    reader.readAsDataURL(file);
}

function handleProfileUpload(file) {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showAdminNotification('Please upload an image file', 'error');
        return;
    }
    
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
        showAdminNotification('Image size should be less than 2MB', 'error');
        return;
    }
    
    // In a real application, you would upload to server
    // For demo, we'll create a data URL
    const reader = new FileReader();
    
    reader.onload = function(e) {
        // Save profile data
        const profileData = {
            dataUrl: e.target.result,
            filename: file.name,
            uploadedAt: new Date().toISOString()
        };
        
        localStorage.setItem('portfolio_profile', JSON.stringify(profileData));
        
        // Log activity
        logAdminActivity('profile_update', 'Updated profile image');
        
        // Show notification
        showAdminNotification('Profile image uploaded successfully', 'success');
        
        // Update preview
        const profilePreview = document.getElementById('profilePreview');
        if (profilePreview) {
            profilePreview.src = e.target.result;
            profilePreview.style.display = 'block';
        }
    };
    
    reader.readAsDataURL(file);
}

function addNewProject() {
    const title = document.getElementById('projectTitle').value;
    const category = document.getElementById('projectCategory').value;
    const description = document.getElementById('projectDescription').value;
    const technologies = document.getElementById('projectTechnologies').value.split(',').map(t => t.trim());
    const status = document.getElementById('projectStatus').value;
    const year = document.getElementById('projectYear').value;
    const image = document.getElementById('projectImage').value;
    const liveUrl = document.getElementById('projectLiveUrl').value;
    const githubUrl = document.getElementById('projectGithubUrl').value;
    
    // Create new project
    const newProject = {
        id: Date.now(),
        title: title,
        description: description,
        category: category,
        technologies: technologies,
        image: image || 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
        liveUrl: liveUrl,
        githubUrl: githubUrl,
        status: status,
        year: parseInt(year),
        features: ['Feature 1', 'Feature 2', 'Feature 3'], // Default features
        createdAt: new Date().toISOString(),
        createdBy: currentAdmin.id
    };
    
    // Load existing projects
    fetch('../project.json')
        .then(response => response.json())
        .then(data => {
            const projects = data.projects || [];
            projects.push(newProject);
            
            // Update JSON file (in real app, this would be API call)
            // For demo, we'll save to localStorage
            localStorage.setItem('portfolio_projects_backup', JSON.stringify(projects));
            
            // Log activity
            logAdminActivity('project_add', `Added project: ${title}`);
            
            // Show notification
            showAdminNotification('Project added successfully', 'success');
            
            // Reset form
            document.getElementById('addProjectForm').reset();
            
            // Reload projects
            loadProjects();
            loadDashboardStats();
            
            // Show download reminder
            showAdminNotification('Remember to update the project.json file with new project data', 'info');
        })
        .catch(error => {
            console.error('Error adding project:', error);
            showAdminNotification('Error adding project', 'error');
        });
}

function editProject(projectId) {
    // Load project details
    fetch('../project.json')
        .then(response => response.json())
        .then(data => {
            const project = data.projects.find(p => p.id == projectId);
            
            if (project) {
                // Fill edit form
                document.getElementById('editProjectTitle').value = project.title;
                document.getElementById('editProjectCategory').value = project.category;
                document.getElementById('editProjectDescription').value = project.description;
                document.getElementById('editProjectTechnologies').value = project.technologies.join(', ');
                document.getElementById('editProjectStatus').value = project.status || 'Completed';
                document.getElementById('editProjectYear').value = project.year;
                document.getElementById('editProjectImage').value = project.image;
                document.getElementById('editProjectLiveUrl').value = project.liveUrl || '';
                document.getElementById('editProjectGithubUrl').value = project.githubUrl || '';
                document.getElementById('editProjectId').value = project.id;
                
                // Show edit modal
                document.getElementById('editProjectModal').style.display = 'flex';
            }
        })
        .catch(error => {
            console.error('Error loading project:', error);
            showAdminNotification('Error loading project', 'error');
        });
}

function updateProject() {
    const projectId = document.getElementById('editProjectId').value;
    const title = document.getElementById('editProjectTitle').value;
    const category = document.getElementById('editProjectCategory').value;
    const description = document.getElementById('editProjectDescription').value;
    const technologies = document.getElementById('editProjectTechnologies').value.split(',').map(t => t.trim());
    const status = document.getElementById('editProjectStatus').value;
    const year = document.getElementById('editProjectYear').value;
    const image = document.getElementById('editProjectImage').value;
    const liveUrl = document.getElementById('editProjectLiveUrl').value;
    const githubUrl = document.getElementById('editProjectGithubUrl').value;
    
    // Load existing projects
    fetch('../project.json')
        .then(response => response.json())
        .then(data => {
            const projects = data.projects || [];
            const projectIndex = projects.findIndex(p => p.id == projectId);
            
            if (projectIndex !== -1) {
                // Update project
                projects[projectIndex] = {
                    ...projects[projectIndex],
                    title: title,
                    description: description,
                    category: category,
                    technologies: technologies,
                    status: status,
                    year: parseInt(year),
                    image: image,
                    liveUrl: liveUrl,
                    githubUrl: githubUrl,
                    updatedAt: new Date().toISOString(),
                    updatedBy: currentAdmin.id
                };
                
                // Update JSON file (in real app, this would be API call)
                // For demo, we'll save to localStorage
                localStorage.setItem('portfolio_projects_backup', JSON.stringify(projects));
                
                // Log activity
                logAdminActivity('project_update', `Updated project: ${title}`);
                
                // Show notification
                showAdminNotification('Project updated successfully', 'success');
                
                // Close modal
                document.getElementById('editProjectModal').style.display = 'none';
                
                // Reload projects
                loadProjects();
                loadDashboardStats();
                
                // Show download reminder
                showAdminNotification('Remember to update the project.json file with updated project data', 'info');
            }
        })
        .catch(error => {
            console.error('Error updating project:', error);
            showAdminNotification('Error updating project', 'error');
        });
}

function deleteProject(projectId) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    // Load existing projects
    fetch('../project.json')
        .then(response => response.json())
        .then(data => {
            const projects = data.projects || [];
            const projectIndex = projects.findIndex(p => p.id == projectId);
            
            if (projectIndex !== -1) {
                const projectTitle = projects[projectIndex].title;
                
                // Remove project
                projects.splice(projectIndex, 1);
                
                // Update JSON file (in real app, this would be API call)
                // For demo, we'll save to localStorage
                localStorage.setItem('portfolio_projects_backup', JSON.stringify(projects));
                
                // Log activity
                logAdminActivity('project_delete', `Deleted project: ${projectTitle}`);
                
                // Show notification
                showAdminNotification('Project deleted successfully', 'success');
                
                // Reload projects
                loadProjects();
                loadDashboardStats();
                
                // Show download reminder
                showAdminNotification('Remember to update the project.json file after deleting project', 'info');
            }
        })
        .catch(error => {
            console.error('Error deleting project:', error);
            showAdminNotification('Error deleting project', 'error');
        });
}

function viewMessage(messageId) {
    const messages = JSON.parse(localStorage.getItem('portfolio_contact_messages') || '[]');
    const message = messages.find(m => m.id == messageId);
    
    if (message) {
        // Fill view form
        document.getElementById('viewMessageName').textContent = message.name;
        document.getElementById('viewMessageEmail').textContent = message.email;
        document.getElementById('viewMessageSubject').textContent = message.subject;
        document.getElementById('viewMessageDate').textContent = new Date(message.date).toLocaleString();
        document.getElementById('viewMessageContent').textContent = message.message;
        
        // Mark as read
        if (!message.read) {
            message.read = true;
            localStorage.setItem('portfolio_contact_messages', JSON.stringify(messages));
            loadDashboardStats();
        }
        
        // Show view modal
        document.getElementById('viewMessageModal').style.display = 'flex';
    }
}

function deleteMessage(messageId) {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    const messages = JSON.parse(localStorage.getItem('portfolio_contact_messages') || '[]');
    const messageIndex = messages.findIndex(m => m.id == messageId);
    
    if (messageIndex !== -1) {
        // Remove message
        messages.splice(messageIndex, 1);
        
        // Save to localStorage
        localStorage.setItem('portfolio_contact_messages', JSON.stringify(messages));
        
        // Log activity
        logAdminActivity('message_delete', 'Deleted contact message');
        
        // Show notification
        showAdminNotification('Message deleted successfully', 'success');
        
        // Reload messages
        loadContactMessages();
        loadDashboardStats();
    }
}

function updateMainWebsiteData(settings) {
    // This function would update the main website data
    // In a real application, this would be an API call
    
    console.log('Updating main website with settings:', settings);
    
    // For demo, we'll just log it
    const websiteUpdates = JSON.parse(localStorage.getItem('portfolio_website_updates') || '[]');
    websiteUpdates.push({
        settings: settings,
        updatedAt: new Date().toISOString(),
        updatedBy: currentAdmin.id
    });
    
    localStorage.setItem('portfolio_website_updates', JSON.stringify(websiteUpdates));
}

function updateLatestProjects(projects) {
    const container = document.getElementById('latestProjects');
    if (!container) return;
    
    if (projects.length === 0) {
        container.innerHTML = '<p class="text-center">No projects</p>';
        return;
    }
    
    let html = '';
    
    projects.forEach(project => {
        html += `
            <div class="latest-item">
                <div class="latest-item-icon">
                    <i class="fas fa-project-diagram"></i>
                </div>
                <div class="latest-item-content">
                    <h4>${project.title}</h4>
                    <p>${project.category} • ${project.status || 'Completed'}</p>
                </div>
                <div class="latest-item-date">
                    ${project.year}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function updateRecentMessages(messages) {
    const container = document.getElementById('recentMessages');
    if (!container) return;
    
    if (messages.length === 0) {
        container.innerHTML = '<p class="text-center">No messages</p>';
        return;
    }
    
    let html = '';
    
    messages.forEach(message => {
        html += `
            <div class="latest-item">
                <div class="latest-item-icon">
                    <i class="fas fa-envelope ${message.read ? 'text-muted' : 'text-primary'}"></i>
                </div>
                <div class="latest-item-content">
                    <h4>${message.name}</h4>
                    <p>${message.subject}</p>
                </div>
                <div class="latest-item-date">
                    ${new Date(message.date).toLocaleDateString()}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function searchTable(tableId, searchTerm) {
    const tbody = document.getElementById(tableId);
    if (!tbody) return;
    
    const rows = tbody.querySelectorAll('tr');
    const searchLower = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchLower) ? '' : 'none';
    });
}

function logAdminActivity(action, description) {
    const activities = JSON.parse(localStorage.getItem('admin_activities') || '[]');
    
    activities.push({
        id: Date.now(),
        adminId: currentAdmin.id,
        action: action,
        description: description,
        timestamp: new Date().toISOString(),
        ip: '127.0.0.1' // In real app, get from server
    });
    
    localStorage.setItem('admin_activities', JSON.stringify(activities));
}

function showAdminNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.admin-notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `admin-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="admin-notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Close button
    const closeBtn = notification.querySelector('.admin-notification-close');
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

// Modal functions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Make functions available globally
window.approveUser = approveUser;
window.rejectUser = rejectUser;
window.editProject = editProject;
window.deleteProject = deleteProject;
window.viewMessage = viewMessage;
window.deleteMessage = deleteMessage;
window.updateProject = updateProject;
window.closeModal = closeModal;

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('admin-modal')) {
        e.target.style.display = 'none';
    }
});

// Close modals with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.admin-modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
});