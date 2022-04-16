const SUITS = ["♠","♥","♣","♦"]
const VALUES = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",

]

export default class Deck {
    constructor(cards = freshDeck()){
        this.cards = cards
    }

    get numberOfCards(){
        return this.cards.length
    }
    
    //takes the first card
    pop() {
        return this.cards.shift()
    }

    //adds to end
    push(card) {
        this.cards.push(card)
    }

    remove(card){
        // find card the matches and remove from array
        let cardIndexToRemove
        for(let i=0;i<this.numberOfCards;i++){
            if (this.matchingCard(card, this.cards[i])) cardIndexToRemove = i
        }
        return this.cards.splice(cardIndexToRemove,1)
    }

    //random shuffle of cards
    shuffle(){
        for(let i = this.numberOfCards - 1; i > 0; i--){
            const newIndex = Math.floor(Math.random() * (i + 1))
            const oldValue = this.cards[newIndex]
            this.cards[newIndex] = this.cards[i]
            this.cards[i] = oldValue
        }
    }

    //sorts cards by suit and then value
    sort(){
        let suitOrdering = this.customOrdering(SUITS)
        let valueOrdering = this.customOrdering(VALUES)
        this.cards.sort(function(a,b){
            return (suitOrdering[a.suit] - suitOrdering[b.suit]) || valueOrdering[a.value] - valueOrdering[b.value]
        })
    }

    matchingCard(cardA, cardB){
        return cardA.value === cardB.value && cardA.suit === cardB.suit
    }

    customOrdering(orderSet){
        let ordering = {}, order = orderSet
        for (let i=0;i<order.length;i++){
            ordering[order[i]] = i
        }
        return ordering
    }
}

class Card {
    constructor(suit, value){
        this.suit = suit
        this.value = value
    }

    get color(){
        return this.suit === "♠" || this.suit === "♣" ? 'black' : 'red'
    }

    getHTML(){
        const cardDiv = document.createElement('div')
        cardDiv.innerText = this.suit
        cardDiv.classList.add("card", this.color)
        cardDiv.dataset.value = `${this.value}${this.suit}`
        return cardDiv
    }
}

function freshDeck() {
    return SUITS.flatMap(suit => {
        return VALUES.map(value => {
            return new Card(suit, value)
        })
    })
}