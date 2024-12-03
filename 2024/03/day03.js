const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })


function findInstructions(line) {
    const expr = /mul\(([0-9]+),([0-9]+)\)/g
    const matches = [...line.matchAll(expr)]
    return matches.map(m => { return { c:m[0], a:parseInt(m[1]), b:parseInt(m[2])}})
}

function findInstructions2(line) {
    const expr = /mul\(([0-9]+),([0-9]+)\)|do\(\)|don\'t\(\)/g
    const matches = [...line.matchAll(expr)]
    return matches
    // return matches.map(m => { return { c:m[0], a:parseInt(m[1]), b:parseInt(m[2])}})
}


// let instructions = findInstructions('xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))')

// let instructions = findInstructions(input)
// console.log(instructions.reduce((p,c) => p + (c.a*c.b),0))

let i2 = findInstructions2('xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))')
