'use strict';

// ====================================================== //
// =============== Déclarer les variables =============== //
// ====================================================== //

// Collection des figures 
const slides = document.querySelectorAll('.slider-figure');

// Lien pour avancer
const bntNext = document.querySelector('.slider-navigation-link[rel="next"]');

// div qui regroupe toutes les figures (pour le survol)
const slidesContainer = document.querySelector('.slider-container');

// Lien pour reculer
const bntPrev = document.querySelector('.slider-navigation-link[rel="prev"]');

// Bouton Diaporama
const btnDiapo = document.querySelector('.slider-diaporama'); 

// Indice de la figure visible dans slides
let index = 0;

// Timer du diaporama
let timer = null;

let pagination = null;





// ====================================================== //
// =============== Déclarer les fonctions =============== //
// ====================================================== //

function changeSlide(animation) {
    // Supprimer la classe is-hidden sur la slide correspondant au nouvel index
    slides[index].classList.remove('is-hidden');
    slides[index].setAttribute('aria-hidden','false');
    slides[index].classList.add(animation);

    // Modifier la classe active de la pagination
    // Cibler dans la ol (= voisin suivant slidesContainer)  un élément de class is-active
    slidesContainer.nextElementSibling.querySelector('li.is-active').classList.remove('is-active');
    // Cibler la li correspondant au nouvel index
    slidesContainer.nextElementSibling.querySelector(`li[aria-controls="slider-${index}"]`).classList.add('is-active');
}

/**
 * Faire avancer le slider
 * Fonction attachée à un gestionnaire d'événement
 * 
 * @function
 * @name onClickNext
 * @kind function
 * @returns {void}
 */
function onClickNext() {


    // Ajouter la classe is-hidden à la slide en cours 
    slides[index].classList.add('is-hidden');
    slides[index].setAttribute('aria-hidden','true');
    
    // Incrémenter index 
    index++;

    // Si index est supérieur au dernier index ( nombre de lignes -1  )
    if( index > slides.length - 1  ) {
        index = 0;
    }

    // Passer la classe d'animation stockée dans l'attribut data-animationLeft du composant

    // Cibler le parent le plus proche de la classe 
    let slider = slidesContainer.closest('.slider')
    console.log(slider);

    // Récupérer la valeur de l'attribut data-animationLeft
    changeSlide(slider.dataset.animationleft);
    
}

/**
 * Faire reculer le slider
 * Fonction attachée à un gestionnaire d'événement
 * 
 * @function
 * @name onClickPrev
 * @kind function
 * @returns {void}
 */
function onClickPrev() {

    slides[index].classList.add('is-hidden');
    slides[index].setAttribute('aria-hidden','true');

    index--;
    
    if( index < 0 ) {
        index = slides.length - 1;
    }

    // Cibler le parent le plus proche de la classe 
    let slider = slidesContainer.closest('.slider')
    console.log(slider);

    // Récupérer la valeur de l'attribut data-animationLeft
    changeSlide(slider.dataset.animationright);
}

/**
 * The `onKeyUp` function is an event handler for the `keyup` event. It is triggered when a key on the keyboard is
 * released. Inside the function, there is a switch statement that checks the value of `event.key`, which represents the
 * key that was released.
 * 
 * @function
 * @name onKeyUp
 * @kind function
 * @param {object} event
 * @returns {void}
 */
function onkeyUp(event) {
    console.log(event.key);

    switch(event.key) {
        case 'ArrowRight':
            onClickNext();
            break;
        
        case 'ArrowLeft':
            onClickPrev();
            break;
    }
}


/**
 * The `onClickDiapo` function is responsible for starting the slideshow. When the button with the class
 * `slider-navigation` is clicked, the function is triggered. Inside the function, the text content of the button is
 * changed to "Stopper le diaporama" (which means "Stop the slideshow" in French). Then, the `setInterval` function is used
 * to call the `onClickNext` function every 2000 milliseconds (1 second), effectively advancing the slideshow
 * automatically.
 * 
 * @function
 * @name onClickDiapo
 * @returns {void}
 */

function onClickBtnDiapo() {
    
    const use = this.firstElementChild.querySelector('use');
        
    if(timer === null) {
        // Lancer l'animation
        timer = setInterval(onClickNext,2000);

        // Modifier la classe du bouton
        this.classList.remove('icon-play');        
        this.classList.add('icon-stop');
        use.setAttribute('xlink:href','#icon-stop');
    } else {
        clearInterval(timer);
        timer = null;

        this.classList.add('icon-play');
        this.classList.remove('icon-stop');
        use.setAttribute('xlink:href','#icon-play');
    }
    
}

/**
 * Mettre le diaporama en pause 
 * 
 * @function
 * @name onMouseOver
 * @kind function
 * @returns {void}
 */

function onMouseOver() {
        
    if( timer !== null ) {
        clearInterval(timer);
        
        const use = btnDiapo.firstElementChild.querySelector('use');
        btnDiapo.classList.add('icon-pause');
        btnDiapo.classList.remove('icon-stop');
        use.setAttribute('xlink:href','#icon-pause');
    }
}

/**
 * Relancer le diaporama si il est en pause 
 * 
 * @function
 * @name onMouseOut
 * @kind function
 * @returns {void}
 */

function onMouseOut() {
    if( timer !== null) {

         // Lancer l'animation
        timer = setInterval(onClickNext,2000);

        // Modifier la classe du bouton
        const use = btnDiapo.firstElementChild.querySelector('use');
        btnDiapo.classList.remove('icon-pause');        
        btnDiapo.classList.add('icon-stop');
        use.setAttribute('xlink:href','#icon-stop');
    }
}

/**
 * Créer une pagination pour le diaporama et l'insérer à fin du composant slider
 * 
 * @function
 * @name onMouseOut
 * @kind function
 * @returns {void}
 */
function createPagination() {
    pagination = document.createElement('ol');
    pagination.classList.add('slider-pagination');
    pagination.role = 'tablist';

    for(let i=0; i < slides.length; i++) {
        let li = document.createElement('li');
        li.classList.add('slider-pagination-item');
        li.role = 'tab';
        li.setAttribute('tabindex','0');
        // Ajouter un id à la figure correspondante
        slides[i].setAttribute('id','slider-' + i);
        // Qui correspond à chaque item de la pagination
        li.setAttribute('aria-controls', `slider-${i}`);
        pagination.appendChild(li);
    }
    
    pagination.firstElementChild.classList.add('is-active');
    slidesContainer.after(pagination);
}


// ##################################################################### //
//    Fonctions et Gestionnaires d'événements exécutés au chargement     //
// ##################################################################### //


createPagination();

// Installer un gestionnaire d’événement sur les boutons 
bntNext.addEventListener('click', onClickNext);
bntPrev.addEventListener('click', onClickPrev);
btnDiapo.addEventListener('click', onClickBtnDiapo);

/**
 * Navigation au clavier : événement est rattaché au document
 * keyup = événement lorsque une touche clavier est relâchée
 */
document.addEventListener('keyup', onkeyUp);


// Mettre le slider en pause si il est déclenché au survol des slides 
slidesContainer.addEventListener('mouseover', onMouseOver);

// Relancer le diaporama si il est en pause lorsque la souris se déplace hors des slides
slidesContainer.addEventListener('mouseout', onMouseOut);


pagination.addEventListener('click', function(event) {

    // console.log(this);
    // console.log(event.target);

    if( event.target.tagName === 'LI' ) {
        // Redéfinir index = l'indice de la li (event.target) dans pagination
        // arr.indexOf(value) renvoie indice de value dans arr (arr doit avoir un prototype Array)

        slides[index].classList.add('is-hidden');
        slides[index].setAttribute('aria-hidden','true');

        // pagination.children = collection des enfants de pagination 
        index = Array.from(this.children).indexOf(event.target);

        changeSlide('animate__fadeInDown');
    }

});

pagination.addEventListener('focusin', function(event) {
    event.target.click();
} );

document.addEventListener('animationend', function(event) {
    console.log(event);
    let classeAnimation = 'animate__' + event.animationName;
    event.target.classList.remove(classeAnimation);
});



