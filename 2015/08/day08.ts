const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })
let lines = input.split('\n').map(s => s.substring(1, s.length - 1))

console.log(lines)

function countSizes(line) {
    
}