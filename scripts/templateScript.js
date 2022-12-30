//TODO: This needs cleaning up but is functioning for now
let currentMode

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

document.addEventListener("DOMContentLoaded", function(){createTemplate()})

function createTemplate(){

    getPreference()

    const body = document.getElementById('body')
    const wrapper = document.createElement('div')
    wrapper.className = 'wrapper'
    wrapper.id = 'wrapper'
    body.appendChild(wrapper)

    const header = createHeader()
    const footer = createFooter()

    const content = document.getElementById('content')

    wrapper.appendChild(header)
    wrapper.appendChild(content)
    wrapper.appendChild(footer)
}

function createHeader(){
    header =  document.createElement('nav')
    header.className = 'navbar'

    const brandTitle = document.createElement('div')
    brandTitle.classList.add('brand-title')
    const logoLink = createLink({href: "#"})
    const logo = document.createElement('img')
    logo.src = "../img/logo.png"
    logo.alt = "EllieAtWHL"

    const toggleButton = createLink({href:'#', class: 'toggle-button'})
    for(let i=0;i<3;i++){
        let bar = document.createElement('span')
        bar.classList.add('bar')
        toggleButton.appendChild(bar)
    }
    
    const topnav = document.createElement('div')
    topnav.className = 'navbar-links'
    let linksElement = document.createElement('ul')

    const homeLinkLI = document.createElement('li')
    const homeLink = createLink({href: '#', text: 'Home'})
    homeLinkLI.appendChild(homeLink)
    linksElement.appendChild(homeLinkLI)

    const aboutMeLinkLI = document.createElement('li')
    const aboutMeLink = createLink({href: '#', text: 'About Me'})
    aboutMeLinkLI.appendChild(aboutMeLink)
    linksElement.appendChild(aboutMeLinkLI)

    const experienceLinkLI = document.createElement('li')
    const experienceLink = createLink({href: '#', text: 'Experience'})
    experienceLinkLI.appendChild(experienceLink)
    linksElement.appendChild(experienceLinkLI)

    const projectsLinkLI = document.createElement('li')
    const projectsLink = createLink({href: '#', text: 'Projects'})
    projectsLinkLI.appendChild(projectsLink)
    linksElement.appendChild(projectsLinkLI)

    topnav.appendChild(linksElement)

    logoLink.appendChild(logo)
    brandTitle.appendChild(logoLink)
    
    header.appendChild(brandTitle)
    header.appendChild(toggleButton)
    header.appendChild(topnav)

    
    logoLink.addEventListener('click', () => {window.location='../?mode='+currentMode})
    toggleButton.addEventListener('click', () => {topnav.classList.toggle('active')})
    homeLink.addEventListener('click', () => {window.location='../?mode='+currentMode})
    aboutMeLink.addEventListener('click', () => {window.location='/about-me/?mode='+currentMode})
    experienceLink.addEventListener('click', () => {window.location='/experience/?mode='+currentMode})
    projectsLink.addEventListener('click', () => {window.location='/projects/?mode='+currentMode})
    
    return header
}

function createFooter(){
    const footer = document.createElement('div')
    footer.className = 'footer'
    
    const findMe = document.createElement('div')
    findMe.className = 'findMe floatLeft'

    heading = document.createElement('p')
    headingText = document.createTextNode('You can also find me at...')
    heading.appendChild(headingText)

    linkList = document.createElement('ul')

    twitterLinkItem = document.createElement('li')
    twitterLink = createLink({href: 'https://twitter.com/EllieAtWHL', target: '_blank', text: 'Twitter'})
    twitterLinkItem.appendChild(twitterLink)

    linkedInLinkItem = document.createElement('li')    
    linkedInLink = createLink({href: 'https://www.linkedin.com/in/elliematthewman/', target: '_blank', text: 'LinkedIn'})    
    linkedInLinkItem.appendChild(linkedInLink)

    githubLinkItem = document.createElement('li')    
    githubLink = createLink({href: 'https://github.com/EllieAtWHL', target: '_blank', text: 'Github'})    
    githubLinkItem.appendChild(githubLink)

    salesforceLinkItem = document.createElement('li')    
    salesforceLink = createLink({href: 'https://trailblazer.me/id/elliematthewman', target: '_blank', text: 'Salesforce'})
    salesforceLinkItem.appendChild(salesforceLink)

    linkList.appendChild(twitterLinkItem)
    linkList.appendChild(linkedInLinkItem)
    linkList.appendChild(githubLinkItem)
    linkList.appendChild(salesforceLinkItem)

    findMe.appendChild(heading)
    findMe.appendChild(linkList)

    darkMode = document.createElement('div')
    darkMode.className = 'darkMode floatRight'

    darkModeLabel = document.createElement('label')
    darkModeLabel.className = 'switch'

    darkModeInput = document.createElement('input')
    darkModeInput.type = 'checkbox'
    darkModeInput.id = 'darkMode'
    if(currentMode === 'dark'){
        darkModeInput.checked = true
    }
    darkModeInput.onclick = function() {var checkbox = document.getElementById('darkMode')
        if(checkbox.checked === true){
            currentMode = 'dark'
        }else {
            currentMode = 'light'
        }
        setColorScheme(currentMode)
        updateURLParameter(currentMode)}
    darkModeSpan = document.createElement('span')
    darkModeSpan.className = 'slider round'
    darkModeP = document.createElement('p')
    darkModeText = document.createTextNode('Dark Mode')

    darkModeP.appendChild(darkModeText)
    darkModeLabel.appendChild(darkModeInput)
    darkModeLabel.appendChild(darkModeSpan)
    darkMode.appendChild(darkModeLabel)
    darkMode.appendChild(darkModeP)


    footer.appendChild(findMe)
    footer.appendChild(darkMode)

    return footer
}

function createLink(linkDetails){
    const link = document.createElement('a')
    if (linkDetails.href) link.href = linkDetails.href
    if (linkDetails.class) link.className = linkDetails.class
    if (linkDetails.active) link.classList.add('active')
    if (linkDetails.target) link.target = linkDetails.target
    if (linkDetails.text){
        const text = document.createTextNode(linkDetails.text)
        link.appendChild(text) 
    }
    return link
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

function updateURLParameter(scheme) {
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set("mode", scheme);
    const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
    history.pushState(null, '', newRelativePathQuery);
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

function handleDarkMode(){
    var checkbox = document.getElementById('darkMode')
    if(checkbox.checked === true){
        currentMode = 'dark'
    }else {
        currentMode = 'light'
    }
    setColorScheme(currentMode);
    updateURLParameter(currentMode);
}