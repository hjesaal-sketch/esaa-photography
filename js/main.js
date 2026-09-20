// ============================================
// 1. MODO OSCURO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('darkToggle');
    const html = document.documentElement;

    if (toggle) {
        const currentTheme = localStorage.getItem('theme') || 'light';
        html.setAttribute('data-theme', currentTheme);

        toggle.addEventListener('click', function() {
            const theme = html.getAttribute('data-theme');
            const newTheme = theme === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
});

// ============================================
// 2. MENÚ HAMBURGUESA
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const overlay = document.getElementById('menuOverlay');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            if (overlay) overlay.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        document.querySelectorAll('#navLinks a').forEach(function(link) {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        if (overlay) {
            overlay.addEventListener('click', function() {
                navLinks.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});

// ============================================
// 3. CARRUSEL
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    if (slides.length === 0 || dots.length === 0) return;

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
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, INTERVAL_TIME);
    }

    function stopAutoplay() {
        if (slideInterval) { clearInterval(slideInterval); slideInterval = null; }
    }

    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const index = parseInt(dot.getAttribute('data-index'));
            goToSlide(index);
            startAutoplay();
        });
    });

    const heroSection = document.getElementById('hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopAutoplay);
        heroSection.addEventListener('mouseleave', startAutoplay);
    }

    startAutoplay();
});

// ============================================
// 4. GALERÍA FADE-IN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const galleryCards = document.querySelectorAll('.photo-card');
    if (galleryCards.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const delay = parseInt(card.getAttribute('data-delay')) || 0;
                setTimeout(() => card.classList.add('visible'), delay);
                observer.unobserve(card);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    galleryCards.forEach(card => observer.observe(card));
});