'use strict';

// ====================================================== //
// =============== Déclarer les variables =============== //
// ====================================================== //

// Collection des figures 
const slides = document.querySelectorAll('.slider-figure');
console.log(slides);

// Lien pour avancer
const bntNext = document.querySelector('.slider-navigation-link[rel="next"]');

// Lien pour reculer
const bntPrev = document.querySelector('.slider-navigation-link[rel="prev"]');

// Indice de la figure visible dans slides
let index = 0;

// Première figure
console.log(slides[index]);
console.log(bntNext);

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

function onClickPrev() {
    console.log('Ca marche');

    // Ajouter la classe is-hidden à la slide en cours 
    slides[index].classList.add('is-hidden');
    slides[index].setAttribute('aria-hidden','true');

    index--;
    
    if( index < 0 ) {
        index = slides.length - 1;
    }

    slides[index].classList.remove('is-hidden');
    slides[index].setAttribute('aria-hidden','false');

}


// ##################################################################### //
// ##### Gestionnaires d'événements exécutés une fois au chargement #### //
// ##################################################################### //

// Installer un gestionnaire d’événement sur les boutons 
bntNext.addEventListener('click', onClickNext);
bntPrev.addEventListener('click', onClickPrev);

