const DEFAULT_OPTIONS = {
    width: "max-content",
    height: "max-content"
}

export default class Modal {

    #modalElement
    #modalContent
    #closeElement
    #removeBinded

    constructor(options){

        this.#modalElement = document.createElement('div');
        this.#modalElement.classList.add("modal")
        
        this.#modalContent = document.createElement('div')
        this.#modalContent.classList.add("modal-content")
        this.#modalElement.append(this.#modalContent)
        
        
        this.#removeBinded = this.removeModal.bind(this)

        this.#closeElement = document.createElement('span')
        this.#closeElement.classList.add('close')
        this.#closeElement.innerHTML = `&times;`
        this.#closeElement.addEventListener("click", this.#removeBinded)
        this.#modalContent.append(this.#closeElement)
        
        this.updateModal({...DEFAULT_OPTIONS, ...options})
        
        let contentElement = document.getElementById('scrollable');
        contentElement.append(this.#modalElement)
    }

    set width(value){
        this.#modalContent.style.setProperty('width', value)
    }

    get width(){
        return this.#modalContent.style.width
    }

    set height(value){
        this.#modalContent.style.setProperty('height', value)
    }

    get height(){
        return this.#modalContent.style.height
    }

    set content(value){
        this.#modalContent.append(value)
    }

    set buttons(value){
        value.forEach(button => {
            let buttonElement = document.createElement('button');
            buttonElement.innerText = button;
            buttonElement.id = button;
            buttonElement.addEventListener('click', this.#removeBinded);
            this.#modalContent.append(buttonElement);
        })
    }

    get okResponse(){
        return true;
    }
    
    updateModal(options){
        Object.entries(options).forEach(([key, value]) => {
            this[key] = value
        })
    }

    removeModal(){
        let response = event.target.id;
        this.#modalElement.remove()
        if (response != 'OK') return;
        return this.okResponse;
    }

}