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


    // Carrusel (si existe en la página)
    const carousel = document.querySelector('.carousel__container');
    if (carousel) {
        const items = document.querySelectorAll('.carousel__item');
        const indicatorsContainer = document.querySelector('.carousel__indicators');
        let currentIndex = 0;
        let autoPlayInterval;
        
        // Crear indicadores
        items.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('carousel__indicator');
            if (index === 0) indicator.classList.add('active');
            
            indicator.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
                updateIndicators();
                resetAutoPlayTimer(); // Reiniciar el temporizador al hacer clic en un indicador
            });
            
            indicatorsContainer.appendChild(indicator);
        });
        
        const indicators = document.querySelectorAll('.carousel__indicator');
        
        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        
        function updateIndicators() {
            indicators.forEach((ind, index) => {
                if (index === currentIndex) {
                    ind.classList.add('active');
                } else {
                    ind.classList.remove('active');
                }
            });
        }
        
        // Función para iniciar el temporizador de reproducción automática
        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % items.length;
                updateCarousel();
                updateIndicators();
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
            stopAutoPlay(); // Detener autoplay al iniciar el toque
        });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoPlay(); // Reiniciar autoplay al finalizar el toque
        });
        
        function handleSwipe() {
            if (touchEndX < touchStartX - 50) { // Umbral de 50px para considerar un swipe
                // Swipe izquierda (siguiente)
                currentIndex = (currentIndex + 1) % items.length;
            } else if (touchEndX > touchStartX + 50) { // Umbral de 50px para considerar un swipe
                // Swipe derecha (anterior)
                currentIndex = (currentIndex - 1 + items.length) % items.length;
            }
            updateCarousel();
            updateIndicators();
        }
        
        // Detener autoplay en eventos de mouse también
        carousel.addEventListener('mouseenter', () => {
            stopAutoPlay();
        });
        
        carousel.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
        
        // Iniciar la reproducción automática
        startAutoPlay();
    }
});