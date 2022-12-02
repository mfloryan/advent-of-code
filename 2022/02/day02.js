const { loadLines } = require('../input')

let lines = loadLines('02/input.txt').map(l => l.split(' '))

let scores = {
    A : { //rock
        X: 1+3,
        Y: 2+6,
        Z: 3+0 },
    B : {  //paper
        X: 1+0,
        Y: 2+3,
        Z: 3+6 },
    C : {  //scissors
        X: 1+6,
        Y: 2+0,
        Z: 3+3 }
}

let scores2 = {
    A : {  //rock
        X: 0+3,
        Y: 3+1,
        Z: 6+2 },
    B : {  //paper
        X: 0+1,
        Y: 3+2,
        Z: 6+3 },
    C : {  //scissors
        X: 0+2,
        Y: 3+3,
        Z: 6+1 }
}

function getGameScore(game) {
    return scores[game[0]][game[1]]
}

function getGameScore2(game) {
    return scores2[game[0]][game[1]]
}

console.log(lines.map(l => getGameScore(l)).reduce((p,c) => p+c))
console.log(lines.map(l => getGameScore2(l)).reduce((p,c) => p+c))
