const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

let maze = input.split('\n').map(l => l.split(''))

const pipeBends = {
    '|': [{ x: 0, y: -1 }, { x: 0, y: 1 }],
    '-': [{ x: -1, y: 0 }, { x: 1, y: 0 }],
    'L': [{ x: 0, y: -1 }, { x: 1, y: 0 }],
    'J': [{ x: -1, y: 0 }, { x: 0, y: -1 }],
    '7': [{ x: 0, y: 1 }, { x: -1, y: 0 }],
    'F': [{ x: 0, y: 1 }, { x: 1, y: 0 }],
}

const surrounding = [
    { x: 0, y: -1 },
    { x: 1, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
]

const offset = (p1, p2) => { return { x: p1.x + p2.x, y: p1.y + p2.y } }
const samePoint = (p1, p2) => p1.x == p2.x & p1.y == p2.y

function findStartType(maze, start) {
    [a, b] = findAllPossibleMatches(maze, start)
    let options = Object.keys(pipeBends)
    for (const o of options) {
        let so = pipeBends[o].map(_ => offset(start, _))
        if (so.find(_ => samePoint(a, _)) && so.find(_ => samePoint(b, _))) return o
    }
}

function findAllPossibleMatches(maze, start) {
    let around = findAround(maze, start)
    let next = []
    around.forEach(a => {
        if (pipeBends[a.c]) {
            let possible = pipeBends[a.c].map(_ => offset(a, _))
            let matching = possible.filter(_ => samePoint(start, _))
            if (matching.length) {
                next.push(a)
            }
        }
    })
    return next
}

function findAround(maze, location) {
    let around = surrounding.map(_ => offset(location, _))
    return maze.filter(m => around.some(a => a.x == m.x && a.y == m.y))
}

function findNextStep(maze, location) {
    let next = pipeBends[location.c].map(_ => offset(_, location))
    return next.map(n => maze.find(_ => samePoint(_, n)))
}

function followThePipes(maze, position, visited = []) {
    visited.push(position)
    let queue = []
    position.d = 0
    queue.push(position)

    while (queue.length > 0) {
        const node = queue.shift()
        let next = findNextStep(maze, node)
        let unvisitedNext = next.filter(n => !visited.some(v => samePoint(n, v)))
        unvisitedNext.forEach(n => {
            n.d = node.d + 1
            visited.push(n)
            queue.push(n)
        })
    }
}

let mazeList = maze.flatMap((row, y) => row.map((c, x) => { return { x, y, c } }))

let start = mazeList.find(_ => _.c == 'S')
start.c = findStartType(mazeList, start)

let visited = []
followThePipes(mazeList, start, visited)
console.log(visited[visited.length - 1].d)

let max = mazeList[mazeList.length - 1]

function countEncosed(loop, max) {
    let enclosed = 0

    for (let y = 0; y <= max.y; y++) {
        let inside = false
        for (let x = 0; x <= max.x; x++) {
            let pointInLoop = loop.find(_ => samePoint(_, { x, y }))
            if (pointInLoop) {
                // scanning vertically
                if (['|', '7', 'F'].includes(pointInLoop.c)) inside = !inside
            } else {
                if (inside) {
                    enclosed++
                }
            }
        }
    }

    return enclosed
}

console.log(countEncosed(visited, max))
