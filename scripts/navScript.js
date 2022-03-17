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
    console.log(body);
    switch(scheme){
        case 'dark':
        // Dark
            console.log('dark mode')            
            body.classList.add("dark");
        break;
        case 'light':
        // Light
            console.log('light mode')           
            body.className = ""
        break;
        default:
        // Default
            console.log('default mode')           
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