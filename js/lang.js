import $ from 'jquery';

// Styles
import "../css/lang.css"

function detectLanguage() {
    if (!localStorage.hasOwnProperty('lang')){
        const langs = ['en', 'es'];
        const browserLang = (navigator.language || navigator.userLanguage).split('-')[0];
        const lang = langs.includes(browserLang) ? browserLang : 'en';
        localStorage.setItem('lang', lang);
        document.documentElement.setAttribute("lang", lang);
    }
}

function loadLangButton() {
    const langBtn = document.getElementById('lang-btn');
    const lang = getTheOtherOption();
    langBtn.innerHTML = lang.toUpperCase();
}

function getTheOtherOption(){
    const lang = localStorage.getItem('lang')
    if (lang === 'en') {
        return 'es';
    }else{
        return 'en';
    }
}
$(function (){
    detectLanguage();
    loadLangButton();
    $('#change-language-btn').on('click', function (e){
        e.preventDefault();
        const lang = getTheOtherOption();
        document.documentElement.setAttribute("lang", lang);
        localStorage.setItem('lang', lang);
        window.location.reload();
    });
});