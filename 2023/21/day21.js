const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

const directions = {
    'E': { x: 1, y: 0 },
    'S': { x: 0, y: 1 },
    'N': { x: 0, y: -1 },
    'W': { x: -1, y: 0 }
}

const apply = (p1, p2) => { return { x: p1.x + p2.x, y: p1.y + p2.y } }

function findNext(garden, start) {
    return Object.values(directions)
        .map(d => apply(d, start))
        .filter(_ => _.x >= 0 && _.y >= 0 && _.x < garden[0].length && _.y < garden.length)
        .filter(_ => garden[_.y][_.x].c != '#')
        .map(_ => garden[_.y][_.x])
}


function walkGarden(garden, start, steps = 6) {
    let gotTo = new Set([start])

    for (let i = 0; i < steps; i++) {

        let optionsForNextStep = new Set()
        gotTo.forEach((v) => findNext(garden, v).forEach(_ => optionsForNextStep.add(_)))

        gotTo = optionsForNextStep

    }
    return gotTo.size
}

function findNext2(garden, start) {
    return Object.values(directions)
        .map(d => apply(d, start))
        .filter(_ => {
            let fixedX = _.x < 0 ? (garden[0].length - 1) + ((_.x + 1) % garden[0].length) : _.x % garden[0].length
            let fixedY = _.y < 0 ? (garden.length - 1) + ((_.y + 1) % garden[0].length) : _.y % garden[0].length

            return garden[fixedY][fixedX].c != '#'
        })
}

const fromXY = (p) => (p.x + 10000000 + p.y + 10000000) * (p.x + 10000000 + p.y + 10000000 + 1) / 2 + p.y + 10000000
const toXY = (v) => {
    let w = Math.floor((Math.sqrt(8 * v + 1) - 1) / 2)
    let y = v - w * (w + 1) / 2
    let x = w - y
    return { x: x - 10000000, y: y - 10000000 }
}

function walkGarden2(garden, start, steps = 6) {
    let gotTo = [fromXY(start)]

    for (let i = 0; i < steps; i++) {

        let optionsForNextStep = []
        for (const g of gotTo) {
            for (const n of findNext2(garden, toXY(g))) {
                if (!optionsForNextStep.includes(fromXY(n))) optionsForNextStep.push(fromXY(n))
            }
        }

        gotTo = optionsForNextStep

    }
    return gotTo.length
}

// input = `...........
// .....###.#.
// .###.##..#.
// ..#.#...#..
// ....#.#....
// .##..S####.
// .##..#...#.
// .......##..
// .##.#.####.
// .##..##.##.
// ...........`

let garden = input.split('\n').map((r, y) => r.split('').map((_, x) => { return { x, y, c: _ } }))
let flatGarden = garden.flatMap(_ => _)

console.log(walkGarden(garden, flatGarden.find(o => o.c == "S"), 64))

let steps = 26501365;

let x = [Math.floor(garden.length / 2), Math.floor(garden.length / 2) + garden.length, Math.floor(garden.length / 2) + 2 * garden.length]
let y = [
    walkGarden2(garden, flatGarden.find(o => o.c == "S"), x[0]),
    walkGarden2(garden, flatGarden.find(o => o.c == "S"), x[1]),
    walkGarden2(garden, flatGarden.find(o => o.c == "S"), x[2])
]

console.log(x.map((v, i) => `a * ${Math.pow(v, 2)} + b * ${v} + c = ${y[i]}`).join('\n'));

console.log("Solve for a,b,c")

console.log("Result:", 620348631910321)
