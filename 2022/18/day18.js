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
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
    [0, 0, -1],
    [0, -1, 0],
    [-1, 0, 0],
]

function cubeHere(a, b) {
    return a[0] == b[0] && a[1] == b[1] && a[2] == b[2]
}

function addPoints(a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
}

function countUncoveredSides(data) {
    let totalUncovered = 0
    for (const cube of data) {
        let cubeSides = sides.map(s => [cube[0] + s[0], cube[1] + s[1], cube[2] + s[2]])
        let covered = cubeSides.filter(side => data.some(c => cubeHere(side, c))).length
        totalUncovered += (6 - covered)
    }
    return totalUncovered
}

function solvePart2(droplets) {
    let bounds = droplets.reduce(
        (p, c) => [[Math.min(p[0][0], c[0]), Math.max(p[0][1], c[0])],
        [Math.min(p[1][0], c[1]), Math.max(p[1][1], c[1])],
        [Math.min(p[2][0], c[2]), Math.max(p[2][1], c[2])]],
        [[Infinity, -Infinity], [Infinity, -Infinity], [Infinity, -Infinity]])

    let outside = []
    let q = []
    start = [0, 0, 0]
    outside.push(start)
    q.push(start)
    while (q.length > 0) {
        let cur = q.shift()
        for (const dir of sides) {
            let s = addPoints(cur, dir)
            if (s[0] >= bounds[0][0] - 1 && s[1] >= bounds[1][0] - 1 && s[2] >= bounds[2][0] - 1 &&
                s[0] <= bounds[0][1] + 1 && s[1] <= bounds[1][1] + 1 && s[2] <= bounds[2][1] + 1 &&
                !droplets.some(d => cubeHere(d, s)) &&
                !outside.some(d => cubeHere(d, s))) {
                outside.push(s)
                q.push(s)
            }
        }
    }

    console.log(outside)

    let area1 = 0
    let area2 = 0

    for (const cube of droplets) {
        for (const dir of sides) {
            area1 += !droplets.some(c => cubeHere(c, addPoints(cube, dir))) ? 1 : 0
            area2 += (!droplets.some(c => cubeHere(c, addPoints(cube, dir))) && 
                       outside.some(c => cubeHere(c, addPoints(cube, dir)))) ? 1 : 0
        }
    }

    return [area1, area2]
}


console.log(countUncoveredSides(data))
console.log(solvePart2(data))
