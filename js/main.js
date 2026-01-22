// ULTRA PROFESSIONAL MICROBIOLOGY PORTFOLIO - MAIN SCRIPT
// Version: 3.0.0

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        // DOM Elements
        this.preloader = document.getElementById('preloader');
        this.navbar = document.querySelector('.navbar');
        this.navMenu = document.getElementById('navMenu');
        this.menuToggle = document.getElementById('menuToggle');
        this.themeToggle = document.getElementById('themeToggle');
        this.backToTop = document.getElementById('backToTop');
        this.collaborationForm = document.getElementById('collaborationForm');
        this.downloadCV = document.getElementById('downloadCV');
        this.currentYear = document.getElementById('currentYear');

        // Initialize components
        this.setupPreloader();
        this.setupNavigation();
        this.setupTheme();
        this.setupScrollEffects();
        this.setupForms();
        this.setupCurrentYear();
        this.setupPrintCV();

        // Initialize animations
        this.setupAnimations();
    }

    // Preloader
    setupPreloader() {
        if (!this.preloader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                this.preloader.classList.add('fade-out');
                
                setTimeout(() => {
                    this.preloader.style.display = 'none';
                }, 500);
            }, 1000);
        });
    }

    // Navigation
    setupNavigation() {
        // Mobile menu toggle
        if (this.menuToggle && this.navMenu) {
            this.menuToggle.addEventListener('click', () => {
                this.menuToggle.classList.toggle('active');
                this.navMenu.classList.toggle('active');
                document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
            });

            // Close menu on link click
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    this.menuToggle.classList.remove('active');
                    this.navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });

        // Active navigation
        this.setupActiveNavigation();
    }

    setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    // Theme Management
    setupTheme() {
        if (!this.themeToggle) return;

        // Check for saved theme or prefer-color-scheme
        const savedTheme = localStorage.getItem('theme') || 
                          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        this.setTheme(savedTheme);

        // Toggle theme on button click
        this.themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update toggle icon
        const icon = this.themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // Scroll Effects
    setupScrollEffects() {
        // Back to top button
        if (this.backToTop) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    this.backToTop.classList.add('visible');
                } else {
                    this.backToTop.classList.remove('visible');
                }
            });

            this.backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

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
                }
            });
        });
    }

    // Forms
    setupForms() {
        if (this.collaborationForm) {
            this.collaborationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCollaborationForm();
            });
        }
    }

    handleCollaborationForm() {
        const formData = {
            name: document.getElementById('inquiryName').value,
            email: document.getElementById('inquiryEmail').value,
            institution: document.getElementById('inquiryInstitution').value,
            subject: document.getElementById('inquirySubject').value,
            message: document.getElementById('inquiryMessage').value,
            timestamp: new Date().toISOString()
        };

        // Validation
        if (!this.validateForm(formData)) {
            return;
        }

        // In a real application, you would send this data to a server
        // For demo purposes, we'll simulate sending
        this.showFormMessage('Sending inquiry... Please wait.', 'info');

        setTimeout(() => {
            // Simulate API call
            this.showFormMessage('Thank you for your inquiry! We will respond within 48 hours.', 'success');
            this.collaborationForm.reset();
            
            // Store in localStorage for demo
            const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
            inquiries.unshift(formData);
            localStorage.setItem('inquiries', JSON.stringify(inquiries.slice(0, 10)));
        }, 1500);
    }

    validateForm(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!data.name.trim()) {
            this.showFormMessage('Please enter your name', 'error');
            return false;
        }
        
        if (!emailRegex.test(data.email)) {
            this.showFormMessage('Please enter a valid email address', 'error');
            return false;
        }
        
        if (!data.message.trim()) {
            this.showFormMessage('Please enter your message', 'error');
            return false;
        }
        
        return true;
    }

    showFormMessage(message, type) {
        // Remove existing messages
        const existingMsg = document.querySelector('.form-message');
        if (existingMsg) {
            existingMsg.remove();
        }

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.textContent = message;
        
        // Style the message
        messageDiv.style.cssText = `
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 0.5rem;
            font-weight: 500;
            text-align: center;
            background-color: ${type === 'error' ? '#f8d7da' : type === 'success' ? '#d4edda' : '#d1ecf1'};
            color: ${type === 'error' ? '#721c24' : type === 'success' ? '#155724' : '#0c5460'};
            border: 1px solid ${type === 'error' ? '#f5c6cb' : type === 'success' ? '#c3e6cb' : '#bee5eb'};
        `;

        // Insert after form actions
        const formActions = document.querySelector('.form-actions');
        if (formActions) {
            formActions.parentNode.insertBefore(messageDiv, formActions.nextSibling);
        }

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // Current Year
    setupCurrentYear() {
        if (this.currentYear) {
            this.currentYear.textContent = new Date().getFullYear();
        }
    }

    // Print CV
    setupPrintCV() {
        if (this.downloadCV) {
            this.downloadCV.addEventListener('click', (e) => {
                e.preventDefault();
                this.generateAcademicCV();
            });
        }
    }

    generateAcademicCV() {
        // Create a print-friendly version of the portfolio
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Ashish Pratap - Academic CV</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        line-height: 1.6; 
                        margin: 2cm; 
                        color: #333;
                    }
                    h1 { color: #0056b3; margin-bottom: 0.5rem; }
                    h2 { color: #28a745; border-bottom: 2px solid #eee; padding-bottom: 0.5rem; }
                    .header { text-align: center; margin-bottom: 2rem; }
                    .contact-info { margin-bottom: 1.5rem; }
                    .section { margin-bottom: 1.5rem; }
                    .item { margin-bottom: 1rem; }
                    .date { color: #666; font-size: 0.9em; }
                    .skills { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }
                    .skill { background: #f0f0f0; padding: 0.25rem 0.5rem; border-radius: 3px; font-size: 0.9em; }
                    @media print {
                        @page { margin: 1cm; }
                        body { margin: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Ashish Pratap</h1>
                    <p>B.Sc Microbiology Student (2024-2027)</p>
                    <div class="contact-info">
                        <p>Email: opashishytff@gmail.com | Portfolio: opashishyt.github.io</p>
                        <p>Instagram: @_op_ashish_yt__</p>
                    </div>
                </div>
                
                <div class="section">
                    <h2>Academic Profile</h2>
                    <p>Aspiring Clinical Microbiologist specializing in diagnostic methodologies, 
                    pathogenic analysis, and antimicrobial research. Currently advancing foundational 
                    knowledge in medical microbiology through rigorous academic pursuit and practical 
                    laboratory training.</p>
                </div>
                
                <div class="section">
                    <h2>Education</h2>
                    <div class="item">
                        <h3>B.Sc Microbiology</h3>
                        <p class="date">2024 - 2027 (Expected)</p>
                        <p>Specialization in Clinical Microbiology and Diagnostic Techniques</p>
                    </div>
                </div>
                
                <div class="section">
                    <h2>Research Focus Areas</h2>
                    <ul>
                        <li>Antimicrobial Resistance Studies</li>
                        <li>Viral Diagnostic Methods</li>
                        <li>Environmental Microbiology</li>
                        <li>Pathogenic Analysis</li>
                    </ul>
                </div>
                
                <div class="section">
                    <h2>Laboratory Skills</h2>
                    <div class="skills">
                        <span class="skill">Aseptic Techniques</span>
                        <span class="skill">Microbial Culturing</span>
                        <span class="skill">Staining Methods</span>
                        <span class="skill">Biochemical Analysis</span>
                        <span class="skill">Microscopy</span>
                        <span class="skill">Antibiotic Sensitivity Testing</span>
                        <span class="skill">Quality Control Procedures</span>
                        <span class="skill">Research Methodology</span>
                    </div>
                </div>
                
                <div class="section">
                    <h2>Academic Timeline</h2>
                    <div class="item">
                        <h3>2024: Program Commencement</h3>
                        <p>Foundational courses in microbiology, biochemistry, and laboratory techniques</p>
                    </div>
                    <div class="item">
                        <h3>2025: Specialization Phase</h3>
                        <p>Advanced courses in medical microbiology, immunology, and diagnostics</p>
                    </div>
                    <div class="item">
                        <h3>2026: Research Intensive</h3>
                        <p>Independent research projects and clinical laboratory preparation</p>
                    </div>
                    <div class="item">
                        <h3>2027: Expected Graduation</h3>
                        <p>Comprehensive knowledge in clinical microbiology and professional readiness</p>
                    </div>
                </div>
                
                <div class="section">
                    <h2>Contact for Collaboration</h2>
                    <p>Open to research partnerships, academic projects, and laboratory internships in the 
                    field of microbiology and clinical diagnostics.</p>
                    <p>Primary Contact: opashishytff@gmail.com</p>
                </div>
                
                <div style="margin-top: 2rem; text-align: center; font-size: 0.9em; color: #666;">
                    <p>Generated from Academic Portfolio - ${new Date().toLocaleDateString()}</p>
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        // Print after a short delay
        setTimeout(() => {
            printWindow.print();
        }, 500);
    }

    // Animations
    setupAnimations() {
        // Initialize Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.expertise-card, .research-card, .project-card, .timeline-item').forEach(el => {
            observer.observe(el);
        });

        // Add CSS for animations
        const style = document.createElement('style');
        style.textContent = `
            .expertise-card,
            .research-card,
            .project-card,
            .timeline-item {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .expertise-card.animate-in,
            .research-card.animate-in,
            .project-card.animate-in,
            .timeline-item.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .timeline-item:nth-child(even) {
                transition-delay: 0.2s;
            }
            
            .timeline-item:nth-child(odd) {
                transition-delay: 0.4s;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});