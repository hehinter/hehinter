/**
 * Hehuang International Trade - Main JavaScript
 * Corporate Website for European and American Markets
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMobile = document.querySelector('.nav-mobile');
    const counters = document.querySelectorAll('.stat-number, .about-stat-number');
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    const contactForm = document.querySelector('.contact-form form');

    // ==========================================================================
    // Header Scroll Effect
    // ==========================================================================
    let lastScroll = 0;
    
    function handleScroll() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }
    
    window.addEventListener('scroll', throttle(handleScroll, 100));

    // ==========================================================================
    // Mobile Navigation
    // ==========================================================================
    if (menuToggle && navMobile) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMobile.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu when clicking a link
        const mobileLinks = navMobile.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navMobile.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // ==========================================================================
    // Smooth Scroll
    // ==========================================================================
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ==========================================================================
    // Counter Animation
    // ==========================================================================
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        function updateCounter() {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        }
        
        updateCounter();
    }

    function checkCounters() {
        counters.forEach(counter => {
            if (isInViewport(counter) && !counter.classList.contains('counted')) {
                counter.classList.add('counted');
                const target = parseInt(counter.getAttribute('data-target')) || parseInt(counter.textContent.replace(/,/g, ''));
                animateCounter(counter, target);
            }
        });
    }

    // ==========================================================================
    // Scroll Reveal Animation
    // ==========================================================================
    function handleRevealAnimations() {
        revealElements.forEach(element => {
            if (isInViewport(element, 100)) {
                element.classList.add('revealed');
            }
        });
    }

    // ==========================================================================
    // Utility Functions
    // ==========================================================================
    function isInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
            rect.bottom >= 0
        );
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ==========================================================================
    // Intersection Observer for Animations
    // ==========================================================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Handle counter animation
                const countersInSection = entry.target.querySelectorAll('.stat-number, .about-stat-number');
                countersInSection.forEach(counter => {
                    if (!counter.classList.contains('counted')) {
                        counter.classList.add('counted');
                        const target = parseInt(counter.getAttribute('data-target')) || parseInt(counter.textContent.replace(/,/g, ''));
                        animateCounter(counter, target);
                    }
                });
                
                // Unobserve after revealing
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all reveal elements
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .stagger-children').forEach(el => {
        revealObserver.observe(el);
    });

    // ==========================================================================
    // Page Load Animation
    // ==========================================================================
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Animate hero elements
        const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-buttons, .hero-stats');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animate-in');
            }, index * 100);
        });
    });

    // ==========================================================================
    // Contact Form Handling
    // ==========================================================================
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Show success message (in production, send to server)
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Message Sent!';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    contactForm.reset();
                }, 3000);
            }
        });
    }

    // ==========================================================================
    // Parallax Effect (for elements with parallax class)
    // ==========================================================================
    function handleParallax() {
        const parallaxElements = document.querySelectorAll('.parallax');
        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            const yPos = -(window.pageYOffset * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    }

    window.addEventListener('scroll', throttle(handleParallax, 16));

    // ==========================================================================
    // Magnetic Button Effect
    // ==========================================================================
    const magneticButtons = document.querySelectorAll('.magnetic');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        button.addEventListener('mouseleave', function() {
            button.style.transform = 'translate(0, 0)';
        });
    });

    // ==========================================================================
    // Active Navigation Link
    // ==========================================================================
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link, .nav-mobile-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
    
    setActiveNavLink();

    // ==========================================================================
    // Lazy Load Images
    // ==========================================================================
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ==========================================================================
    // Scroll Progress Indicator
    // ==========================================================================
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        let progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:var(--secondary-color);z-index:9999;transition:width 0.1s;';
            document.body.appendChild(progressBar);
        }
        progressBar.style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', throttle(updateScrollProgress, 16));

    // ==========================================================================
    // Back to Top Button
    // ==========================================================================
    let backToTopBtn = document.querySelector('.back-to-top');
    
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
        backToTopBtn.style.cssText = 'position:fixed;bottom:30px;right:30px;width:50px;height:50px;background:var(--secondary-color);color:var(--primary-color);border:none;border-radius:50%;cursor:pointer;opacity:0;visibility:hidden;transition:all 0.3s;z-index:999;display:flex;align-items:center;justify-content:center;';
        document.body.appendChild(backToTopBtn);
    }
    
    function toggleBackToTop() {
        if (window.pageYOffset > 500) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    }
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', throttle(toggleBackToTop, 100));

    // ==========================================================================
    // Initialize
    // ==========================================================================
    handleScroll();
    handleRevealAnimations();
    
    // Initial check for counters
    setTimeout(checkCounters, 500);

    // ==========================================================================
    // Console Easter Egg
    // ==========================================================================
    console.log('%c🚀 Hehuang International Trade', 'font-size: 24px; font-weight: bold; color: #00ff88;');
    console.log('%cYour trusted partner in global trade and technology.', 'font-size: 14px; color: #666;');
    console.log('%cWebsite: hehinter.com | Support: support@hehinter.com', 'font-size: 12px; color: #999;');

});

// ==========================================================================
// Export for module usage (if needed)
// ==========================================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {};
}
