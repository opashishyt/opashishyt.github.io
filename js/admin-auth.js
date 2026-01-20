// Secure Admin Authentication System
class AdminAuth {
    constructor() {
        this.credentials = {
            username: 'opashishyt',
            password: 'Ashish@2006'
        };
        
        this.currentPage = window.location.pathname.split('/').pop();
        this.init();
    }

    init() {
        // Route based on current page
        switch(this.currentPage) {
            case 'admin.html':
                this.setupLoginPage();
                break;
            case 'dashboard.html':
                this.checkAuthAndSetupDashboard();
                break;
            default:
                this.setupAdminLink();
        }
    }

    // Secure credential storage (in memory only)
    getStoredCredentials() {
        return this.credentials;
    }

    // Secure authentication check
    authenticate(username, password) {
        const stored = this.getStoredCredentials();
        
        // Timing-safe comparison (simplified for demo)
        const usernameMatch = this.constantTimeCompare(username, stored.username);
        const passwordMatch = this.constantTimeCompare(password, stored.password);
        
        return usernameMatch && passwordMatch;
    }

    // Constant time comparison to prevent timing attacks
    constantTimeCompare(a, b) {
        const aBuf = new TextEncoder().encode(a);
        const bBuf = new TextEncoder().encode(b);
        
        if (aBuf.length !== bBuf.length) {
            return false;
        }
        
        let result = 0;
        for (let i = 0; i < aBuf.length; i++) {
            result |= aBuf[i] ^ bBuf[i];
        }
        
        return result === 0;
    }

    // Generate secure session token
    generateSessionToken() {
        const array = new Uint8Array(32);
        window.crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Setup login page
    setupLoginPage() {
        const loginBtn = document.getElementById('loginBtn');
        const form = document.querySelector('.login-form');
        
        if (loginBtn && form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
            
            loginBtn.addEventListener('click', () => {
                this.handleLogin();
            });
            
            // Add enter key support
            document.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && form.contains(document.activeElement)) {
                    this.handleLogin();
                }
            });
        }
    }

    handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        const usernameError = document.getElementById('usernameError');
        const passwordError = document.getElementById('passwordError');
        
        // Clear errors
        if (usernameError) usernameError.textContent = '';
        if (passwordError) passwordError.textContent = '';
        
        // Validation
        let isValid = true;
        
        if (!username) {
            if (usernameError) usernameError.textContent = 'Username is required';
            isValid = false;
        }
        
        if (!password) {
            if (passwordError) passwordError.textContent = 'Password is required';
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Simulate network delay to prevent timing attacks
        setTimeout(() => {
            if (this.authenticate(username, password)) {
                // Successful login
                const sessionToken = this.generateSessionToken();
                
                // Store session in localStorage
                const sessionData = {
                    token: sessionToken,
                    username: username,
                    timestamp: Date.now(),
                    expires: Date.now() + (2 * 60 * 60 * 1000) // 2 hours
                };
                
                localStorage.setItem('adminSession', JSON.stringify(sessionData));
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                // Failed login
                if (passwordError) {
                    passwordError.textContent = 'Invalid credentials';
                }
                
                // Clear password field
                document.getElementById('password').value = '';
                
                // Add shake effect
                const loginBox = document.querySelector('.admin-login-box');
                if (loginBox) {
                    loginBox.classList.add('shake');
                    setTimeout(() => loginBox.classList.remove('shake'), 500);
                }
                
                // Log failed attempt
                this.logFailedAttempt(username);
            }
        }, 500 + Math.random() * 500);
    }

    logFailedAttempt(username) {
        const attempts = JSON.parse(localStorage.getItem('failedAttempts') || '[]');
        attempts.push({
            username: username,
            timestamp: Date.now(),
            ip: 'local'
        });
        
        // Keep only last 10 attempts
        localStorage.setItem('failedAttempts', JSON.stringify(attempts.slice(-10)));
    }

    // Check authentication and setup dashboard
    checkAuthAndSetupDashboard() {
        const sessionData = JSON.parse(localStorage.getItem('adminSession') || '{}');
        
        // Check if session exists and is valid
        if (!sessionData.token || 
            !sessionData.expires || 
            sessionData.expires < Date.now() ||
            !this.validateSessionToken(sessionData.token)) {
            
            // Clear invalid session
            localStorage.removeItem('adminSession');
            
            // Redirect to login
            window.location.href = 'admin.html';
            return;
        }
        
        // Session is valid, setup dashboard
        this.setupDashboard();
    }

    validateSessionToken(token) {
        // In a real app, validate against server
        // For demo, just check format
        return /^[a-f0-9]{64}$/.test(token);
    }

    setupDashboard() {
        // Setup logout button
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }
        
        // Setup session timeout warning
        this.setupSessionTimeout();
        
        // Setup dashboard functionality
        this.setupDashboardFunctions();
    }

    setupSessionTimeout() {
        const sessionData = JSON.parse(localStorage.getItem('adminSession') || '{}');
        const timeLeft = sessionData.expires - Date.now();
        
        if (timeLeft > 0) {
            // Show warning 5 minutes before expiry
            setTimeout(() => {
                this.showSessionWarning();
            }, Math.max(timeLeft - (5 * 60 * 1000), 0));
            
            // Auto logout on expiry
            setTimeout(() => {
                this.handleLogout();
            }, timeLeft);
        }
    }

    showSessionWarning() {
        const warning = document.createElement('div');
        warning.className = 'session-warning';
        warning.innerHTML = `
            <div class="warning-content">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Your session will expire in 5 minutes. Save your work.</span>
                <button onclick="this.closest('.session-warning').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(warning);
        
        // Add warning styles
        this.addSessionWarningStyles();
    }

    addSessionWarningStyles() {
        const styleId = 'session-warning-styles';
        if (document.getElementById(styleId)) return;
        
        const styles = `
            .session-warning {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #fff3cd;
                border: 1px solid #ffecb5;
                border-radius: 8px;
                padding: 1rem;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 9999;
                animation: slideInRight 0.3s ease;
                max-width: 400px;
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            .warning-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .warning-content i {
                color: #ff9800;
                font-size: 1.25rem;
            }
            
            .warning-content span {
                color: #856404;
                font-size: 0.875rem;
                flex: 1;
            }
            
            .warning-content button {
                background: none;
                border: none;
                color: #856404;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                transition: background 0.2s;
            }
            
            .warning-content button:hover {
                background: rgba(0, 0, 0, 0.1);
            }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.id = styleId;
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    handleLogout() {
        // Clear session
        localStorage.removeItem('adminSession');
        
        // Clear any sensitive data
        localStorage.removeItem('portfolioProjectsBackup');
        
        // Redirect to login
        window.location.href = 'admin.html';
    }

    setupDashboardFunctions() {
        // Load projects for admin
        this.loadAdminProjects();
        
        // Setup project form
        this.setupProjectForm();
        
        // Setup file upload
        this.setupFileUpload();
        
        // Setup real-time validation
        this.setupRealTimeValidation();
    }

    async loadAdminProjects() {
        try {
            const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
            this.displayAdminProjects(projects);
        } catch (error) {
            console.error('Error loading projects:', error);
            this.showMessage('Error loading projects', 'error');
        }
    }

    displayAdminProjects(projects) {
        const projectsList = document.getElementById('projectsList');
        if (!projectsList) return;
        
        if (!projects.length) {
            projectsList.innerHTML = `
                <div class="no-projects-admin">
                    <i class="fas fa-inbox"></i>
                    <p>No projects added yet</p>
                </div>
            `;
            return;
        }
        
        projectsList.innerHTML = projects.map((project, index) => `
            <div class="project-item-admin">
                <div class="project-header-admin">
                    <h4>${project.title}</h4>
                    <span class="project-date-admin">${project.date}</span>
                </div>
                <p class="project-desc-admin">${project.description.substring(0, 100)}...</p>
                <div class="project-actions-admin">
                    <button class="btn-edit" onclick="adminAuth.editProject(${index})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="adminAuth.deleteProject(${index})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    setupProjectForm() {
        const form = document.getElementById('projectForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProject();
            });
        }
        
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                form.reset();
                document.getElementById('fileInput').value = '';
            });
        }
    }

    async saveProject() {
        const title = document.getElementById('projectTitle').value.trim();
        const description = document.getElementById('projectDescription').value.trim();
        const tags = document.getElementById('projectTags').value.trim();
        const link = document.getElementById('projectLink').value.trim();
        const fileInput = document.getElementById('fileInput');
        
        // Validation
        if (!title || !description) {
            this.showMessage('Please fill in all required fields', 'error');
            return;
        }
        
        // Parse tags
        const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        
        // Handle file (in real app, upload to server)
        let fileName = '';
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            fileName = `project_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            
            // In a real application, upload file to server
            // For demo, simulate upload
            await this.simulateFileUpload(file, fileName);
        }
        
        // Create project object
        const newProject = {
            id: Date.now(),
            title: title,
            description: description,
            tags: tagsArray,
            type: document.getElementById('projectType').value,
            status: document.getElementById('projectStatus').value,
            date: document.getElementById('projectDate').value || 
                  new Date().toISOString().split('T')[0],
            link: link || null,
            file: fileName || null,
            featured: document.getElementById('featuredProject').checked,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Load existing projects
        let projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
        
        // Add new project
        projects.unshift(newProject);
        
        // Save to localStorage
        localStorage.setItem('portfolioProjects', JSON.stringify(projects));
        
        // Update display
        this.displayAdminProjects(projects);
        
        // Show success message
        this.showMessage('Project saved successfully!', 'success');
        
        // Clear form
        document.getElementById('projectForm').reset();
        fileInput.value = '';
        
        // Trigger update on main page
        this.triggerMainPageUpdate();
    }

    async simulateFileUpload(file, fileName) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Simulated upload: ${file.name} -> ${fileName}`);
                resolve(true);
            }, 1000);
        });
    }

    editProject(index) {
        const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
        const project = projects[index];
        
        if (!project) return;
        
        // Populate form
        document.getElementById('projectTitle').value = project.title;
        document.getElementById('projectDescription').value = project.description;
        document.getElementById('projectTags').value = project.tags.join(', ');
        document.getElementById('projectLink').value = project.link || '';
        document.getElementById('projectType').value = project.type || 'research';
        document.getElementById('projectStatus').value = project.status || 'ongoing';
        document.getElementById('projectDate').value = project.date || '';
        document.getElementById('featuredProject').checked = project.featured || false;
        
        // Scroll to form
        document.getElementById('projectForm').scrollIntoView({ behavior: 'smooth' });
        
        // Store current index for update
        this.currentEditIndex = index;
        
        // Change save button text
        const saveBtn = document.querySelector('.save-btn');
        if (saveBtn) {
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Update Project';
            saveBtn.onclick = () => this.updateProject(index);
        }
    }

    updateProject(index) {
        const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
        const project = projects[index];
        
        if (!project) return;
        
        // Update project data
        project.title = document.getElementById('projectTitle').value.trim();
        project.description = document.getElementById('projectDescription').value.trim();
        project.tags = document.getElementById('projectTags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
        project.link = document.getElementById('projectLink').value.trim() || null;
        project.type = document.getElementById('projectType').value;
        project.status = document.getElementById('projectStatus').value;
        project.date = document.getElementById('projectDate').value || project.date;
        project.featured = document.getElementById('featuredProject').checked;
        project.updatedAt = new Date().toISOString();
        
        // Save updated projects
        localStorage.setItem('portfolioProjects', JSON.stringify(projects));
        
        // Update display
        this.displayAdminProjects(projects);
        
        // Show success message
        this.showMessage('Project updated successfully!', 'success');
        
        // Reset form
        document.getElementById('projectForm').reset();
        
        // Reset save button
        const saveBtn = document.querySelector('.save-btn');
        if (saveBtn) {
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Project';
            saveBtn.onclick = null;
        }
        
        // Trigger update on main page
        this.triggerMainPageUpdate();
    }

    deleteProject(index) {
        if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            return;
        }
        
        const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
        projects.splice(index, 1);
        
        localStorage.setItem('portfolioProjects', JSON.stringify(projects));
        this.displayAdminProjects(projects);
        
        this.showMessage('Project deleted successfully', 'success');
        this.triggerMainPageUpdate();
    }

    setupFileUpload() {
        const fileInput = document.getElementById('fileInput');
        const fileDisplay = document.querySelector('.file-upload-area');
        
        if (fileInput && fileDisplay) {
            fileInput.addEventListener('change', () => {
                if (fileInput.files.length > 0) {
                    const file = fileInput.files[0];
                    fileDisplay.innerHTML = `
                        <i class="fas fa-check-circle"></i>
                        <p>${file.name} (${this.formatFileSize(file.size)})</p>
                        <p class="file-info">Ready to upload</p>
                    `;
                    fileDisplay.style.borderColor = '#28a745';
                    fileDisplay.style.background = '#f0fff4';
                }
            });
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    setupRealTimeValidation() {
        const titleInput = document.getElementById('projectTitle');
        const descInput = document.getElementById('projectDescription');
        
        if (titleInput) {
            titleInput.addEventListener('input', () => {
                this.validateField(titleInput, 'Title must be at least 5 characters', 
                    value => value.length >= 5);
            });
        }
        
        if (descInput) {
            descInput.addEventListener('input', () => {
                this.validateField(descInput, 'Description must be at least 20 characters',
                    value => value.length >= 20);
            });
        }
    }

    validateField(input, errorMessage, validator) {
        const formGroup = input.closest('.form-group');
        let errorDiv = formGroup.querySelector('.field-error');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            formGroup.appendChild(errorDiv);
        }
        
        if (!validator(input.value.trim())) {
            errorDiv.textContent = errorMessage;
            errorDiv.style.display = 'block';
            input.style.borderColor = '#dc3545';
        } else {
            errorDiv.style.display = 'none';
            input.style.borderColor = '#28a745';
        }
    }

    showMessage(text, type) {
        // Remove existing messages
        const existingMsg = document.querySelector('.admin-message');
        if (existingMsg) {
            existingMsg.remove();
        }
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `admin-message message-${type}`;
        messageDiv.textContent = text;
        
        // Style based on type
        const styles = {
            success: { bg: '#d4edda', border: '#c3e6cb', color: '#155724' },
            error: { bg: '#f8d7da', border: '#f5c6cb', color: '#721c24' },
            info: { bg: '#d1ecf1', border: '#bee5eb', color: '#0c5460' }
        };
        
        const style = styles[type] || styles.info;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            animation: slideInRight 0.3s ease;
            background: ${style.bg};
            border: 1px solid ${style.border};
            color: ${style.color};
            font-weight: 500;
            max-width: 300px;
        `;
        
        document.body.appendChild(messageDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    triggerMainPageUpdate() {
        // In a real application, this would trigger a refresh or real-time update
        // For demo, we'll just log
        console.log('Projects updated - main page should refresh');
        
        // If main page is open in another tab, you could use BroadcastChannel
        if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel('portfolio-updates');
            channel.postMessage({ type: 'projects-updated', timestamp: Date.now() });
        }
    }

    setupAdminLink() {
        // Add secure admin link check
        const adminLink = document.querySelector('a[href="admin.html"]');
        if (adminLink) {
            adminLink.addEventListener('click', (e) => {
                // Check if already logged in
                const session = JSON.parse(localStorage.getItem('adminSession') || '{}');
                if (session.token && session.expires > Date.now()) {
                    // Already logged in, go directly to dashboard
                    e.preventDefault();
                    window.location.href = 'dashboard.html';
                }
            });
        }
    }

    // Export projects function
    exportProjects() {
        const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
        const dataStr = JSON.stringify(projects, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `projects-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showMessage('Projects exported successfully', 'success');
    }
    
    // Backup data function
    backupData() {
        const backup = {
            projects: JSON.parse(localStorage.getItem('portfolioProjects') || '[]'),
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };
        
        const dataStr = JSON.stringify(backup, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `portfolio-backup-${new Date().getTime()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showMessage('Full backup completed', 'success');
    }
}

// Initialize admin auth
let adminAuth;

document.addEventListener('DOMContentLoaded', () => {
    adminAuth = new AdminAuth();
});