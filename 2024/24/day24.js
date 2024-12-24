const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

// input = `x00: 1
// x01: 1
// x02: 1
// y00: 0
// y01: 1
// y02: 0

// x00 AND y00 -> z00
// x01 XOR y01 -> z01
// x02 OR y02 -> z02`

function parseInput(input) {
    let [data, code] = input.split('\n\n')

    let values = new Map()
    data = data.split('\n').forEach(l => {
        let [c, v] = l.split(': ')
        values.set(c, parseInt(v))
    })

    code = code.split('\n').map(l => {
        let v = l.split(' ')
        return [v[0], v[1], v[2], v[4]]
    })

    return [values, code]
}

const operations = {
    'AND': (a, b) => a & b,
    'OR': (a, b) => a | b,
    'XOR': (a, b) => a ^ b,
}

function calculateValue(wire, wires, values, depth = 0) {
    if (depth > 60) throw "There is a loop in the graph"
    let prev = wires.find(v => v[3] == wire)

    let setup = { l: prev[0], r: prev[2], g: prev[1] }

    if (!setup.l.startsWith('x') && !setup.l.startsWith('y')) {
        setup.l = calculateValue(setup.l, wires, values, depth++)
    } else {
        setup.l = values.get(setup.l)
    }

    if (!setup.r.startsWith('x') && !setup.r.startsWith('y')) {
        setup.r = calculateValue(setup.r, wires, values, depth++)
    } else {
        setup.r = values.get(setup.r)
    }

    return operations[setup.g](setup.l, setup.r)
}

function printFunction(wire, wires, depth = 0) {
    if (depth > 2) return '...'
    let connection = wires.find(v => v[3] == wire)

    let setup = { l: connection[0], r: connection[2], g: connection[1] }

    let ret = `${wire} = `

    let left
    if (!setup.l.startsWith('x') && !setup.l.startsWith('y')) {
        left = '(' + printFunction(setup.l, wires, depth + 1) + ')'
    } else {
        left = setup.l
    }

    let right
    if (!setup.r.startsWith('x') && !setup.r.startsWith('y')) {
        right = '(' + printFunction(setup.r, wires, depth + 1) + ')'
    } else {
        right = setup.r
    }

    if (left.length > right.length) {
        ret += `${right} ${setup.g} ${left}`
    } else {
        ret += `${left} ${setup.g} ${right}`
    }

    return ret
}

function getFullOutput(code, outputBits, values) {
    return outputBits.map(o => calculateValue(o, code, values))
}

function printDot(wires) {
    console.log('digraph {')
    for (const w of wires) {
        let color = w[1] == 'AND'?'green4':w[1]=='OR'?'purple':'black'
        console.log(` ${w[0]} -> ${w[3]} [color=\"${color}\"];`)
        console.log(` ${w[2]} -> ${w[3]} [color=\"${color}\"];`)
        console.log(`${w[3]} [color=\"${color}\",fontcolor=\"${color}\"]`)
    }
    for (const o of wires.filter(w => w[3].startsWith('z')).map(w => w[3])) {
        console.log(`${o} [style=filled,color=darkolivegreen1]`)
    }
    let inputs = [...new Set(wires.flatMap(w => [w[0], w[2]]))].filter(v => v.startsWith('x') || v.startsWith('y'))
    for (const i of inputs) {
        console.log(`${i} [style=filled,color=khaki1]`)
    }
    console.log('}')

}

function populateValues(x, y) {
    let values = new Map()
    for (let i = 0; i < x.length; i++) {
        values.set('x' + i.toString().padStart('2', '0'), parseInt(x[i]))
    }
    for (let i = 0; i < y.length; i++) {
        values.set('y' + i.toString().padStart('2', '0'), parseInt(y[i]))
    }
    return values
}

function testEveryBit(code, outputBits) {
    let correctBits = []
    for (let b = 0; b < 45; b++) {
        let x = '0'.repeat(44 - b) + '1' + '0'.repeat(b)
        let y = '0'.repeat(44 - b) + '1' + '0'.repeat(b)

        let v = populateValues(x, y)
        let z = getFullOutput(code, outputBits, v).join('')

        if (z.split('').toReversed()[b] == '1') {
            correctBits.push(b)
        }

    }
    return correctBits
}


let [data, code] = parseInput(input)
const outputBits = code.map(c => c[3]).filter(v => v.startsWith('z')).sort()

// node day24.js | dot -Tpng >day24.png
// printDot(code)
// return

let valueCodes = getFullOutput(code, outputBits, data)
console.log(parseInt(valueCodes.toReversed().join(''), 2))

console.log(
    outputBits.map(b => printFunction(b, code)).join('\n')
)

let swap = [
    ["z14", "vss"],
    ["kdh", "hjf"],
    ["z31", "kpp"],
    ["z35", "sgj"],
]

for (const sw of swap) {
    let s1 = code.find(v => v[3] == sw[0])
    let s2 = code.find(v => v[3] == sw[1])
    s1[3] = sw[1]
    s2[3] = sw[0]
}

console.log("")
console.log("AFTER THE FIX")

console.log(
    outputBits.map(b => printFunction(b, code)).join('\n')
)


console.log(testEveryBit(code, outputBits).length == 45)

console.log(swap.flat().sort().join(','))
return
