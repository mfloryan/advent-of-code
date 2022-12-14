const { loadLines } = require('../input')

let lines = loadLines('14/input.txt')

// lines =`498,4 -> 498,6 -> 496,6
// 503,4 -> 502,4 -> 502,9 -> 494,9`.split('\n')

function parseLine(line) {
    let pairs = line.split(" -> ").map(p => p.split(',').map(Number))
    return pairs
}

let rockLines = lines.map(parseLine)

function getAllRocks(rockLines) {
    let rock = []

    rockLines.forEach(rlp => {
        for (let i =0; i < rlp.length-1; i++) {
            let pair = [ rlp[i], rlp[i+1]]
            if (pair[0][0] == pair[1][0]) {
                let from = Math.min(pair[0][1], pair[1][1])
                let to = Math.max(pair[0][1], pair[1][1])
                for (let y = from; y <= to; y++) {
                    rock.push([pair[0][0], y])
                }

            } else if (pair[0][1] == pair[1][1]) {
                let from = Math.min(pair[0][0], pair[1][0])
                let to = Math.max(pair[0][0], pair[1][0])

                for (let x = from; x <= to; x++) {
                    rock.push([x, pair[0][1]])
                }
            } else {
                console.log("Diagonal?")
            }
        }
    })
    return rock
}


function createBox(obstacles, boundaries) {
    let box = [];
    for (let y = boundaries.minY; y <= boundaries.maxY; y++) {
        let row = [];
       for (let x = boundaries.minX; x <= boundaries.maxX; x++) {
            if (obstacles.some(p => p[0] == x && p[1] == y)) row.push('#'); else row.push('.');
       }
       box.push(row);
    }
    return box;
}


const result = {
    fall_off:1,
    blocked:2,
    done:3
}

function dropGrainOfSand(map, maxY, maxX, start) {
    let grainX = start.x;
    let grainY = start.y;

    if (grainY > maxY) return result.fall_off;
    if (grainX < 0) return result.fall_off;
    if (grainX > maxX) return result.fall_off;
    if (map[start.y][start.x] != '.') return result.blocked;

    let down = dropGrainOfSand(map, maxY, maxX, {x: start.x, y: start.y+1})
    if (down == result.blocked) {
        let left = dropGrainOfSand(map, maxY, maxX, {x: start.x-1, y: start.y+1})
        if (left == result.blocked) {
            let right = dropGrainOfSand(map, maxY, maxX, {x: start.x+1, y: start.y+1})
            if (right == result.blocked) {
                map[start.y][start.x] = 'o'
                return result.blocked
            }
            return result.done
        }
        return result.done
    }
    return result.done
}


function solveInput(rock) {
    let boundaries = rock.reduce(
        (p,c) => [
            [Math.min(p[0][0],c[0]), Math.max(p[0][1],c[0]) ],
            [Math.min(p[1][0],c[1]),Math.max(p[1][1],c[1])] ]
        , [[Infinity,-Infinity],[Infinity, -Infinity]])
    const bounds = {
        minX: boundaries[0][0],
        maxX: boundaries[0][1],
        minY: boundaries[1][0],
        maxY: boundaries[1][1],
    }

    bounds.minY = 0
    let map = createBox(rock, bounds)

    // console.log(map.map(l => l.join('')).join('\n'))
    dropGrainOfSand(map, bounds.maxY, bounds.maxX, {x: 500 - bounds.minX, y: 1})
    // console.log(map.map(l => l.join('')).join('\n'))
    console.log(map.flatMap(r => r.filter(e => e=='o')).length)
}

function solveInput2(rock) {
    let boundaries = rock.reduce(
        (p,c) => [
            [Math.min(p[0][0],c[0]), Math.max(p[0][1],c[0]) ],
            [Math.min(p[1][0],c[1]),Math.max(p[1][1],c[1])] ]
        , [[Infinity,-Infinity],[Infinity, -Infinity]])
    const bounds = {
        minX: boundaries[0][0],
        maxX: boundaries[0][1],
        minY: boundaries[1][0],
        maxY: boundaries[1][1],
    }
    bounds.minY = 0

    bounds.maxY += 2;
    let dx = bounds.maxY + 2

    bounds.minX = 500 - dx
    bounds.maxX = 500 + dx

    let map = createBox(rock, bounds)
    map[map.length-1].forEach((v,i) => map[map.length-1][i] = '#')

    dropGrainOfSand(map, bounds.maxY, bounds.maxX, {x: 500 - bounds.minX, y: 0})
    console.log(map.flatMap(r => r.filter(e => e=='o')).length)
}

let rock = getAllRocks(rockLines)
solveInput(rock)
solveInput2(rock)
