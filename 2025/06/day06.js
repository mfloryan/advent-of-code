const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function part1(input) {

    let rows = input.split('\n')

    let ops = rows.pop().split(/ +/)
    let values = rows.map(r => r.split(/ +/).map(v => Number.parseInt(v)))

    ops.pop()

    return ops
        .map((op, k) =>
            values
                .map(vr => vr[k])
                .reduce((p, c) => op == '+' ? p + c : p * c))
        .reduce((p, c) => p + c)
}

function part2(input) {
    let rows = input.split('\n')
    let ops = rows.pop()

    let colIds = []

    for (let c = 0; c < ops.length; c++) {
        if (ops[c] != ' ') {
            colIds.push(c)
        }
    }

    colIds.push(ops.length + 1)

    let total = BigInt(0)

    for (let i = 0; i < colIds.length - 1; i++) {
        let values = []
        for (let k = colIds[i + 1] - 2; k >= colIds[i]; k--) {
            let value = ''
            for (let r = 0; r < rows.length; r++) {
                value += rows[r][k]
            }
            values.push(Number.parseInt(value))
        }
        let op = ops[colIds[i]]
        total += BigInt(values.reduce((p, c) => op == '+' ? p + c : p * c))
    }

    return total
}

console.log(part1(input))
console.log(part2(input))
