const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

let lines = input.split('\n')
let data = lines.map(l => l.split(' ').map(_ => parseInt(_)))

// console.log(data)

function extrapolateNextValue(history) {
    let rows = []
    rows[0] = history.slice()
    let rowIndex = 0

    while (! rows[rowIndex].every(v => v == 0)) {
        let newRow = []
        let currentRow = rows[rowIndex]
        for (let i =0; i <currentRow.length - 1; i++) {
            newRow.push(currentRow[i+1] - currentRow[i])
        }
        rows.push(newRow)
        rowIndex++;
    }

    rows[rows.length - 1].push(0)

    for (let i = rows.length - 2; i >= 0; i--) {
        rows[i].push(rows[i][rows[i].length - 1] + rows[i+1][rows[i+1].length - 1])
    }

    return rows[0][rows[0].length - 1]
}


console.log(extrapolateNextValue([10,13,16,21,30,45]))

const sum = (p,c) => p+c

let part1 = data.map(row => extrapolateNextValue(row)).reduce(sum)
console.log(part1)
