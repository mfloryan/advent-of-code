const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

// input = `r, wr, b, g, bwu, rb, gb, br

// brwrr
// bggr
// gbbr
// rrbgbr
// ubwu
// bwurrg
// brgr
// bbrgwb`

let [a, b] = input.split('\n\n')

let towels = a.split(', ')
let designs = b.split('\n')

function isArrangementPossible(design, towels) {
    if (design == '') return true

    let options = towels.filter(t => design.startsWith(t))

    for (const option of options) {
        if (isArrangementPossible(
            design.substring(option.length),
            towels)) return true
    }
    return false
}

function countPossibleTowelArrangements(design, towels, memory = new Map()) {
    if (design == '') return 1
    if (memory.has(design)) return memory.get(design)

    let options = towels.filter(t => design.startsWith(t))
    if (options.length == 0) return 0

    let sum = options
        .map(o => countPossibleTowelArrangements(design.substring(o.length), towels, memory))
        .reduce((p, c) => p + c)

    memory.set(design, sum)
    return sum
}

console.log(
    designs.filter(d => isArrangementPossible(d, towels)).length
)

console.log(
    designs.map(d => countPossibleTowelArrangements(d, towels)).reduce((p, c) => p + c)
)
