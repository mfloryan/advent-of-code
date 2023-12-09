const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

let lines = input.split('\n')
let data = lines.map(l => l.split(' ').map(_ => parseInt(_)))

function extrapolate(row) {
    nextRow = []
    row.reduce((p, c) => { nextRow.push(c - p); return c })
    if (nextRow.some(_ => _ != 0)) {
        [first, last] = extrapolate(nextRow)
        return [row[0] - first, row[row.length - 1] + last]
    } else {
        return [row[0], row[row.length - 1]]
    }
}

const sumPairs = (p, c) => [p[0] + c[0], p[1] + c[1]]

let answers = data.map(extrapolate).reduce(sumPairs, [0, 0])
console.log(answers[1])
console.log(answers[0])
