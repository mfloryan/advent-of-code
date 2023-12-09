const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function parse(line) {
    let action = line[0]
    let value = parseInt(line.substring(1))
    return { action, value }
}

const moves = {
    'N': (pos, len) => { return { x: pos.x, y: pos.y - len } },
    'S': (pos, len) => { return { x: pos.x, y: pos.y + len } },
    'E': (pos, len) => { return { x: pos.x + len, y: pos.y } },
    'W': (pos, len) => { return { x: pos.x - len, y: pos.y } },
}

const turns = {
    'N': { 'L': 'W', 'R': 'E' },
    'S': { 'L': 'E', 'R': 'W' },
    'E': { 'L': 'N', 'R': 'S' },
    'W': { 'L': 'S', 'R': 'N' },
}

function turn(facing, direction, angle) {
    if (angle == 0) return facing
    else return turn(turns[facing][direction], direction, angle - 90)
}

const howToAct = {
    'N': (state, value) => { return { heading: state.heading, pos: moves['N'](state.pos, value) } },
    'S': (state, value) => { return { heading: state.heading, pos: moves['S'](state.pos, value) } },
    'E': (state, value) => { return { heading: state.heading, pos: moves['E'](state.pos, value) } },
    'W': (state, value) => { return { heading: state.heading, pos: moves['W'](state.pos, value) } },
    'L': (state, value) => { return { heading: turn(state.heading, 'L', value), pos: state.pos } },
    'R': (state, value) => { return { heading: turn(state.heading, 'R', value), pos: state.pos } },
    'F': (state, value) => { return { heading: state.heading, pos: moves[state.heading](state.pos, value) } },
}

function move(state, instruction) {
    return howToAct[instruction.action](state, instruction.value)
}

// input = `F10
// N3
// F7
// R90
// F11`

const distance = (p1, p2) => Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y)
let start = { heading: 'E', pos: { x: 0, y: 0 } }
let actions = input.split('\n').map(parse)

let destination = actions.reduce((p, c) => move(p, c), start)
console.log(distance(start.pos, destination.pos))
