const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

const digging = {
    'R': { x: 1, y: 0 },
    'D': { x: 0, y: 1 },
    'U': { x: 0, y: -1 },
    'L': { x: -1, y: 0 },
}

const apply = (p1, p2) => { return { x: p1.x + p2.x, y: p1.y + p2.y } }

function parse(line) {
    let [dir, steps, colour] = line.split(' ', 3)
    return { dir, steps, colour: colour.substring(1, colour.length - 1) }
}


function dig(plan) {
    let map = []
    let pos = { x: 0, y: 0 }
    for (const p of plan) {
        for (let i = 0; i < p.steps; i++) {
            pos = apply(pos, digging[p.dir])
            map.push({ x: pos.x, y: pos.y, c: p.colour })
        }
    }
    return map
}

// input = `R 6 (#70c710)
// D 5 (#0dc571)
// L 2 (#5713f0)
// D 2 (#d2c081)
// R 2 (#59c680)
// D 2 (#411b91)
// L 5 (#8ceee2)
// U 2 (#caa173)
// L 1 (#1b58a2)
// U 2 (#caa171)
// R 2 (#7807d2)
// U 3 (#a77fa3)
// L 2 (#015232)
// U 2 (#7a21e3)`

let data = input.split('\n').map(parse)
let map = dig(data)
console.log(map.length)

let dim = map.reduce(
    (p, c) => { return { l: Math.min(c.x, p.l), t: Math.min(c.y, p.t), b: Math.max(c.y, p.b), r: Math.max(c.x, p.r) } },
    { l: Infinity, t: Infinity, b: -Infinity, r: -Infinity })

console.log(dim)

function inside(map, point) {
    let left = map.filter(_ => _.x < point.x && _.y == point.y).length
    let top = map.filter(_ => _.x == point.x && _.y < point.y).length


    // let countLeft = 0, countTop = 0
    // if (left.length > 0) {
    //     countLeft = 1
    //     for (let i = 1; i < left.length; i++) {
    //         if (Math.abs(left[i] - left[i - 1]) > 1) countLeft++;
    //     }
    // }

    // if (top.length > 0) {
    //     countTop = 1
    //     for (let i = 1; i < top.length; i++) {
    //         if (Math.abs(top[i] - top[i - 1]) > 1) countTop++;
    //     }
    // }


    // for (const t of top) {

    // }


    return (left % 2 == 1 && top % 2 == 1)
}

// let insideCount = 0
// for (let x = dim.l; x <= dim.r; x++) {
//     for (let y = dim.t; y <= dim.b; y++) {
//         let p = { x, y }
//         // console.log(p, inside(map, p))
//         if (inside(map, p)) insideCount++
//     }
// }

// console.log(insideCount)

// for (let y = dim.t; y <= dim.b; y++) {
//     let row = []
//     for (let x = dim.l; x <= dim.r; x++) {
//         let p = { x, y }
//         if (map.find(_ => p.x == _.x && p.y == _.y)) row.push('#')
//         else {
//             row.push('.')
//         }
//     }
//     console.log(row.join(''))
// }

function findStart(map, dim) {
    for (let y = dim.t; y <= dim.b; y++) {
        for (let x = dim.l; x <= dim.r; x++) {
            let left = map.filter(_ => _.x < x && _.y == y).length
            let right = map.filter(_ => _.x > x && _.y == y).length
            if (left == 1 && right == 1) return { x, y }
        }
    }
}

console.log()
floodFill(map, findStart(map, dim))

for (let y = dim.t; y <= dim.b; y++) {
    let row = []
    for (let x = dim.l; x <= dim.r; x++) {
        let p = { x, y }
        let inMap = map.find(_ => p.x == _.x && p.y == _.y)
        if (inMap) {
            if (inMap.c) row.push("#"); else row.push("*")
        } else row.push('.')

    }
    console.log(row.join(''))
}


function floodFill(map, point) {
    let queue = [point]

    while (queue.length > 0) {
        let point = queue.shift()

        let mapPoint = map.find(_ => _.x == point.x && _.y == point.y)
        if (!mapPoint) {
            map.push(point)
            queue.push({ x: point.x - 1, y: point.y })
            queue.push({ x: point.x + 1, y: point.y })
            queue.push({ x: point.x, y: point.y - 1 })
            queue.push({ x: point.x, y: point.y + 1 })
        }
    }
}

console.log(map.length)
