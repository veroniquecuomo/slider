export default class Slider {

    // Le conteneur principal
    slider = null;
    // NodeList des slides 
    slides = [];

    // Navigation 
    nav = null;

    // Pagination 
    pagination = null;

    diaporama = null;
    timer = null;

    // index de la slide active
    index = 0;

    // Options par défaut
    options = {
        pagination: false,
        diaporama: false
    };

    constructor(selector, options= this.options) {
        this.slider = document.querySelector(selector);
        

        if(
            this.slider !== null
        ) {
            this.options = options;
            this.slides = this.slider.querySelectorAll('.slider-slide');
            this.init();
        }
    }   

    init() {

        this.hideSlides();
        this.createNavigation();

        this.slider.addEventListener('click', this.onClickSlider.bind(this));
        document.addEventListener('keyup', this.onkeyUp.bind(this));

        this.slider.addEventListener('animationend', (event) => {            
            // let classeAnimation = 'animate__' + event.animationName;
            event.target.classList.remove(this.slider.dataset.animationleft);
            event.target.classList.remove(this.slider.dataset.animationright);
            event.target.classList.remove('animate__fadeInDown');
        });
        
        if(this.options.pagination) {
            this.createPagination();
            this.pagination.addEventListener('focusin', (event) => {
                event.target.click();
            } );
        }

        if(this.options.diaporama) {
            this.createDiaporama();
            // Stopper le slider  (attention aux positions : voir z-index sur slider-container)
            this.slider.querySelector('.slider-container').addEventListener('mouseover', () => {
                if(this.timer !== null) {
                    this.diaporamaStop();
                }
            });
        }
    }

    hideSlides() {
        this.slides.forEach((slide,i) => {
            if(i > 0)
                slide.classList.add('is-hidden');
                slide.setAttribute('aria-hidden', 'true');
        });
    }
    
    createNavigation() {
        this.nav = document.createElement('nav');
        this.nav.classList.add('slider-navigation');

        let btnPrev = document.createElement('a');
        btnPrev.classList.add('slider-navigation-link');
        btnPrev.role='button';
        btnPrev.rel = 'prev';

        let btnNext = btnPrev.cloneNode();
        btnNext.rel  = 'next';

        let spanPrev = document.createElement('span');
        spanPrev.setAttribute('aria-hidden','true');  
        spanPrev.classList.add('slider-icon');              
        let spanNext = spanPrev.cloneNode();

        spanPrev.classList.add('icon-arrow-left');
        spanNext.classList.add('icon-arrow-right');

        btnPrev.setAttribute('data-action','backward');
        btnNext.setAttribute('data-action','forward');

        btnPrev.append(spanPrev);
        btnNext.append(spanNext);

        this.nav.append(btnPrev);
        this.nav.append(btnNext);

        this.slider.append(this.nav);
    }

    createPagination() {
        this.pagination = document.createElement('ol');
        this.pagination.classList.add('slider-pagination');
        this.pagination.role = 'tablist';

        for(let i=0; i < this.slides.length; i++) {
            let li = document.createElement('li');
            li.classList.add('slider-pagination-item');
            li.role = 'tab';
            li.setAttribute('tabindex','0');
            // Ajouter un id à la figure correspondante
            this.slides[i].setAttribute('id','slider-' + i);
            // Qui correspond à chaque item de la pagination
            li.setAttribute('aria-controls', `slider-${i}`);
            this.pagination.appendChild(li);
        }
        
        this.pagination.firstElementChild.classList.add('is-active');
        this.slider.append(this.pagination);
    }

    createDiaporama() {
        this.diaporama = document.createElement('button');
        this.diaporama.classList.add('slider-diaporama');
        this.diaporama.type = this.diaporama.role = 'button';

        let span = document.createElement('span');
        span.setAttribute('aria-hidden','true');
        span.classList.add('icon-play');
        this.diaporama.append(span);
        this.slider.append(this.diaporama);
    }

    changeSlide(animation) {
        // Supprimer la classe is-hidden sur la slide correspondant au nouvel index
        this.slides[this.index].classList.remove('is-hidden');
        this.slides[this.index].setAttribute('aria-hidden','false');
        this.slides[this.index].classList.add(animation); 
        
        // Remplacer par événement animationend
        //setTimeout(() => this.slides[this.index].classList.remove(animation),1000);

        if(this.pagination)  {
            // Modifier la classe active de la pagination
            this.pagination.querySelector('li.is-active').classList.remove('is-active');
            this.pagination.children[this.index].classList.add('is-active');
        }
    }

    backward() {
        this.slides[this.index].classList.add('is-hidden');
        this.slides[this.index].setAttribute('aria-hidden','true');

        this.index--;
        if( this.index < 0 ) {
            this.index = this.slides.length - 1;
        }

        this.changeSlide(this.slider.dataset.animationleft);
        
    }

    forward() {
        this.slides[this.index].classList.add('is-hidden');
        this.slides[this.index].setAttribute('aria-hidden','true');

        this.index++;
        if( this.index > this.slides.length - 1  ) {
            this.index = 0;
        }

        this.changeSlide(this.slider.dataset.animationright);
    }

    diaporamaStart() {
        this.timer = setInterval(() => this.forward(),2000);
        this.diaporama.firstElementChild.classList.remove('icon-play');        
        this.diaporama.firstElementChild.classList.add('icon-stop');
    }

    diaporamaStop() {
        clearInterval(this.timer);
        this.timer = null;
        this.diaporama.firstElementChild.classList.add('icon-play');
        this.diaporama.firstElementChild.classList.remove('icon-stop');
    }

    onClickSlider(event) {
        // event.target.closest(selector) renvoie l'élément ou le premier parent correspondant à selector
        // Si lien ou span 
        if( event.target.closest('.slider-navigation-link')){            
            let target = event.target.closest('.slider-navigation-link');
            // La méthode est stockée dans un attribut data-action de chaque bouton
            let action = target.dataset.action;

            // Equivalent à this.forward() ou à this.backward()
            // Il faut utiliser la notation [] pour passer la valeur de action 
            // car this.action() appellerait une méthode action() de l'objet
            this[action]();            
        }
        else if( event.target.closest('.slider-pagination-item') ) {

            this.slides[this.index].classList.add('is-hidden');
            this.slides[this.index].setAttribute('aria-hidden','true');

            // pagination.children = collection des enfants de pagination 
            this.index = Array.from(this.pagination.children).indexOf(event.target);
            this.changeSlide('animate__fadeInDown');
        }
        else if( event.target.closest('.slider-diaporama')) {
            this.timer === null ? this.diaporamaStart() : this.diaporamaStop();
        }
    }

    onkeyUp(event) {
        switch(event.key) {
            case 'ArrowRight':
                this.forward();
                break;
            
            case 'ArrowLeft':
                this.backward();
                break;
        }
    }
}