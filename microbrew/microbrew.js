import { Customer_Deck } from "./scripts/customer.js";
import { Recipe_Deck } from "./scripts/recipe.js";
import { Reputation_Deck } from "./scripts/reputation.js";
import { Game } from "./scripts/game.js";

const MALT_COLOUR_MAP = {
    "yellow" : 1,
    "orange" : 2,
    "brown" : 3 
}

const GAME_START =  document.getElementById('game-start')
const PLAY_BUTTON = document.getElementById('play-game')
const PLAY_AREA = document.getElementById('play-area')
const CUSTOMERS = document.getElementById('customers')
const RECIPES = document.getElementById('recipes')

PLAY_BUTTON.addEventListener('click', startGame)

function startGame() {
    console.log(`Game starting`)
    
    let game = new Game('Ellie', 'Dave');

    console.log(game)

    game.displayCopper(game.playerOne);

    GAME_START.style.display = 'none'
    PLAY_AREA.style.display = 'inline-block'

    //TODO: Select token to swap to hops

    //TODO: Confirm swap

    //TODO Switch to player two

    //TODO: Select tokens to swap to hops

    //TODO: Confirm swap

    // let customers = new Customer_Deck();
    // customers.shuffle();
    // const customersText = document.createElement('p')
    // customersText.innerText = JSON.stringify(customers)
    // CUSTOMERS.append(customersText)
    // let deal = new Customer_Deck(customers.deal())
    

    // let recipes = new Recipe_Deck();
    // recipes.shuffle()
    // const recipesText = document.createElement('p')
    // recipesText.innerText = JSON.stringify(recipes)
    // RECIPES.append(recipesText)
    // let chosen = new Recipe_Deck(recipes.deal())

    // let reputations = new Reputation_Deck();
    // console.log(reputations)

    /*console.log(JSON.stringify(this.PLAYER_ONE))
    console.log(JSON.stringify(this.PLAYER_TWO));*/
}