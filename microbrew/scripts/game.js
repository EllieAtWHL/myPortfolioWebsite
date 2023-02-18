import Modal from "../../scripts/modal.js";

const TOKENS_MAP =
    [
        { 'type': 'yellow', 'count': 16, 'image': 'img/hexagon_yellow.svg' },
        { 'type': 'orange', 'count': 16, 'image': 'img/hexagon_orange.svg' },
        { 'type': 'brown', 'count': 16, 'image': 'img/hexagon_brown.svg' },
        { 'type': 'hops', 'count': 6, 'image': 'img/hexagon_green.svg' }
    ]

const PLAYERS = 2;
const TOKENS_PER_COLUMN = 4;

let currentGame;

export class Game {
    constructor(name1, name2) {
        currentGame = this;
        this.pot = new Token_Pot();
        this.pot.shuffle();

        this.playerOne = new Player(name1, 1);
        this.playerTwo = new Player(name2, 2);

        this.turn = this.playerOne;
        this.status = 'Start';

        this.playerOne.copper = this.fillPlayerCopper();
        this.playerTwo.copper = this.fillPlayerCopper();

        this.addHops();
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
            row.push(this.pot.dealToken());
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
        this.pot = new Token_Pot(this.pot.pot.concat(hopsTokens));
        this.pot.shuffle();

    }

    displayCopper(player) {
        displayCopper(player);
    }

    handleClick(event) {
        handleClick(event, this);
    }
}

export class Player {
    constructor(name, number) {
        this.name = name;
        this.number = number;
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

class Token_Pot {
    constructor(pot = startingPot()) {
        this.pot = pot;
    }

    get numberOfTokens() {
        return this.pot.length;
    }

    shuffle() {
        for (let i = this.numberOfTokens - 1; i > 0; i--) {
            const newIndex = Math.floor(Math.random() * (i + 1))
            const oldValue = this.pot[newIndex]
            this.pot[newIndex] = this.pot[i]
            this.pot[i] = oldValue
        }
    }

    dealToken() {
        return this.pot.shift();
    }
}

class Token {
    constructor(type, id) {
        this.type = type;
        this.id = id;
    }
}

function startingPot() {
    let pot = [];
    TOKENS_MAP.forEach(type => {
        if (type.type === 'hops') return;
        for (let i = 0; i < type.count; i++) {
            pot.push(new Token(type.type, `${type.type + i}`));
        }
    })
    return pot;
}

function displayCopper(player) {

    let playerIndicator = document.getElementById('player-name');

    playerIndicator.innerHTML = null;
    playerIndicator.innerText = player.name;

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
            displayCopper(currentGame.turn);
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
                displayCopper(currentGame.turn);
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