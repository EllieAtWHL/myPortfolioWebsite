let currentMode;

function handleNav() {
    var nav = document.getElementById("myTopNav");
    if (nav.className === "topnav") {
      nav.className += " responsive";
    } else {
      nav.className = "topnav";
    }
}

function setColorScheme(scheme) {    
    switch(scheme){
        case 'dark':  
            document.getElementById('darkMode').checked = true;
            document.getElementById('mainBody').classList.add("dark");
        break;
        case 'light':           
            document.getElementById('mainBody').className = ""
        break;
        default:          
            document.getElementById('mainBody').className = ""
        break;
    }
}

function getPreferredColorScheme() {
    if(currentMode){
        return currentMode;
    }
    if (window.matchMedia) {
        if(window.matchMedia('(prefers-color-scheme: dark)').matches){
            currentMode = 'dark';
        } else {
            currentMode = 'light';
        }
    }
    return currentMode;
}

function handleDarkMode(){
    var checkbox = document.getElementById('darkMode');
    if(checkbox.checked === true){
        currentMode = 'dark';
    }else {
        currentMode = 'light';
    }
    setColorScheme(currentMode);
}

window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    if(params.has('mode')){
        currentMode = params.get('mode');
    }
    if(window.matchMedia){
        var colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        colorSchemeQuery.addEventListener('change', setColorScheme(getPreferredColorScheme()));
    }
}