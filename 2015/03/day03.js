const fs = require('fs')
const path = require('path')
let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

let moveEffects = {
    '>': p => p.x++,
    '<': p => p.x--,
    '^': p => p.y--,
    'v': p => p.y++
}

function visitHouses(moves) {
    let houses = [];
    let position = {x:0, y:0}
    houses.push([position.x, position.y])
    moves.forEach( move => {
        moveEffects[move](position)
        if (!houses.some(p => p[0] == position.x && p[1] == position.y)) {
            houses.push([position.x, position.y])
        }
    });
    return houses.length
}

function visitRoboHouses(moves) {
    let houses = [];
    let position1 = {x:0, y:0}
    let position2 = {x:0, y:0}
    houses.push([position1.x, position1.y])
    let i = 0;
    moves.forEach( move => {
        let position = i%2?position1:position2;
        moveEffects[move](position)
        if (!houses.some(p => p[0] == position.x && p[1] == position.y)) {
            houses.push([position.x, position.y])
        }
        i++;
    });
    return houses.length
}

console.log(visitHouses(input.split('')))
console.log(visitRoboHouses(input.split('')))
