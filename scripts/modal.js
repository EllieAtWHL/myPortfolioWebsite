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
        
        
        this.#removeBinded = this.remove.bind(this)

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
        console.log(`Setting width: ${value}`)
    }

    get width(){
        return this.#modalContent.style.width
    }

    set height(value){
        this.#modalContent.style.setProperty('height', value)
        console.log(`Setting height: ${value}`)
    }

    get height(){
        return this.#modalContent.style.height
    }

    set content(value){
        value.style.width = this.width
        value.style.height = this.height
        value.style.padding = '12px'
        this.#modalContent.append(value)
    }
    
    updateModal(options){
        Object.entries(options).forEach(([key, value]) => {
            this[key] = value
        })
    }

    remove(){
        this.#modalElement.remove()
    }

}