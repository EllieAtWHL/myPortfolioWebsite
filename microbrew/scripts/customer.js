const CUSTOMER_LIST =
    [
        {
            'name': 'Jamaican Tropical Stout',
            'country': 'Jamaica',
            'color': 'dark',
            'drink': ['yellow', 'brown', 'brown', 'brown'],
            'special': 'sweet',
            'bonus': 3
        },
        {
            'name': 'India Pale Ale',
            'country': 'India',
            'color': 'light',
            'drink': ['yellow', 'yellow', 'yellow', 'orange'],
            'special': 'hops',
            'bonus': 2
        },
        {
            'name': 'Munich Dark Lager',
            'country': 'Germany',
            'color': 'neutral',
            'drink': ['orange', 'orange', 'orange', 'orange'],
            'special': 'spicy',
            'bonus': 2
        }
    ]

class Customer {
    constructor(name, country, color, drink, special, bonus){
        this.name = name
        this.country = country
        this.color = color
        this.drink = drink
        this.special = special
        this.bonus = bonus
    }
}

export class Customer_Deck {
    constructor(deck = freshDeck()){
        this.deck = deck
    }

    get numberOfCustomers(){
        return this.deck.length
    }

    deal() {
        return this.deck.shift()
    }

    shuffle(){
        for(let i = this.numberOfCustomers -1; i > 0; i--){
            const newIndex = Math.floor(Math.random() * (i + 1))
            const oldValue = this.deck[newIndex]
            this.deck[newIndex] = this.deck[i]
            this.deck[i] = oldValue
        }
    }
}

function freshDeck() {
    let deck = []; 
    CUSTOMER_LIST.forEach( customer => {
        deck.push(new Customer(customer.name, customer.country, customer.color, customer.drink, customer.special, customer.bonus))
    })
    return deck
}