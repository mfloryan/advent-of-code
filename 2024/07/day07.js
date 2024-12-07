const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

// input = `190: 10 19
// 3267: 81 40 27
// 83: 17 5
// 156: 15 6
// 7290: 6 8 6 15
// 161011: 16 10 13
// 192: 17 8 14
// 21037: 9 7 18 13
// 292: 11 6 16 20`

let data = input
    .split('\n')
    .map(l => {
        [a, b] = l.split(': ')
        return {
            l: parseInt(a),
            r: b.split(' ').map(v => parseInt(v))
        }
    }
)

function generateOperations(ops, number, options = [], current = [], iteration = 0) {
    if (iteration == number) {
        options.push(current)
        return
    }

    for (const op of ops) {
        generateOperations(ops, number, options, [...current, op], iteration + 1,)
    }
}

function canItemWork(item, ops) {
    let options = []
    generateOperations(ops, item.r.length - 1, options)

    for (const option of options) {
        let result = item.r[0]
        for (let i = 0; i < option.length; i++) {
            let op = option[i]
            let nextValue = item.r[i + 1]
            if (op == '|') {
                result = parseInt("" + result + nextValue)
            }
            if (op == '+') {
                result += nextValue
            }
            if (op == '*') {
                result *= nextValue
            }
        }
        if (result == item.l) return true
    }
    return false
}

console.log(
    data.filter(i => canItemWork(i, '+*')).reduce((p, c) => p + c.l, 0)
)

console.log(
    data.filter(i => canItemWork(i, '+*|')).reduce((p, c) => p + c.l, 0)
)
