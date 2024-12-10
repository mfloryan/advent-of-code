const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function parseMapIntoList(input) {
    return input
        .split('\n')
        .flatMap(
            (l, row) => l.split('')
                .map((h, col) => { return { h: parseInt(h), x: col, y: row } }))
}

const directions = {
    'E': { x: 1, y: 0 },
    'S': { x: 0, y: 1 },
    'N': { x: 0, y: -1 },
    'W': { x: -1, y: 0 }
}

function getBounds(map) {
    return map.reduce((p, c) => {
        return { x: Math.max(p.x, c.x), y: Math.max(p.y, c.y) }
    },
        { x: 0, y: 0 })
}

function checkBounds(p, bounds) {
    return p.x >= 0 && p.y >= 0 && p.x <= bounds.x && p.y <= bounds.y
}

function addPoints(a, b) {
    return { x: a.x + b.x, y: a.y + b.y }
}

function getScore(start, map, bounds) {
    let score = []
    findPath(start, map, bounds, false, [], score)
    return score.length
}

function getRating(start, map, bounds) {
    let rating = []
    findPath(start, map, bounds, true, [], rating)
    return rating.length
}

function findPath(start, map, bounds, allTrails = false, visited = [], paths = []) {
    visited.push(`${start.x}:${start.y}`)
    if (map[start.y][start.x] == 9) {
        paths.push(start)
        return
    }

    let nextSteps = Object.values(directions)
        .map(d => addPoints(d, start))
        .filter(p => checkBounds(p, bounds))
        .filter(p => !visited.includes(`${p.x}:${p.y}`))
        .filter(p => map[p.y][p.x] == map[start.y][start.x] + 1)

    for (const next of nextSteps) {
        if (allTrails)
            findPath(next, map, bounds, allTrails, visited.slice(), paths)
        else
            findPath(next, map, bounds, allTrails, visited, paths)
    }
}

let map = parseMapIntoList(input)
let trail = input.split('\n').map(l => l.split('').map(v => parseInt(v)))

let bounds = getBounds(map)
let lowPoints = map.filter(p => p.h == 0)

console.log(lowPoints.map(p => getScore(p, trail, bounds)).reduce((p, c) => p + c))
console.log(lowPoints.map(p => getRating(p, trail, bounds)).reduce((p, c) => p + c))
