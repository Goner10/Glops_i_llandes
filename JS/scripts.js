document.addEventListener('DOMContentLoaded', function() {


    // Menú hamburguesa
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    mobileMenu.addEventListener('click', function() {
        this.classList.toggle('hero__menu-toggle--active');
        navMenu.classList.toggle('hero__nav--active');
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



    // Carrusel (si existe en la página)
    const carousel = document.querySelector('.carousel__container');
    if (carousel) {
        const prevBtn = document.querySelector('.carousel__btn--prev');
        const nextBtn = document.querySelector('.carousel__btn--next');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        nextBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % document.querySelectorAll('.carousel__item').length;
            updateCarousel();
        });

        prevBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + document.querySelectorAll('.carousel__item').length) % 
                          document.querySelectorAll('.carousel__item').length;
            updateCarousel();
        });

        let autoPlayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % document.querySelectorAll('.carousel__item').length;
            updateCarousel();
        }, 5000);

        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });

        carousel.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % document.querySelectorAll('.carousel__item').length;
                updateCarousel();
            }, 5000);
        });
    }

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


});
