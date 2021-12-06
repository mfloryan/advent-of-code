const { loadLines, loadNumbers } = require('../input')
let lines = loadLines('06/input.txt')
// lines = [`3,4,3,1,2`]

let fish = lines[0].split(',').map(n => Number.parseInt(n))
let fishStats = fish.reduce( (p,c) => { p[c]++; return p }, new Array(9).fill(0))

for (let i = 0; i < 256; i++) {
    let zero = fishStats.shift()
    fishStats[6] += zero
    fishStats.push(zero)
    if (i == 79) console.log("Day 06 - part 1:", fishStats.reduce((p,c) => p+c, 0))
}

console.log("Day 06 - part 2:", fishStats.reduce((p,c) => p+c, 0))
