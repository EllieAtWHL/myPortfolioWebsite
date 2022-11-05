import Modal from "../scripts/modal.js"

let imageElement = document.getElementById('image')
console.log(imageElement)
imageElement.addEventListener('click', expandImage)

function expandImage(){
    console.log(event)
    let image = event.target
    let imageClone = image.cloneNode(true);
    imageClone.id = 'imageCopy'
    let modal = new Modal({height: '85vh', content: imageClone});
}