import Modal from "../scripts/modal.js"

let imageElement = document.getElementById('image-container')
imageElement.addEventListener('click', expandImage)

function expandImage(){
    let image = event.target.id === 'image' ? event.target : event.target.previousElementSibling
    let imageClone = image.cloneNode(true)
    imageClone.id = 'imageCopy'
    let modal = new Modal({content: imageClone});
}