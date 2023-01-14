const lightningLink = document.getElementById('lightning');
const ghlLink = document.getElementById('ghl');
const regicideLink = document.getElementById('regicide');
const londonLink = document.getElementById('london-2012');

lightningLink.addEventListener('click', () => {window.location='../lightning-rollout/part-1.html?mode='+currentMode})
ghlLink.addEventListener('click', () => {window.location='../ghl/index.html?mode='+currentMode})
regicideLink.addEventListener('click', () => {window.location='../regicide/index.html?mode='+currentMode})
londonLink.addEventListener('click', () => {window.location='../london-2012/it-begins.html?mode='+currentMode})

function getPreference() {
    const params = new URLSearchParams(window.location.search)
    if(params.has('mode')){
        currentMode = params.get('mode')
    }
    if(window.matchMedia){
        var colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
        colorSchemeQuery.addEventListener('change', setColorScheme(getPreferredColorScheme()))
    }
}

const buttonElements = document.querySelectorAll('.card')

buttonElements.forEach(buttonElement => {
    buttonElement.addEventListener('click', handleClick)
})

function handleClick(event){

    if(event.target.localName === 'li'){
        return
    }
    
    let button = event.currentTarget

    let hover = button.querySelector('.card-desc')
    hover.classList.toggle('closed')

    let links = button.querySelector('.links')
    links.classList.toggle('closed')

    let nextSibling = button.nextElementSibling
    let prevSibling = button.previousElementSibling

    while(nextSibling) {
        let hover = nextSibling.querySelector('.card-desc')
        hover.classList.remove('closed')

        let links = nextSibling.querySelector('.links')
        links.classList.add('closed')

        nextSibling = nextSibling.nextElementSibling;
    }
    while(prevSibling) {
        let hover = prevSibling.querySelector('.card-desc')
        hover.classList.remove('closed')

        let links = prevSibling.querySelector('.links')
        links.classList.add('closed')

        prevSibling = prevSibling.previousElementSibling;
    }
}

function setColorScheme(scheme) {  
    const element = document.getElementById('body')  
    switch(scheme){
        case 'dark':  
            element.classList.add("dark")
        break
        case 'light':           
            element.className = ""
        break
        default:          
            element.className = ""
        break
    }
}

function getPreferredColorScheme() {
    if(currentMode){
        return currentMode
    }
    if (window.matchMedia) {
        if(window.matchMedia('(prefers-color-scheme: dark)').matches){
            currentMode = 'dark'
        } else {
            currentMode = 'light'
        }
    }
    return currentMode
}