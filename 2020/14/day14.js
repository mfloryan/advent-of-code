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

function applyMask2(mask, value) {
    let addressess = []
    let binary = value.toString(2).padStart(36,0)
    let masked = binary.split('').map((c,i) => {
        if (mask[i] == '0') return c
        else if (mask[i] == '1') return 1
        else return mask[i]
    })

    createOptions(masked, [], addressess)

    return addressess.map(_ => Number.parseInt(_, 2))
}

function createOptions(mask, value, options = []) {
    if (value.length == mask.length) {
        options.push(value.join(''))
        return
    }
    if (mask[value.length] == 'X') {
        createOptions(mask, [...value, '0'], options)
        createOptions(mask, [...value, '1'], options)
    } else {
        createOptions(mask, [...value, mask[value.length]], options)
    }
}

function process2(program) {
    let mem = {}
    let mask = "X".repeat(36)

    for (const instruction of program) {
        if (instruction.mask) {
            mask = instruction.mask
        }

        if (instruction.index) {
            let addressess = applyMask2(mask, instruction.index)

            for (const adr of addressess) {
                mem[adr] = instruction.value
            }
        }

    }
    return mem
}

let input = loadLines(__dirname)
let data = input.map(parse)

console.log(Object.values(process(data)).reduce((p,c) => p+c))
console.log(Object.values(process2(data)).reduce((p,c) => p+c))
