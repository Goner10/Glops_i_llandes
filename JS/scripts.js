document.addEventListener('DOMContentLoaded', function() {


    // Menú hamburguesa
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    mobileMenu.addEventListener('click', function(e) {
        this.classList.toggle('hero__menu-toggle--active');
        navMenu.classList.toggle('hero__nav--active');
        e.stopPropagation(); // Previene que el clic llegue al documento
    });
    
    // Evitar que los clics dentro del menú lo cierren
    navMenu.addEventListener('click', function(e) {
        e.stopPropagation(); // Previene que el clic llegue al documento
    });
    
    // Cerrar el menú cuando se hace clic en cualquier parte fuera del menú
    document.addEventListener('click', function() {
        if (navMenu.classList.contains('hero__nav--active')) {
            mobileMenu.classList.remove('hero__menu-toggle--active');
            navMenu.classList.remove('hero__nav--active');
        }
    });



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
    
    // Crear indicadores
    items.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('carousel__indicator');
        if (index === 0) indicator.classList.add('active');
        
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
            updateIndicators();
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
    
    // Agregar funcionalidad de swipe para móviles
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX) {
            // Swipe izquierda (siguiente)
            currentIndex = (currentIndex + 1) % items.length;
        } else if (touchEndX > touchStartX) {
            // Swipe derecha (anterior)
            currentIndex = (currentIndex - 1 + items.length) % items.length;
        }
        updateCarousel();
        updateIndicators();
    }
    
    // Auto-reproducción
    let autoPlayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
        updateIndicators();
    }, 4000); // Cambio cada 3 segundos
    
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % items.length;
            updateCarousel();
            updateIndicators();
        }, 4000);
    });
}
});
