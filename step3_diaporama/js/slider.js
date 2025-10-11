'use strict';

// ====================================================== //
// =============== Déclarer les variables =============== //
// ====================================================== //

// Collection des figures 
const slides = document.querySelectorAll('.slider-figure');

// Lien pour avancer
const bntNext = document.querySelector('.slider-navigation-link[rel="next"]');

// Lien pour reculer
const bntPrev = document.querySelector('.slider-navigation-link[rel="prev"]');

// Bouton Diaporama
const btnDiapo = document.querySelector('.slider-diaporama'); 

// Indice de la figure visible dans slides
let index = 0;

// Timer du diaporama
let timer = null;


// div qui regroupe toutes les figures (pour le survol)
const slidesContainer = document.querySelector('.slider-container');


// ====================================================== //
// =============== Déclarer les fonctions =============== //
// ====================================================== //


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

/**
    Cacher la slide correspondant à l'index
    Incrémenter index (pour accéder à la figure suivante)
        Si index est supérieur au dernier index du tableau slides
        Alors index = 0
    Montrer la slide correspondant à index

*/

    // Ajouter la classe is-hidden à la slide en cours 
    slides[index].classList.add('is-hidden');
    slides[index].setAttribute('aria-hidden','true');

    // Incrémenter index 
    index++;

    // Si index est supérieur au dernier index ( nombre de lignes -1  )
    if( index > slides.length - 1  ) {
        index = 0;
    }

    // Supprimer la classe is-hidden sur la slide correspondant au nouvel index
    slides[index].classList.remove('is-hidden');
    slides[index].setAttribute('aria-hidden','false');

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
    
/**
    Cacher la slide correspondant à l'index
    Décrémenter index (pour accéder à la figure précédente)
        Si index est inférieur à 0 
        Alors index = dernier index du tableau slides
    Montrer la slide correspondant à index
*/

    slides[index].classList.add('is-hidden');
    slides[index].setAttribute('aria-hidden','true');

    index--;
    
    if( index < 0 ) {
        index = slides.length - 1;
    }

    slides[index].classList.remove('is-hidden');
    slides[index].setAttribute('aria-hidden','false');

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
    
    /** 
    Si timer est null
        Alors lancer le diaporama 
        Modifier le svg
    Sinon 
        Arrêter le diaporama
        ?
        Modifier le svg
    */

    // Cibler l'enfant svg du bouton puis l'enfant use de svg
    
    // on peut utiliser this qui correspond à btnDiapo ! : 
    // l'élément sur lequel est installé l'événement : this est l'objet qui exécute la fonction 
    // const use = this.firstElementChild.children[1];
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

    /**
    Si le timer est différent de null Alors 
        stopper l'animation
        modifier le bouton en pause 
     */
        
    if( timer !== null ) {
        const use = btnDiapo.firstElementChild.querySelector('use');
        clearInterval(timer);

        console.log(timer);

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

        const use = btnDiapo.firstElementChild.querySelector('use');
        
         // Lancer l'animation
        timer = setInterval(onClickNext,2000);

        // Modifier la classe du bouton
        btnDiapo.classList.remove('icon-pause');        
        btnDiapo.classList.add('icon-stop');
        use.setAttribute('xlink:href','#icon-stop');
    }
}


// ##################################################################### //
// ##### Gestionnaires d'événements exécutés une fois au chargement #### //
// ##################################################################### //

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

