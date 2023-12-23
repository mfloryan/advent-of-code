const fs = require('fs')
let lines = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf8' }).split('\n')

function parse(line) {
    let [dev, tower] = line.split(" -> ")
    let [name, weight] = dev.split(' ')
    let o = {
        dev: name,
        weight: Number(weight.substring(1, weight.length - 1))
    }
    if (tower) o.tower = tower.split(', ')
    return o
}

// lines = `pbga (66)
// xhth (57)
// ebii (61)
// havc (66)
// ktlj (57)
// fwft (72) -> ktlj, cntj, xhth
// qoyq (66)
// padx (45) -> pbga, havc, qoyq
// tknk (41) -> ugml, padx, fwft
// jptl (61)
// ugml (68) -> gyxo, ebii, jptl
// gyxo (61)
// cntj (57)`.split('\n')

let data = lines.map(parse)

let allTowers = data.filter(d => d.tower).map(d => d.tower).flatMap(_ => _)

let part1 = data.filter(d => !allTowers.includes(d.dev))
console.log(part1[0].dev)

let root = part1[0].dev

function getWeights(data, root, level = 0) {
    let rootTower = data.find(d => d.dev == root)
    if (!rootTower.tower) return rootTower.weight

    let w = []
    for (const next of rootTower.tower) {
        w.push([next, getWeights(data, next, level + 1)])
    }

    let m = {}
    for (const x of w) {
        if (!m[x[1]]) m[x[1]] = []
        m[x[1]].push(x[0])
    }

    if (Object.keys(m).length > 1) {
        // console.log("unbalanced", m)
        let incorrectValue = Number(Object.keys(m).find(k => m[k].length == 1))
        let otherValue = Number(Object.keys(m).find(v => Number(v) != incorrectValue))
        let incorrectWeight = data.find(d => d.dev == m[incorrectValue][0]).weight
        console.log("correct value: ", incorrectWeight + (otherValue - incorrectValue))
        // return
    }

    // let s = new Set(w.map(_ => _[1]))
    // if (s.size > 1) {
    //     let a = []
    //     s.forEach(v => a.push(v))
    //     let diff = a.reduce((p,c) => p-c)
    //     console.log("unbalanced", level, root, diff, rootTower.weight + diff)
    // }

    return w.map(_ => _[1]).reduce((p, c) => p + c) + rootTower.weight
}

console.log(getWeights(data, root))
