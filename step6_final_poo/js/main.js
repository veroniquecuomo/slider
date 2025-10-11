
import Slider from './modules/Slider.js';
const monSlider = new Slider('.mySlider',{
    pagination:true,
    diaporama:true
});
console.log(monSlider.slider);

// Accéder à une variable déclarée dans foo.js
// Plantage si foo est déclarée en tant que module
// console.log(foo);