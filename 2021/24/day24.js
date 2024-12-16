const { loadLines } = require('../input')
let input = loadLines('24/input.txt')

const instructions = {
    'inp': (cpu, a) => cpu.var[a] = cpu.input.shift(),
    'add': (cpu, a, b) => cpu.var[a] = cpu.var[a] + cpu.var[b],
    'addv': (cpu, a, b) => cpu.var[a] = cpu.var[a] + b,
    'mul': (cpu, a, b) => cpu.var[a] = cpu.var[a] * cpu.var[b],
    'mulv': (cpu, a, b) => cpu.var[a] = cpu.var[a] * b,
    'div': (cpu, a, b) => cpu.var[a] = Math.floor(cpu.var[a] / cpu.var[b]),
    'divv': (cpu, a, b) => cpu.var[a] = Math.floor(cpu.var[a] / b),
    'mod': (cpu, a, b) => cpu.var[a] = cpu.var[a] % cpu.var[b],
    'modv': (cpu, a, b) => cpu.var[a] = cpu.var[a] % b,
    'eql': (cpu, a, b) => cpu.var[a] = cpu.var[a] == cpu.var[b] ? 1 : 0,
    'eqlv': (cpu, a, b) => cpu.var[a] = cpu.var[a] == b ? 1 : 0,
}

function parseCode(line) {
    let ops = line.split(' ')
    let instruction = ops.shift()
    if (ops.length == 1) {
        return (cpu) => instructions[instruction](cpu, ops[0])
    } else {
        let value = parseInt(ops[1])
        if (isNaN(value)) {
            return (cpu) => instructions[instruction](cpu, ops[0], ops[1])
        } else {
            return (cpu) => instructions[instruction+'v'](cpu, ops[0], value)
        }
    }
}

function runCode(code, input) {
    let cpu = {
        var: {
            w: 0,
            x: 0,
            y: 0,
            z: 0
        },
        input: [...input]
    }

    for (op of code) {
        op(cpu)
    }

    return cpu
}

let code = input.map(l => parseCode(l))

console.log(
    runCode(code, [7,1,1,3,1,1,5,1,9,1,7,8,9,1]).var.z
)

console.log(
    runCode(code, [9,1,2,9,7,3,9,5,9,1,9,9,9,3]).var.z
)
