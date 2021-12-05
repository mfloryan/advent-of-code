const { loadLines, loadNumbers } = require('../input')
let lines = loadLines('05/input.txt')

// lines = `0,9 -> 5,9
// 8,0 -> 0,8
// 9,4 -> 3,4
// 2,2 -> 2,1
// 7,0 -> 7,4
// 6,4 -> 2,0
// 0,9 -> 2,9
// 3,4 -> 1,4
// 0,0 -> 8,8
// 5,5 -> 8,2`.split('\n')

function parseLine(line) {
    let coords = line.split('->').map(i => i.split(',').map(n => Number.parseInt(n)))
    return {x1: coords[0][0], y1: coords[0][1], x2: coords[1][0], y2: coords[1][1]}
}

function createPlane(dim) {
    let plane = []
    for (let y = 0; y <= dim.y; y++) {
        plane.push(new Array(dim.x+1).fill(0))
    }
    return plane
}

function drawLine(plane, line, diagonal = false) {
    let dx = line.x2 - line.x1
    let dy = line.y2 - line.y1

    if (!diagonal && Math.abs(dx) == Math.abs(dy)) return

    for (i = 0; i <= Math.abs(dx == 0?dy:dx); i++){
        let x = line.x1 + i * Math.sign(dx)
        let y = line.y1 + i * Math.sign(dy)
        plane[y][x]++
    }
}

let data = lines.map(parseLine)
let dim = data.reduce((p,c) => { return {x: Math.max(p.x, c.x1, c.x2) , y: Math.max(p.y, c.y1, c.y2) } }, {x:0, y:0})

let plane1 = createPlane(dim)
data.forEach(line => drawLine(plane1, line))
let r1 = plane1.map(y => y.filter(p => p > 1).length).reduce((p,c) => (p+c), 0)
console.log("Day 05 - part 1:", r1)

let plane2 = createPlane(dim)
data.forEach(line => drawLine(plane2, line, true))
let r2 = plane2.map(y => y.filter(p => p > 1).length).reduce((p,c) => (p+c), 0)
console.log("Day 05 - part 2:", r2)
