const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function parse(line) {
    let g = line.split(":")
    let id = parseInt(g[0].split(' ')[1])
    let sets = g[1].split(";").map(g => g.split(", ").map(_ => { box = _.trim().split(' '); return [ parseInt(box[0]), box[1] ]}).reduce((p,c) => { p[c[1]] = c[0]; return p }, {}))
    return {
        id,
        sets
    }
}

input = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`

let games = input.split('\n').map(parse)

function isGamePossibe(bag, game) {
    for (const set of game.sets) {
        for (const cube in set) {
            if (bag[cube] < set[cube]) return false
        }
    }
    return true
}

const bag = {'red':12,'green':13,'blue':14}

let possible = games.map(g => [g.id, isGamePossibe(bag, g)]).filter(_ => _[1]).reduce((p,c) => p+c[0],0)
console.log(possible)

function minimumBag(game) {
    let bag = {}
    for (const set of game.sets) {
        for (const cube in set) {
            if (bag[cube]) {
                if (bag[cube] < set[cube]) bag[cube] = set[cube]
            } else {
                bag[cube] = set[cube]
            }
        }
    }
    return bag
}

console.log(minimumBag(games[0]))