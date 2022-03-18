function handleNav() {
    var nav = document.getElementById("myTopNav");
    if (nav.className === "topnav") {
      nav.className += " responsive";
    } else {
      nav.className = "topnav";
    }
}

function setColorScheme(scheme) {
    var body = document.getElementById("mainBody");
    switch(scheme){
        case 'dark':          
            body.classList.add("dark");
        break;
        case 'light':           
            body.className = ""
        break;
        default:          
            body.className = ""
        break;
    }
}

function getPreferredColorScheme() {
    if (window.matchMedia) {
        if(window.matchMedia('(prefers-color-scheme: dark)').matches){
            return 'dark';
        } else {
            return 'light';
        }
    }
    return 'light';
}

window.onload = function() {
    if(window.matchMedia){
        var colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        colorSchemeQuery.addEventListener('change', setColorScheme(getPreferredColorScheme()));
    }
}