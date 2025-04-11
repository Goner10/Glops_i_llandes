document.addEventListener('DOMContentLoaded', function() {

    // Menú hamburguesa
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    // Función para alternar el menú
    function toggleMenu(e) {
        if (e) e.stopPropagation();
        mobileMenu.classList.toggle('hero__menu-toggle--active');
        navMenu.classList.toggle('hero__nav--active');
    }
    
    // Función para cerrar el menú
    function closeMenu() {
        if (navMenu.classList.contains('hero__nav--active')) {
            mobileMenu.classList.remove('hero__menu-toggle--active');
            navMenu.classList.remove('hero__nav--active');
        }
    }
    
    // Evento click para el botón del menú
    mobileMenu.addEventListener('click', function(e) {
        toggleMenu(e);
    });
    
    // Evento touch para el botón del menú
    mobileMenu.addEventListener('touchend', function(e) {
        e.preventDefault();
        toggleMenu(e);
    }, false);
    
    // Evitar que clicks dentro del menú lo cierren
    navMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Evitar que touches dentro del menú lo cierren
    navMenu.addEventListener('touchend', function(e) {
        e.stopPropagation();
    }, false);
    
    // Cerrar menú con click fuera
    document.addEventListener('click', closeMenu);
    
    // Cerrar menú con touch fuera
    document.addEventListener('touchend', function(e) {
        // Solo procesar eventos de toque que no sean sobre el menú o el botón
        if (!navMenu.contains(e.target) && e.target !== mobileMenu && !mobileMenu.contains(e.target)) {
            closeMenu();
        }
    }, false);


    // Selector de idioma para reservas
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Cambia entre idiomas
            const lang = this.dataset.lang;
            document.querySelectorAll('.lang-es, .lang-en').forEach(el => {
                el.classList.add('hidden');
            });
            document.querySelectorAll(`.lang-${lang}`).forEach(el => {
                el.classList.remove('hidden');
            });

            // Cambia entre widgets
            document.getElementById('widget-es').classList.toggle('hidden', lang !== 'es');
            document.getElementById('widget-en').classList.toggle('hidden', lang !== 'en');
        });
    });

    const botonesAcordeon = document.querySelectorAll('.acordeon-titulo');
 
    botonesAcordeon.forEach(boton => {
        boton.addEventListener('click', () => {
            const contenido = boton.nextElementSibling;

            // Cierra todos los paneles excepto el actual
            document.querySelectorAll('.acordeon-contenido').forEach(panel => {
                if (panel !== contenido) {
                    panel.classList.remove('activo');
                }
            });

            // Alterna el panel clicado
            contenido.classList.toggle('activo');
        });
    });


    // Carrusel con contador numérico (si existe en la página)
    const carousel = document.querySelector('.carousel__container');
    if (carousel) {
        const items = document.querySelectorAll('.carousel__item');
        const totalItems = items.length;
        let currentIndex = 0;
        let autoPlayInterval;
        let isTouching = false;
        
        // Crear flechas de navegación
        const prevArrow = document.createElement('button');
        prevArrow.classList.add('carousel__arrow', 'carousel__arrow--prev');
        prevArrow.innerHTML = '&#10094;';
        prevArrow.setAttribute('aria-label', 'Anterior');
        
        const nextArrow = document.createElement('button');
        nextArrow.classList.add('carousel__arrow', 'carousel__arrow--next');
        nextArrow.innerHTML = '&#10095;';
        nextArrow.setAttribute('aria-label', 'Siguiente');
        
        // Crear contador numérico (en lugar de indicadores)
        const counter = document.createElement('div');
        counter.classList.add('carousel__counter');
        counter.setAttribute('aria-live', 'polite');
        counter.textContent = `1/${totalItems}`;
        
        const carouselParent = carousel.parentElement;
        carouselParent.appendChild(prevArrow);
        carouselParent.appendChild(nextArrow);
        carouselParent.appendChild(counter);
        
        // Eliminar el contenedor de indicadores si existe
        const oldIndicators = document.querySelector('.carousel__indicators');
        if (oldIndicators) {
            oldIndicators.innerHTML = ''; // Vaciamos el contenedor en lugar de eliminarlo para mantener la estructura
        }
        
        // Función para ir a una diapositiva específica
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
        
        // Función para actualizar el carrusel
        function updateCarousel() {
            // Implementar transición suave
            carousel.style.transition = "transform 0.5s ease";
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        
        // Función para actualizar el contador
        function updateCounter() {
            counter.textContent = `${currentIndex + 1} | ${totalItems}`;
        }
        
        // Evento para flecha anterior
        prevArrow.addEventListener('click', function() {
            goToSlide(currentIndex - 1);
            resetAutoPlayTimer();
        });
        
        // Evento para flecha siguiente
        nextArrow.addEventListener('click', function() {
            goToSlide(currentIndex + 1);
            resetAutoPlayTimer();
        });
        
        // Función para iniciar el temporizador de reproducción automática
        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                if (!isTouching) {
                    goToSlide(currentIndex + 1);
                }
            }, 6000);
        }
        
        // Función para detener el temporizador
        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }
        
        // Función para reiniciar el temporizador
        function resetAutoPlayTimer() {
            stopAutoPlay();
            startAutoPlay();
        }
        
        // Agregar funcionalidad de swipe para móviles
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
            const swipeThreshold = 50; // Umbral para considerar un swipe
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe izquierda (siguiente)
                goToSlide(currentIndex + 1);
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe derecha (anterior)
                goToSlide(currentIndex - 1);
            }
        }
        
        // Detener autoplay en eventos de mouse
        carouselParent.addEventListener('mouseenter', () => {
            stopAutoPlay();
        });
        
        carouselParent.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
        
        // También usar teclado para navegar
        document.addEventListener('keydown', function(e) {
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
        
        // Verificar si el elemento está en el viewport
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
        
        // Iniciar la reproducción automática
        startAutoPlay();
    }
});