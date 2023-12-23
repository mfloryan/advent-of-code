const fs = require('fs')
let lines = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf8' }).split('\n')

function parse(line) {
    let parts = line.split(' ')
    let o = {
        reg: parts[0],
        op: parts[1],
        value: Number(parts[2]),
        cond: {
            reg: parts[4],
            comp: parts[5],
            value: Number(parts[6])
        }
    }
    return o
}

const comps = {
    '<': (a, b) => a < b,
    '>': (a, b) => a > b,
    '<=': (a, b) => a <= b,
    '>=': (a, b) => a >= b,
    '==': (a, b) => a == b,
    '!=': (a, b) => a != b,
}

const ops = {
    'inc': (a, b) => a + b,
    'dec': (a, b) => a - b,
}

function runCode(code) {
    let registers = {}
    let registersMax = -Infinity

    for (const instruction of code) {
        if (!registers[instruction.reg]) registers[instruction.reg] = 0
        if (!registers[instruction.cond.reg]) registers[instruction.cond.reg] = 0
        if (comps[instruction.cond.comp](registers[instruction.cond.reg], instruction.cond.value)) {
            registers[instruction.reg] = ops[instruction.op](registers[instruction.reg], instruction.value)
        }
        registersMax = Math.max(registersMax, registers[instruction.reg])
    }
    return [registers, registersMax]
}


let data = lines.map(parse)
let results = runCode(data)
console.log(Object.values(results[0]).reduce((p, c) => Math.max(p, c), -Infinity))
console.log(results[1])
