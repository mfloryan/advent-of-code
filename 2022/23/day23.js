const { loadLines } = require('../input')

let lines = loadLines('23/input.txt')

// lines = `..............
// ..............
// .......#......
// .....###.#....
// ...#...#.#....
// ....#...##....
// ...#.###......
// ...##.#.##....
// ....#..#......
// ..............
// ..............
// ..............`.split('\n')

const directions = 'NSWE'.split('')

const adjecent = {
    'N': [{ x: 0,  y: -1 }, { x: -1, y: -1 }, { x: 1,  y: -1 }],
    'S': [{ x: 0,  y: 1 },  { x: -1, y: 1 },  { x: 1,  y: 1 }],
    'W': [{ x: -1, y: 0 },  { x: -1, y: 1 },  { x: -1, y: -1 }],
    'E': [{ x: 1,  y: 0 },  { x: 1,  y: -1 }, { x: 1,  y: 1 }],
}

const around = [
    {x:  0, y: -1},
    {x:  0, y:  1},
    {x:  1, y: -1},
    {x:  1, y:  0},
    {x:  1, y:  1},
    {x: -1, y: -1},
    {x: -1, y:  0},
    {x: -1, y:  1},
]

function add(a, b) {
    return {x: a.x + b.x, y: a.y + b.y}
}

function same(a,b) {
    return a.x == b.x && a.y == b.y
}

function showElves(elves) {
    let dim = findBoundingRectangle(elves)
    for (let y = dim.minY; y <= dim.maxY; y++) {
        let line = []
        for (let x = dim.minX; x <= dim.maxX; x++ ) {
            if (elves.find(e => same({x,y},e))) {
                line.push('#')
            } else {
                line.push('.')
            }
        }
        console.log(line.join(''))
    }
}

function findBoundingRectangle(elves) {
    return elves.reduce((p, c) => {
        return {
            minX: Math.min(p.minX, c.x), maxX: Math.max(p.maxX, c.x),
            minY: Math.min(p.minY, c.y), maxY: Math.max(p.maxY, c.y)
        }
    }, { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity })
}

function moveElves(elves, directionIndex) {
    let potentialMoves = []
    let newElves = []
    let good = 0
    for (const elf of elves) {
        let aroundPositions = around.map(a => add(elf, a))
        if (!aroundPositions.some(p => elves.some(e => same(e,p)))) {
            good++
            newElves.push(elf)
            continue
        }

        let foundMove = false
        for (let i = 0; i < directions.length; i++) {
            let dir = directions[(directionIndex + i) % directions.length]
            // console.log(dir)
            let adj = adjecent[dir].map(p => add(elf, p))
            if (!adj.some(a => elves.some(e => same(a,e)))) {
                foundMove = true
                potentialMoves.push([elf, adj[0]])
                break;
            }
        }

        if (!foundMove) newElves.push(elf)
    }

    for (const pm of potentialMoves) {
        if (!potentialMoves.some(opm => same(pm[1],opm[1]) && !same(pm[0], opm[0]))) {
            newElves.push(pm[1])
        } else {
            newElves.push(pm[0])
        }
    }

    return {elves: newElves, moved: elves.length - good}
}

let elves = lines.flatMap((l, y) => l.split('').map((v,x) => { return {v,x,y}})).filter(e => e.v == "#")

let after = { elves: elves }
let i = 0
let round = 0
do {
    after = moveElves(after.elves, i)
    i = (i+1) % directions.length
    round++
    if (round == 10) {
        let dim = findBoundingRectangle(after.elves)
        console.log(((dim.maxY - dim.minY + 1) * (dim.maxX - dim.minX + 1)) - after.elves.length)
    }
} while (after.moved > 0)

console.log(round)
