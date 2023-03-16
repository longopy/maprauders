import $ from 'jquery';

$(function (){
    $('#change-language-btn').on('click', function (e){
        console.log(e)
        e.preventDefault();
        let location = window.location.href;
        const lang = localStorage.getItem('lang');
        if (lang === 'es') {
            location = location.replace(/\/es\//, '/en/');
        }else{
            location = location.replace(/\/en\//, '/es/');
        }
        window.location.href = location;
    });
});