const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

// input = `..F7.
// .FJ|.
// SJ.L7
// |F--J
// LJ...`

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

const offset = (p1, p2) => { return {x: p1.x + p2.x, y: p1.y + p2.y }}
const samePoint = (p1, p2) => p1.x == p2.x & p1.y == p2.y

function findStartType(maze, start) {
    [a,b] = findNextSteps(maze, start)
    let options = Object.keys(pipeBends)
    for (const o of options) {
        let so = pipeBends[o].map(_ => offset(start, _))
        if (so.find(_ => samePoint(a, _)) && so.find(_ => samePoint(b, _))) return o
    }
}

function findAround(maze, location) {
    let around = surrounding.map(_ => offset(location, _))
    return maze.filter(m => around.some(a => a.x == m.x && a.y == m.y))
}

function findNextSteps(maze, start) {
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

function moveInMaze(maze, position, visited = [], distance = 0) {
    visited.push(position)
    let queue = []
    position.d = 0
    queue.push(position)

    while (queue.length > 0) {
        const node = queue.shift()
        let next = findNextSteps(maze, node)
        let unvisitedNext = next.filter(n => !visited.some(v => samePoint(n,v)))
        unvisitedNext.forEach( n => {
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
moveInMaze(mazeList, start, visited)
console.log(visited[visited.length - 1].d)
