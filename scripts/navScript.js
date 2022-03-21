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
    if (window.matchMedia) {
        if(window.matchMedia('(prefers-color-scheme: dark)').matches){
            return 'dark';
        } else {
            return 'light';
        }
    }
    return 'light';
}

function handleDarkMode(){
    var checkbox = document.getElementById('darkMode');
    if(checkbox.checked === true){
        setColorScheme('dark');
    }else {
        setColorScheme('light');
    }
}

window.onload = function() {
    if(window.matchMedia){
        var colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        colorSchemeQuery.addEventListener('change', setColorScheme(getPreferredColorScheme()));
    }
}