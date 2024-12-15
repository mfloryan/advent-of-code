const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

let reg = /([-0-9]+)/g

console.log([...input.matchAll(reg)].map(v => parseInt(v[0])).reduce((p, c) => p + c))

let o = JSON.parse(input)

function sumObject(o) {
    let sum = 0
    if (typeof o == 'number') return o
    if (typeof o == 'string') return 0

    if (Array.isArray(o)) {
        sum += o.map(v => sumObject(v)).reduce((p, c) => p + c)
    } else {
        let values = Object.values(o)
        if (!values.some(v => v == 'red')) {
            sum += values.map(v => sumObject(v)).reduce((p, c) => p + c)
        }
    }

    return sum
}

console.log(
    sumObject(o)
)
