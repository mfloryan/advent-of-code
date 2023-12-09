const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function parse(line) {
    let action = line[0]
    let value = parseInt(line.substring(1))
    return [action, value]
}

const moves = {
    'N': (pos, len) => [pos[0], pos[1] - len],
    'S': (pos, len) => [pos[0], pos[1] + len],
    'E': (pos, len) => [pos[0] + len, pos[1]],
    'W': (pos, len) => [pos[0] - len, pos[1]],
}

const leftTurns = ['N', 'W', 'S', 'E']
const rightTurns = ['N', 'E', 'S', 'W']

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
    'N': (state, value) => [state[0], moves['N'](state[1], value)],
    'S': (state, value) => [state[0], moves['S'](state[1], value)],
    'E': (state, value) => [state[0], moves['E'](state[1], value)],
    'W': (state, value) => [state[0], moves['W'](state[1], value)],
    'L': (state, value) => [turn(state[0], 'L', value), state[1]],
    'R': (state, value) => [turn(state[0], 'R', value), state[1]],
    'F': (state, value) => [state[0], moves[state[0]](state[1], value)],
}

function move(state, instruction) {
    return howToAct[instruction[0]](state, instruction[1])
}

// input = `F10
// N3
// F7
// R90
// F11`

const distance = (p1, p2) => Math.abs(p2[0] - p1[0]) + Math.abs(p2[1] - p1[1])

let actions = input.split('\n').map(parse)
let destination = actions.reduce((p, c) => move(p, c), ['E', [0, 0]])
console.log(distance([0,0], destination[1]))
