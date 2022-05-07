import Deck from "./deck.js"
import Toast from "../scripts/toast.js"

const NUM_OF_PLAYERS = 1
const TOTAL_JESTERS = 2
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
const jesterButton = document.getElementById('use-jester')
const undoButton = document.getElementById('undo-move')
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

let royalDeck, drawDeck, royalCard, chosenCards, activeDeck, discardDeck, playerHand, currentRoyalAttack, discardedRoyalAttack, currentRoyalHealth, currentShield, onAttack
let messages = []
let toastMessages = []
let moves = []
let jestersRemaining = TOTAL_JESTERS

playButton.addEventListener('click', startGame)

handSlots.forEach(slot => {
    slot.addEventListener('click', cardSelected)
})

attackButton.addEventListener('click', handlePlayerAttack)
jesterButton.addEventListener('click', handleUseJester)
undoButton.addEventListener('click', handleUndoMove)


function startGame() {
    gameStart.style.display = 'none'
    playArea.style.display = 'grid'
    attackButton.style.visibility = 'hidden'
    undoButton.style.visibility = 'hidden'
    onAttack = true
    chosenCards = undefined
    activeDeck = undefined
    discardDeck = undefined
    jestersRemaining = TOTAL_JESTERS
    clearDefenceMessage()
    updateJesterText()
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
    royalCard = royalDeck.pop()
    if(!royalCard) wonGame()
    currentRoyalAttack = ROYAL_STATS_MAP[royalCard.value].attack
    currentRoyalHealth = ROYAL_STATS_MAP[royalCard.value].health
    renderRoyalCard()
}

function renderRoyalCard(){
    royalCardSlot.innerHTML = ''
    let tempRoyalCard = new Deck([royalCard])
    royalCard = tempRoyalCard.cards[0]
    royalCardSlot.appendChild(royalCard.getHTML())
    powerTextElement.innerText = `Immunity against: ${SUIT_POWER_MAP[royalCard.suit]}`
    updateStatsText()
}

function createPlayerHand(){
    playerHand = new Deck(drawDeck.cards.splice(0, HAND_LIMIT))
    playerHand.sort()
    updatePlayerHand()

}

function updatePlayerHand(){
    handSlots.forEach( (slot, index) => {
        slot.innerHTML = ''
        if(playerHand.cards[index]){
            slot.appendChild(playerHand.cards[index].getHTML())
        }
    })
}

function cardSelected(){
    if(onAttack){ //temp so only can undo when attacking for now
        let type = onAttack ? 'playCard' : 'discardCard'
        let state = {
            discardDeck: discardDeck ? new Deck(discardDeck.cards) : null,
            playerHand: playerHand ? new Deck(playerHand.cards) : null,
            royalDeck: royalDeck ? new Deck(royalDeck.cards) : null,
            activeDeck: activeDeck ? new Deck(activeDeck.cards) : null,
            chosenCards: chosenCards ? new Deck(chosenCards.cards) : null,
            drawDeck: drawDeck ? new Deck(drawDeck.cards) : null,
            royalCard: royalCard ? JSON.parse(JSON.stringify(royalCard)) : null,
            royalAttack: currentRoyalAttack,
            royalHealth: currentRoyalHealth,
            currentShield: currentShield
        }
        moves.unshift({type: type, state: state})
        moves = JSON.parse(JSON.stringify(moves))
    }
    if(!event.target.dataset.value) return
    let cardValue = event.target.dataset.value
    let selectedCard = {suit: cardValue.substring(cardValue.length-1), value: cardValue.substring(0,cardValue.length-1)}
    if(onAttack){
        if(invalidSelection(selectedCard)){
            let toast = new Toast({
                text: 'Illegal move',
                error: true
            })
            moves.shift()
        }
        else {
            attackButton.style.visibility = 'visible'
            moveSelectedCardToChosenCards(selectedCard)
            let slotToClear = event.path[1]
            renderSelectedCardMovement(slotToClear)
        }
    } else {        
        discardedRoyalAttack -= CARD_VALUE_MAP[selectedCard.value]
        moveSelectedCardToDiscard(selectedCard)
        let slotToClear = event.path[1]
        renderDiscardedCardMovement(slotToClear)
        if(discardedRoyalAttack <= 0) {
            clearDefenceMessage()
            onAttack = true
        } else {
            updateDefenceMessage()
        }
        if(playerHand.numberOfCards === 0 && jestersRemaining === 0) alertBox(['Sorry, you lost'], true)
    }
    if(moves.length > 0 && chosenCards?.numberOfCards > 0) undoButton.style.visibility = 'visible'
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

function moveSelectedCardToDiscard(selectedCard){
    let removedCard = playerHand.remove(selectedCard);
    if(!discardDeck) discardDeck = new Deck(removedCard)
    else {
        discardDeck = new Deck(removedCard.concat(discardDeck.cards))
    }
}

function renderSelectedCardMovement(slot){
    let cardToCreate = slot.innerHTML
    slot.innerHTML = ''
    let slotToPopulate = chosenCards.numberOfCards - 1
    if(activeDeck) slotToPopulate += activeDeck.numberOfCards
    activeSlots[slotToPopulate].innerHTML = cardToCreate
}

function renderActiveDeck(){
    let activeAreaCards = {cards: []}
    if(activeDeck && chosenCards){
        activeAreaCards = new Deck(activeDeck.cards.concat(chosenCards.cards))
    } else if(activeDeck){
        activeAreaCards = new Deck(activeDeck.cards)
    } else if(chosenCards){
        activeAreaCards = new Deck(chosenCards.cards)
    }
    activeSlots.forEach((slot,index) => {
        slot.innerHTML = ''
        if(activeAreaCards?.cards[index]){
            slot.appendChild(activeAreaCards.cards[index].getHTML())
        } 
    })
}

function renderDiscardedCardMovement(slot){
    slot.innerHTML = ''
    updateDiscardPile()
}

function handlePlayerAttack(){
    
    undoButton.style.visibility = 'hidden' // temp hiding until undo implemented for playerAttack too
    // moves.unshift({type: 'playerAttack'})
    let suitsActive= []
    chosenCards.cards.forEach( card => {
        if(card.suit !== royalCard.suit){
            suitsActive.push(card.suit)
        }
        else {
            const toast = new Toast({
                text: `${card.suit} power is blocked`,
            })
            toastMessages.push(toast)
        }
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
    } else {
        let toast =  Toast({
            text: `Unable to heal from discard`
        })
        toastMessages.push(toast)
    }
}

function healFromDiscard(maxHeal){
    let toast = new Toast({
        text: `Healing ${maxHeal} ${maxHeal === 1 ? 'card' : 'cards'} from the discard pile`
    })
    toastMessages.push(toast)
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
    let toast = new Toast({
        text: `Drawing ${maxDraw} ${maxDraw === 1 ? 'card' : 'cards'} from tavern`
    })
    toastMessages.push(toast)
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
    let toast = new Toast({
        text: `Attacking ${royalCard.value}${royalCard.suit} for ${damageDealt} damage`
    })
    toastMessages.push(toast)
    if(currentRoyalHealth > 0) {
        if (!activeDeck) activeDeck = new Deck(chosenCards.cards)
        else activeDeck = new Deck(activeDeck.cards.concat(chosenCards.cards))
        updateHealthText()
        attackButton.style.visibility = 'hidden'
        if(playerHand.numberOfCards === 0 && jestersRemaining === 0) alertBox(['Sorry, you lost'], true)
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
    let toast = new Toast({
        text: `${royalCard.value}${royalCard.suit} is attacking for ${currentRoyalAttack}`
    })
    toastMessages.push(toast)
    discardedRoyalAttack = currentRoyalAttack
    chosenCards = undefined
    if(currentRoyalAttack <= 0 ) onAttack = true;
    else {
       updateDefenceMessage()
    }    
}

function updateDefenceMessage(){
    if(discardedRoyalAttack > 0){
        let defenceElement = document.getElementById('defence-message')
        defenceElement.innerText = `Current defense needed is ${discardedRoyalAttack}`
        defenceElement.style.display = 'block'
    }
}
function clearDefenceMessage(){
    let defenceElement = document.getElementById('defence-message')
    defenceElement.innerText = ``
    defenceElement.style.display = 'none'
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
        let toast = new Toast({
            text: `${royalCard.value}${royalCard.suit} defeated with critical hit`
        })
        toastMessages.push(toast)
        drawDeck = new Deck([royalCard].concat(drawDeck.cards))
    }
    else {
        let toast = new Toast({
            text: `${royalCard.value}${royalCard.suit} defeated`
        })
        toastMessages.push(toast)
        if(!discardDeck) discardDeck = new Deck([royalCard])
        else discardDeck = new Deck([royalCard].concat(discardDeck.cards))
    }
    
    if(playerHand.numberOfCards === 0 && jestersRemaining === 0) alertBox(['Sorry, you lost'], true)

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
    attackButton.style.visibility = 'hidden'
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
    attackElement.innerText = `Royal Attack: \n ${currentRoyalAttack}`
}
function updateHealthText(){
    healthElement.innerText = `Royal Health: \n ${currentRoyalHealth}`
}

function updateDeckCount() {
    royalDeckElement.innerText = royalDeck.numberOfCards
    drawDeckElement.innerText = drawDeck.numberOfCards
}

function handleUseJester(){
    // moves.unshift({type: 'useJester'})
    if(jestersRemaining < 1) {
        alertBox([`No jesters remaining`], false)
        return
    }
    jestersRemaining--
    discardPlayerHand()
    updateJesterText()
    if(jestersRemaining === 0){
        jesterButton.removeEventListener('click', handleUseJester)
        jesterButton.remove();
    }
}

function discardPlayerHand(){
    if (!discardDeck) discardDeck = new Deck(playerHand.cards)
    else {
        discardDeck = new Deck(playerHand.cards.concat(discardDeck.cards))
    }
    createPlayerHand()
    updateDiscardPile()
    updateDeckCount()
}

function updateJesterText(){
    let jesterMessage = document.getElementById('jester-message')
    jesterMessage.innerText = `Jesters left: ${jestersRemaining}`
}

function handleUndoMove(){
    let moveToUndo = moves.shift()
    
    activeDeck = moveToUndo.state.activeDeck ? new Deck(moveToUndo.state.activeDeck.cards) : null;
    chosenCards = moveToUndo.state.chosenCards ? new Deck(moveToUndo.state.chosenCards.cards) : null;
    discardDeck = moveToUndo.state.discardDeck ? new Deck(moveToUndo.state.discardDeck.cards) : null;
    drawDeck = moveToUndo.state.drawDeck ? new Deck(moveToUndo.state.drawDeck.cards) : null;
    playerHand = moveToUndo.state.playerHand ? new Deck(moveToUndo.state.playerHand.cards) : null;
    royalDeck = moveToUndo.state.royalDeck ? new Deck(moveToUndo.state.royalDeck.cards) : null;
    royalCard = moveToUndo.state.royalCard
    currentRoyalAttack = moveToUndo.state.royalAttack
    currentRoyalHealth = moveToUndo.state.royalHealth
    currentShield = moveToUndo.state.currentShield
  
    updateAllItems()
}

function wonGame(){
    alertBox([`You won the game?!?`], true)
}

function alertBox(messages, endGame){
    toastMessages.forEach( toast => {
        toast.remove()
    })
    if(endGame){
        addAlertBoxButton('Restart', endGame)
    } else {
        addAlertBoxButton('Continue')
    }

    let listElement = document.createElement('ul')
    listElement.classList.add('message')

    messageElement.appendChild(listElement)
    messages.forEach((message) => {
        let listMessage = document.createElement('li')
        listMessage.classList.add('list-message')
        listMessage.innerText = message
        listElement.appendChild(listMessage)
    })
    
    gameMessage.style.display = 'block'
    
}

function addAlertBoxButton(label, endGame){
    let footerElement = document.querySelector('.modal-footer')
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
    clearModal()
    //TODO: button isn't defined, you silly sausage
    //button.removeEventListener('click', closeModal)
}

function restartGame(){
    startGame()
    clearModal()
    //TODO: button isn't defined, you silly sausage
    //button.removeEventListener('click', restartGame)
}

function clearModal(){
    gameMessage.style.display = 'none'
    messageElement.innerHTML = ''
    messages = []
    let footerElement = document.querySelector('.modal-footer')
    footerElement.innerHTML = ''
}

function updateAllItems(){
    if(!chosenCards) attackButton.style.visibility = 'hidden'
    if(moves.length < 1) undoButton.style.visibility = 'hidden'
    renderRoyalCard()
    updateDeckCount()
    updateDefenceMessage()
    updateDiscardPile()
    updateJesterText()
    renderActiveDeck()
    updatePlayerHand()
}