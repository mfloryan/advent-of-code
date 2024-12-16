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

function samePoint(a, b) {
    return a.x == b.x && a.y == b.y
}

function addPoints(a, b) {
    return { x: a.x + b.x, y: a.y + b.y }
}

const directions = {
    'E': { m: { x: 1, y: 0 },  l: 'N', r: 'S' },
    'W': { m: { x: -1, y: 0 }, l: 'S', r: 'N' },
    'S': { m: { x: 0, y: 1 },  l: 'E', r: 'W' },
    'N': { m: { x: 0, y: -1 }, l: 'W', r: 'E' },
}

let paths = []

function exploreMaze(maze, point, dir, end, scores, globalScores, score = 0, visited = new Set()) {
    visited.add(`${point.x}:${point.y}`)
    globalScores[point.y][point.x] = Math.min(score, globalScores[point.y][point.x])

    if (samePoint(point, end)) {
        paths.push({score, seats: visited})
        scores.push(score)
        return
    }

    let next = [
        [addPoints(point, directions[dir].m), dir, 1],
        [addPoints(point, directions[directions[dir].l].m), directions[dir].l, 1001],
        [addPoints(point, directions[directions[dir].r].m), directions[dir].r, 1001]
    ].filter(p => maze[p[0].y][p[0].x] != '#' && !visited.has(`${p[0].x}:${p[0].y}`))

    next = next.filter(np => globalScores[np[0].y][np[0].x] >= score - 1000)

    for (const np of next) {
        exploreMaze(maze, np[0], np[1], end, scores, globalScores, score + np[2], new Set(visited))
    }

}

function solveMaze(maze, start, end) {
    let scores = []
    let globalScores = new Array(maze.length)
    for (let i=0; i< maze.length; i++) {
        globalScores[i] = new Array(maze[i].length).fill(Infinity)
    }
    exploreMaze(maze, start, 'E', end, scores, globalScores)
    let minScore = scores.toSorted((a,b) => a-b)[0]

    let minPaths = paths.filter(p => p.score == minScore)
    let seats = minPaths.map(p => p.seats).reduce((p,c) => p.union(c))
    return [minScore, seats.size]
}


// input = `###############
// #.......#....E#
// #.#.###.#.###.#
// #.....#.#...#.#
// #.###.#####.#.#
// #.#.#.......#.#
// #.#.#####.###.#
// #...........#.#
// ###.#.#####.#.#
// #...#.....#.#.#
// #.#.#.###.#.#.#
// #.....#...#.#.#
// #.###.#.#.#.#.#
// #S..#.....#...#
// ###############`

// input = `#################
// #...#...#...#..E#
// #.#.#.#.#.#.#.#.#
// #.#.#.#...#...#.#
// #.#.#.#.###.#.#.#
// #...#.#.#.....#.#
// #.#.#.#.#.#####.#
// #.#...#.#.#.....#
// #.#.#####.#.###.#
// #.#.#.......#...#
// #.#.###.#####.###
// #.#.#...#.....#.#
// #.#.#.#####.###.#
// #.#.#.........#.#
// #.#.#.#########.#
// #S#.............#
// #################`

let map = parseMapIntoList(input)
let map2 = input.split('\n').map(r => r.split(''))

let start = map.find(p => p.c == 'S')
let end = map.find(p => p.c == 'E')

console.log(
    solveMaze(map2, start, end)
)
