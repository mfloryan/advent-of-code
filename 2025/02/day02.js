const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })


function partOneValidator(i) {
    let s = i.toString()
    if (s.length % 2 == 0) {
        if (s.substring(0, s.length / 2) == s.substring(s.length / 2)) {
            return true
        }
    }
    return false
}

function getParts(string, len) {
    let a = string.split('')
    let p = []
    while (a.length > 0) {
        p.push(a.splice(0, len).join(""))
    }
    return p
}

function partTwoValidator(i) {
    let s = i.toString()
        for (let j = Math.floor(s.length / 2); j > 0; j--) {
            if (s.length % j == 0) {
                let parts = getParts(s, j)
                if (parts.every(v => v == parts[0])) {
                    return true;
                }
            }
        }
    return false
}

function invalidIds(start, end, isIdInvalid) {
    let invalidSum = 0
    for (let i = start; i <= end; i++) {
        if (isIdInvalid(i)) invalidSum += i
    }
    return invalidSum
}


let data = input.split(",").map(p => p.split('-').map(v => parseInt(v)))

console.log(
    data.map(v => invalidIds(v[0], v[1], partOneValidator)).reduce((p, c) => p + c, 0)
)

console.log(
    data.map(v => invalidIds(v[0], v[1], partTwoValidator)).reduce((p, c) => p + c, 0)
)
