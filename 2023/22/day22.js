const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function parse(line) {
    let [p1, p2] = line.split('~').map(_ => _.split(',').map(_ => parseInt(_)))
    return [{ x: p1[0], y: p1[1], z: p1[2] }, { x: p2[0], y: p2[1], z: p2[2] }]
}

function overlap(a, b) {
    let ox = a[1].x >= b[0].x && a[0].x <= b[1].x
    let oy = a[1].y >= b[0].y && a[0].y <= b[1].y
    let oz = a[1].z >= b[0].z && a[0].z <= b[1].z
    return ox && oy && oz
}

function tryDropBrick(bricks, brick) {
    let dz = 0
    while ((brick[0].z - dz) > 1) {
        let movedBrick = [
            { x: brick[0].x, y: brick[0].y, z: brick[0].z - (dz + 1) },
            { x: brick[1].x, y: brick[1].y, z: brick[1].z - (dz + 1) }]

        if (bricks.some(ob => overlap(movedBrick, ob))) break;

        dz++;
    }

    return [
        { x: brick[0].x, y: brick[0].y, z: brick[0].z - dz },
        { x: brick[1].x, y: brick[1].y, z: brick[1].z - dz },
    ]
}

function dropBrics(bricksInTheAir) {
    let bricks = []

    let dropped = 0;

    let sortedBricks = bricksInTheAir.toSorted((a,b) => (a[0].z - b[0].z))

    while (sortedBricks.length > 0) {
        let brick = sortedBricks.shift()
        if (brick[0].z == 1) { //on the ground
            bricks.push(brick)
        } else {
            let droppedBrick = tryDropBrick(bricks, brick)
            if (droppedBrick[0].z != brick[0].z) dropped++;
            bricks.push(droppedBrick)
        }
    }

    return [bricks, dropped]
}

function settleBricks(bricksInTheAir) {

    let bricks = bricksInTheAir.toSorted((a, b) => (a[0].z - b[0].z) )

    let dropped = 0;
    do {
        let r = dropBrics(bricks)
        bricks = r[0]
        dropped = r[1]
    } while (dropped > 0)

    return bricks
}

// input = `1,0,1~1,2,1
// 0,0,2~2,0,2
// 0,2,3~2,2,3
// 0,0,4~0,2,4
// 2,0,5~2,2,5
// 0,1,6~2,1,6
// 1,1,8~1,1,9`

let bricks = settleBricks(input.split('\n').map(parse))

let part1 = 0, part2 = 0
for (let i = 0; i < bricks.length; i++) {
    let fewerBricks = bricks.toSpliced(i, 1)
    let f = dropBrics(fewerBricks)
    if (f[1] == 0) part1++
    part2 += f[1]
}

console.log(part1)
console.log(part2)
