import Modal from "./modal.js"

let imageElements = document.getElementsByClassName('image-container');

for (let i = 0; i < imageElements.length; i++) {
    imageElements[i].addEventListener('click', expandImage);
}

function expandImage(){
    let image = event.target.id === 'image' ? event.target : event.target.previousElementSibling
    let expandedImage = image.cloneNode(true);
    expandedImage.id = 'expandedImage';
    new Modal({content: expandedImage});
}