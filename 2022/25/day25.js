const { loadLines } = require('../input')

let lines = loadLines('25/input.txt')

const snafuDigits = ['=', '-', '0', '1', '2']
const snafuValues = [-2, -1, 0, 1, 2]

// lines = `1=-0-2
// 12111
// 2=0=
// 21
// 2=01
// 111
// 20012
// 112
// 1=-1=
// 1-12
// 12
// 1=
// 122`.split('\n')

function snafuToDec(number) {
    let result = 0
    let power = 0
    let digits = number.split('')
    while (digits.length > 0) {
        let digit = digits.pop()
        result += Math.pow(5, power) * snafuValues[snafuDigits.indexOf(digit)]
        power++
    }
    return result
}

function decToSnafu(number) {
    let n = number
    let d = []
    do {
        let r = (n + 2) % 5
        d.unshift(snafuDigits[r])
        n -= (snafuValues[r])
        n = n / 5
    } while (n > 0)
    return d.join('')
}

let decValue = lines.map(snafuToDec).reduce((p, c) => p + c)
console.log(decToSnafu(decValue))
