const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })
let lines = input.split('\n').map(s => s.substring(1, s.length - 1))

// lines = `
// abc
// aaa\\"aaa
// \\x27`.split('\n')

function countSizes(line) {
    let charCount = 0

    let isEscape = false
    for (let i=0; i < line.length; i++) {
        if (isEscape) {
            charCount++;
            if (line[i] == '\\') {

            } else if (line[i] == '"') {

            } else if (line[i] == 'x') {
                i+= 2
            } else {
                throw("Unexpected escape sequence: " + line[i])
            }
            isEscape = false
        } else {
            if (line[i] == '\\') {
                isEscape = true
            } else {
                charCount++;
            }
        }
    }
    return charCount
}

let stringCode = lines.reduce((p,c) => p+2+c.length,0)
let memoryCharacters = lines.reduce((p,c) => p+countSizes(c),0)
console.log(stringCode-memoryCharacters)
