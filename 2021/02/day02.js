const { loadLines } = require('../input')

let input = `forward 5
down 5
forward 8
up 3
down 8
forward 2`

let lines = input.split('\n')

lines = loadLines('02/input.txt')

let interpreter1 = {
    'forward': (state, magnitude) => { state.position += magnitude },
    'down': (state, magnitude) => { state.depth += magnitude },
    'up': (state, magnitude) => { state.depth -= magnitude }
}

let interpreter2 = {
    'forward': (state, magnitude) => { state.position += magnitude; state.depth += state.aim * magnitude },
    'down': (state, magnitude) => { state.aim += magnitude },
    'up': (state, magnitude) => { state.aim -= magnitude }
}

function parseInstructions(line) {
    let [move, magnitude] = line.split(" ")
    return { move, magnitude: Number.parseInt(magnitude) }
}

function moveSubmarine(instructions, interpreter) {
    return instructions
        .map(parseInstructions)
        .reduce((p, c) => {
            interpreter[c.move](p, c.magnitude); return p
        }, {
            position: 0,
            depth: 0,
            aim: 0
        })
}

let state = moveSubmarine(lines, interpreter1)
console.log("Day 02 part 1:", state.position * state.depth)

state = moveSubmarine(lines, interpreter2)
console.log("Day 02 part 2:", state.position * state.depth)
