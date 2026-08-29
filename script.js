// ============================================
// 1. MODO OSCURO
// ============================================
const toggle = document.getElementById('darkToggle');
const html = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

toggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// ============================================
// 2. MENÚ HAMBURGUESA
// ============================================
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('mainNav');
const overlay = document.getElementById('menuOverlay');

function toggleMenu() {
    hamburger.classList.toggle('active');
    mainNav.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
}

function closeMenu() {
    hamburger.classList.remove('active');
    mainNav.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', toggleMenu);
overlay.addEventListener('click', closeMenu);

document.querySelectorAll('#mainNav a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMenu();
    }
});

// ============================================
// 3. CARRUSEL CON FADE AUTOMÁTICO
// ============================================
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let slideInterval;
const INTERVAL_TIME = 4500;

function goToSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
}

function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
}

function startAutoplay() {
    stopAutoplay();
    slideInterval = setInterval(nextSlide, INTERVAL_TIME);
}

function stopAutoplay() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'));
        goToSlide(index);
        startAutoplay();
    });
});

const heroSection = document.getElementById('hero');
heroSection.addEventListener('mouseenter', stopAutoplay);
heroSection.addEventListener('mouseleave', startAutoplay);

startAutoplay();

// ============================================
// 4. FADE-IN ESCALONADO DE LA GALERÍA
// ============================================
const galleryCards = document.querySelectorAll('.photo-card');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const card = entry.target;
            const delay = parseInt(card.getAttribute('data-delay')) || 0;

            setTimeout(() => {
                card.classList.add('visible');
            }, delay);

            observer.unobserve(card);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

galleryCards.forEach(card => {
    observer.observe(card);
});