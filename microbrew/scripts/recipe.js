const RECIPE_LIST = 
[
    {
        'recipe': ['yellow', 'orange', 'orange', 'brown'],
        'perfect': 3,
        'smooth': 3,
        'rough': 3,
        'muddled': 3,
        'special': ['sweet', 'spicy'],
        'color': 'medium'
    },{
        'recipe': ['yellow', 'orange', 'orange', 'orange'],
        'perfect': 3,
        'smooth': 3,
        'rough': 2,
        'muddled': 1,
        'special': ['hops', 'spicy'],
        'color': 'medium'
    },{
        'recipe': ['yellow', 'brown', 'brown', 'brown'],
        'perfect': 4,
        'smooth': 4,
        'rough': 3,
        'muddled': 1,
        'special': ['sweet', 'hops'],
        'color': 'dark'
    },{
        'recipe': ['yellow', 'yellow', 'brown', 'brown'],
        'perfect': 4,
        'smooth': 4,
        'rough': 3,
        'muddled': 1,
        'special': ['spicy'],
        'color': 'medium'
    },{
        'recipe': ['yellow', 'yellow', 'yellow', 'orange'],
        'perfect': 3,
        'smooth': 3,
        'rough': 2,
        'muddled': 1,
        'special': ['sweet', 'hops'],
        'color': 'light'
    },{
        'recipe': ['yellow', 'yellow', 'yellow', 'brown'],
        'perfect': 4,
        'smooth': 4,
        'rough': 3,
        'muddled': 1,
        'special': ['sweet', 'hops'],
        'color': 'light'
    },{
        'recipe': ['yellow', 'yellow', 'orange', 'orange'],
        'perfect': 4,
        'smooth': 3,
        'rough': 2,
        'muddled': 2,
        'special': [],
        'color': 'light'
    },{
        'recipe': ['orange', 'orange', 'brown', 'brown'],
        'perfect': 4,
        'smooth': 3,
        'rough': 2,
        'muddled': 2,
        'special': [],
        'color': 'dark'
    },{
        'recipe': ['orange', 'orange', 'orange', 'brown'],
        'perfect': 3,
        'smooth': 3,
        'rough': 2,
        'muddled': 1,
        'special': ['hops', 'spicy'],
        'color': 'medium'
    },{
        'recipe': ['orange', 'orange', 'orange', 'orange'],
        'perfect': 5,
        'smooth': 5,
        'rough': 4,
        'muddled': 2,
        'special': [],
        'color': 'medium'
    },{
        'recipe': ['orange', 'orange', 'orange', 'orange'],
        'perfect': 5,
        'smooth': 5,
        'rough': 4,
        'muddled': 2,
        'special': [],
        'color': 'medium'
    },{
        'recipe': ['orange', 'brown', 'brown', 'brown'],
        'perfect': 4,
        'smooth': 3,
        'rough': 2,
        'muddled': 2,
        'special': [],
        'color': 'dark'
    },{
        'recipe': ['brown', 'brown', 'brown', 'brown'],
        'perfect': 6,
        'smooth': 5,
        'rough': 4,
        'muddled': 2,
        'special': ['hops'],
        'color': 'dark'
    },{
        'recipe': ['brown', 'brown', 'brown', 'brown'],
        'perfect': 6,
        'smooth': 5,
        'rough': 4,
        'muddled': 2,
        'special': ['hops'],
        'color': 'dark'
    },{
        'recipe': ['yellow', 'yellow', 'yellow', 'yellow'],
        'perfect': 6,
        'smooth': 5,
        'rough': 4,
        'muddled': 2,
        'special': ['spicy'],
        'color': 'light'
    },{
        'recipe': ['yellow', 'yellow', 'yellow', 'yellow'],
        'perfect': 6,
        'smooth': 5,
        'rough': 4,
        'muddled': 2,
        'special': ['spicy'],
        'color': 'light'
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