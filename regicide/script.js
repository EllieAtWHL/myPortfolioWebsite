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
const royalDeckElement = document.querySelector('.royal-deck')
const drawDeckElement = document.querySelector('.draw-deck')
const royalCardSlot = document.querySelector('.royal-card-slot')
const discardCardSlot = document.querySelector('.discard-card-slot')
const attackElement = document.querySelector('.attack')
const healthElement = document.querySelector('.health')
const powerTextElement = document.querySelector('.power-text')
const attackButton = document.querySelector('.attack-button')
const handSlots = [
    document.querySelector('.hand-card-slot-first'),
    document.querySelector('.hand-card-slot-second'),
    document.querySelector('.hand-card-slot-third'),
    document.querySelector('.hand-card-slot-fourth'),
    document.querySelector('.hand-card-slot-fifth'),
    document.querySelector('.hand-card-slot-sixth'),
    document.querySelector('.hand-card-slot-seventh'),
    document.querySelector('.hand-card-slot-eigth')
]
const activeSlots = [
    document.querySelector('.active-card-slot-first'),
    document.querySelector('.active-card-slot-second'),
    document.querySelector('.active-card-slot-third'),
    document.querySelector('.active-card-slot-fourth'),
    document.querySelector('.active-card-slot-fifth'),
    document.querySelector('.active-card-slot-sixth'),
    document.querySelector('.active-card-slot-seventh'),
    document.querySelector('.active-card-slot-eigth')
]

let royalDeck, drawDeck, royalCard, chosenCards, activeDeck, discardDeck, playerHand, currentRoyalAttack, currentRoyalHealth, onAttack


handSlots.forEach(slot => {
    slot.addEventListener('click', cardSelected)
})


playButton.addEventListener('click', startGame)


attackButton.addEventListener('click', handlePlayerAttack)

function startGame() {
    gameStart.style.display = 'none'
    playArea.style.display = 'grid'
    attackButton.disabled = true
    onAttack = true
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
    royalCardSlot.appendChild(royalCard.getHTML())
    powerTextElement.innerText = `Protected against: ${SUIT_POWER_MAP[royalCard.suit]}`
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
            alert('Illegal move') //TODO Improve illegal moves
        }
        else {
            attackButton.disabled = false
            moveSelectedCardToChosenCards(selectedCard)
            let slotToClear = event.path[1]
            renderSelectedCardMovement(slotToClear)
        }
    } else {
        //TODO: Select cards to be discards
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
        else alert(`${card.suit} power is blocked`)
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
    else alert(`Unable to heal`)
}

function healFromDiscard(maxHeal){
    alert(`Healing ${maxHeal} ${maxHeal === 1 ? 'card' : 'cards'} from the discard pile`) //TODO
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
    alert(`Drawing ${maxDraw} ${maxDraw === 1 ? 'card' : 'cards'} from tavern`)
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
    alert(`Attacking ${royalCard.value}${royalCard.suit} for ${damageDealt} damage`)
    if(currentRoyalHealth > 0) {
        if (!activeDeck) activeDeck = new Deck(chosenCards.cards)
        else activeDeck = new Deck(activeDeck.cards.concat(chosenCards.cards))
        chosenCards = undefined
        updateHealthText()
        attackButton.disabled = true
        handleRoyalAttack()
    }
    else handleRoyalDefeated(currentRoyalHealth === 0)
}

function handleRoyalAttack(){
    onAttack = false
    let shield = royalCard.suit === '♠' ? 0 : currentShield()
    currentRoyalAttack -= shield
    updateAttackText()
    alert(`${royalCard.value}${royalCard.suit} is attacking for ${currentRoyalAttack}`)
    console.log(`Actual shield ${shield}`)
    onAttack = true
}

function currentShield(){
    let shield = 0
    if(activeDeck?.cards) shield += getCardShield(activeDeck.cards)
    if(chosenCards?.cards) shield += getCardShield(chosenCards.cards)
    return shield
}

function getCardShield(cards){
    let shield = 0
    cards.forEach(card => {
        if(card.suit === '♠') shield += CARD_VALUE_MAP[card.value]
    })
    return shield
}

function handleRoyalDefeated(exactKill){
    if(exactKill) {
        alert(`${royalCard.value}${royalCard.suit} defeated with critical hit`)
        drawDeck = new Deck([royalCard].concat(drawDeck.cards))
    }
    else {
        alert(`${royalCard.value}${royalCard.suit} defeated`)
        if(!discardDeck) discardDeck = new Deck([royalCard])
        else discardDeck = new Deck([royalCard].concat(discardDeck.cards))
    }
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