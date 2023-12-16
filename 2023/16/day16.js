const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

const directions = {
    'E': { x: 1, y: 0 },
    'S': { x: 0, y: 1 },
    'N': { x: 0, y: -1 },
    'W': { x: -1, y: 0 }
}

const mirrorA = {
    'E': 'N',
    'S': 'W',
    'N': 'E',
    'W': 'S'
}

const mirrorB = {
    'E': 'S',
    'S': 'E',
    'N': 'W',
    'W': 'N'
}

const apply = (p1, p2) => { return { x: p1.x + p2.x, y: p1.y + p2.y } }

const tiles = {
    '.': dir => [dir],
    '/': dir => [mirrorA[dir]],
    '\\': dir => [mirrorB[dir]],
    '-': dir => {
        if (dir == 'E' || dir == 'W') [dir]
        return ['E', 'W']
    },
    '|': dir => {
        if (dir == 'S' || dir == 'N') return [dir]
        return ['S', 'N']
    }
}

function energise(map, pos, direction, history = []) {
    if (pos.x < 0 || pos.y < 0 || pos.x > map[0].length - 1 || pos.y > map.length - 1) return
    if (history.find(p => p.x == pos.x && p.y == pos.y && p.d == direction)) return
    map[pos.y][pos.x].v = '#'
    history.push({ x: pos.x, y: pos.y, d: direction })
    let tile = map[pos.y][pos.x].c
    let dirs = tiles[tile](direction)
    for (d of dirs) {
        energise(map, apply(pos, directions[d]), d, history)
    }
}

function countEnergyTiles(map) {
    let count = 0
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            if (map[y][x].v) count++
        }
    }
    return count
}

// input=`.|...\\....
// |.-.\\.....
// .....|-...
// ........|.
// ..........
// .........\\
// ..../.\\\\..
// .-.-/..|..
// .|....-|.\\
// ..//.|....`

let map = input.split('\n').map(r => r.split('').map(_ => { return { c: _ } }))

energise(map, { x: 0, y: 0 }, 'E')
console.log(countEnergyTiles(map))

let max = 0

for (let x = 0; x < map[0].length - 1; x++) {
    for (let s of [{ y: 0, d: 'S' }, { y: map.length - 1, d: 'N' }]) {
        let m = input.split('\n').map(r => r.split('').map(_ => { return { c: _ } }))
        energise(m, { x, y: s.y }, s.d)
        max = Math.max(max, countEnergyTiles(m))
    }
}

for (let y = 0; y < map.length; y++) {
    for (let s of [{ x: 0, d: 'E' }, { x: map[0].length - 1, d: 'W' }]) {
        let m = input.split('\n').map(r => r.split('').map(_ => { return { c: _ } }))
        energise(m, { x: s.x, y }, s.d)
        max = Math.max(max, countEnergyTiles(m))
    }
}

console.log(max)
