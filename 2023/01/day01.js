const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

// input=`1abc2
// pqr3stu8vwx
// a1b2c3d4e5f
// treb7uchet`

// input = `two1nine
// eightwothree
// abcone2threexyz
// xtwone3four
// 4nineeightseven2
// zoneight234
// 7pqrstsixteen`

const digitsAsWords = {
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9
}
const words = Object.keys(digitsAsWords)

let lines = input.split('\n')

function calibrationValue(lines, decodeWords = false) {
    let total = 0
    lines.forEach(l => {

        let alldigits = []

        if (decodeWords) {
            let firstWord = words.map(w => [w, l.indexOf(w)]).filter(_ => _[1] > -1).reduce((p, c) => p[1] > c[1] ? [c[0], c[1]] : [p[0], p[1]], ['', Infinity])
            let lastWord = words.map(w => [w, l.lastIndexOf(w)]).filter(_ => _[1] > -1).reduce((p, c) => p[1] < c[1] ? [c[0], c[1]] : [p[0], p[1]], ['', -Infinity])

            if (firstWord[0] != '') alldigits.push([digitsAsWords[firstWord[0]], firstWord[1]])
            if (lastWord[0] != '') alldigits.push([digitsAsWords[lastWord[0]], lastWord[1]])
        }

        let chars = l.split('')
        let digits = chars.map((c, i) => [parseInt(c), i]).filter(c => !isNaN(c[0]))
        alldigits.push(...digits)
        alldigits.sort((a, b) => a[1] - b[1])
        let sum = alldigits[0][0] * 10 + alldigits[alldigits.length - 1][0]
        total += sum
    })
    return total
}

console.log(calibrationValue(lines, false))
console.log(calibrationValue(lines, true))
