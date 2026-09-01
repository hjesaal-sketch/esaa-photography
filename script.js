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
// 2. MENÚ HAMBURGUESA (COMO EOS)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
        });
    }
});

// ============================================
// 3. SISTEMA DE NAVEGACIÓN SPA
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.getElementById('main-content');
    const navLinks = document.querySelectorAll('[data-page]');

    // Función para cargar una página
    function loadPage(page) {
        fetch(`/pages/${page}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`No se pudo cargar ${page}`);
                }
                return response.text();
            })
            .then(html => {
                mainContent.innerHTML = html;
                // Cerrar menú móvil después de cargar
                const navLinks = document.getElementById('navLinks');
                if (navLinks) navLinks.classList.remove('active');
                // Ejecutar scripts específicos de la página (carrusel, galería)
                initPageScripts();
            })
            .catch(error => {
                console.error('Error cargando la página:', error);
                mainContent.innerHTML = `<p>Error cargando la página. Intenta de nuevo.</p>`;
            });
    }

    // Función para inicializar scripts específicos de la página
    function initPageScripts() {
        // Carrusel
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.dot');
        if (slides.length > 0 && dots.length > 0) {
            let currentSlide = 0;
            const INTERVAL_TIME = 4500;
            let slideInterval;

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
                if (slideInterval) {
                    clearInterval(slideInterval);
                    slideInterval = null;
                }
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
        }

        // Galería con fade-in
        const galleryCards = document.querySelectorAll('.photo-card');
        if (galleryCards.length > 0) {
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
            galleryCards.forEach(card => observer.observe(card));
        }
    }

    // Evento click en los enlaces del menú
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page) {
                loadPage(page);
                // Actualizar URL sin recargar
                history.pushState({ page }, '', `/${page}`);
            }
        });
    });

    // Manejar navegación con botones de atrás/adelante
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.page) {
            loadPage(event.state.page);
        }
    });

    // Cargar página inicial
    const initialPage = window.location.pathname.replace('/', '') || 'home';
    loadPage(initialPage);
});