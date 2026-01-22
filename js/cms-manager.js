// COMPLETE WEBSITE CMS SYSTEM
// Version: 1.0.0

class CMSManager {
    constructor() {
        this.settings = this.loadSettings();
        this.sections = this.loadSections();
        this.media = this.loadMedia();
        this.init();
    }

    init() {
        this.loadWebsiteContent();
        this.setupCMSListeners();
    }

    // ========== SETTINGS MANAGEMENT ==========
    loadSettings() {
        try {
            const saved = localStorage.getItem('websiteSettings');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error loading settings:', e);
        }

        // Default settings
        return {
            // Site Info
            siteName: "Ashish Pratap Portfolio",
            siteTitle: "Ashish Pratap | Microbiology Researcher",
            siteDescription: "Aspiring Clinical Microbiologist | B.Sc Microbiology (2024-2027)",
            siteKeywords: "Microbiology, Clinical Microbiology, B.Sc Microbiology, Research",
            
            // Personal Info
            fullName: "Ashish Pratap",
            title: "Microbiology Researcher",
            degree: "B.Sc Microbiology",
            duration: "2024-2027",
            email: "opashishytff@gmail.com",
            website: "https://opashishyt.github.io",
            instagram: "https://www.instagram.com/_op_ashish_yt__",
            
            // Social Media
            socialLinks: {
                instagram: "https://www.instagram.com/_op_ashish_yt__",
                email: "mailto:opashishytff@gmail.com",
                website: "https://opashishyt.github.io",
                linkedin: "",
                github: "",
                twitter: ""
            },
            
            // Contact Info
            contactInfo: {
                primaryEmail: "opashishytff@gmail.com",
                secondaryEmail: "",
                phone: "",
                address: "B.Sc Microbiology Program, 2024-2027 Cohort",
                institution: "Microbiology University"
            },
            
            // SEO & Meta
            meta: {
                author: "Ashish Pratap",
                ogImage: "https://opashishyt.github.io/assets/og-image.jpg",
                ogUrl: "https://opashishyt.github.io",
                ogDescription: "Aspiring Clinical Microbiologist | B.Sc Microbiology (2024-2027)"
            },
            
            // Appearance
            appearance: {
                primaryColor: "#0056b3",
                secondaryColor: "#28a745",
                fontPrimary: "'Inter', sans-serif",
                fontSecondary: "'Source Serif Pro', serif",
                logoIcon: "🔬",
                favicon: ""
            },
            
            // Statistics
            stats: {
                projects: 3,
                labTechniques: 15,
                graduationYear: 2027,
                researchProjects: 3
            },
            
            // Features
            features: {
                darkMode: true,
                printCV: true,
                contactForm: true,
                adminPanel: true
            },
            
            lastUpdated: new Date().toISOString(),
            version: "3.0.0"
        };
    }

    saveSettings() {
        try {
            this.settings.lastUpdated = new Date().toISOString();
            localStorage.setItem('websiteSettings', JSON.stringify(this.settings));
            return true;
        } catch (e) {
            console.error('Error saving settings:', e);
            return false;
        }
    }

    // ========== SECTIONS MANAGEMENT ==========
    loadSections() {
        try {
            const saved = localStorage.getItem('websiteSections');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error loading sections:', e);
        }

        // Default sections content
        return {
            hero: {
                title: "Ashish Pratap",
                subtitle: "Clinical Microbiology",
                description: "Aspiring clinical microbiologist specializing in diagnostic methodologies, pathogenic analysis, and antimicrobial research. Currently advancing foundational knowledge in medical microbiology through rigorous academic pursuit and practical laboratory training.",
                badge1: "B.Sc Microbiology",
                badge2: "2024-2027"
            },
            
            about: {
                title: "About Me",
                subtitle: "Professional Profile",
                description: "Dedicated undergraduate student pursuing B.Sc in Microbiology with a specialized focus on clinical diagnostics and pathogenic analysis. Committed to advancing medical microbiology through evidence-based research and innovative diagnostic methodologies.",
                
                expertise: {
                    lab: {
                        title: "Laboratory Techniques",
                        items: ["Aseptic Techniques", "Microbial Culturing", "Staining Methods", "Biochemical Analysis"]
                    },
                    diagnostic: {
                        title: "Diagnostic Skills",
                        items: ["Pathogen Identification", "Antibiotic Sensitivity", "Microscopic Analysis", "Quality Control"]
                    },
                    research: {
                        title: "Research Methodology",
                        items: ["Experimental Design", "Data Analysis", "Scientific Writing", "Literature Review"]
                    }
                }
            },
            
            academics: {
                title: "Academic Timeline",
                subtitle: "Educational Journey",
                
                timeline: [
                    {
                        year: "2024",
                        title: "Program Commencement",
                        description: "Initiated B.Sc Microbiology program with foundational courses in general microbiology, biochemistry, and cellular biology. Began laboratory training in basic microbiological techniques.",
                        skills: ["Microbiology Fundamentals", "Laboratory Safety", "Cell Biology"]
                    },
                    {
                        year: "2025",
                        title: "Specialization Phase",
                        description: "Advanced to specialized courses in medical microbiology, immunology, and microbial genetics. Intensive laboratory work focusing on diagnostic techniques and pathogenic analysis.",
                        skills: ["Medical Microbiology", "Immunology", "Diagnostic Methods"]
                    },
                    {
                        year: "2026",
                        title: "Research Intensive",
                        description: "Focus on research methodology, clinical microbiology, and antimicrobial studies. Undertaking independent research projects and preparing for clinical laboratory exposure.",
                        skills: ["Research Methods", "Clinical Microbiology", "Antimicrobial Studies"]
                    },
                    {
                        year: "2027",
                        title: "Program Completion",
                        description: "Expected graduation with comprehensive knowledge in clinical microbiology, equipped for professional laboratory roles or advanced studies in medical microbiology.",
                        skills: ["Clinical Competence", "Research Capability", "Professional Readiness"]
                    }
                ]
            },
            
            research: {
                title: "Research Focus Areas",
                subtitle: "Scientific Inquiry",
                
                areas: [
                    {
                        title: "Antimicrobial Resistance",
                        icon: "fas fa-bacteria",
                        description: "Investigating emerging patterns of antibiotic resistance in clinically significant pathogens and exploring alternative therapeutic approaches.",
                        tags: ["AMR", "Pathogens", "Therapeutics"]
                    },
                    {
                        title: "Viral Diagnostics",
                        icon: "fas fa-virus",
                        description: "Studying rapid diagnostic methods for viral infections with emphasis on molecular techniques and point-of-care testing.",
                        tags: ["Virology", "Diagnostics", "Molecular Methods"]
                    },
                    {
                        title: "Environmental Microbiology",
                        icon: "fas fa-seedling",
                        description: "Analyzing microbial communities in environmental samples and their implications for public health and ecosystem balance.",
                        tags: ["Ecology", "Public Health", "Bioremediation"]
                    }
                ]
            },
            
            contact: {
                title: "Contact & Collaboration",
                subtitle: "Professional Network",
                description: "Open to research partnerships, academic projects, and laboratory internships"
            },
            
            footer: {
                mission: "Advancing medical microbiology through rigorous research and evidence-based diagnostic approaches.",
                copyright: "Ashish Pratap. All rights reserved.",
                disclaimer: "This portfolio represents academic work and research interests."
            }
        };
    }

    saveSections() {
        try {
            localStorage.setItem('websiteSections', JSON.stringify(this.sections));
            return true;
        } catch (e) {
            console.error('Error saving sections:', e);
            return false;
        }
    }

    // ========== MEDIA MANAGEMENT ==========
    loadMedia() {
        try {
            const saved = localStorage.getItem('websiteMedia');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error loading media:', e);
        }

        return {
            logo: {
                icon: "🔬",
                name: "ASHISH PRATAP",
                title: "Microbiology Researcher"
            },
            heroImage: "",
            profileImage: "",
            projectImages: [],
            gallery: []
        };
    }

    saveMedia() {
        try {
            localStorage.setItem('websiteMedia', JSON.stringify(this.media));
            return true;
        } catch (e) {
            console.error('Error saving media:', e);
            return false;
        }
    }

    // ========== WEBSITE CONTENT LOADING ==========
    loadWebsiteContent() {
        // Load only on main page
        if (!window.location.pathname.includes('admin') && 
            !window.location.pathname.includes('dashboard')) {
            this.updateDOMContent();
        }
    }

    updateDOMContent() {
        // Update Hero Section
        this.updateHeroSection();
        
        // Update About Section
        this.updateAboutSection();
        
        // Update Academics Section
        this.updateAcademicsSection();
        
        // Update Research Section
        this.updateResearchSection();
        
        // Update Contact Section
        this.updateContactSection();
        
        // Update Footer
        this.updateFooter();
        
        // Update Page Meta
        this.updatePageMeta();
        
        // Update Social Links
        this.updateSocialLinks();
    }

    updateHeroSection() {
        const hero = this.sections.hero;
        const settings = this.settings;
        
        // Update title
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.innerHTML = `
                <span class="title-line">${settings.fullName}</span>
                <span class="title-line highlight">${hero.subtitle}</span>
                <span class="title-line">Researcher</span>
            `;
        }
        
        // Update badges
        const badge1 = document.querySelector('.hero-badge .badge:nth-child(1)');
        const badge2 = document.querySelector('.hero-badge .badge.badge-accent');
        if (badge1) badge1.textContent = settings.degree;
        if (badge2) badge2.textContent = settings.duration;
        
        // Update description
        const desc = document.querySelector('.hero-description');
        if (desc) desc.textContent = hero.description;
        
        // Update stats
        const stats = document.querySelectorAll('.stat-number');
        if (stats.length >= 3) {
            stats[0].textContent = settings.stats.researchProjects + "+";
            stats[1].textContent = settings.stats.labTechniques + "+";
            stats[2].textContent = settings.stats.graduationYear;
        }
    }

    updateAboutSection() {
        const about = this.sections.about;
        
        // Update section titles
        const sectionTitle = document.querySelector('#about .section-title');
        const sectionSubtitle = document.querySelector('#about .section-subtitle');
        if (sectionTitle) sectionTitle.textContent = about.title;
        if (sectionSubtitle) sectionSubtitle.textContent = about.subtitle;
        
        // Update description
        const desc = document.querySelector('#about .about-intro p');
        if (desc) desc.textContent = about.description;
        
        // Update expertise cards
        const cards = document.querySelectorAll('.expertise-card');
        if (cards.length >= 3) {
            // Lab Techniques
            cards[0].querySelector('h5').textContent = about.expertise.lab.title;
            const labItems = cards[0].querySelectorAll('li');
            about.expertise.lab.items.forEach((item, index) => {
                if (labItems[index]) labItems[index].textContent = item;
            });
            
            // Diagnostic Skills
            cards[1].querySelector('h5').textContent = about.expertise.diagnostic.title;
            const diagItems = cards[1].querySelectorAll('li');
            about.expertise.diagnostic.items.forEach((item, index) => {
                if (diagItems[index]) diagItems[index].textContent = item;
            });
            
            // Research Methodology
            cards[2].querySelector('h5').textContent = about.expertise.research.title;
            const researchItems = cards[2].querySelectorAll('li');
            about.expertise.research.items.forEach((item, index) => {
                if (researchItems[index]) researchItems[index].textContent = item;
            });
        }
        
        // Update academic profile
        const infoItems = document.querySelectorAll('.info-item');
        if (infoItems.length >= 4) {
            infoItems[0].querySelector('.info-value').textContent = this.settings.degree;
            infoItems[1].querySelector('.info-value').textContent = this.settings.duration;
            infoItems[2].querySelector('.info-value').textContent = "Clinical Microbiology";
            infoItems[3].querySelector('.info-value').textContent = "Active Student";
        }
    }

    updateAcademicsSection() {
        const academics = this.sections.academics;
        
        // Update section titles
        const sectionTitle = document.querySelector('#academics .section-title');
        const sectionSubtitle = document.querySelector('#academics .section-subtitle');
        if (sectionTitle) sectionTitle.textContent = academics.title;
        if (sectionSubtitle) sectionSubtitle.textContent = academics.subtitle;
        
        // Update timeline items
        const timelineItems = document.querySelectorAll('.timeline-item');
        academics.timeline.forEach((item, index) => {
            if (timelineItems[index]) {
                // Update year
                timelineItems[index].querySelector('.marker-date').textContent = item.year;
                
                // Update title
                timelineItems[index].querySelector('h3').textContent = item.title;
                
                // Update description
                timelineItems[index].querySelector('p').textContent = item.description;
                
                // Update skills
                const skillTags = timelineItems[index].querySelectorAll('.skill-tag');
                item.skills.forEach((skill, skillIndex) => {
                    if (skillTags[skillIndex]) {
                        skillTags[skillIndex].textContent = skill;
                    }
                });
            }
        });
    }

    updateResearchSection() {
        const research = this.sections.research;
        
        // Update section titles
        const sectionTitle = document.querySelector('#research .section-title');
        const sectionSubtitle = document.querySelector('#research .section-subtitle');
        if (sectionTitle) sectionTitle.textContent = research.title;
        if (sectionSubtitle) sectionSubtitle.textContent = research.subtitle;
        
        // Update research cards
        const researchCards = document.querySelectorAll('.research-card');
        research.areas.forEach((area, index) => {
            if (researchCards[index]) {
                // Update icon
                const icon = researchCards[index].querySelector('.research-icon i');
                if (icon) {
                    icon.className = area.icon;
                }
                
                // Update title
                researchCards[index].querySelector('h3').textContent = area.title;
                
                // Update description
                researchCards[index].querySelector('p').textContent = area.description;
                
                // Update tags
                const tags = researchCards[index].querySelectorAll('.research-tags span');
                area.tags.forEach((tag, tagIndex) => {
                    if (tags[tagIndex]) {
                        tags[tagIndex].textContent = tag;
                    }
                });
            }
        });
    }

    updateContactSection() {
        const settings = this.settings;
        const contact = this.sections.contact;
        
        // Update section titles
        const sectionTitle = document.querySelector('#contact .section-title');
        const sectionSubtitle = document.querySelector('#contact .section-subtitle');
        if (sectionTitle) sectionTitle.textContent = contact.title;
        if (sectionSubtitle) sectionSubtitle.textContent = contact.subtitle;
        
        // Update contact description
        const contactDesc = document.querySelector('.contact-header p');
        if (contactDesc) contactDesc.textContent = contact.description;
        
        // Update email
        const emailLink = document.querySelector('a[href^="mailto:"]');
        if (emailLink) {
            emailLink.href = `mailto:${settings.email}`;
            emailLink.textContent = settings.email;
        }
        
        // Update website
        const websiteLink = document.querySelector('.detail-item:nth-child(2) .detail-link');
        if (websiteLink) {
            websiteLink.href = settings.website;
            websiteLink.textContent = settings.website.replace('https://', '');
        }
        
        // Update Instagram
        const instagramLink = document.querySelector('.detail-item:nth-child(3) .detail-link');
        if (instagramLink) {
            instagramLink.href = settings.instagram;
            instagramLink.textContent = settings.instagram.includes('instagram.com/') 
                ? '@' + settings.instagram.split('instagram.com/')[1]
                : settings.instagram;
        }
        
        // Update address
        const addressText = document.querySelectorAll('.detail-text');
        if (addressText[0]) {
            addressText[0].textContent = settings.contactInfo.address;
        }
    }

    updateFooter() {
        const settings = this.settings;
        const footer = this.sections.footer;
        
        // Update logo
        const logoName = document.querySelector('.footer-logo .logo-name');
        const logoTitle = document.querySelector('.footer-logo .logo-title');
        if (logoName) logoName.textContent = settings.fullName;
        if (logoTitle) logoTitle.textContent = settings.title;
        
        // Update mission
        const mission = document.querySelector('.footer-mission');
        if (mission) mission.textContent = footer.mission;
        
        // Update copyright
        const copyright = document.querySelector('.copyright p');
        if (copyright) {
            const year = new Date().getFullYear();
            copyright.innerHTML = `&copy; ${year} ${footer.copyright}`;
        }
        
        // Update disclaimer
        const disclaimer = document.querySelector('.disclaimer');
        if (disclaimer) disclaimer.textContent = footer.disclaimer;
        
        // Update credentials
        const degreeSpan = document.querySelector('.credential-item:nth-child(1) span');
        if (degreeSpan) {
            degreeSpan.textContent = `${settings.degree} (${settings.duration})`;
        }
    }

    updatePageMeta() {
        const settings = this.settings;
        
        // Update page title
        document.title = settings.siteTitle;
        
        // Update meta description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = "description";
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = settings.siteDescription;
        
        // Update meta keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.name = "keywords";
            document.head.appendChild(metaKeywords);
        }
        metaKeywords.content = settings.siteKeywords;
        
        // Update OG tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDesc = document.querySelector('meta[property="og:description"]');
        const ogImage = document.querySelector('meta[property="og:image"]');
        const ogUrl = document.querySelector('meta[property="og:url"]');
        
        if (ogTitle) ogTitle.content = settings.meta.ogTitle || settings.siteTitle;
        if (ogDesc) ogDesc.content = settings.meta.ogDescription || settings.siteDescription;
        if (ogImage) ogImage.content = settings.meta.ogImage;
        if (ogUrl) ogUrl.content = settings.meta.ogUrl || settings.website;
    }

    updateSocialLinks() {
        const settings = this.settings;
        
        // Update social links in footer
        const instagramLink = document.querySelector('a[href*="instagram.com"]');
        const emailLink = document.querySelector('a[href^="mailto:"]');
        const websiteLink = document.querySelector('a[href="https://opashishyt.github.io"]');
        
        if (instagramLink && settings.socialLinks.instagram) {
            instagramLink.href = settings.socialLinks.instagram;
        }
        
        if (emailLink && settings.socialLinks.email) {
            emailLink.href = settings.socialLinks.email;
        }
        
        if (websiteLink && settings.socialLinks.website) {
            websiteLink.href = settings.socialLinks.website;
        }
    }

    // ========== DASHBOARD CMS FUNCTIONS ==========
    setupCMSListeners() {
        // Setup only on dashboard
        if (window.location.pathname.includes('dashboard.html')) {
            this.setupDashboardCMS();
        }
    }

    setupDashboardCMS() {
        // Setup action cards
        this.setupActionCards();
    }

    setupActionCards() {
        const actionCards = document.querySelectorAll('.action-card');
        actionCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const action = card.querySelector('h4').textContent.toLowerCase();
                this.openEditor(action);
            });
        });
    }

    openEditor(section) {
        let modalHTML = '';
        let title = '';
        let icon = '';

        switch(section) {
            case 'basic':
            case 'basic information':
                title = 'Basic Information';
                icon = 'fas fa-info-circle';
                modalHTML = this.getBasicInfoEditor();
                break;
                
            case 'hero':
                title = 'Hero Section';
                icon = 'fas fa-home';
                modalHTML = this.getHeroEditor();
                break;
                
            case 'about':
                title = 'About Section';
                icon = 'fas fa-user';
                modalHTML = this.getAboutEditor();
                break;
                
            case 'academics':
                title = 'Academics Timeline';
                icon = 'fas fa-graduation-cap';
                modalHTML = this.getAcademicsEditor();
                break;
                
            case 'research':
                title = 'Research Areas';
                icon = 'fas fa-flask';
                modalHTML = this.getResearchEditor();
                break;
                
            case 'contact':
                title = 'Contact Information';
                icon = 'fas fa-envelope';
                modalHTML = this.getContactEditor();
                break;
                
            case 'social':
                title = 'Social Media Links';
                icon = 'fas fa-share-alt';
                modalHTML = this.getSocialEditor();
                break;
                
            case 'appearance':
                title = 'Appearance Settings';
                icon = 'fas fa-palette';
                modalHTML = this.getAppearanceEditor();
                break;
                
            case 'media':
                title = 'Media Library';
                icon = 'fas fa-images';
                modalHTML = this.getMediaEditor();
                break;
                
            default:
                return;
        }

        // Remove existing modal
        const existingModal = document.querySelector('.cms-editor-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'cms-editor-modal';
        modal.innerHTML = `
            <div class="cms-editor-content">
                <div class="editor-header">
                    <h3><i class="${icon}"></i> ${title}</h3>
                    <button class="editor-close" onclick="this.closest('.cms-editor-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                ${modalHTML}
            </div>
        `;

        document.body.appendChild(modal);

        // Setup form submission
        this.setupEditorForm(section, modal);
    }

    getBasicInfoEditor() {
        return `
            <div class="editor-body">
                <form class="editor-form" id="basicInfoForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="fullName">Full Name *</label>
                            <input type="text" id="fullName" value="${this.settings.fullName}" required>
                        </div>
                        <div class="form-group">
                            <label for="title">Professional Title</label>
                            <input type="text" id="title" value="${this.settings.title}">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="degree">Degree Program</label>
                            <input type="text" id="degree" value="${this.settings.degree}">
                        </div>
                        <div class="form-group">
                            <label for="duration">Duration</label>
                            <input type="text" id="duration" value="${this.settings.duration}">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Primary Email *</label>
                        <input type="email" id="email" value="${this.settings.email}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="website">Website URL</label>
                        <input type="url" id="website" value="${this.settings.website}">
                    </div>
                    
                    <div class="editor-actions">
                        <button type="button" class="btn btn-outline" onclick="this.closest('.cms-editor-modal').remove()">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    getHeroEditor() {
        return `
            <div class="editor-body">
                <form class="editor-form" id="heroForm">
                    <div class="form-group">
                        <label for="heroSubtitle">Hero Subtitle</label>
                        <input type="text" id="heroSubtitle" value="${this.sections.hero.subtitle}">
                    </div>
                    
                    <div class="form-group">
                        <label for="heroDescription">Hero Description</label>
                        <textarea id="heroDescription" rows="4">${this.sections.hero.description}</textarea>
                    </div>
                    
                    <div class="editor-actions">
                        <button type="button" class="btn btn-outline" onclick="this.closest('.cms-editor-modal').remove()">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    getAboutEditor() {
        return `
            <div class="editor-body">
                <form class="editor-form" id="aboutForm">
                    <div class="form-group">
                        <label for="aboutTitle">Section Title</label>
                        <input type="text" id="aboutTitle" value="${this.sections.about.title}">
                    </div>
                    
                    <div class="form-group">
                        <label for="aboutSubtitle">Section Subtitle</label>
                        <input type="text" id="aboutSubtitle" value="${this.sections.about.subtitle}">
                    </div>
                    
                    <div class="form-group">
                        <label for="aboutDescription">Description</label>
                        <textarea id="aboutDescription" rows="4">${this.sections.about.description}</textarea>
                    </div>
                    
                    <h4>Expertise Areas</h4>
                    
                    <div class="form-group">
                        <label for="labTitle">Laboratory Techniques Title</label>
                        <input type="text" id="labTitle" value="${this.sections.about.expertise.lab.title}">
                    </div>
                    
                    <div class="form-group">
                        <label>Laboratory Skills</label>
                        <div class="array-items" id="labSkills">
                            ${this.sections.about.expertise.lab.items.map(item => `
                                <div class="array-item">
                                    <span>${item}</span>
                                    <button type="button" onclick="this.parentElement.remove()">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                        <div class="add-item-form">
                            <input type="text" id="newLabSkill" placeholder="New skill">
                            <button type="button" class="btn btn-sm" onclick="cmsManager.addItem('labSkills', 'newLabSkill')">
                                Add
                            </button>
                        </div>
                    </div>
                    
                    <div class="editor-actions">
                        <button type="button" class="btn btn-outline" onclick="this.closest('.cms-editor-modal').remove()">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    setupEditorForm(section, modal) {
        const form = modal.querySelector('form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEditorChanges(section, form);
        });
    }

    saveEditorChanges(section, form) {
        switch(section) {
            case 'basic':
                this.saveBasicInfo(form);
                break;
            case 'hero':
                this.saveHeroSection(form);
                break;
            case 'about':
                this.saveAboutSection(form);
                break;
            // Add other cases as needed
        }
    }

    saveBasicInfo(form) {
        this.settings.fullName = form.querySelector('#fullName').value.trim();
        this.settings.title = form.querySelector('#title').value.trim();
        this.settings.degree = form.querySelector('#degree').value.trim();
        this.settings.duration = form.querySelector('#duration').value.trim();
        this.settings.email = form.querySelector('#email').value.trim();
        this.settings.website = form.querySelector('#website').value.trim();
        
        // Update contact info
        this.settings.contactInfo.primaryEmail = this.settings.email;
        this.settings.contactInfo.address = `${this.settings.degree} Program, ${this.settings.duration} Cohort`;
        
        // Update social links
        this.settings.socialLinks.email = `mailto:${this.settings.email}`;
        this.settings.socialLinks.website = this.settings.website;
        
        if (this.saveSettings()) {
            this.showMessage('Basic information updated successfully!', 'success');
            this.closeModal();
        }
    }

    saveHeroSection(form) {
        this.sections.hero.subtitle = form.querySelector('#heroSubtitle').value.trim();
        this.sections.hero.description = form.querySelector('#heroDescription').value.trim();
        
        if (this.saveSections()) {
            this.showMessage('Hero section updated successfully!', 'success');
            this.closeModal();
        }
    }

    saveAboutSection(form) {
        this.sections.about.title = form.querySelector('#aboutTitle').value.trim();
        this.sections.about.subtitle = form.querySelector('#aboutSubtitle').value.trim();
        this.sections.about.description = form.querySelector('#aboutDescription').value.trim();
        this.sections.about.expertise.lab.title = form.querySelector('#labTitle').value.trim();
        
        // Get lab skills
        const labSkills = Array.from(form.querySelectorAll('#labSkills .array-item span'))
            .map(span => span.textContent);
        this.sections.about.expertise.lab.items = labSkills;
        
        if (this.saveSections()) {
            this.showMessage('About section updated successfully!', 'success');
            this.closeModal();
        }
    }

    addItem(containerId, inputId) {
        const container = document.getElementById(containerId);
        const input = document.getElementById(inputId);
        
        if (!container || !input || !input.value.trim()) return;
        
        const newItem = document.createElement('div');
        newItem.className = 'array-item';
        newItem.innerHTML = `
            <span>${input.value.trim()}</span>
            <button type="button" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(newItem);
        input.value = '';
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMsg = document.querySelector('.cms-message');
        if (existingMsg) {
            existingMsg.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `cms-message cms-message-${type}`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 3000);
    }

    closeModal() {
        const modal = document.querySelector('.cms-editor-modal');
        if (modal) {
            modal.remove();
        }
    }

    // ========== BACKUP & RESTORE ==========
    backupAllData() {
        const backup = {
            settings: this.settings,
            sections: this.sections,
            media: this.media,
            projects: JSON.parse(localStorage.getItem('portfolioProjects') || '[]'),
            timestamp: new Date().toISOString(),
            version: '3.0.0'
        };
        
        const dataStr = JSON.stringify(backup, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `portfolio-complete-backup-${new Date().getTime()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showMessage('Complete backup downloaded!', 'success');
    }

    resetToDefaults() {
        if (!confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
            return;
        }
        
        localStorage.removeItem('websiteSettings');
        localStorage.removeItem('websiteSections');
        localStorage.removeItem('websiteMedia');
        
        this.settings = this.loadSettings();
        this.sections = this.loadSections();
        this.media = this.loadMedia();
        
        this.showMessage('All settings reset to defaults!', 'success');
        
        // Reload page if on dashboard
        if (window.location.pathname.includes('dashboard.html')) {
            setTimeout(() => location.reload(), 1000);
        }
    }
}

// Initialize CMS Manager
let cmsManager;

document.addEventListener('DOMContentLoaded', () => {
    cmsManager = new CMSManager();
});