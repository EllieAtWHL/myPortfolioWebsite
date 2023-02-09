const RECIPE_LIST = 
[
    {
        'recipe': ['yellow', 'orange', 'orange', 'brown'],
        'perfect': 3,
        'smooth': 3,
        'rough': 3,
        'muddled': 3,
        'special': ['sweet', 'spicy'],
        'color': 'light'
    },
    {
        'recipe': ['yellow', 'brown', 'brown', 'brown'],
        'perfect': 4,
        'smooth': 4,
        'rough': 3,
        'muddled': 1,
        'special': ['sweet', 'hops'],
        'color': 'dark'
    }
]

class Recipe {
    constructor(recipe, perfect, smooth, rough, muddled, special, color){
        this.recipe = recipe
        this.perfect = perfect
        this.smooth = smooth
        this.rough = rough
        this.muddled = muddled
        this.special = special
        this.color = color
    }
}

export class Recipe_Deck {
    constructor(deck = freshDeck()){
        this.deck = deck
    }

    get numberOfRecipes(){
        return this.deck.length
    }
    
    deal() {
        return this.deck.shift()
    }

    shuffle(){
        for(let i = this.numberOfRecipes -1; i > 0; i--){
            const newIndex = Math.floor(Math.random() * (i + 1))
            const oldValue = this.deck[newIndex]
            this.deck[newIndex] = this.deck[i]
            this.deck[i] = oldValue
        }
    }
}

function freshDeck() {
    let deck = [];
    RECIPE_LIST.forEach(recipe => {
        deck.push(new Recipe(recipe.recipe, recipe.perfect, recipe.smooth, recipe.rough, recipe.muddled, recipe.special, recipe.color))
    })
    return deck
}