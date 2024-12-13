const fs = require('fs')
const path = require('path')
const nerdamer = require('../nerdamer/all')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

let groups = input.split('\n\n')

function parseGroup(group) {
    let [ba, bb, prize] = group.split('\n')

    ba = ba.substring(10).split(', ').map(v => v.substring(1)).map(Number)
    bb = bb.substring(10).split(', ').map(v => v.substring(1)).map(Number)
    prize = prize.substring(7).split(', ').map(v => v.substring(2)).map(Number)

    return {
        a: ba,
        b: bb,
        prize: prize
    }
}

function simulatePlays(game) {

    for (let a = 1; a <= 100; a++) {
        for (let b = 1; b <= 100; b++) {
            let result = [
                game.a[0] * a + game.b[0] * b,
                game.a[1] * a + game.b[1] * b
            ]
            if (result[0] == game.prize[0] && 
                result[1] == game.prize[1]) {
                cost = 3 * a + b;
                return cost
            }
        }
    }

    return false
}

function solveBigGames(game) {

    let sol = nerdamer.solveEquations(
        [`${game.a[0]}*a + ${game.b[0]}*b = ${game.prize[0]}`,
         `${game.a[1]}*a + ${game.b[1]}*b = ${game.prize[1]}`]
    )

    let a = sol[0][1]
    let b = sol[1][1]

    if (Math.round(a) == a && Math.round(b) == b) {
        return 3 * a + b
    } 
    
    return false
}

let games = groups.map(g => parseGroup(g))

console.log(
    games.map(g => simulatePlays(g))
        .filter(v => v)
        .reduce((p, c) => p + c))

let bigGames = games.map(
    g => {
        return {
            a: g.a,
            b: g.b,
            prize: [g.prize[0] + 10000000000000, g.prize[1] + 10000000000000]
        }
    })

console.log(
    bigGames.map(g => solveBigGames(g))
        .filter(v => v)
        .reduce((p, c) => p + c)
)
