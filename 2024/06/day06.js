const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

// input = `....#.....
// .........#
// ..........
// ..#.......
// .......#..
// ..........
// .#..^.....
// ........#.
// #.........
// ......#...`

let map = input.split('\n').flatMap((l, row) => l.split('').flatMap((c, col) => { return { c: c, x: col, y: row } }))

let guard = map.find(p => p.c == '^')

let guardPos = { c: guard.c, x: guard.x, y: guard.y }


const dir = {
    '^': { x: 0, y: -1 },
    '<': { x: -1, y: 0 },
    '>': { x: 1, y: 0 },
    'v': { x: 0, y: 1 },
}

const turnRight = {
    '^': '>',
    '<': '^',
    '>': 'v',
    'v': '<'
}

function moveOnMap(map, start, heading) {
    let distinctPositions = []
    let end = false
    let currentHeading = heading
    let currentPos = {x: start.x, y: start.y}
    let bounds = map.reduce((p,c) => { return {x: Math.max(c.x, p.x), y: Math.max(c.y, p.y)}}, {x:0, y:0})
    console.log(bounds)

    do {

        if (!distinctPositions.find(p=> p.x == currentPos.x && p.y == currentPos.y)) {
            distinctPositions.push({x:currentPos.x, y:currentPos.y})
        }

        let offset = dir[currentHeading]
        let next = { x: currentPos.x + offset.x, y: currentPos.y + offset.y }
        if (next.x < 0 || next.y < 0 || next.x > bounds.x || next.y > bounds.y) {
            end = true
        } else {
            let nextOnMap = map.find(p => p.x == next.x && p.y == next.y)
            if (nextOnMap.c == '#') {
                currentHeading = turnRight[currentHeading]
            } else {
                currentPos.x = next.x
                currentPos.y = next.y
            }
        }
    } while (!end)

    return distinctPositions.length
}


console.log(moveOnMap(map, { x: guard.x, y: guard.y }, guard.c))
