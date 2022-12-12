const { loadLines } = require('../input')
let lines = loadLines('25/input.txt')

// lines = `v...>>.vv>
// .vv>>.vv..
// >>.>v>...v
// >>v>>.>.v.
// v>v.vv.v..
// >.>>..v...
// .vv..>.>v.
// v.v..>>v.v
// ....v..v.>`.split('\n')

let seaFloor = lines.map(l => l.split(''))

function draw(seaFloor) {
    console.log(
    seaFloor.map(r => r.join('')).join('\n')
    )
    console.log()
}

function goEast(seaFloor, newSeaFloor, r, l, x, y) {
    let moved = false
    if (l == '>') {
        let eastX = (x+1) % r.length
        if (seaFloor[y][eastX] == '.') {
            newSeaFloor[y][x] = '.'
            newSeaFloor[y][eastX] = '>'
            moved = true
        } else {
            newSeaFloor[y][x] = l
        }
    } else {
        if (!newSeaFloor[y][x]) {
            newSeaFloor[y][x] = l
        }
    }
    return moved
}

function goSouth(seaFloor, newSeaFloor, r, l, x, y) {
    let moved = false
    if (l == 'v') {
        let southY = (y+1) % seaFloor.length
        if (seaFloor[southY][x] == '.') {
            newSeaFloor[y][x] = '.'
            newSeaFloor[southY][x] = 'v'
            moved = true
        } else {
            newSeaFloor[y][x] = l
        }
    } else {
        if (!newSeaFloor[y][x]) {
            newSeaFloor[y][x] = l
        }
    }
    return moved
}

function makeMoves(seaFloor, moveRules) {
    let newSeaFloor = new Array(seaFloor.length)
    for (let i = 0; i < seaFloor.length; i++) newSeaFloor[i] = new Array(seaFloor[i].length)
    let moved = false;
    seaFloor.forEach((r,y) => {
        r.forEach((l, x) => {
            moved = moveRules(seaFloor, newSeaFloor, r, l, x, y) || moved
        })
    })

    return {seaFloor: newSeaFloor, moved}
}

draw(seaFloor)

let moved = false;
let steps = 0;
do {
    moved = false
    steps++;
    let r = makeMoves(seaFloor, goEast)
    moved = r.moved
    r = makeMoves(r.seaFloor, goSouth)
    moved = r.moved || moved
    seaFloor = r.seaFloor
} while (moved)

console.log(steps)
draw(seaFloor)
