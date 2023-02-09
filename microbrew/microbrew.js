import { Customer_Deck } from "./scripts/customer.js";
import { Recipe_Deck } from "./scripts/recipe.js";
import Player from "./scripts/player.js";

const MALT_COLOUR_MAP = {
    "yellow" : 1,
    "orange" : 2,
    "brown" : 3 
}

const GAME_START =  document.getElementById('game-start')
const PLAY_BUTTON = document.getElementById('play-game')
const PLAY_AREA = document.getElementById('play-area')

const PLAYER_ONE = new Player();
const PLAYER_TWO = new Player();

PLAY_BUTTON.addEventListener('click', startGame)

function startGame() {
    console.log(`Game starting`)
    
    GAME_START.style.display = 'none'
    PLAY_AREA.style.display = 'inline-block'

    let testDeck = new Customer_Deck();
    console.log(JSON.stringify(testDeck))

    testDeck.shuffle();
    console.log(JSON.stringify(testDeck))

    let deal = new Customer_Deck(testDeck.deal())
    console.log(JSON.stringify(testDeck))
    console.log(JSON.stringify(deal))

    let recipes = new Recipe_Deck();
    console.log(JSON.stringify(recipes))

    recipes.shuffle()
    let chosen = new Recipe_Deck(recipes.deal())
    console.log(JSON.stringify(chosen))

    console.log(JSON.stringify(this.PLAYER_ONE))
    console.log(JSON.stringify(this.PLAYER_TWO));
}