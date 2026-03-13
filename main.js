/**
 * ============================================
 * KINGDOM LANDING PAGE - MAIN JAVASCRIPT
 * Interactive functionality and animations
 * ============================================
 */

// ============================================
// DOM ELEMENTS
// ============================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const testimonialsTrack = document.getElementById('testimonialsTrack');
const sliderPrev = document.getElementById('sliderPrev');
const sliderNext = document.getElementById('sliderNext');
const sliderDots = document.querySelectorAll('.dot');
const currentYear = document.getElementById('currentYear');

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initTestimonialsSlider();
    initContactForm();
    initScrollReveal();
    updateCurrentYear();
});

// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================
function initNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Active link highlighting on scroll
    window.addEventListener('scroll', () => {
        highlightActiveLink();
    });
}

// Highlight active navigation link based on scroll position
function highlightActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ============================================
// SCROLL EFFECTS
// ============================================
function initScrollEffects() {
    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // Back to top functionality
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// TESTIMONIALS SLIDER
// ============================================
let currentSlide = 0;
const totalSlides = 4;

function initTestimonialsSlider() {
    // Previous button
    sliderPrev.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
    });

    // Next button
    sliderNext.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
    });

    // Dot navigation
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });

    // Auto-play slider
    setInterval(() => {
        goToSlide(currentSlide + 1);
    }, 6000);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToSlide(currentSlide - 1);
        } else if (e.key === 'ArrowRight') {
            goToSlide(currentSlide + 1);
        }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    testimonialsTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    testimonialsTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                goToSlide(currentSlide + 1); // Swipe left - next
            } else {
                goToSlide(currentSlide - 1); // Swipe right - previous
            }
        }
    }
}

function goToSlide(index) {
    // Handle wrap-around
    if (index < 0) {
        index = totalSlides - 1;
    } else if (index >= totalSlides) {
        index = 0;
    }

    currentSlide = index;

    // Update track position
    testimonialsTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update dots
    sliderDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

// ============================================
// CONTACT FORM
// ============================================
function initContactForm() {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Validate form
        if (validateForm(data)) {
            // Simulate form submission
            submitForm(data);
        }
    });

    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });

        input.addEventListener('input', () => {
            clearError(input);
        });
    });
}

function validateForm(data) {
    let isValid = true;

    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        showError('name', 'Please enter your name (at least 2 characters)');
        isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    // Subject validation
    if (!data.subject) {
        showError('subject', 'Please select a subject');
        isValid = false;
    }

    // Message validation
    if (!data.message || data.message.trim().length < 10) {
        showError('message', 'Please enter a message (at least 10 characters)');
        isValid = false;
    }

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;

    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                showError(fieldName, 'Please enter your name (at least 2 characters)');
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showError(fieldName, 'Please enter a valid email address');
            }
            break;
        case 'subject':
            if (!value) {
                showError(fieldName, 'Please select a subject');
            }
            break;
        case 'message':
            if (value.length < 10) {
                showError(fieldName, 'Please enter a message (at least 10 characters)');
            }
            break;
    }
}

function showError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const formGroup = field.closest('.form-group');

    // Remove existing error
    clearError(field);

    // Add error styling
    formGroup.classList.add('error');
    field.style.borderColor = '#e74c3c';

    // Create error message
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #e74c3c;
        font-size: 0.85rem;
        margin-top: 5px;
        display: block;
    `;

    formGroup.appendChild(errorElement);
}

function clearError(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error');
    field.style.borderColor = '';

    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

function submitForm(data) {
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Hide form and show success message
        contactForm.style.display = 'none';
        formSuccess.classList.add('active');

        // Reset form
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Log form data (in production, send to server)
        console.log('Form submitted:', data);
    }, 1500);
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.service-card, .skill-card, .project-mini-card, .stat-item, .mission-box'
    );

    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        revealObserver.observe(el);
    });

    // Add revealed class styles
    const style = document.createElement('style');
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function updateCurrentYear() {
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
}

// ============================================
// PARALLAX EFFECT (Optional Enhancement)
// ============================================
function initParallax() {
    const heroBg = document.querySelector('.hero-bg-image');
    
    if (heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            heroBg.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Initialize parallax on load
window.addEventListener('load', initParallax);

// ============================================
// TYPING EFFECT (Optional - for hero title)
// ============================================
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    const text = heroTitle.innerHTML;
    heroTitle.innerHTML = '';
    heroTitle.style.opacity = '1';

    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };

    // Start typing after initial fade-in
    setTimeout(typeWriter, 1000);
}

// Uncomment to enable typing effect
// document.addEventListener('DOMContentLoaded', initTypingEffect);

// ============================================
// COUNTER ANIMATION (for stats)
// ============================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    // Scroll-based animations can be added here
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// ============================================
// ERROR HANDLING
// ============================================
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// ============================================
// SERVICE WORKER (for PWA capabilities - optional)
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================
console.log('%c👑 Welcome to Kingdom\'s Portfolio!', 'font-size: 20px; font-weight: bold; color: #d4af37;');
console.log('%cBuilding Value • Inspiring Growth • Creating Impact', 'font-size: 14px; color: #b0b0c0;');
