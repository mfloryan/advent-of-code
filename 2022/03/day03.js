const { loadLines } = require('../input')

let lines = loadLines('03/input.txt')

function openRucksack(line) {
    let items = line.split('')
    let left = items.slice(0, items.length / 2)
    let right = items.slice(items.length / 2)

    return left.find(i => right.includes(i))
}

function countPriority(item) {
    if (item.charCodeAt(0) > 96) return item.charCodeAt(0) - 96
    return item.charCodeAt(0) - 64 + 26

} 
function parseLine(line) {
    let common = openRucksack(line)
    return countPriority(common)
}

console.log(lines.map(l => parseLine(l)).reduce((p,c) => p+c))

let total = 0;
for (var i = 0; i < lines.length; i+= 3) {
    let triple =  [lines[i], lines[i+1], lines[i+2]].map(l => l.split(''))
    let commonAB = triple[0].filter(a => triple[1].includes(a))
    let common = commonAB.find(a => triple[2].includes(a))
    total += countPriority(common)
}
console.log(total)
