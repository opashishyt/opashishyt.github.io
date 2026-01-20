// Projects Loader and Manager
class ProjectsManager {
    constructor() {
        this.projectsContainer = document.getElementById('projectsContainer');
        this.projects = [];
        this.init();
    }

    async init() {
        await this.loadProjects();
        this.displayProjects();
    }

    async loadProjects() {
        try {
            // First try to load from localStorage (for admin-added projects)
            const localProjects = localStorage.getItem('portfolioProjects');
            
            if (localProjects) {
                this.projects = JSON.parse(localProjects);
            } else {
                // Fallback to default projects.json
                const response = await fetch('projects.json');
                
                if (!response.ok) {
                    throw new Error('Projects file not found');
                }
                
                this.projects = await response.json();
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            this.projects = this.getDefaultProjects();
        }
    }

    getDefaultProjects() {
        return [
            {
                id: 1,
                title: "Microbial Water Quality Analysis",
                description: "Comprehensive study examining microbial contamination levels in urban water sources, focusing on identification of coliform bacteria and assessment of public health implications.",
                type: "research",
                status: "completed",
                date: "October 2024",
                tags: ["Water Microbiology", "Public Health", "Bacterial Analysis"],
                link: "",
                file: null,
                featured: true
            },
            {
                id: 2,
                title: "Antibiotic Susceptibility Testing",
                description: "Laboratory investigation of antibiotic resistance patterns in clinical isolates using disc diffusion and broth dilution methods to evaluate emerging resistance trends.",
                type: "lab",
                status: "ongoing",
                date: "November 2024",
                tags: ["Antimicrobial Resistance", "Clinical Isolates", "AST"],
                link: "",
                file: null,
                featured: true
            },
            {
                id: 3,
                title: "Microbial Genetics Fundamentals",
                description: "Academic exploration of bacterial genetics including plasmid transfer, mutation analysis, and genetic regulation mechanisms in prokaryotic systems.",
                type: "academic",
                status: "completed",
                date: "September 2024",
                tags: ["Bacterial Genetics", "Molecular Biology", "Academic"],
                link: "",
                file: null,
                featured: false
            }
        ];
    }

    displayProjects() {
        if (!this.projectsContainer) return;

        if (!this.projects || this.projects.length === 0) {
            this.projectsContainer.innerHTML = this.getNoProjectsHTML();
            return;
        }

        // Sort projects: featured first, then by date
        const sortedProjects = [...this.projects].sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return new Date(b.date) - new Date(a.date);
        });

        const projectsHTML = sortedProjects.map(project => this.createProjectHTML(project)).join('');
        
        this.projectsContainer.innerHTML = `
            <div class="projects-grid">
                ${projectsHTML}
            </div>
        `;

        // Add CSS for grid
        const style = document.createElement('style');
        style.textContent = `
            .projects-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                gap: 1.5rem;
            }
            
            @media (max-width: 768px) {
                .projects-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createProjectHTML(project) {
        const typeIcon = this.getTypeIcon(project.type);
        const statusClass = this.getStatusClass(project.status);
        const statusText = this.getStatusText(project.status);
        
        return `
            <div class="project-card" data-id="${project.id}">
                <div class="project-header">
                    <span class="project-type">${typeIcon} ${project.type.toUpperCase()}</span>
                    <h3>${project.title}</h3>
                </div>
                
                <div class="project-body">
                    <p class="project-description">${project.description}</p>
                    
                    <div class="project-meta">
                        <span class="project-date">
                            <i class="fas fa-calendar"></i> ${project.date}
                        </span>
                        <span class="project-status ${statusClass}">
                            ${statusText}
                        </span>
                    </div>
                    
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    </div>
                    
                    <div class="project-actions">
                        ${project.file ? `
                            <a href="uploads/${project.file}" class="project-link" target="_blank">
                                <i class="fas fa-download"></i>
                                <span>Download</span>
                            </a>
                        ` : ''}
                        
                        ${project.link ? `
                            <a href="${project.link}" class="project-link project-link-outline" target="_blank">
                                <i class="fas fa-external-link-alt"></i>
                                <span>Details</span>
                            </a>
                        ` : ''}
                        
                        <button class="project-link" onclick="projectsManager.viewProjectDetails(${project.id})">
                            <i class="fas fa-info-circle"></i>
                            <span>View Details</span>
                        </button>
                    </div>
                </div>
                
                ${project.featured ? `
                    <div class="project-badge">
                        <i class="fas fa-star"></i>
                        <span>Featured</span>
                    </div>
                ` : ''}
            </div>
        `;
    }

    getTypeIcon(type) {
        const icons = {
            research: '🔬',
            lab: '🧪',
            academic: '📚',
            clinical: '🏥',
            field: '🌿'
        };
        return icons[type] || '📋';
    }

    getStatusClass(status) {
        const classes = {
            completed: 'status-completed',
            ongoing: 'status-ongoing',
            planning: 'status-planning',
            published: 'status-published'
        };
        return classes[status] || 'status-default';
    }

    getStatusText(status) {
        const texts = {
            completed: 'Completed',
            ongoing: 'Ongoing',
            planning: 'In Planning',
            published: 'Published'
        };
        return texts[status] || 'Not Specified';
    }

    getNoProjectsHTML() {
        return `
            <div class="no-projects">
                <div class="no-projects-icon">
                    <i class="fas fa-microscope"></i>
                </div>
                <h3>No Research Projects Available</h3>
                <p>Research projects will be displayed here once added through the admin panel.</p>
                <p class="no-projects-note">
                    <small>Contact administrator to add research projects</small>
                </p>
            </div>
        `;
    }

    viewProjectDetails(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const modalHTML = `
            <div class="project-modal" id="projectModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${project.title}</h2>
                        <button class="modal-close" onclick="this.closest('.project-modal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="modal-meta">
                            <span class="modal-type">${this.getTypeIcon(project.type)} ${project.type}</span>
                            <span class="modal-date">${project.date}</span>
                            <span class="modal-status ${this.getStatusClass(project.status)}">
                                ${this.getStatusText(project.status)}
                            </span>
                        </div>
                        
                        <div class="modal-description">
                            <h4>Project Description</h4>
                            <p>${project.description}</p>
                        </div>
                        
                        ${project.tags.length > 0 ? `
                            <div class="modal-tags">
                                <h4>Tags & Keywords</h4>
                                <div class="tags-list">
                                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                        
                        ${project.link || project.file ? `
                            <div class="modal-links">
                                <h4>Project Resources</h4>
                                <div class="links-list">
                                    ${project.file ? `
                                        <a href="uploads/${project.file}" class="resource-link" target="_blank">
                                            <i class="fas fa-file-pdf"></i>
                                            <span>Download Project File</span>
                                        </a>
                                    ` : ''}
                                    
                                    ${project.link ? `
                                        <a href="${project.link}" class="resource-link" target="_blank">
                                            <i class="fas fa-external-link-alt"></i>
                                            <span>View External Resource</span>
                                        </a>
                                    ` : ''}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="this.closest('.project-modal').remove()">
                            Close Details
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal
        const existingModal = document.getElementById('projectModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Add modal styles
        this.addModalStyles();
    }

    addModalStyles() {
        const styleId = 'project-modal-styles';
        if (document.getElementById(styleId)) return;

        const styles = `
            .project-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                padding: 1rem;
            }
            
            .modal-content {
                background: white;
                border-radius: 12px;
                width: 100%;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: modalFadeIn 0.3s ease;
            }
            
            @keyframes modalFadeIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-header h2 {
                margin: 0;
                font-size: 1.5rem;
                color: #333;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 1.25rem;
                color: #666;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 4px;
                transition: background 0.2s;
            }
            
            .modal-close:hover {
                background: #f0f0f0;
            }
            
            .modal-body {
                padding: 1.5rem;
            }
            
            .modal-meta {
                display: flex;
                gap: 1rem;
                margin-bottom: 1.5rem;
                flex-wrap: wrap;
            }
            
            .modal-type,
            .modal-date,
            .modal-status {
                padding: 0.25rem 0.75rem;
                border-radius: 4px;
                font-size: 0.875rem;
                font-weight: 500;
            }
            
            .modal-type {
                background: #e3f2fd;
                color: #1565c0;
            }
            
            .modal-date {
                background: #f3e5f5;
                color: #7b1fa2;
            }
            
            .status-completed {
                background: #e8f5e9;
                color: #2e7d32;
            }
            
            .status-ongoing {
                background: #fff3e0;
                color: #f57c00;
            }
            
            .modal-description h4,
            .modal-tags h4,
            .modal-links h4 {
                margin: 0 0 0.75rem;
                color: #555;
                font-size: 1.125rem;
            }
            
            .modal-description {
                margin-bottom: 1.5rem;
            }
            
            .modal-description p {
                margin: 0;
                line-height: 1.6;
                color: #666;
            }
            
            .modal-tags {
                margin-bottom: 1.5rem;
            }
            
            .tags-list {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }
            
            .tag {
                background: #f5f5f5;
                color: #666;
                padding: 0.25rem 0.75rem;
                border-radius: 4px;
                font-size: 0.875rem;
            }
            
            .modal-links {
                margin-bottom: 1.5rem;
            }
            
            .links-list {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }
            
            .resource-link {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: #1565c0;
                text-decoration: none;
                padding: 0.75rem;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
                transition: all 0.2s;
            }
            
            .resource-link:hover {
                background: #f5f5f5;
                border-color: #1565c0;
            }
            
            .resource-link i {
                font-size: 1.125rem;
            }
            
            .modal-footer {
                padding: 1.5rem;
                border-top: 1px solid #eee;
                text-align: right;
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.id = styleId;
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }
}

// Initialize projects manager
let projectsManager;

document.addEventListener('DOMContentLoaded', () => {
    projectsManager = new ProjectsManager();
});