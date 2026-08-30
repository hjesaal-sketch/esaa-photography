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
// 2. MENÚ HAMBURGUESA (CORREGIDO)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');
    const overlay = document.getElementById('menuOverlay');

    if (!hamburger || !mainNav || !overlay) {
        console.error('❌ Menú hamburguesa: elementos no encontrados');
        return;
    }

    function toggleMenu(e) {
        e.preventDefault();
        e.stopPropagation();
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

    // Eventos para el botón hamburguesa
    hamburger.addEventListener('click', toggleMenu);
    hamburger.addEventListener('touchstart', toggleMenu, { passive: true });

    // Eventos para el overlay
    overlay.addEventListener('click', closeMenu);
    overlay.addEventListener('touchstart', closeMenu, { passive: true });

    // Eventos para los enlaces del menú (NO cerrar el menú antes de navegar)
    document.querySelectorAll('#mainNav a').forEach(function(link) {
        link.addEventListener('click', function(e) {
            // No prevenimos el comportamiento por defecto
            // Cerramos el menú después de que el enlace haya ejecutado su navegación
            setTimeout(closeMenu, 150);
        });
        link.addEventListener('touchstart', function(e) {
            // Dejamos que el evento se propague
            setTimeout(closeMenu, 150);
        }, { passive: true });
    });

    // Cerrar menú al redimensionar la ventana
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
});

// ============================================
// 3. CARRUSEL CON FADE AUTOMÁTICO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;
    const INTERVAL_TIME = 4500;

    if (slides.length === 0 || dots.length === 0) {
        console.warn('Carrusel: no se encontraron slides o dots');
        return;
    }

    function goToSlide(index) {
        slides.forEach(function(s) { s.classList.remove('active'); });
        dots.forEach(function(d) { d.classList.remove('active'); });
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

    dots.forEach(function(dot) {
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
// 4. FADE-IN ESCALONADO DE LA GALERÍA
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const galleryCards = document.querySelectorAll('.photo-card');

    if (galleryCards.length === 0) {
        console.warn('Galería: no se encontraron tarjetas');
        return;
    }

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const card = entry.target;
                const delay = parseInt(card.getAttribute('data-delay')) || 0;

                setTimeout(function() {
                    card.classList.add('visible');
                }, delay);

                observer.unobserve(card);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    galleryCards.forEach(function(card) {
        observer.observe(card);
    });
});