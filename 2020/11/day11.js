const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

let map = input.split('\n').map(l => l.split(''))

// map = `L.LL.LL.LL
// LLLLLLL.LL
// L.L.L..L..
// LLLL.LL.LL
// L.LL.LL.LL
// L.LLLLL.LL
// ..L.L.....
// LLLLLLLLLL
// L.LLLLLL.L
// L.LLLLL.LL`.split('\n').map(l => l.split(''))

function parseMap(map) {
    let parsedMap = []
    for (let y = 0; y < map.length; y++) {
        let row = map[y]
        for (let x = 0; x < row.length; x++) {
            parsedMap.push({x,y,c:row[x]})
        }
    }
    return parsedMap
}

const aroundMe = [
    {x: -1, y: -1},
    {x: -1, y:  0},
    {x: -1, y:  1},
    {x:  0, y: -1},
    {x:  0, y:  1},
    {x:  1, y: -1},
    {x:  1, y:  0},
    {x:  1, y:  1},
]

function samePoint(a,b) {
    return a.x == b.x && a.y == b.y
}

function printMap(map) {
    let maxX = map.reduce((p,c) => Math.max(p,c.x),0)
    let maxY = map.reduce((p,c) => Math.max(p,c.y),0)
    for (let y = 0; y <= maxY; y++) {
        let row = []
        for (let x = 0; x <= maxX; x++) {
            row.push(map.find(p => p.x == x && p.y == y).c)
        }
        console.log(row.join(''))
    }
}

function isAround(point, neighbour) {
    aroundMe.map(a => { return {x:a.x + point.x, y: a.y + point.y}})
    return aroundMe.some(x => samePoint(x, neighbour))
}

function getSurrounding(map, position) {
    let potentialAround = aroundMe.map(a => { return {x:a.x + position.x, y: a.y + position.y}})
    return map.filter(p => potentialAround.some(a => samePoint(p,a)))
}

function getTransformedSeat(map, point) {
    if (point.c == '.') return point;

    let surroundings = getSurrounding(map, point)

    if (point.c == "L") {
        if (surroundings.every(p => p.c != "#"))
            return {x:point.x, y: point.y, c:"#"}
        else
            return point
    } else if (point.c == "#") {
        if (surroundings.filter(p => p.c == "#").length >= 4) {
            return {x:point.x, y:point.y, c:"L"}
        } else {
            return point
        }
    }
}

function updateMap(map) {
    let newMap = []

    let changes = 0
    map.forEach(p => {
        let ts = getTransformedSeat(map, p)
        newMap.push(ts)
        if (p.c != ts.c) changes++
    });
    return [newMap, changes];
}

let parsedMap = parseMap(map)

let changes = 0
do {
    let ur = updateMap(parsedMap)
    parsedMap = ur[0]
    changes = ur[1]
    console.log(changes)
} while (changes > 0)

printMap(parsedMap)
console.log(parsedMap.filter(p => p.c == "#").length)
