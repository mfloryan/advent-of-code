const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function parseMapIntoList(input) {
    return input
        .split('\n')
        .flatMap(
            (l, row) => l.split('')
            .map((c, col) => { return { c: c, x: col, y: row } }))
}

function getBounds(map) {
    return map.reduce((p, c) => { 
        return { x: Math.max(p.x, c.x), y: Math.max(p.y, c.y) } },
        { x: 0, y: 0 })
}

function checkBounds(p, bounds) {
    return p.x >= 0 && p.y >= 0 && p.x <= bounds.x && p.y <= bounds.y
}

function sameNode(a, b) {
    return a.x == b.x && a.y == b.y
}

function calculatePairAntinodes(a, b, bounds, minDist = 2, maxDist = 2) {
    let dx = a.x - b.x
    let dy = a.y - b.y

    let as = []
    for (let m = minDist; m < maxDist + 1; m++) {
        as.push({ x: a.x - m * dx, y: a.y - m * dy })
        as.push({ x: b.x + m * dx, y: b.y + m * dy })
    }
    let ret = as.filter(a => checkBounds(a, bounds))
    return ret
}

function getAntiNodes(groups, bounds, minDist = 2, maxDist = 2) {
    let antinodes = []
    for (const freq of Object.keys(groups)) {
        let group = groups[freq]
        for (let i = 0; i < group.length; i++) {
            for (let j = i + 1; j < group.length; j++) {
                let a = calculatePairAntinodes(group[i], group[j], bounds, minDist, maxDist)
                for (const node of a) {
                    if (!antinodes.some(n => sameNode(node, n))) {
                        antinodes.push(node)
                    }
                }
            }
        }
    }
    return antinodes
}

let map = parseMapIntoList(input)
let freq = map.filter(m => m.c != '.')
let freqGroups = Object.groupBy(freq, v => v.c)

let bounds = getBounds(map)
console.log(getAntiNodes(freqGroups, bounds).length)
console.log(getAntiNodes(freqGroups, bounds, 1, bounds.x).length)
