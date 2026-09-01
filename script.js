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
// 2. MENÚ HAMBURGUESA (PÁGINAS INDEPENDIENTES)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const overlay = document.getElementById('menuOverlay');

    if (!hamburger || !navLinks || !overlay) {
        console.error('❌ Elementos del menú no encontrados');
        return;
    }

    // Función para cerrar el menú COMPLETAMENTE
    function closeMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Función para abrir/cerrar el menú
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    }

    // Evento click en el botón hamburguesa
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    // Evento click en el overlay (fondo oscuro)
    overlay.addEventListener('click', function(e) {
        e.stopPropagation();
        closeMenu();
    });

    // ===== LA PARTE QUE CAMBIA =====    // Cerrar menú al hacer clic en un enlace (NAVEGACIÓN NATIVA)
    document.querySelectorAll('#navLinks a').forEach(function(link) {
        link.addEventListener('click', function(e) {
            // Guardamos el href
            const href = this.getAttribute('href');
            
            // Si es un enlace a otra página (no es un ancla #)
            if (href && !href.startsWith('#')) {
                // Cerramos el menú inmediatamente
                e.preventDefault(); // 👈 Prevenimos la navegación nativa
                closeMenu();
                // Navegamos después de cerrar el menú
                setTimeout(function() {
                    window.location.href = href;
                }, 150);
            } else {
                // Si es un ancla (#), prevenimos el comportamiento por defecto
                e.preventDefault();
                closeMenu();
            }
        });
    });

    // Cerrar menú al redimensionar a desktop
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