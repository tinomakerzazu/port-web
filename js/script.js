// Error Handling Utility
function safeExecute(fn, errorMsg = 'Error executing function') {
    try {
        return fn();
    } catch (error) {
        console.error(errorMsg, error);
        return null;
    }
}

// Loading Screen
const loader = document.getElementById('loader');
const loaderStat = document.querySelector('.loader-stat');
const loaderBar = document.querySelector('.loader-bar');

if (loader && loaderBar) {
    const loadingMessages = [
        'Initializing...',
        'Loading assets...',
        'Connecting to server...',
        'Preparing interface...',
        'Almost ready...',
        'Welcome!'
    ];

    let loadingProgress = 0;
    const loadingInterval = setInterval(() => {
        try {
            loadingProgress += Math.random() * 15;
            if (loadingProgress > 100) loadingProgress = 100;
            
            if (loaderBar) {
                loaderBar.style.width = loadingProgress + '%';
            }
            
            const messageIndex = Math.floor((loadingProgress / 100) * (loadingMessages.length - 1));
            if (loaderStat) {
                loaderStat.textContent = loadingMessages[messageIndex] || 'Loading...';
            }
            
            if (loadingProgress >= 100) {
                clearInterval(loadingInterval);
                setTimeout(() => {
                    if (loader) {
                        loader.classList.add('hidden');
                    }
                    if (document.body) {
                        document.body.style.overflow = 'auto';
                    }
                }, 500);
            }
        } catch (error) {
            console.error('Loading screen error:', error);
            clearInterval(loadingInterval);
            if (loader) {
                loader.classList.add('hidden');
            }
            if (document.body) {
                document.body.style.overflow = 'auto';
            }
        }
    }, 200);
}

// Navigation
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const navIndicator = document.querySelector('.nav-indicator');

// Validate navigation elements
if (!navbar || !hamburger || !navMenu) {
    console.warn('Navigation elements not found');
}

// Navbar scroll effect - optimized with requestAnimationFrame
let lastScroll = 0;
let scrollRaf = null;
window.addEventListener('scroll', () => {
    if (scrollRaf) return;
    
    scrollRaf = requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update nav indicator (throttled)
        updateNavIndicator();
        
        lastScroll = currentScroll;
        scrollRaf = null;
    });
}, { passive: true });

// Update navigation indicator - optimized
let navIndicatorUpdateCounter = 0;
const navIndicatorUpdateInterval = 5; // Update every 5 scroll events

function updateNavIndicator() {
    // Throttle updates
    if (navIndicatorUpdateCounter % navIndicatorUpdateInterval !== 0) {
        navIndicatorUpdateCounter++;
        return;
    }
    navIndicatorUpdateCounter++;
    
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (navLink && navIndicator) {
                const linkRect = navLink.getBoundingClientRect();
                const navRect = navbar.getBoundingClientRect();
                navIndicator.style.width = linkRect.width + 'px';
                navIndicator.style.left = (linkRect.left - navRect.left) + 'px';
            }
        }
    });
}

// Mobile menu toggle
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    });
});

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Canvas Animation for Hero
function initCanvasAnimation() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    // Reduced particle count for better performance
    const particleCount = window.innerWidth < 768 ? 60 : 100;
    const maxConnections = 5; // Limit connections per particle
    const connectionDistance = 120;
    const connectionDistanceSq = connectionDistance * connectionDistance; // Pre-calculate squared distance
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.color = `rgba(213, 184, 147, ${this.opacity})`;
            this.connections = []; // Store connections to avoid recalculating
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Optimized connection calculation - only check nearby particles
    function updateConnections() {
        particles.forEach(p => p.connections = []);
        
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            let connectionCount = 0;
            
            for (let j = i + 1; j < particles.length && connectionCount < maxConnections; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distanceSq = dx * dx + dy * dy;
                
                if (distanceSq < connectionDistanceSq) {
                    p1.connections.push({ particle: p2, distanceSq });
                    p2.connections.push({ particle: p1, distanceSq });
                    connectionCount++;
                }
            }
        }
    }
    
    // Update connections less frequently
    let connectionUpdateCounter = 0;
    const connectionUpdateInterval = 10; // Update every 10 frames
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Update connections periodically
        if (connectionUpdateCounter % connectionUpdateInterval === 0) {
            updateConnections();
        }
        connectionUpdateCounter++;
        
        // Draw connections
        ctx.strokeStyle = 'rgba(213, 184, 147, 0.3)';
        ctx.lineWidth = 1;
        particles.forEach(p1 => {
            p1.connections.forEach(({ particle: p2, distanceSq }) => {
                const distance = Math.sqrt(distanceSq);
                const opacity = (1 - distance / connectionDistance) * 0.3;
                ctx.strokeStyle = `rgba(213, 184, 147, ${opacity})`;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Throttled resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Reinitialize particles on significant resize
            if (Math.abs(canvas.width - window.innerWidth) > 100) {
                particles.forEach(p => {
                    p.x = Math.random() * canvas.width;
                    p.y = Math.random() * canvas.height;
                });
            }
        }, 250);
    }, { passive: true });
}

// Floating Particles Background
function createFloatingParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 80;
    const colors = [
        'rgba(213, 184, 147, 0.5)',
        'rgba(97, 120, 145, 0.4)',
        'rgba(111, 77, 56, 0.3)',
        'rgba(99, 32, 36, 0.3)'
    ];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        const size = Math.random() * 8 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 25 + 20;
        const delay = Math.random() * 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: ${x}%;
            top: ${y}%;
            pointer-events: none;
            box-shadow: 0 0 ${size * 3}px ${color};
            will-change: transform;
            transform: translateZ(0);
        `;
        
        particlesContainer.appendChild(particle);
        
        animateParticle(particle, duration, delay);
    }
}

function animateParticle(particle, duration, delay) {
    const startX = parseFloat(particle.style.left);
    const startY = parseFloat(particle.style.top);
    
    function move() {
        const newX = startX + (Math.random() - 0.5) * 40;
        const newY = startY + (Math.random() - 0.5) * 40;
        const opacity = 0.3 + Math.random() * 0.5;
        
        // Use transform instead of left/top for better performance
        particle.style.transition = `transform ${duration}s ease-in-out, opacity ${duration}s ease-in-out`;
        particle.style.transform = `translate(${newX - startX}%, ${newY - startY}%) translateZ(0)`;
        particle.style.opacity = opacity;
        
        setTimeout(() => {
            particle.style.transform = 'translate(0, 0) translateZ(0)';
            setTimeout(move, duration * 1000);
        }, duration * 1000);
    }
    
    setTimeout(move, delay * 1000);
}

// Typing effect for hero title
function initTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;
    
    const words = [
        'Full Stack Developer',
        'Web Developer',
        'Software Engineer',
        'UI/UX Designer',
        'Problem Solver',
        'Code Architect'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(type, 2500);
            return;
        }
        
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }
        
        const speed = isDeleting ? 40 : 80;
        setTimeout(type, speed);
    }
    
    setTimeout(type, 1500);
}

// Counter animation for stats
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }, index * 100);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.skill-card, .project-card, .about-content, .contact-content, .tech-category, .highlight-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Stats counter observer
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                if (!stat.classList.contains('animated')) {
                    stat.classList.add('animated');
                    animateCounter(stat);
                }
            });
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats').forEach(container => {
    statsObserver.observe(container);
});

// Skill progress bars animation
const skillBarsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target.querySelector('.skill-progress');
            if (progressBar && !progressBar.classList.contains('animated')) {
                progressBar.classList.add('animated');
                const width = progressBar.style.width;
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 200);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-card').forEach(card => {
    skillBarsObserver.observe(card);
});

// Form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.querySelector('span').textContent;
        
        // Animate button
        submitButton.style.transform = 'scale(0.95)';
        submitButton.querySelector('span').textContent = 'Enviando...';
        
        setTimeout(() => {
            submitButton.style.transform = 'scale(1)';
            submitButton.querySelector('span').textContent = '¡Enviado!';
            submitButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            
            setTimeout(() => {
                submitButton.querySelector('span').textContent = originalText;
                submitButton.style.background = '';
                contactForm.reset();
            }, 2000);
        }, 1000);
    });
}

// Parallax effect for hero background
function updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero && scrolled < window.innerHeight) {
        const gradientMesh = hero.querySelector('.gradient-mesh');
        if (gradientMesh) {
            gradientMesh.style.transform = `translate(${scrolled * 0.1}px, ${scrolled * 0.1}px)`;
        }
        
        const rings = hero.querySelectorAll('.ring');
        rings.forEach((ring, index) => {
            const speed = (index + 1) * 0.05;
            ring.style.transform = `translate(-50%, -50%) rotate(${scrolled * speed}deg)`;
        });
    }
}

let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateParallax();
            ticking = false;
        });
        ticking = true;
    }
});

// Mouse move effect for hero - optimized with throttling
let mouseMoveRaf = null;
document.addEventListener('mousemove', (e) => {
    if (mouseMoveRaf) return;
    
    mouseMoveRaf = requestAnimationFrame(() => {
        const hero = document.querySelector('.hero');
        if (!hero) {
            mouseMoveRaf = null;
            return;
        }
        
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const gradientMesh = hero.querySelector('.gradient-mesh');
        if (gradientMesh) {
            const x = (mouseX - 0.5) * 80;
            const y = (mouseY - 0.5) * 80;
            gradientMesh.style.transform = `translate(${x}px, ${y}px) translateZ(0)`;
        }
        
        const rings = hero.querySelectorAll('.ring');
        rings.forEach((ring, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed * 20;
            const y = (mouseY - 0.5) * speed * 20;
            ring.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) translateZ(0)`;
        });
        
        mouseMoveRaf = null;
    });
}, { passive: true });

// Smooth reveal for section headers
const sectionHeaders = document.querySelectorAll('.section-header');
sectionHeaders.forEach((header) => {
    header.style.opacity = '0';
    header.style.transform = 'translateY(20px)';
    header.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.3 });
    
    headerObserver.observe(header);
});

// Add hover effect to tech tags
const techTags = document.querySelectorAll('.tech-tag');
techTags.forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.1)';
    });
    
    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Magnetic effect for buttons and cards
function initMagneticEffect() {
    const magneticElements = document.querySelectorAll('.btn, .skill-card, .project-card, .social-link, .tech-tag, .stat-box');
    
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            if (window.innerWidth > 768) {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const moveX = x * 0.2;
                const moveY = y * 0.2;
                
                el.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });
}

// Tilt effect for project cards
function initTiltEffect() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth > 768) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// Add ripple effect to buttons
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}

const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('click', createRipple);
});

// Add ripple styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Scroll reveal animation
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.section-header, .tech-category, .skill-card, .project-card, .highlight-item');
    
    revealElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
    });
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => revealObserver.observe(el));
}

// Initialize everything on page load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Initialize canvas animation
    initCanvasAnimation();
    
    // Initialize floating particles
    createFloatingParticles();
    
    // Initialize typing effect
    initTypingEffect();
    
    // Initialize magnetic effect
    initMagneticEffect();
    
    // Initialize tilt effect
    initTiltEffect();
    
    // Initialize scroll reveal
    initScrollReveal();
    
    // Update nav indicator on load
    updateNavIndicator();
    
    // Animate hero elements
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '1';
    }
    
    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription) {
        heroDescription.style.opacity = '1';
    }
    
    const heroButtons = document.querySelector('.hero-buttons');
    if (heroButtons) {
        heroButtons.style.opacity = '1';
    }
    
    // Initialize custom cursor
    initCustomCursor();
    
    // Initialize hologram canvas
    initHologramCanvas();
    
    // Initialize notifications system
    initNotifications();
});

// Custom Cursor
function initCustomCursor() {
    // Only on desktop devices
    if (window.innerWidth < 769 || !window.matchMedia('(hover: hover)').matches) {
        return;
    }
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';
    document.body.appendChild(cursorDot);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let dotX = 0;
    let dotY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        dotX += (mouseX - dotX) * 0.3;
        dotY += (mouseY - dotY) * 0.3;
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-card, .nav-link');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        el.addEventListener('mousedown', () => cursor.classList.add('click'));
        el.addEventListener('mouseup', () => cursor.classList.remove('click'));
    });
}

// Hologram Canvas Effect
function initHologramCanvas() {
    const canvas = document.getElementById('hologram-canvas');
    if (!canvas) return;
    
    try {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.warn('Canvas 2D context not available');
            return;
        }
        
        const rect = canvas.getBoundingClientRect();
        if (!rect || rect.width === 0 || rect.height === 0) {
            console.warn('Canvas dimensions invalid');
            return;
        }
        
        canvas.width = rect.width;
        canvas.height = rect.height;
    
    const particles = [];
    // Reduced particle count for hologram
    const particleCount = window.innerWidth < 768 ? 25 : 35;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.3;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(213, 184, 147, ${this.opacity})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(213, 184, 147, 0.8)';
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Optimized connection calculation
    const maxConnections = 3;
    const connectionDistance = 100;
    const connectionDistanceSq = connectionDistance * connectionDistance;
    
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            let connectionCount = 0;
            for (let j = i + 1; j < particles.length && connectionCount < maxConnections; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distanceSq = dx * dx + dy * dy;
                
                if (distanceSq < connectionDistanceSq) {
                    const distance = Math.sqrt(distanceSq);
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(213, 184, 147, ${0.2 * (1 - distance / connectionDistance)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    connectionCount++;
                }
            }
        }
    }
    
    let connectionUpdateCounter = 0;
    const connectionUpdateInterval = 15; // Update connections less frequently
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Update connections less frequently for better performance
        if (connectionUpdateCounter % connectionUpdateInterval === 0) {
            connectParticles();
        }
        connectionUpdateCounter++;
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            try {
                const rect = canvas.getBoundingClientRect();
                if (rect && rect.width > 0 && rect.height > 0) {
                    canvas.width = rect.width;
                    canvas.height = rect.height;
                }
            } catch (error) {
                console.error('Canvas resize error:', error);
            }
        }, 250);
    });
    } catch (error) {
        console.error('Hologram canvas initialization error:', error);
    }
}

// Notifications System - Client Requests
function initNotifications() {
    const notificationsContainer = document.getElementById('notificationsContainer');
    if (!notificationsContainer) return;
    
    // Fictional client data - More realistic and varied
    const clientNames = [
        'María González', 'Carlos Rodríguez', 'Ana Martínez', 'Luis Fernández',
        'Sofia Pérez', 'Diego Sánchez', 'Valentina López', 'Andrés Torres',
        'Camila Ramírez', 'Sebastián Gómez', 'Isabella Herrera', 'Mateo Díaz',
        'Lucía Morales', 'Nicolás Castro', 'Emma Vargas', 'Daniel Jiménez',
        'Olivia Ruiz', 'Gabriel Mendoza', 'Amelia Ortega', 'Santiago Navarro',
        'Roberto Silva', 'Patricia Vega', 'Fernando Castro', 'Laura Mendoza',
        'Ricardo Paredes', 'Carmen Flores', 'Javier Ríos', 'Monica Herrera'
    ];
    
    const companyTypes = [
        'Restaurante', 'Tienda Online', 'Consultoría', 'Startup Tech',
        'E-commerce', 'Agencia Digital', 'Negocio Local', 'Empresa Familiar',
        'Freelancer', 'ONG', 'Clínica', 'Gimnasio', 'Hotel', 'Cafetería',
        'Tienda de Ropa', 'Servicios Profesionales', 'Educación Online', 'Bienes Raíces',
        'Farmacia', 'Taller Mecánico', 'Salón de Belleza', 'Academia', 'Veterinaria',
        'Estudio Fotográfico', 'Bufete de Abogados', 'Inmobiliaria'
    ];
    
    const projectTypes = [
        'página web corporativa',
        'tienda online',
        'landing page',
        'portafolio profesional',
        'sitio web empresarial',
        'plataforma e-commerce',
        'aplicación web',
        'sitio web institucional',
        'sitio web responsive',
        'plataforma de gestión',
        'sistema de reservas online'
    ];
    
    const emailDomains = [
        'gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com',
        'empresa.com', 'negocio.com', 'startup.com', 'consultoria.com',
        'protonmail.com', 'icloud.com', 'live.com'
    ];
    
    const requestMessages = [
        'Solicitud para crear una',
        'Necesito desarrollar una',
        'Estoy interesado en una',
        'Buscamos crear una',
        'Queremos implementar una',
        'Requiero una',
        'Necesitamos una'
    ];
    
    function generateClientEmail(name) {
        const nameParts = name.toLowerCase().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts[1] || nameParts[0];
        const domain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
        
        // More realistic email variations
        const variations = [
            `${firstName}.${lastName}@${domain}`,
            `${firstName}${lastName}@${domain}`,
            `${firstName}_${lastName}@${domain}`,
            `${firstName}${Math.floor(Math.random() * 99) + 1}@${domain}`,
            `${lastName}.${firstName}@${domain}`
        ];
        
        return variations[Math.floor(Math.random() * variations.length)];
    }
    
    function getInitials(name) {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }
    
    function getRandomTimeAgo() {
        // More realistic time variations (2-30 minutes)
        const minutes = [2, 3, 4, 5, 7, 10, 12, 15, 18, 20, 25, 30];
        const selectedMin = minutes[Math.floor(Math.random() * minutes.length)];
        return `Hace ${selectedMin} min`;
    }
    
    function createNotification() {
        const clientName = clientNames[Math.floor(Math.random() * clientNames.length)];
        const companyType = companyTypes[Math.floor(Math.random() * companyTypes.length)];
        const projectType = projectTypes[Math.floor(Math.random() * projectTypes.length)];
        const requestMessage = requestMessages[Math.floor(Math.random() * requestMessages.length)];
        const clientEmail = generateClientEmail(clientName);
        const initials = getInitials(clientName);
        const timeAgo = getRandomTimeAgo();
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-pulse"></div>
            <div class="notification-header">
                <div class="notification-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                </div>
                <button class="notification-close" aria-label="Cerrar notificación">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="notification-content">
                <div class="notification-title">Nueva Solicitud de Proyecto</div>
                <div class="notification-message">
                    ${requestMessage} <strong>${projectType}</strong> para <strong>${companyType}</strong>.
                </div>
                <div class="notification-client">
                    <div class="notification-avatar">${initials}</div>
                    <div class="notification-client-info">
                        <div class="notification-client-name">${clientName}</div>
                        <div class="notification-client-email">${clientEmail}</div>
                    </div>
                </div>
                <div class="notification-time">${timeAgo}</div>
            </div>
        `;
        
        // Add close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            removeNotification(notification);
        });
        
        // Auto-remove after 10 seconds (longer for 2-minute intervals)
        setTimeout(() => {
            removeNotification(notification);
        }, 10000);
        
        notificationsContainer.appendChild(notification);
        
        // Limit to 3 notifications max
        const notifications = notificationsContainer.querySelectorAll('.notification');
        if (notifications.length > 3) {
            removeNotification(notifications[0]);
        }
    }
    
    function removeNotification(notification) {
        if (!notification || !notification.parentNode) return;
        
        notification.classList.add('slide-out');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 400);
    }
    
    // Create first notification after 30 seconds (more realistic)
    setTimeout(() => {
        createNotification();
    }, 30000);
    
    // Create notifications every 2 minutes (120000 ms)
    setInterval(() => {
        createNotification();
    }, 120000);
}

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
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

// Apply throttling to scroll events
const throttledScroll = throttle(() => {
    updateNavIndicator();
}, 16);

window.addEventListener('scroll', throttledScroll);

// Prevent body scroll during loading
document.body.style.overflow = 'hidden';