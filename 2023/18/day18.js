const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function parse(line) {
    let [dir, steps, colour] = line.split(' ', 3)
    return { dir, distance: parseInt(steps), colour: colour.substring(1, colour.length - 1) }
}

const dirMap = { 0: 'R', 1: 'D', 2: 'L', 3: 'U' }

function parse2(instructions) {
    let distance = Number.parseInt(instructions.colour.substring(1, 6), 16)
    let dir = dirMap[instructions.colour.substring(6)]
    return { distance, dir }
}
const getEnd = {
    'R': (s, v) => { return { x: s.x + v, y: s.y } },
    'L': (s, v) => { return { x: s.x - v, y: s.y } },
    'D': (s, v) => { return { x: s.x, y: s.y + v } },
    'U': (s, v) => { return { x: s.x, y: s.y - v } },
}

function getCoordinates(plan) {
    let coordinates = []
    let start = { x: 0, y: 0 }
    coordinates.push(start)
    plan.reduce((p, c) => { let end = getEnd[c.dir](p, c.distance); coordinates.push(end); return end }, start)
    return coordinates
}

// input = `R 6 (#70c710)
// D 5 (#0dc571)
// L 2 (#5713f0)
// D 2 (#d2c081)
// R 2 (#59c680)
// D 2 (#411b91)
// L 5 (#8ceee2)
// U 2 (#caa173)
// L 1 (#1b58a2)
// U 2 (#caa171)
// R 2 (#7807d2)
// U 3 (#a77fa3)
// L 2 (#015232)
// U 2 (#7a21e3)`


function shoelace(coords) {
    let c = BigInt(0)
    for (let i = 0; i < coords.length - 1; i++) {
        c += (BigInt(coords[i].x) * BigInt(coords[i + 1].y) - BigInt(coords[i].y) * BigInt(coords[i + 1].x))
    }
    return c / BigInt(2)
}

function calculateArea(data) {
    let coords = getCoordinates(data)
    return shoelace(coords) + BigInt(data.reduce((p, c) => p + c.distance, 0) / 2) + BigInt(1)
}

let data = input.split('\n').map(parse)

console.log(calculateArea(data))
console.log(calculateArea(data.map(parse2)))
return
