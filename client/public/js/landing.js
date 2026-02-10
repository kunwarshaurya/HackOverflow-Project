// Landing page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeLandingAnimations();
    initializeFeatureCards();
    initializeScrollEffects();
});

function initializeLandingAnimations() {
    // Animate hero elements on load
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    
    if (heroTitle) {
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 300);
    }
    
    if (heroSubtitle) {
        setTimeout(() => {
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 600);
    }
    
    if (heroButtons) {
        setTimeout(() => {
            heroButtons.style.opacity = '1';
            heroButtons.style.transform = 'translateY(0)';
        }, 900);
    }
    
    // Animate floating elements
    animateFloatingElements();
}

function animateFloatingElements() {
    const floatingElements = document.querySelectorAll('.float-element');
    
    floatingElements.forEach((element, index) => {
        const delay = index * 200;
        const duration = 3000 + (index * 500);
        
        setTimeout(() => {
            element.style.animation = `float ${duration}ms ease-in-out infinite`;
        }, delay);
    });
}

function initializeFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    // Add hover effects
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Animate cards on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
}

function initializeScrollEffects() {
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const heroGraphic = document.querySelector('.hero-graphic');
    
    if (hero && heroGraphic) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            heroGraphic.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Fade in sections on scroll
    const sections = document.querySelectorAll('.features, .cta');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.8s ease-out';
        sectionObserver.observe(section);
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        25% { transform: translateY(-10px) rotate(5deg); }
        50% { transform: translateY(-5px) rotate(-3deg); }
        75% { transform: translateY(-15px) rotate(3deg); }
    }
    
    .hero-title, .hero-subtitle, .hero-buttons {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease-out;
    }
    
    .feature-card {
        transition: all 0.3s ease-out;
    }
    
    .floating-elements {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
    }
    
    .float-element {
        position: absolute;
        opacity: 0.1;
        font-size: 2rem;
        color: var(--primary-color);
    }
    
    .float-element:nth-child(1) {
        top: 20%;
        left: 10%;
    }
    
    .float-element:nth-child(2) {
        top: 60%;
        right: 15%;
    }
    
    .float-element:nth-child(3) {
        bottom: 30%;
        left: 20%;
    }
`;
document.head.appendChild(style);