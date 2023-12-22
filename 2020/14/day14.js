const { loadLines } = require('../input')

function parse(line) {
    if (line.startsWith("mask")) {
        return {
            mask: line.substring(7)
        }
    } else {
        [mem, value] = line.split(" = ")
        return {
            index: Number(mem.substring(4, mem.length - 1)),
            value: Number(value)
        }
    }
}

function applyMask(mask, value) {
    let binary = value.toString(2).padStart(36,0)
    let masked = binary.split('').map((c,i) => mask[i] == 'X'?c:mask[i]).join('')
    return Number.parseInt(masked, 2)
}

function process(program) {
    let mem = {}
    let mask = "X".repeat(36)

    for (const instruction of program) {
        if (instruction.mask) {
            mask = instruction.mask
        }

        if (instruction.index) {
            mem[instruction.index] = applyMask(mask, instruction.value)
        }

    }
    return mem
}
let input = loadLines(__dirname)
let data = input.map(parse)

let result = process(data)
console.log(Object.values(result).reduce((p,c) => p+c))
