import $ from 'jquery';

function detectLanguage() {
    const lang = localStorage.getItem('lang', 'en')
}

function loadLangButton() {
    const langBtn = document.getElementById('lang-btn');
    const lang = getTheOtherOption();
    langBtn.src=`../data/lang/${lang}.svg`;
}

function loadTitle(){
    const lang = localStorage.getItem('lang', 'en')
    const titles ={
        en: 'Marauders Interactive Maps',
        es: 'Mapas Interactivos Marauders'
    }
    document.title = titles[lang]; 
}

function getTheOtherOption(){
    const lang = localStorage.getItem('lang', 'en')
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
        console.log(e)
        const lang = getTheOtherOption();
        localStorage.setItem('lang', lang);
        window.location.reload();
    });
});