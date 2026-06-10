/* =========================================
   LIQUID GLASS - VANILLA JS LOGIC
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Theme Toggle System
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    themeToggleBtn.addEventListener('click', () => {
        htmlElement.classList.toggle('light-mode');
        const isLightMode = htmlElement.classList.contains('light-mode');
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    });

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinksContainer = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileMenuBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('open');
        });
    });

    // 3. Navbar Blur on Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // Active Section Highlight via IntersectionObserver (High Performance)
    const sections = document.querySelectorAll('.section');
    const sectionObserverOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, sectionObserverOptions);
    sections.forEach(sec => sectionObserver.observe(sec));

    // 4. Custom Cursor & Parallax State
    const cursor = document.getElementById('cursor-glow');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    // Cursor hover effects
    const interactables = document.querySelectorAll('a, button, .magnetic-container, .parallax-card');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // 5. High Performance Parallax & Anti-Gravity Effects
    const parallaxCards = document.querySelectorAll('.parallax-card');
    const bgBlobs = document.querySelector('.bg-blobs');
    
    // Cache absolute metrics to prevent layout thrashing (getBoundingClientRect) inside the animation loop
    let cardMetrics = [];
    function calculateCardMetrics() {
        cardMetrics = Array.from(parallaxCards).map(card => {
            const rect = card.getBoundingClientRect();
            return {
                el: card,
                width: rect.width,
                height: rect.height,
                pageX: rect.left + window.scrollX,
                pageY: rect.top + window.scrollY,
                isHovered: false
            };
        });
    }
    
    // Initialize and recalculate only on resize
    calculateCardMetrics();
    window.addEventListener('resize', calculateCardMetrics, { passive: true });

    // Reset transform on mouse leave for cards
    cardMetrics.forEach(card => {
        card.el.addEventListener('mouseleave', () => {
            card.isHovered = false;
            card.el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
            card.el.style.transition = 'transform 0.5s ease-out';
        });
        card.el.addEventListener('mouseenter', () => {
            card.isHovered = true;
            card.el.style.transition = 'none';
        });
    });

    // Single unified requestAnimationFrame loop
    function animateFrame() {
        // 1. Ultra-smooth cursor follow (Calmer interpolation)
        cursorX += (mouseX - cursorX) * 0.12;
        cursorY += (mouseY - cursorY) * 0.12;
        cursor.style.transform = `translate(calc(-50% + ${cursorX}px), calc(-50% + ${cursorY}px))`;

        // 2. Background Blobs Parallax
        const normX = (mouseX / window.innerWidth - 0.5) * 2;
        const normY = (mouseY / window.innerHeight - 0.5) * 2;
        if (bgBlobs) {
            bgBlobs.style.transform = `translate(${normX * -20}px, ${normY * -20}px)`;
        }

        // 3. 3D Tilt Effect on visible cards
        const currentScrollY = window.scrollY;
        const currentScrollX = window.scrollX;
        
        cardMetrics.forEach(card => {
            // Fast viewport check
            const top = card.pageY - currentScrollY;
            const bottom = top + card.height;
            const left = card.pageX - currentScrollX;
            
            if (top < window.innerHeight && bottom > 0) {
                const cardX = (mouseX - (left + card.width / 2)) / (card.width / 2);
                const cardY = (mouseY - (top + card.height / 2)) / (card.height / 2);
                
                // Clamp rotation slightly if not hovered to prevent crazy spins from far edges
                const factor = card.isHovered ? 5 : 2; 
                card.el.style.transform = `perspective(1000px) rotateX(${cardY * -factor}deg) rotateY(${cardX * factor}deg) translateZ(5px)`;
            }
        });

        requestAnimationFrame(animateFrame);
    }
    animateFrame(); // Start unified animation loop

    // 6. Magnetic Buttons Effect
    const magneticBtns = document.querySelectorAll('.magnetic');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            // Bounding client rect inside mousemove for buttons is okay since there are few and only on hover
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left) - rect.width / 2;
            const y = (e.clientY - rect.top) - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        btn.addEventListener('mouseleave', function() {
            btn.style.transform = `translate(0px, 0px)`;
            btn.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
        btn.addEventListener('mouseenter', function() {
            btn.style.transition = 'none';
        });
    });

    // 7. Scroll Fade-in (Intersection Observer)
    const fadeObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, fadeObserverOptions);

    const fadeElements = document.querySelectorAll('.section-header, .parallax-card, .skill-category, .fade-up');
    fadeElements.forEach(el => {
        el.classList.add('fade-up');
        fadeObserver.observe(el);
    });

    // 8. Typewriter Effect
    const typeWriterElement = document.getElementById('typewriter');
    let words = ["Software Developer", "Computer Engineer", "AI Enthusiast", "Problem Solver"];
    if (typeWriterElement && typeWriterElement.hasAttribute('data-words')) {
        try {
            words = JSON.parse(typeWriterElement.getAttribute('data-words'));
        } catch(e) {}
    }
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        if (!typeWriterElement) return;
        
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typeWriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typeWriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 40 : 100;
        
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before next word
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    setTimeout(typeEffect, 1000);

    // Prevent Form Submission Refresh for Demo
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = `<span>Sent!</span> <i class="ph ph-check"></i>`;
            setTimeout(() => {
                btn.innerHTML = originalText;
                contactForm.reset();
            }, 3000);
        });
    }

});
