const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

numbers = input.split("\n").map(l => l.split("  ").map(v => parseInt(v)))

let list1 = numbers.map(n => n[0]).toSorted((a, b) => a - b)
let list2 = numbers.map(n => n[1]).toSorted((a, b) => a - b)

let diff = list1.reduce((p, c, i) => p + Math.abs(c - list2[i]), 0);

console.log(diff)

let similarity = list1.reduce((p, c, i) => p + (c * list2.filter(n => n == c).length), 0);

console.log(similarity)
