const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })


function findMaxJoltedVoltage(bank, len) {
    let selected = []
    let pos = -1
    for (let j = len; j > 0; j--) {
        let max = 0

        for (let i = pos + 1; i < bank.length - (j - 1); i++) {
            if (bank[i] > max) {
                max = bank[i]
                pos = i
            }
        }
        selected.push(max)
    }
    return parseInt(selected.join(''))
}

let banks = input.split('\n').map(l => l.split('').map(v => Number.parseInt(v)))
console.log(banks.map(b => findMaxJoltedVoltage(b, 2)).reduce((p, c) => p + c, 0))
console.log(banks.map(b => findMaxJoltedVoltage(b, 12)).reduce((p, c) => p + c, 0))
