const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })


function findMaxVoltage(bank) {
    let firstMax = 0
    let firstPos = 0
    for (let i = 0; i < bank.length - 1; i++) {
        if (bank[i] > firstMax) {
            firstMax = bank[i]
            firstPos = i
        }
    }

    let second = 0
    for (let i = firstPos + 1; i < bank.length; i++) {
        if (bank[i] > second) second = bank[i]
    }

    return firstMax * 10 + second
}

function findMaxJoltedVoltage(bank) {
    let selected = []
    let pos = -1
    for (let j = 11; j >= 0; j--) {
        // console.log(j, pos)
        let max = 0

        for (let i = pos + 1; i < bank.length - j; i++) {
            // console.log("  ",i, bank[i])
            if (bank[i] > max) {
                max = bank[i]
                pos = i
            }
        }
        selected.push(max)
    }
    return parseInt(selected.join(''))
}

let banks = input.split('\n').map(l => l.split('').map(v => parseInt(v)))
console.log(banks.map(b => findMaxVoltage(b)).reduce((p, c) => p + c, 0))
console.log(banks.map(b => findMaxJoltedVoltage(b)).reduce((p, c) => p + c, 0))
