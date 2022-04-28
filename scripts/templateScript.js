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
    header =  document.createElement('div')
    header.className = 'header'
    inner = createInner()
    header.appendChild(inner)

    const logoLink = createLink({onclick: function() {window.location='../?mode='+currentMode}, href: "#"})

    const logo = document.createElement('img')
    logo.src = "../img/logo.png"
    logo.alt = "EllieAtWHL"

    const topnav = document.createElement('div')
    topnav.className = 'topnav'
    topnav.id = 'myTopNav'

    const menuLinkSpan = document.createElement('span')
    const menuLink = createLink({onclick: function(){const nav = document.getElementById("myTopNav")
    if (nav.className === "topnav") {
      nav.className += " responsive"
    } else {
      nav.className = "topnav"
    }}, href: 'javascript:void(0)', class: 'icon'})
    const menuLinkBars = document.createElement('i')
    menuLinkBars.className = 'fa fa-bars'
    menuLink.appendChild(menuLinkBars)
    menuLinkSpan.appendChild(menuLink)

    const homeLinkSpan = document.createElement('span')
    const homeLink = createLink({onclick: function() {window.location='../?mode='+currentMode}, href: '#', text: 'Home'})
    // TODO: const homeLink = createLink({onclick: function() {window.location='../?mode='+currentMode}, href: '#', text: 'Home', active: true})
    homeLinkSpan.appendChild(homeLink)

    const aboutMeLinkSpan = document.createElement('span')
    const aboutMeLink = createLink({onclick: function() {window.location='/about-me/?mode='+currentMode}, href: '#', text: 'About Me'})
    aboutMeLinkSpan.appendChild(aboutMeLink)

    const experienceLinkSpan = document.createElement('span')
    const experienceLink = createLink({onclick: function() {window.location='/experience/?mode='+currentMode}, href: '#', text: 'Experience'})
    experienceLinkSpan.appendChild(experienceLink)

    const projectsLinkSpan = document.createElement('span')
    const projectsLink = createLink({onclick: function() {window.location='/projects/?mode='+currentMode}, href: '#', text: 'Projects'})
    projectsLinkSpan.appendChild(projectsLink)

    topnav.appendChild(menuLinkSpan)
    topnav.appendChild(homeLinkSpan)
    topnav.appendChild(aboutMeLinkSpan)
    topnav.appendChild(experienceLinkSpan)
    topnav.appendChild(projectsLinkSpan)

    logoLink.appendChild(logo)
    inner.appendChild(logoLink)
    inner.appendChild(topnav)

    return header
}

function createFooter(){
    const footer = document.createElement('div')
    footer.className = 'footer'
    const inner = createInner()
    footer.appendChild(inner)
    
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
        setColorScheme(currentMode)}
    darkModeSpan = document.createElement('span')
    darkModeSpan.className = 'slider round'
    darkModeP = document.createElement('p')
    darkModeText = document.createTextNode('Dark Mode')

    darkModeP.appendChild(darkModeText)
    darkModeLabel.appendChild(darkModeInput)
    darkModeLabel.appendChild(darkModeSpan)
    darkMode.appendChild(darkModeLabel)
    darkMode.appendChild(darkModeP)


    inner.appendChild(findMe)
    inner.appendChild(darkMode)

    return footer
}

function createInner(){
    const inner = document.createElement('div')
    inner.className = 'inner'
    return inner
}

function createLink(linkDetails){
    const link = document.createElement('a')
    if (linkDetails.onclick) link.onclick = linkDetails.onclick
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
    setColorScheme(currentMode)
}