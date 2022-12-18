const { loadLines } = require('../input')

let lines = loadLines('18/input.txt')

// lines=`2,2,2
// 1,2,2
// 3,2,2
// 2,1,2
// 2,3,2
// 2,2,1
// 2,2,3
// 2,2,4
// 2,2,6
// 1,2,5
// 3,2,5
// 2,1,5
// 2,3,5`.split('\n')

let data = lines.map(l => l.split(",").map(Number))

const sides = [
    [0,0,1],
    [0,1,0],
    [1,0,0],
    [0,0,-1],
    [0,-1,0],
    [-1,0,0],
]

function cubeHere(c, side) {
    return c => c[0] == side[0] && c[1] == side[1] && c[2] == side[2]
}

function countUncoveredSides(data) {
    let totalUncovered = 0
    for (const cube of data) {
        let cubeSides = sides.map(s => [cube[0]+s[0], cube[1]+s[1], cube[2]+s[2]])
        let covered = cubeSides.filter(side => data.some(cubeHere)).length
        totalUncovered += (6 - covered)
    }
    return totalUncovered
}

function countExternalArea(droplets) {
    let bounds = droplets.reduce(
    (p,c) => [[Math.min(p[0][0],c[0]), Math.max(p[0][1],c[0])],
               [Math.min(p[1][0],c[1]), Math.max(p[1][1],c[1])],
               [Math.min(p[2][0],c[2]), Math.max(p[2][1],c[2])]],
    [[Infinity,-Infinity],[Infinity,-Infinity],[Infinity,-Infinity]])

    for (let x = bounds[0][0]; x <= bounds[0][1]; x++) {
        for (let y = bounds[1][0]; y <= bounds[1][1]; y++) {
            for (let z = bounds[2][0]; z <= bounds[2][1]; z++) {
            }
        }
    }
}

console.log(countUncoveredSides(data))
console.log(countExternalArea(data))
