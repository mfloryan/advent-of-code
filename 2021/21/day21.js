
function rolldice3(dice) {
    let diceState = dice
    let rollsSum = 0;
    for (let i = 0; i < 3; i++) {
        rollsSum += (diceState + 1)
        diceState++;
        diceState = diceState % 100;
    }
    return {d: diceState, rollsSum}
}

function runGame(initialPlayerPosition, rollDiceFunction, winningPoints) {
    let players = [initialPlayerPosition[0] - 1, initialPlayerPosition[1] - 1]
    let scores = [0, 0]

    let rolls = 0;
    let dice = 0;

    do {
        let roll = rollDiceFunction(dice);
        rolls += 3;
        dice = roll.d;
        players[0] += roll.rollsSum;
        players[0] = players[0] % 10;
        scores[0] += players[0] + 1;
        if (scores[0] >= winningPoints) break;

        roll = rollDiceFunction(dice);
        rolls += 3;
        dice = roll.d;
        players[1] += roll.rollsSum;
        players[1] = players[1] % 10;
        scores[1] += players[1] + 1;
        if (scores[1] >= winningPoints) break;
    } while (true)

    return { rolls, scores }
}

let universeId = 0;

let players = [6, 9]
let r = runGame(players, rolldice3, 1000)
console.log(r.rolls * Math.min(r.scores[0], r.scores[1]))


function getDiceRoll(universeRollStates, zeroOffsetRollNumber) {
    if (universeRollStates.length - 1 < zeroOffsetRollNumber) {
        return 1
    } else {
        return Number.parseInt(universeRollStates[zeroOffsetRollNumber]) + 1
    }
}

function runGame2(initialPlayerPosition, universeId) {
    let players = [initialPlayerPosition[0] - 1, initialPlayerPosition[1] - 1]
    let scores = [0, 0]
    let universeRollStates = universeId.toString(3).split('').reverse(); 

    let rolls = 0;
    let dice = 0;

    do {
        players[0] += getDiceRoll(universeRollStates, rolls++) + getDiceRoll(universeRollStates, rolls++) + getDiceRoll(universeRollStates, rolls++);
        players[0] = players[0] % 10;
        scores[0] += players[0] + 1;
        if (scores[0] >= 21) return [1, 0];

        players[1] += getDiceRoll(universeRollStates, rolls++) + getDiceRoll(universeRollStates, rolls++) + getDiceRoll(universeRollStates, rolls++);
        players[1] = players[1] % 10;
        scores[1] += players[1] + 1;
        if (scores[1] >= 21) return [0, 1];
    } while (true)
}

// let pw = [0, 0]
// for (let i = 0; i < Math.pow(3,21); i++) {
//     let r = runGame2(players, i);
//     pw[0] += r[0]; pw[1] += r[1];
//     if (i % 100000000 == 0) console.log(pw)
// }
// console.log( pw )

function fact(n) {
    if (n == 1) return n; else return n * fact(n-1)
}

console.log(444356092776315 + 341960390180808)
console.log(Math.pow(3,31))

