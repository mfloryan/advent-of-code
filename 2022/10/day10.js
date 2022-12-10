const { loadLines } = require('../input')

let lines = loadLines('10/input.txt')

function parseLine(line) {
    [o, a] = line.split(' ')
    let r = { op: o }
    if (a) {
        r.arg = parseInt(a)
    }
    return r
}

let instructions = lines.map(parseLine)

let execution = [1]

instructions.forEach(i => {
    let lastValue = execution[execution.length - 1]
    if (i.op == "noop") {
        execution.push(lastValue)
    } else if (i.op == "addx") {
        execution.push(lastValue)
        execution.push(lastValue + i.arg)
    }
})

let indexes = [20, 60, 100, 140, 180, 220]

console.log(
    indexes.map(v => execution[v - 1] * v).reduce((p, c) => p + c)
)

let display = new Array(6)
for (let i = 0; i < display.length; i++) {
    display[i] = new Array(40).fill('.')
}

function showDisplay(display) {
    console.log(display.map(l => l.join('')).join('\n'))
}

execution.forEach((v, i) => {
    let x = i % 40
    let y = Math.floor(i / 40)
    if (y < 6) {
        let spritePosition = [v - 1, v, v + 1]
        if (spritePosition.includes(x)) display[y][x] = "#"
    }
})

showDisplay(display)
