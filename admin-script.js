// Admin Panel JavaScript
const ADMIN_CONFIG = {
    USERNAME: 'opashishyt',
    PASSWORD: 'Ashish@2006',
    SESSION_KEY: 'microbiology_lab_admin_session',
    PROJECTS_KEY: 'lab_projects_admin'
};

let adminState = {
    isAuthenticated: false,
    projects: [],
    currentUser: null
};

// Initialize Admin
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('admin-login.html')) {
        initLoginPage();
    } else if (window.location.pathname.includes('admin-dashboard.html')) {
        initDashboard();
    }
});

// Login Page
function initLoginPage() {
    const loginForm = document.getElementById('adminLoginForm');
    const togglePassword = document.getElementById('togglePassword');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    }
    
    // Check for existing session
    const session = localStorage.getItem(ADMIN_CONFIG.SESSION_KEY);
    if (session) {
        try {
            const sessionData = JSON.parse(session);
            if (sessionData.expires > Date.now()) {
                window.location.href = 'admin-dashboard.html';
            }
        } catch (error) {
            localStorage.removeItem(ADMIN_CONFIG.SESSION_KEY);
        }
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe')?.checked || false;
    
    if (username === ADMIN_CONFIG.USERNAME && password === ADMIN_CONFIG.PASSWORD) {
        // Create session
        const session = {
            username: username,
            loginTime: new Date().toISOString(),
            expires: Date.now() + (rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)
        };
        
        localStorage.setItem(ADMIN_CONFIG.SESSION_KEY, JSON.stringify(session));
        
        // Show success and redirect
        showAlert('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
        }, 1000);
    } else {
        showAlert('Invalid username or password', 'error');
    }
}

// Dashboard
function initDashboard() {
    checkAuth();
    loadDashboardData();
    initEventListeners();
}

function checkAuth() {
    const session = localStorage.getItem(ADMIN_CONFIG.SESSION_KEY);
    
    if (!session) {
        redirectToLogin();
        return;
    }
    
    try {
        const sessionData = JSON.parse(session);
        
        if (sessionData.expires < Date.now()) {
            localStorage.removeItem(ADMIN_CONFIG.SESSION_KEY);
            redirectToLogin();
            return;
        }
        
        adminState.isAuthenticated = true;
        adminState.currentUser = sessionData;
        
        // Update UI
        document.getElementById('adminUsername').textContent = sessionData.username;
        document.getElementById('adminAvatar').textContent = sessionData.username.charAt(0).toUpperCase();
        
    } catch (error) {
        redirectToLogin();
    }
}

function redirectToLogin() {
    window.location.href = 'admin-login.html';
}

function loadDashboardData() {
    // Load projects
    loadProjects();
    updateStats();
}

async function loadProjects() {
    try {
        // Try to load from localStorage first
        const savedProjects = localStorage.getItem(ADMIN_CONFIG.PROJECTS_KEY);
        
        if (savedProjects) {
            adminState.projects = JSON.parse(savedProjects);
        } else {
            // Load from main projects.json
            const response = await fetch('../projects.json');
            adminState.projects = await response.json();
            saveProjects();
        }
        
        updateProjectsTable();
        
    } catch (error) {
        console.error('Error loading projects:', error);
        adminState.projects = getSampleProjects();
        updateProjectsTable();
    }
}

function saveProjects() {
    localStorage.setItem(ADMIN_CONFIG.PROJECTS_KEY, JSON.stringify(adminState.projects));
}

function updateProjectsTable() {
    const tableBody = document.querySelector('#projectsTable tbody');
    if (!tableBody) return;
    
    if (adminState.projects.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <i class="fas fa-flask fa-2x text-muted mb-2"></i>
                    <p class="mb-0 text-muted">No research projects found</p>
                    <button class="btn btn-primary mt-2" onclick="openAddProjectModal()">
                        <i class="fas fa-plus"></i> Add First Project
                    </button>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = adminState.projects.map(project => `
        <tr>
            <td>${project.id}</td>
            <td class="project-image-cell">
                <img src="${project.image}" alt="${escapeHtml(project.title)}" width="80">
            </td>
            <td>
                <strong>${escapeHtml(project.title)}</strong>
                <div class="small text-muted">${escapeHtml(project.principal_investigator || 'Lab Team')}</div>
            </td>
            <td>
                <div class="d-flex flex-wrap gap-1">
                    ${(project.tags || []).map(tag => 
                        `<span class="badge bg-light text-dark">${escapeHtml(tag)}</span>`
                    ).join('')}
                </div>
            </td>
            <td>
                <span class="badge ${project.status === 'completed' ? 'bg-success' : 'bg-warning'}">
                    ${project.status || 'active'}
                </span>
            </td>
            <td>
                <div class="action-btns">
                    <button class="edit-btn" onclick="editProject(${project.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn" onclick="deleteProject(${project.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function updateStats() {
    const totalProjects = adminState.projects.length;
    const completedProjects = adminState.projects.filter(p => p.status === 'completed').length;
    const ongoingProjects = totalProjects - completedProjects;
    
    document.getElementById('totalProjects').textContent = totalProjects;
    document.getElementById('completedProjects').textContent = completedProjects;
    document.getElementById('ongoingProjects').textContent = ongoingProjects;
}

// Project Management
function openAddProjectModal() {
    const modal = document.getElementById('projectModal');
    const form = document.getElementById('projectForm');
    const title = document.getElementById('modalTitle');
    
    if (modal && form && title) {
        form.reset();
        form.dataset.mode = 'add';
        delete form.dataset.projectId;
        
        // Set default values
        document.getElementById('projectStatus').value = 'active';
        document.getElementById('projectCategory').value = 'ongoing';
        
        title.textContent = 'Add New Research Project';
        modal.classList.add('active');
    }
}

function editProject(projectId) {
    const project = adminState.projects.find(p => p.id === projectId);
    
    if (!project) {
        showAlert('Project not found', 'error');
        return;
    }
    
    const modal = document.getElementById('projectModal');
    const form = document.getElementById('projectForm');
    const title = document.getElementById('modalTitle');
    
    if (modal && form && title) {
        form.dataset.mode = 'edit';
        form.dataset.projectId = projectId;
        
        // Fill form fields
        document.getElementById('projectTitle').value = project.title || '';
        document.getElementById('projectShortDescription').value = project.shortDescription || '';
        document.getElementById('projectFullDescription').value = project.fullDescription || '';
        document.getElementById('projectImage').value = project.image || '';
        document.getElementById('projectTags').value = Array.isArray(project.tags) ? project.tags.join(', ') : project.tags || '';
        document.getElementById('projectCategory').value = project.category || 'ongoing';
        document.getElementById('projectStatus').value = project.status || 'active';
        document.getElementById('projectStartDate').value = project.start_date || '';
        document.getElementById('projectEndDate').value = project.end_date || '';
        document.getElementById('projectPrincipalInvestigator').value = project.principal_investigator || '';
        document.getElementById('projectFundingSource').value = project.funding_source || '';
        document.getElementById('projectDetails').value = Array.isArray(project.details) ? project.details.join('\n') : project.details || '';
        
        title.textContent = 'Edit Research Project';
        modal.classList.add('active');
    }
}

function deleteProject(projectId) {
    if (!confirm('Are you sure you want to delete this research project? This action cannot be undone.')) {
        return;
    }
    
    const index = adminState.projects.findIndex(p => p.id == projectId);
    
    if (index !== -1) {
        adminState.projects.splice(index, 1);
        saveProjects();
        updateProjectsTable();
        updateStats();
        showAlert('Research project deleted successfully!', 'success');
    }
}

function handleProjectForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const mode = form.dataset.mode;
    const projectId = form.dataset.projectId;
    
    // Get form data
    const formData = new FormData(form);
    const projectData = Object.fromEntries(formData.entries());
    
    // Process special fields
    if (projectData.tags) {
        projectData.tags = projectData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    
    if (projectData.details) {
        projectData.details = projectData.details.split('\n').map(detail => detail.trim()).filter(detail => detail);
    }
    
    try {
        if (mode === 'add') {
            // Add new project
            projectData.id = generateProjectId();
            projectData.created_at = new Date().toISOString();
            adminState.projects.unshift(projectData);
            showAlert('Research project added successfully!', 'success');
            
        } else if (mode === 'edit' && projectId) {
            // Update existing project
            const index = adminState.projects.findIndex(p => p.id == projectId);
            if (index !== -1) {
                projectData.updated_at = new Date().toISOString();
                adminState.projects[index] = { ...adminState.projects[index], ...projectData };
                showAlert('Research project updated successfully!', 'success');
            }
        }
        
        saveProjects();
        updateProjectsTable();
        updateStats();
        closeModal();
        
    } catch (error) {
        console.error('Error saving project:', error);
        showAlert('Failed to save project. Please try again.', 'error');
    }
}

function generateProjectId() {
    const maxId = adminState.projects.reduce((max, project) => Math.max(max, project.id || 0), 0);
    return maxId + 1;
}

// Utility Functions
function closeModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function showAlert(message, type) {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
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
    
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Quick Actions
function exportData() {
    const dataStr = JSON.stringify(adminState.projects, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'microbiology-lab-projects.json';
    a.click();
    
    URL.revokeObjectURL(url);
    showAlert('Data exported successfully!', 'success');
}

function backupData() {
    const backup = {
        projects: adminState.projects,
        timestamp: new Date().toISOString(),
        version: '1.0'
    };
    
    localStorage.setItem('lab_backup', JSON.stringify(backup));
    showAlert('Backup created successfully!', 'success');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                adminState.projects = Array.isArray(data) ? data : data.projects || [];
                saveProjects();
                updateProjectsTable();
                updateStats();
                showAlert('Data imported successfully!', 'success');
            } catch (error) {
                showAlert('Invalid file format', 'error');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

function syncData() {
    showAlert('Syncing data with server...', 'info');
    // In a real application, this would sync with a backend server
    setTimeout(() => {
        showAlert('Data synchronized successfully!', 'success');
    }, 1500);
}

// Event Listeners
function initEventListeners() {
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem(ADMIN_CONFIG.SESSION_KEY);
            window.location.href = 'admin-login.html';
        });
    }
    
    // Add project button
    const addProjectBtn = document.getElementById('addProjectBtn');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', openAddProjectModal);
    }
    
    // Project form
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', handleProjectForm);
    }
    
    // Close modal buttons
    const closeModalBtns = document.querySelectorAll('.close-modal, .cancel-btn');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Close modal on overlay click
    const modalOverlay = document.getElementById('projectModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(event) {
            if (event.target === this) {
                closeModal();
            }
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
        
        if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
            event.preventDefault();
            openAddProjectModal();
        }
    });
}

// Sample Projects (Fallback)
function getSampleProjects() {
    return [
        {
            id: 1,
            title: "Antibiotic Resistance Research",
            shortDescription: "Study of antibiotic-resistant bacteria in clinical settings",
            fullDescription: "This research project focuses on identifying and characterizing antibiotic-resistant bacterial strains in hospital environments.",
            image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?ixlib=rb-4.0.3&auto=format&fit=crop&w=1032&q=80",
            tags: ["Antibiotic Resistance", "Clinical Microbiology", "Pathogen Research"],
            category: "ongoing",
            status: "active",
            start_date: "2023-01-15",
            end_date: "2024-12-31",
            principal_investigator: "Dr. Sarah Chen",
            funding_source: "National Science Foundation",
            details: ["Sample collection", "DNA sequencing", "Data analysis"],
            created_at: new Date().toISOString()
        }
    ];
}

// Make functions globally available
window.openAddProjectModal = openAddProjectModal;
window.editProject = editProject;
window.deleteProject = deleteProject;
window.closeModal = closeModal;
window.exportData = exportData;
window.backupData = backupData;
window.importData = importData;
window.syncData = syncData;