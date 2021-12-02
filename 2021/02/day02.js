const fs = require('fs')
const path = require('path')

let input = `forward 5
down 5
forward 8
up 3
down 8
forward 2`

let lines = input.split('\n')
let fileInput =  fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })
lines=fileInput.split('\n')

let position = 0, depth = 0, aim = 0

let parser2 = {
    'forward': (state, magnitude) => { state.position += magnitude; state.depth += state.aim * magnitude },
    'down': (state, magnitude) => { state.aim += magnitude },
    'up': (state, magnitude) => { state.aim -= magnitude }
}

let state = {
    position: 0,
    depth: 0,
    aim: 0
}

lines.forEach(line => {
    let [move, size] = line.split(" ")
    size = Number.parseInt(size)

    parser2[move](state, size)
})

console.log(state.position, state.depth)
console.log("Day 02 part 2:", state.position * state.depth)
