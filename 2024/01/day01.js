const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

numbers = input.split("\n").map(l => l.split("  ").map(v => parseInt(v)))

let list1 = numbers.map(n => n[0]).toSorted((a, b) => a - b)
let list2 = numbers.map(n => n[1]).toSorted((a, b) => a - b)

let diff = 0;

for (let i = 0; i < list1.length; i++) {
    diff += Math.abs(list1[i] - list2[i])
}

console.log(diff)

let similarity = 0;

for (let i = 0; i < list1.length; i++) {
    similarity += (list1[i] * list2.filter(n => n == list1[i]).length)
}

console.log(similarity)
