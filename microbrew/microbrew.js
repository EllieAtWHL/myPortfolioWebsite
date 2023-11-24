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

    let playerOneName = document.getElementById('playerOne').value || 'Player One';
    let playerTwoName = document.getElementById('playerTwo').value || 'Player Two';
    let game = new Game(playerOneName, playerTwoName);

    console.log(game)

    GAME_START.style.display = 'none'
    PLAY_AREA.style.display = 'inline-block'
    
}