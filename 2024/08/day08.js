const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

let map = input.split('\n').flatMap((l, row) => l.split('').flatMap((c, col) => { return { c: c, x: col, y: row } }))
let map2 = input.split('\n').map(l => l.split(''))

let freq = map.filter(m => m.c != '.')
let freqGroups = Object.groupBy(freq, v => v.c)

function distance(a,b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

function checkBounds(p, bounds) {
    return p.x >= 0 && p.y >= 0 && p.x <= bounds.x && p.y <= bounds.y
}

function calculatePairAntinodes(a,b, bounds) {
    let dx = a.x - b.x
    let dy = a.y - b.y
    let a1 = {x: a.x - 2*dx, y: a.y - 2*dy}
    let a2 = {x: b.x + 2* dx, y: b.y + 2*dy}
    let ret = []
    if (checkBounds(a1, bounds)) ret.push(a1)
    if (checkBounds(a2, bounds)) ret.push(a2)
    return ret
}

function getAntiNodes(groups, bounds) {
    let antinodes = []
    for (const freq of Object.keys(groups)) {
        let group = groups[freq]
        for (let i = 0; i < group.length; i++) {
            for (let j = i+1; j < group.length; j++) {
                let a = calculatePairAntinodes(group[i], group[j], bounds)
                for (const node of a) {
                    if (!antinodes.some(n => n.x == node.x && n.y == node.y)) {
                        antinodes.push(node)
                    }
                }
            }
        }
    }
    return antinodes
}

function parseGroups(groups, bounds) {
    return getAntiNodes(groups, bounds)
}

let bounds = map.reduce((p,c) => {return {x:Math.max(p.x, c.x), y: Math.max(p.y, c.y)}}, {x:0, y:0})
console.log(parseGroups(freqGroups, bounds).length)
