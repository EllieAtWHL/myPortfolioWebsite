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
    hover.classList.toggle('open')

    let links = button.querySelector('.links')
    links.classList.toggle('closed')
    links.classList.toggle('open')

    let nextSibling = button.nextElementSibling
    let prevSibling = button.previousElementSibling

    while(nextSibling) {
        let hover = nextSibling.querySelector('.card-desc')
        hover.classList.remove('closed')
        hover.classList.add('open')

        let links = nextSibling.querySelector('.links')
        links.classList.add('closed')
        links.classList.remove('open')

        nextSibling = nextSibling.nextElementSibling;
    }
    while(prevSibling) {
        let hover = prevSibling.querySelector('.card-desc')
        hover.classList.remove('closed')
        hover.classList.add('open')

        let links = prevSibling.querySelector('.links')
        links.classList.add('closed')
        links.classList.remove('open')

        prevSibling = prevSibling.previousElementSibling;
    }
}