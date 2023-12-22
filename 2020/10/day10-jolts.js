const { loadLines } = require('../input')

let lines = loadLines(__dirname)

let adapters = lines.map(Number)

adapters.sort((a,b) => a - b)
adapters.unshift(0)
adapters.push(adapters[adapters.length-1]+3)

let steps = []
adapters.reduce((p,c) => {
    steps.push(c-p)
    return c
})

console.log(
    steps.filter(s => s == 1).length *
    steps.filter(s => s == 3).length
)
