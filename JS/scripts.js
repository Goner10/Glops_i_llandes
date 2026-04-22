document.addEventListener('DOMContentLoaded', function () {

    // Menú hamburguesa
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenu && navMenu) {
        // Función para alternar el menú
        function toggleMenu(e) {
            if (e) e.stopPropagation();
            mobileMenu.classList.toggle('hero__menu-toggle--active');
            navMenu.classList.toggle('hero__nav--active');
        }

        function closeMenu() {
            if (navMenu.classList.contains('hero__nav--active')) {
                mobileMenu.classList.remove('hero__menu-toggle--active');
                navMenu.classList.remove('hero__nav--active');
            }
        }

        // Evento click para el botón del menú
        mobileMenu.addEventListener('click', function (e) {
            toggleMenu(e);
            document.body.classList.toggle('menu-open');

            if (document.body.classList.contains('menu-open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Evento touch para el botón del menú
        mobileMenu.addEventListener('touchend', function (e) {
            e.preventDefault();
            toggleMenu(e);
        }, false);

        // Evitar que clicks dentro del menú lo cierren
        navMenu.addEventListener('click', function (e) {
            e.stopPropagation();
        });

        // Evitar que touches dentro del menú lo cierren
        navMenu.addEventListener('touchend', function (e) {
            e.stopPropagation();
        }, false);

        // Cerrar menú con click fuera
        document.addEventListener('click', function () {
            closeMenu();
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
        });

        // Cerrar menú con touch fuera
        document.addEventListener('touchend', function (e) {
            if (!navMenu.contains(e.target) && e.target !== mobileMenu && !mobileMenu.contains(e.target)) {
                closeMenu();
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
            }
        }, false);
    }

    // Selector de idioma unificado
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const lang = this.dataset.lang;
            console.log(`Cambiando a idioma: ${lang}`);

            document.querySelectorAll('.lang-es, .lang-en').forEach(el => {
                el.classList.add('hidden');
            });

            document.querySelectorAll(`.lang-${lang}`).forEach(el => {
                el.classList.remove('hidden');
            });

            if (document.getElementById('widget-es') && document.getElementById('widget-en')) {
                document.getElementById('widget-es').classList.add('hidden');
                document.getElementById('widget-en').classList.add('hidden');
                document.getElementById(`widget-${lang}`).classList.remove('hidden');
            }
        });
    });

    // Idioma por defecto
    document.querySelectorAll('.lang-en').forEach(el => {
        el.classList.add('hidden');
    });

    document.querySelectorAll('.lang-es').forEach(el => {
        el.classList.remove('hidden');
    });

    const esButton = document.querySelector('.lang-btn[data-lang="es"]');
    if (esButton) {
        esButton.classList.add('active');
    }

    // Acordeón
    const botonesAcordeon = document.querySelectorAll('.acordeon-titulo');

    botonesAcordeon.forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            const contenido = boton.nextElementSibling;

            document.querySelectorAll('.acordeon-contenido').forEach(panel => {
                if (panel !== contenido) {
                    panel.classList.remove('activo');
                }
            });

            const isMobile = window.innerWidth <= 768;
            const offset = isMobile ? 80 : 0;
            const rect = boton.getBoundingClientRect();
            const targetTop = rect.top + window.pageYOffset - offset;

            if (isMobile) {
                window.scrollTo({ top: targetTop, behavior: 'smooth' });
                setTimeout(() => {
                    contenido.classList.toggle('activo');
                }, 200);
            } else {
                contenido.classList.toggle('activo');
                requestAnimationFrame(() => {
                    window.scrollTo({ top: targetTop, behavior: 'smooth' });
                });
            }
        });
    });

    // Carrusel con contador numérico
    const carousel = document.querySelector('.carousel__container');
    if (carousel) {
        const items = document.querySelectorAll('.carousel__item');
        const totalItems = items.length;
        let currentIndex = 0;
        let autoPlayInterval;
        let isTouching = false;

        const carouselElement = document.querySelector('.carousel');
        if (carouselElement) {
            carouselElement.addEventListener('touchstart', function (e) {
                if (e.touches.length > 1) {
                    e.preventDefault();
                }
            }, { passive: false });

            let lastTapTime = 0;
            carouselElement.addEventListener('touchend', function (e) {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTapTime;

                if (tapLength < 500 && tapLength > 0) {
                    e.preventDefault();
                }

                lastTapTime = currentTime;
            }, { passive: false });
        }

        const prevArrow = document.createElement('button');
        prevArrow.classList.add('carousel__arrow', 'carousel__arrow--prev');
        prevArrow.innerHTML = '&#10094;';
        prevArrow.setAttribute('aria-label', 'Anterior');

        const nextArrow = document.createElement('button');
        nextArrow.classList.add('carousel__arrow', 'carousel__arrow--next');
        nextArrow.innerHTML = '&#10095;';
        nextArrow.setAttribute('aria-label', 'Siguiente');

        const counter = document.createElement('div');
        counter.classList.add('carousel__counter');
        counter.setAttribute('aria-live', 'polite');
        counter.textContent = `1/${totalItems}`;

        const carouselParent = carousel.parentElement;
        carouselParent.appendChild(prevArrow);
        carouselParent.appendChild(nextArrow);
        carouselParent.appendChild(counter);

        const oldIndicators = document.querySelector('.carousel__indicators');
        if (oldIndicators) {
            oldIndicators.innerHTML = '';
        }

        function goToSlide(index) {
            if (index < 0) {
                index = totalItems - 1;
            } else if (index >= totalItems) {
                index = 0;
            }

            currentIndex = index;
            updateCarousel();
            updateCounter();
        }

        function updateCarousel() {
            carousel.style.transition = 'transform 0.5s ease';
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        function updateCounter() {
            counter.textContent = `${currentIndex + 1} | ${totalItems}`;
        }

        prevArrow.addEventListener('click', function () {
            goToSlide(currentIndex - 1);
            resetAutoPlayTimer();
        });

        nextArrow.addEventListener('click', function () {
            goToSlide(currentIndex + 1);
            resetAutoPlayTimer();
        });

        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                if (!isTouching) {
                    goToSlide(currentIndex + 1);
                }
            }, 4000);
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        function resetAutoPlayTimer() {
            stopAutoPlay();
            startAutoPlay();
        }

        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            isTouching = true;
            stopAutoPlay();
        });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            isTouching = false;
            startAutoPlay();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                goToSlide(currentIndex + 1);
            } else if (touchEndX > touchStartX + swipeThreshold) {
                goToSlide(currentIndex - 1);
            }
        }

        carouselParent.addEventListener('mouseenter', () => {
            stopAutoPlay();
        });

        carouselParent.addEventListener('mouseleave', () => {
            startAutoPlay();
        });

        document.addEventListener('keydown', function (e) {
            if (isElementInViewport(carousel)) {
                if (e.key === 'ArrowLeft') {
                    goToSlide(currentIndex - 1);
                    resetAutoPlayTimer();
                } else if (e.key === 'ArrowRight') {
                    goToSlide(currentIndex + 1);
                    resetAutoPlayTimer();
                }
            }
        });

        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        startAutoPlay();
    }

    // Año automático en footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

});