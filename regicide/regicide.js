import Deck from "./deck.js"

const NUM_OF_PLAYERS = 1
const HAND_LIMIT = 8
const CARD_VALUE_MAP = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "J": 10,
    "Q": 15,
    "K": 20,
    "A": 1
} 
const SUIT_POWER_MAP = {
    "♠": "Shield against enemy attack",
    "♥": "Heal from the discard",
    "♣": "Double damage",
    "♦": "Draw cards"
}
const ROYAL_STATS_MAP = {
    "J": {attack: 10, health: 20},
    "Q": {attack: 15, health: 30},
    "K": {attack: 20, health: 40}
}

const gameStart =  document.getElementById('game-start')
const playButton = document.getElementById('play-game')
const playArea = document.getElementById('play-area')
const gameMessage = document.getElementById('game-message')
const messageElement = document.getElementById('message')
const royalDeckElement = document.querySelector('.royal-deck')
const drawDeckElement = document.querySelector('.draw-deck')
const royalCardSlot = document.querySelector('.royal-card-slot')
const discardCardSlot = document.querySelector('.discard-card-slot')
const attackElement = document.querySelector('.attack')
const healthElement = document.querySelector('.health')
const powerTextElement = document.querySelector('.power-text')
const attackButton = document.getElementById('attack-button')
const handSlots = [
    document.getElementById('hand-card-slot-first'),
    document.getElementById('hand-card-slot-second'),
    document.getElementById('hand-card-slot-third'),
    document.getElementById('hand-card-slot-fourth'),
    document.getElementById('hand-card-slot-fifth'),
    document.getElementById('hand-card-slot-sixth'),
    document.getElementById('hand-card-slot-seventh'),
    document.getElementById('hand-card-slot-eigth')
]
const activeSlots = [
    document.getElementById('active-card-slot-first'),
    document.getElementById('active-card-slot-second'),
    document.getElementById('active-card-slot-third'),
    document.getElementById('active-card-slot-fourth'),
    document.getElementById('active-card-slot-fifth'),
    document.getElementById('active-card-slot-sixth'),
    document.getElementById('active-card-slot-seventh'),
    document.getElementById('active-card-slot-eigth')
]

let royalDeck, drawDeck, royalCard, chosenCards, activeDeck, discardDeck, playerHand, currentRoyalAttack, currentRoyalHealth, currentShield, onAttack
let messages = []

playButton.addEventListener('click', startGame)

handSlots.forEach(slot => {
    slot.addEventListener('click', cardSelected)
})

attackButton.addEventListener('click', handlePlayerAttack)

function startGame() {
    gameStart.style.display = 'none'
    playArea.style.display = 'grid'
    attackButton.disabled = true
    onAttack = true
    chosenCards = undefined
    activeDeck = undefined
    discardDeck = undefined
    clearActiveDeck()
    updateDiscardPile()
    createDecks()
    setRoyalCard()
    createPlayerHand()
    updateDeckCount()
}

function createDecks(){
    let deck = new Deck()
    let jackCards = []
    let queenCards = []
    let kingCards = []
    let playerCards = []
    deck.cards.forEach(card => {
        switch (card.value) {
            case 'J':
                jackCards.push(card)
                break
            case 'Q':
                queenCards.push(card)
                break
            case 'K':
                kingCards.push(card)
                break
            default:
                playerCards.push(card)
                break
        }
    })
    drawDeck = new Deck(playerCards)
    drawDeck.shuffle()
    royalDeck =  createRoyalDeck(jackCards, queenCards, kingCards)
}

function createRoyalDeck(jacks, queens, kings){
    let jacksDeck = new Deck(jacks)
    jacksDeck.shuffle()
    let queensDeck = new Deck(queens)
    queensDeck.shuffle()
    let kingsDeck = new Deck(kings)
    kingsDeck.shuffle()
    return new Deck(jacksDeck.cards.concat(queensDeck.cards, kingsDeck.cards))
}

function setRoyalCard(){
    royalCardSlot.innerHTML = ''
    royalCard = royalDeck.pop()
    if(!royalCard) wonGame()
    royalCardSlot.appendChild(royalCard.getHTML())
    powerTextElement.innerText = `Immunity against: ${SUIT_POWER_MAP[royalCard.suit]}`
    currentRoyalAttack = ROYAL_STATS_MAP[royalCard.value].attack
    currentRoyalHealth = ROYAL_STATS_MAP[royalCard.value].health
    updateStatsText()
}

function createPlayerHand(){
    playerHand = new Deck(drawDeck.cards.splice(0, HAND_LIMIT))
    playerHand.sort()
    updatePlayerHand()

}

function updatePlayerHand(){

    for(let i = 0; i < playerHand.numberOfCards; i++){
        handSlots[i].innerHTML = ''
        handSlots[i].appendChild(playerHand.cards[i].getHTML())
    }
}

function cardSelected(){
    let cardValue = event.target.dataset.value
    let selectedCard = {suit: cardValue.substring(cardValue.length-1), value: cardValue.substring(0,cardValue.length-1)}
    if(onAttack){
        if(invalidSelection(selectedCard)){
            alertBox('Illegal move')
        }
        else {
            attackButton.disabled = false
            moveSelectedCardToChosenCards(selectedCard)
            let slotToClear = event.path[1]
            renderSelectedCardMovement(slotToClear)
        }
    } else {
        //TODO: Select cards to be discarded
    }
}

function invalidSelection(selectedCard){
    if(activeDeckEmpty()) return false
    if(activeCompanion(selectedCard)) return false
    if(activeSet(selectedCard)) return false
    return true
}
function activeDeckEmpty(){
    return !chosenCards || chosenCards.numberOfCards < 1
}
function activeCompanion(selectedCard){
    return  chosenCards
        &&  chosenCards.numberOfCards === 1 
        &&  ((chosenCards.cards[0].value === 'A' && selectedCard.value !== 'A')
            || (selectedCard.value === 'A' && chosenCards.cards[0].value !== 'A')) 
        
}
function activeSet(selectedCard){
    if (CARD_VALUE_MAP[selectedCard.value] > 4 || selectedCard.value === 'A') return false
    if (validSet(selectedCard)) return true
    return false
}
function validSet(selectedCard){
    if(selectedMatchesActive(selectedCard)) {
        return sumOfCardsLessThanTen(selectedCard)
    }
    return false
}
function selectedMatchesActive(selectedCard){
    let match = true
    chosenCards.cards.forEach(card => {
        match = match && (card.value === selectedCard.value)
    })
    return match
}
function sumOfCardsLessThanTen(selectedCard){
    if(selectedCard.value === "4" & chosenCards.numberOfCards < 2) return true
    if(selectedCard.value === "3" & chosenCards.numberOfCards < 3) return true
    if(selectedCard.value === "2" & chosenCards.numberOfCards < 4) return true
    return false
}

function moveSelectedCardToChosenCards(selectedCard){
    let removedCard = playerHand.remove(selectedCard);
    if(!chosenCards) chosenCards = new Deck(removedCard);
    else chosenCards.push(removedCard[0])
}

function renderSelectedCardMovement(slot){
    let cardToCreate = slot.innerHTML
    slot.innerHTML = ''
    let slotToPopulate = chosenCards.numberOfCards - 1
    if(activeDeck) slotToPopulate += activeDeck.numberOfCards
    activeSlots[slotToPopulate].innerHTML = cardToCreate
}

function handlePlayerAttack(){
    let suitsActive= []
    chosenCards.cards.forEach( card => {
        if(card.suit !== royalCard.suit){
            suitsActive.push(card.suit)
        }
        else messages.push(`${card.suit} power is blocked`);
    })
    if(suitsActive.includes('♥')){
        handleHearts()
    }
    if(suitsActive.includes('♦')){
        handleDiamonds()
    }
    playerAttack(suitsActive)

}

function totalPlayerAttack(){
    let total = 0
    chosenCards.cards.forEach(card => {
        total += CARD_VALUE_MAP[card.value]
    })
    return total
}

function handleHearts(){
    let maxHeal = Math.min(totalPlayerAttack(), discardDeckCardTotal())
    if (maxHeal > 0) {
        healFromDiscard(maxHeal)
    }
    else messages.push(`Unable to heal`)
}

function healFromDiscard(maxHeal){
    messages.push(`Healing ${maxHeal} ${maxHeal === 1 ? 'card' : 'cards'} from the discard pile`)//TODO
    discardDeck.shuffle()
    let healedCards = discardDeck.cards.splice(0,maxHeal)
    drawDeck = new Deck(drawDeck.cards.concat(healedCards))
    updateDiscardPile()
    updateDeckCount()
}

function discardDeckCardTotal(){
    if (!discardDeck) return 0
    return discardDeck.numberOfCards
}

function handleDiamonds(){
    let maxDraw = Math.min(totalPlayerAttack(), HAND_LIMIT - playerHand.numberOfCards, drawDeck.numberOfCards)
    if (maxDraw > 0) drawFromTavern(maxDraw)
}

function drawFromTavern(maxDraw){
    messages.push(`Drawing ${maxDraw} ${maxDraw === 1 ? 'card' : 'cards'} from tavern`)
    let drawnCards = []
    for(let i=0;i<maxDraw;i++){
        drawnCards.push(drawDeck.pop())
    }
    playerHand = new Deck(playerHand.cards.concat(drawnCards))
    playerHand.sort()
    updatePlayerHand()
    updateDeckCount()
}

function playerAttack(suits){
    let damageDealt = totalPlayerAttack()
    if(suits.includes('♣')) damageDealt += damageDealt
    currentRoyalHealth -= damageDealt
    messages.push(`Attacking ${royalCard.value}${royalCard.suit} for ${damageDealt} damage`)
    if(currentRoyalHealth > 0) {
        if (!activeDeck) activeDeck = new Deck(chosenCards.cards)
        else activeDeck = new Deck(activeDeck.cards.concat(chosenCards.cards))
        updateHealthText()
        attackButton.disabled = true
        if(playerHand.numberOfCards === 0) alertBox('Sorry, you lost', true)
        else handleRoyalAttack(suits)
    }
    else handleRoyalDefeated(currentRoyalHealth === 0)
}

function handleRoyalAttack(suits){
    onAttack = false
    if(!currentShield) currentShield = 0
    if(suits.includes('♠')){
        let shield = royalCard.suit === '♠' ? 0 : getCardShield(chosenCards.cards)
        currentRoyalAttack -= shield
        if (currentRoyalAttack < 0) currentRoyalAttack = 0
        currentShield += shield
        updateAttackText()
    }
    messages.push(`${royalCard.value}${royalCard.suit} is attacking for ${currentRoyalAttack}`)
    
    alertBox(messages) //TODO: Clean up messages
    messages =[]

    chosenCards = undefined
    onAttack = true
}

function getCardShield(cards){
    let shield = 0
    cards.forEach(card => {
        shield += CARD_VALUE_MAP[card.value]
    })
    return shield
}

function handleRoyalDefeated(exactKill){
    if(exactKill) {
        messages.push(`${royalCard.value}${royalCard.suit} defeated with critical hit`)
        drawDeck = new Deck([royalCard].concat(drawDeck.cards))
    }
    else {
        messages.push(`${royalCard.value}${royalCard.suit} defeated`)
        if(!discardDeck) discardDeck = new Deck([royalCard])
        else discardDeck = new Deck([royalCard].concat(discardDeck.cards))
    }

    alertBox(messages) //TODO: Clean up messages
    messages =[]

    currentShield = 0
    moveActiveToDiscard()
    setRoyalCard()
    updateDeckCount()
}

function moveActiveToDiscard(){
    if(!discardDeck) discardDeck = new Deck(chosenCards.cards)
    else {
        if (activeDeck?.cards) discardDeck = new Deck(chosenCards.cards.concat(discardDeck.cards, activeDeck.cards))
        else discardDeck = new Deck(chosenCards.cards.concat(discardDeck.cards))
    }
    chosenCards = undefined
    activeDeck = undefined
    updateDiscardPile()
    clearActiveDeck()
}

function clearActiveDeck(){
    activeSlots.forEach(slot => {
        slot.innerHTML = ''
    })
    attackButton.disabled = true
}

function updateDiscardPile(){
    discardCardSlot.innerText = ''
    if(discardDeck?.cards[0]) discardCardSlot.appendChild(discardDeck.cards[0].getHTML())
    else discardCardSlot.innerText = 'Discard Pile'

}

function updateStatsText(){
    updateAttackText()
    updateHealthText()
}
function updateAttackText(){
    attackElement.innerText = `Current attack: \n ${currentRoyalAttack}`
}
function updateHealthText(){
    healthElement.innerText = `Current health: \n ${currentRoyalHealth}`
}

function updateDeckCount() {
    royalDeckElement.innerText = royalDeck.numberOfCards
    drawDeckElement.innerText = drawDeck.numberOfCards
}

function wonGame(){
    alertBox(`You won the game?!?`, true)
}

function alertBox(message, endGame){
    if(endGame){
        //TODO: add end game buttons
        addAlertBoxButton('Restart', endGame)
    } else {
        addAlertBoxButton('Continue')
    }
    messageElement.innerText = message
    gameMessage.style.display = 'block'
    
}

function addAlertBoxButton(label, endGame){
    let footerElement = document.querySelector('.modal-footer');
    let button = document.createElement('button')
    button.innerText = label
    footerElement.appendChild(button)
    if(endGame){
        button.addEventListener('click', restartGame)
    } else {
        button.addEventListener('click', closeModal)
    }
}

function closeModal(){
    gameMessage.style.display = 'none'
    let footerElement = document.querySelector('.modal-footer');
    footerElement.innerHTML = ''
    button.removeEventListener('click', closeModal)
}

function restartGame(){
    startGame();
    gameMessage.style.display = 'none'
    let footerElement = document.querySelector('.modal-footer');
    footerElement.innerHTML = ''
    button.removeEventListener('click', restartGame)
}