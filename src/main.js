import('./js/mobile-menu');
import './js/carousel-settings.js';
import('./js/animation');
import { translations } from "./lang.js";

function applyTranslations(lang) {
  for (const key in translations[lang]) {
    const elements = document.getElementsByClassName(key);
    for (const el of elements) {
      el.innerText = translations[lang][key];
    }
  }
}
