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


    // Selector de idioma unificado (para reservas y carta)
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Resetear botones
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            
            const lang = this.dataset.lang;
            console.log(`Cambiando a idioma: ${lang}`);
            
            // OCULTAR TODOS los elementos de TODOS los idiomas primero
            document.querySelectorAll('.lang-es, .lang-en').forEach(el => {
                el.classList.add('hidden');
            });
            
            // MOSTRAR SOLO los elementos del idioma seleccionado
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

    // Al cargar la página, asegurar que solo el idioma por defecto (español) está visible
    // Ocultar todo el contenido en inglés al cargar
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

    const botonesAcordeon = document.querySelectorAll('.acordeon-titulo');
 
    botonesAcordeon.forEach(boton => {
        boton.addEventListener('click', () => {
            const contenido = boton.nextElementSibling;

           
            document.querySelectorAll('.acordeon-contenido').forEach(panel => {
                if (panel !== contenido) {
                    panel.classList.remove('activo');
                }
            });

            
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


        const carouselElement = document.querySelector('.carousel');
        if (carouselElement) {
            // Prevenir gestos de pinch zoom
            carouselElement.addEventListener('touchstart', function(e) {
                if (e.touches.length > 1) {
                    e.preventDefault();
                }
            }, { passive: false });
            
            // Prevenir doble tap para hacer zoom
            let lastTapTime = 0;
            carouselElement.addEventListener('touchend', function(e) {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTapTime;
                
                if (tapLength < 500 && tapLength > 0) {
                    e.preventDefault();
                }
                
                lastTapTime = currentTime;
            }, { passive: false });
        }
        
        // Crear flechas de navegación
        const prevArrow = document.createElement('button');
        prevArrow.classList.add('carousel__arrow', 'carousel__arrow--prev');
        prevArrow.innerHTML = '&#10094;';
        prevArrow.setAttribute('aria-label', 'Anterior');
        
        const nextArrow = document.createElement('button');
        nextArrow.classList.add('carousel__arrow', 'carousel__arrow--next');
        nextArrow.innerHTML = '&#10095;';
        nextArrow.setAttribute('aria-label', 'Siguiente');
        
        // Crear contador numérico 
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
            }, 4000);
        }
        
        
        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }
        
        // Función para reiniciar el temporizador
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
        
        
        startAutoPlay();
    }
    

    function adjustReservationIframe() {
        const reservationIframes = document.querySelectorAll('.thefork-widget-container iframe');
        if (reservationIframes.length > 0) {
            const windowWidth = window.innerWidth;
            
            reservationIframes.forEach(iframe => {
                if (windowWidth <= 360) {
                    iframe.style.height = '900px';
                } else if (windowWidth <= 480) {
                    iframe.style.height = '850px';
                } else if (windowWidth <= 768) {
                    iframe.style.height = '800px';
                } else {
                    iframe.style.height = '750px';
                }
            });
        }
    }
    
    if (document.querySelector('.thefork-widget-container')) {
        adjustReservationIframe();
        window.addEventListener('resize', adjustReservationIframe);
    }
    
    // Evitar scroll cuando el menú está abierto en móviles
    const menuToggle = document.getElementById('mobile-menu');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.body.classList.toggle('menu-open');
            
            if (document.body.classList.contains('menu-open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }




});