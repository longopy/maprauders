import $ from 'jquery';

// Styles
import "../css/lang.css"

function detectLanguage() {
    if (!localStorage.hasOwnProperty('lang')){
        localStorage.setItem('lang', 'en');
    }
}

function loadLangButton() {
    const langBtn = document.getElementById('lang-btn');
    const lang = getTheOtherOption();
    langBtn.src=`../data/lang/${lang}.svg`;
}

function loadTitle(){
    const lang = localStorage.getItem('lang')
    const titles ={
        en: 'Marauders Interactive Maps',
        es: 'Mapas Interactivos Marauders'
    }
    document.title = titles[lang]; 
    document.lang = lang;
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
    loadTitle();
    loadLangButton();
    $('#change-language-btn').on('click', function (e){
        e.preventDefault();
        const lang = getTheOtherOption();
        localStorage.setItem('lang', lang);
        window.location.reload();
    });
});