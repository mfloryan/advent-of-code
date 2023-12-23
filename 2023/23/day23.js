const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

const slopes = {
    '>': { x: 1, y: 0 },
    'v': { x: 0, y: 1 },
    '^': { x: 0, y: -1 },
    '<': { x: -1, y: 0 },
}

const directions = Object.values(slopes)

const apply = (p1, p2) => { return { x: p1.x + p2.x, y: p1.y + p2.y } }

function findNext(island, position) {
    if (Object.keys(slopes).includes(position.c)) {
        let next = apply(position, slopes[position.c])
        return [island[next.y][next.x]]
    }

    return directions
        .map(d => apply(d, position))
        .filter(_ => _.x >= 0 && _.y >= 0 && _.x < island[0].length && _.y < island.length)
        .filter(_ => island[_.y][_.x].c != '#')
        .map(_ => island[_.y][_.x])
}

function icyWalk(island, position, end, visited = [], paths = []) {
    if (position.x == end.x && position.y == end.y) {
        paths.push(visited.length)
        return
    }

    // visited.push(position)
    let next = findNext(island, position).filter(p => !visited.some(v => v.x == p.x && v.y == p.y))
    for (const n of next) {
        icyWalk(island, n, end, [...visited, position], paths)
    }
}

let island = input.split('\n').map((r, y) => r.split('').map((_, x) => { return { x, y, c: _ } }))
let flatIsland = island.flatMap(_ => _)

let start = flatIsland.find(_ => _.y == 0 && _.c == '.')
let end = flatIsland.find(_ => _.y == island.length - 1 && _.c == '.')

console.log(start, end)

let paths = []
icyWalk(island, start, end, [], paths)

console.log(paths)
console.log(paths.reduce((p,c) => Math.max(p,c), -Infinity))