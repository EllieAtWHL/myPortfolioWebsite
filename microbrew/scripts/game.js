import Modal from "../../scripts/modal.js";
import { TOKENS_MAP, Token_Pot, Token } from "./token.js";
import { Customer_Deck } from "./customer.js";
import { Recipe_Deck } from "./recipe.js";
import { Reputation_Deck } from "./reputation.js";


const PLAYERS = 2;
const TOKENS_PER_COLUMN = 4;

let currentGame;

export class Game {
    constructor(name1, name2) {
        currentGame = this;

        this.tokenPot = this.newGameTokenPot();
        this.newGamePlayers(name1, name2);
        this.newGameCustomers();
        this.newGameRecipes();
        this.newGameReputation();

        this.updateDisplay();

        this.addHops();
    }

    newGameTokenPot(){
        let pot = new Token_Pot();
        pot.shuffle();
        return pot;
    }

    newGamePlayers(name1, name2){
        this.playerOne = new Player(name1, 1);
        this.playerTwo = new Player(name2, 2);

        this.turn = this.playerOne;
        this.status = 'Start';

        this.playerOne.copper = this.fillPlayerCopper();
        this.playerTwo.copper = this.fillPlayerCopper();
    }

    newGameCustomers(){
        this.customerDeck = new Customer_Deck();
        this.customerDeck.shuffle();

        this.playerOne.loyalCustomerDeck = new Customer_Deck([this.customerDeck.deal()])
        this.playerTwo.loyalCustomerDeck = new Customer_Deck([this.customerDeck.deal()])

        this.thirstyCustomers = new Customer_Deck([this.customerDeck.deal()]);
        this.thirstyCustomers = new Customer_Deck(this.thirstyCustomers.deck.concat(this.customerDeck.deal()));
    }

    newGameRecipes(){
        this.recipeDeck = new Recipe_Deck();
        this.recipeDeck.shuffle();

        this.playerOne.recipeHand = new Recipe_Deck([this.recipeDeck.deal()]);
        this.playerTwo.recipeHand = new Recipe_Deck([this.recipeDeck.deal()]);

        this.recipeBoard = new Recipe_Deck([this.recipeDeck.deal()]);
        this.recipeBoard = new Recipe_Deck(this.recipeBoard.deck.concat(this.recipeDeck.deal()));
        this.recipeBoard = new Recipe_Deck(this.recipeBoard.deck.concat(this.recipeDeck.deal()));
    }

    newGameReputation(){
        this.reputationDeck = new Reputation_Deck();
        this.reputationDeck.shuffle();

        this.publicReputation = new Reputation_Deck([this.reputationDeck.deal()]);

        this.playerOne.reputation = new Reputation_Deck([this.reputationDeck.deal()]);
        this.playerOne.reputation = new Reputation_Deck(this.playerOne.reputation.deck.concat(this.reputationDeck.deal()));
        this.playerTwo.reputation = new Reputation_Deck([this.reputationDeck.deal()]);
        this.playerTwo.reputation = new Reputation_Deck(this.playerTwo.reputation.deck.concat(this.reputationDeck.deal()));
    }

    fillPlayerCopper() {
        let playerCopper = new Copper();
        let content = []
        for (let i = 0; i < playerCopper.cols; i++) {
            content.push(this.fillCol());
        }
        playerCopper.content = content;
        return playerCopper;
    }

    fillCol() {
        let row = []
        for (let i = 0; i < TOKENS_PER_COLUMN; i++) {
            row.push(this.tokenPot.dealToken());
        }
        return row;
    }

    addHops() {
        let numHopsToAdd = (TOKENS_MAP.find(token => token.type === 'hops').count) - PLAYERS;
        let hopsTokens = [];
        for (let i = 0; i < numHopsToAdd; i++) {
            let hopsToken = new Token('hops', `hops${i}`);
            hopsTokens.push(hopsToken);
        }
        this.tokenPot = new Token_Pot(this.tokenPot.pot.concat(hopsTokens));
        this.tokenPot.shuffle();

    }

    updateDisplay(){
        console.log('Display public info');//TODO: display public information
        this.displayCustomers(currentGame.turn);
        this.displayRecipes(currentGame.turn);
        this.displayReputation(currentGame.turn);
        this.displayCopper(currentGame.turn);
    }

    displayCustomers(player){
        console.log('Display customers'); //TODO:
        console.log(player.loyalCustomerDeck);
    }
    displayRecipes(player){
        console.log('Display recipes'); //TODO:
        console.log(player.recipeHand);
    }
    displayReputation(player){
        console.log('Display reputation'); //TODO:
        console.log(player.reputation);
    }

    displayCopper(player) {
        let playerIndicator = document.getElementById('player-name');

        playerIndicator.innerHTML = null;
        playerIndicator.innerText = `${player.name} - £${player.cash}`;

        player.copper.content.forEach((column, colIndex) => {
            column.forEach((row, rowIndex) => {
                let tokenDiv = document.querySelector(`[data-row="${(rowIndex + 1).toString()}"][data-col="${(colIndex + 1).toString()}"]`)
                tokenDiv.innerHTML = null;
                const tokenImage = fillTokenSlot(row.type, row.id, player);
                tokenImage.addEventListener('click', handleClick);
                tokenDiv.appendChild(tokenImage);
            })
        })
    }

    handleClick(event) {
        handleClick(event, this);
    }
}

export class Player {
    constructor(name, number) {
        this.name = name;
        this.number = number;
        this.cash = 0;
    }
}

export class Copper {
    constructor(tokens) {
        this.extra_column = false;
        this.cols = 4;
    }

    addColumn() {
        this.extra_column = true;
        this.cols = 5;
    }

    discardToken(column, row, tokenToReplace){
        this.content[column][row] = tokenToReplace;
    }
}

function fillTokenSlot(type, id, player) {
    const tokenImage = document.createElement('img')
    tokenImage.src = getTokenImageUrl(type);
    tokenImage.classList.add('token');
    tokenImage.setAttribute('data-tokenid', id);
    tokenImage.setAttribute('data-player', player.number);
    return tokenImage;
}

function getTokenImageUrl(type) {
    const token = TOKENS_MAP.find(token => token.type === type);
    return token.image;
}

function insertHop(clickedToken) {
    let clickedTokenDiv = clickedToken.parentElement;
    let clickedTokenPlayer = JSON.parse(clickedToken.dataset.player);
    let token_row = clickedTokenDiv.dataset.row;
    let token_col = clickedTokenDiv.dataset.col;
    let hopsId = `hops${3 + clickedTokenPlayer}`
    let hopsToken = new Token('hops', hopsId);
    currentGame.turn.copper.discardToken(token_col-1, token_row-1, hopsToken);
}

function handleClick(event){
    let clickedToken = event.target;
    switch(currentGame.status){
        case 'Start': 
            insertHop(clickedToken);
            currentGame.displayCopper(currentGame.turn);
            let confirmed = confirmHopSwitch();
            if(confirmed){
                switch(clickedToken.dataset.player) {
                    case "1":
                        currentGame.turn = currentGame.playerTwo;
                        break;
                    case "2":
                        currentGame.turn = currentGame.playerOne;
                        currentGame.status = 'Play';
                        break;
                    default:
                        console.log('There\'s something happening here');
                }
                currentGame.displayCopper(currentGame.turn);
            } else {
                console.log('TODO: Undo') // TODO:
            }
            break;
        default:
            console.log('Nothing else functional')
    }
}

function confirmHopSwitch(){
    let modalContent = document.createElement('div');
        modalContent.innerText = 'Confirm switch?';
        return new Modal({height: '40px', width: '300px', content: modalContent, buttons: ['OK', 'Cancel']});

        //TODO: Don;t like as a modal so fix!
}