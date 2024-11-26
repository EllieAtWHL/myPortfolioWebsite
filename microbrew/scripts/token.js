export const TOKENS_MAP =
    [
        { 'type': 'yellow', 'count': 16, 'image': 'img/hexagon_yellow.svg' },
        { 'type': 'orange', 'count': 16, 'image': 'img/hexagon_orange.svg' },
        { 'type': 'brown', 'count': 16, 'image': 'img/hexagon_brown.svg' },
        { 'type': 'hops', 'count': 6, 'image': 'img/hexagon_green.svg' }
    ];

export class Token_Pot {
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

export class Token {
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