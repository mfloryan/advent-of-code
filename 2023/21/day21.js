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
    let gotTo = [start]

    for (let i = 0; i < steps; i++) {

        let optionsForNextStep = gotTo.flatMap(_ => findNext(garden, _))

        let uniqueSteps = []
        for (const o of optionsForNextStep) {
            if (!uniqueSteps.includes(o)) uniqueSteps.push(o)
        }
        gotTo = uniqueSteps

    }
    console.log(gotTo.length)
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

let garden = input.split('\n').map((r,y) => r.split('').map((_,x) => { return {x,y,c:_}}))
let flatGarden = garden.flatMap(_ => _)

console.log(walkGarden(garden, flatGarden.find(o => o.c =="S"), 64))
