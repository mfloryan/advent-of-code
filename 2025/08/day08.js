const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function distance(p1, p2) {

    return Math.sqrt(
        Math.pow(p1[0] - p2[0], 2) +
        Math.pow(p1[1] - p2[1], 2) +
        Math.pow(p1[2] - p2[2], 2)
    )
}

let data = input.split('\n').map(r => r.split(',').map(v => Number.parseInt(v)))
let connections = new Set()
let circuits = []

let p = 0

while (true) {
    p++
    let minPair = { i: 0, j: 0, distance: Infinity }

    for (let i = 0; i < data.length; i++) {
        for (let j = i + 1; j < data.length; j++) {
            if (connections.has(`${i}-${j}`)) continue
            if (distance(data[i], data[j]) < minPair.distance) {
                minPair.i = i
                minPair.j = j
                minPair.distance = distance(data[i], data[j])
            }
        }
    }
    connections.add(`${minPair.i}-${minPair.j}`)

    let existingCircuit = circuits.filter(c => c.has(minPair.i) || c.has(minPair.j))
    if (existingCircuit.length == 2) {
        circuits.splice(circuits.indexOf(existingCircuit[0]), 1)
        circuits.splice(circuits.indexOf(existingCircuit[1]), 1)
        joinedCircuit = new Set([...existingCircuit[0], ...existingCircuit[1]])
        circuits.push(joinedCircuit)
    } else if (existingCircuit.length == 1) {
        existingCircuit[0].add(minPair.i)
        existingCircuit[0].add(minPair.j)
    } else {
        circuits.push(new Set([minPair.i, minPair.j]))
    }

    if (p == 1000) {
        console.log(circuits.map(c => c.size).toSorted((a, b) => b - a).slice(0, 3).reduce((p, c) => p * c))
    }

    if (circuits.length == 1 && circuits[0].size == data.length) {
        console.log("All connected", p)
        console.log(data[minPair.i][0], data[minPair.j][0], data[minPair.i][0] * data[minPair.j][0])
        break;
    }
}
