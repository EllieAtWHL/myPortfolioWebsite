const REPUTATION_MAP = 
    [
        {'category': ['sweet']},
        {'category': ['hops']},
        {'category': ['spicy']},
        {'category': ['Jamaica', 'USA']},
        {'category': ['India', 'Russia', 'Japan']},
        {'category': ['England', 'Ireland', 'Scotland']},
        {'category': ['Germany', 'Belgium', 'Czechia']}
    ]

class Reputation {
    constructor(category){
        this.category = category;
    }
}

export class Reputation_Deck {
    constructor(deck = freshDeck()){
        this.deck = deck
    }

    get numberOfReputations(){
        return this.deck.length
    }

    deal() {
        return this.deck.shift()
    }

    shuffle(){
        for(let i = this.numberOfReputations -1; i > 0; i--){
            const newIndex = Math.floor(Math.random() * (i + 1))
            const oldValue = this.deck[newIndex]
            this.deck[newIndex] = this.deck[i]
            this.deck[i] = oldValue
        }
    }
}

function freshDeck() {
    let deck = [];
    REPUTATION_MAP.forEach( reputation => {
        deck.push(new Reputation(reputation.category))
    })
    return deck;
}