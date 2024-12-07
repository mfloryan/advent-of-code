const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

let data = input.split('\n').map(l => {
    [a, b] = l.split(': ')
    return {
        l: parseInt(a),
        r: b.split(' ').map(v => parseInt(v))
    }
}
)

function generateOperations(number, current = [], iteration = 0, options = []) {
    if (iteration == number) {
        options.push(current)
        return
    }

    generateOperations(number, [...current, '*'], iteration + 1, options)
    generateOperations(number, [...current, '+'], iteration + 1, options)
}

function canItemWork(item) {
    let options = []
    generateOperations(item.r.length - 1, [], 0, options)

    for (const option of options) {
        let result = item.r[0]
        let i = 0
        for (const op of option) {
            i++
            if (op == '+') {
                result += item.r[i]
            }
            if (op == '*') {
                result *= item.r[i]
            }
        }
        if (result == item.l) return true
    }
    return false
}

let possible = data.filter(i => canItemWork(i))
console.log(possible.reduce((p, c) => p + c.l, 0))
