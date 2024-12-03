const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })


function findInstructions(line) {
    const expr = /mul\(([0-9]+),([0-9]+)\)/g
    const matches = [...line.matchAll(expr)]
    return matches.map(m => { return { c: m[0], a: parseInt(m[1]), b: parseInt(m[2]) } })
}

function findInstructions2(line) {
    const expr = /mul\(([0-9]+),([0-9]+)\)|do\(\)|don\'t\(\)/g
    const matches = [...line.matchAll(expr)]
    return matches.map(m => { return { c: m[0], a: parseInt(m[1]), b: parseInt(m[2]) } })
}

function execute(instructions) {
    let result = 0
    let enabled = true
    for (const i of instructions) {
        if (i.c.startsWith('mul') && enabled) {
            result += (i.a * i.b)
        }
        if (i.c == "do()") {
            enabled = true
        }
        if (i.c == "don't()") {
            enabled = false
        }
    }
    return result
}

let instructions = findInstructions(input)
console.log(execute(instructions))

let i2 = findInstructions2(input)
console.log(execute(i2))
