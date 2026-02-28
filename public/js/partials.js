// Component-specific JavaScript functionality

// Navbar functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeNavbar();
    initializeDropdowns();
});

function initializeNavbar() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (navMenu.classList.contains('active')) {
                if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    }
    
    // Highlight active navigation link
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    
    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.nav-dropdown-btn');
        const content = dropdown.querySelector('.nav-dropdown-content');
        
        if (btn && content) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Close other dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
                
                dropdown.classList.toggle('active');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function() {
                dropdown.classList.remove('active');
            });
            
            // Prevent dropdown from closing when clicking inside
            content.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    });
}

// Tab functionality
function initializeTabs() {
    const tabContainers = document.querySelectorAll('.tabs');
    
    tabContainers.forEach(container => {
        const tabItems = container.querySelectorAll('.tab-item');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                tabItems.forEach(tab => tab.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                this.classList.add('active');
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    });
}

// Accordion functionality
function initializeAccordions() {
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
        const items = accordion.querySelectorAll('.accordion-item');
        
        items.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            
            if (header && content) {
                header.addEventListener('click', function() {
                    const isActive = item.classList.contains('active');
                    
                    // Close all accordion items
                    items.forEach(otherItem => {
                        otherItem.classList.remove('active');
                    });
                    
                    // Toggle current item
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            }
        });
    });
}

// Progress bar animation
function animateProgressBar(progressBar, targetValue) {
    const currentValue = parseInt(progressBar.style.width) || 0;
    const increment = (targetValue - currentValue) / 20;
    
    let current = currentValue;
    const timer = setInterval(() => {
        current += increment;
        
        if ((increment > 0 && current >= targetValue) || (increment < 0 && current <= targetValue)) {
            current = targetValue;
            clearInterval(timer);
        }
        
        progressBar.style.width = current + '%';
    }, 50);
}

// Initialize progress bars
function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        const targetValue = parseInt(bar.getAttribute('data-value')) || 0;
        
        // Animate when element comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateProgressBar(bar, targetValue);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(bar);
    });
}

// Counter animation
function animateCounter(element, targetValue) {
    const startValue = 0;
    const duration = 2000;
    const increment = targetValue / (duration / 16);
    
    let current = startValue;
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= targetValue) {
            current = targetValue;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Initialize counters
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const targetValue = parseInt(counter.getAttribute('data-count')) || 0;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(counter, targetValue);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Smooth scroll functionality
function initializeSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeAccordions();
    initializeProgressBars();
    initializeCounters();
    initializeSmoothScroll();
    initializeLazyLoading();
});

// Export functions for external use
window.Components = {
    initializeTabs,
    initializeAccordions,
    initializeProgressBars,
    initializeCounters,
    animateProgressBar,
    animateCounter
};