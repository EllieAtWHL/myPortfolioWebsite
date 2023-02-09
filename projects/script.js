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