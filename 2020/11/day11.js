const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

let map = input.split('\n').map(l => l.split(''))

function getSurrounding(map, position) {

}

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

function isAround(point, neighbour) {
    aroundMe.map(a => { return {x:a.x + point.x, y: a.y + point.y}})
    return aroundMe.some(x => samePoint(x, neighbour))
}

function getTransformedSeat(map, point) {
    if (point.c == '.') return point;
    let surroundings = map.filter(p => isAround(point,p))
}

function updateMap(map) {
    let newMap = []

    map.forEach(p => {
        newMap.push(getTrasformedSeat(map, p))
    });
    return newMap;
}

console.log(parseMap(map))