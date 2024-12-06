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
let map2 = input.split('\n').map(l => l.split(''))

let guard = map.find(p => p.c == '^')

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
    let walkingMap = map.map(l => new Array(l.length))
    walkingMap[start.y][start.x] = true
    let end = false
    let currentHeading = heading
    let currentPos = { x: start.x, y: start.y }
    let bounds = { x: map[0].length - 1, y: map.length - 1 }

    let distinctPosLen = distinctPositions.length
    let i = 0

    do {
        i++
        i = i % (map.length * 4)

        if (!walkingMap[currentPos.y][currentPos.x]) {
            walkingMap[currentPos.y][currentPos.x] = true
            distinctPositions.push({ x: currentPos.x, y: currentPos.y })
        }

        if (i == 0) {
            if (distinctPosLen == distinctPositions.length) {
                return -1
            } else {
                distinctPosLen = distinctPositions.length
            }
        }

        let offset = dir[currentHeading]
        let next = { x: currentPos.x + offset.x, y: currentPos.y + offset.y }
        if (next.x < 0 || next.y < 0 || next.x > bounds.x || next.y > bounds.y) {
            end = true
        } else {
            let nextOnMap = map[next.y][next.x]
            if (nextOnMap == '#') {
                currentHeading = turnRight[currentHeading]
            } else {
                currentPos.x = next.x
                currentPos.y = next.y
            }
        }
    } while (!end)

    return distinctPositions.length
}

function testObstacles(map, start, heading) {
    let possibleObstacles = 0
    for (let x = 0; x < map[0].length; x++) {
        for (let y = 0; y < map.length; y++) {
            if (map[y][x] != '#' && map[y][x] != '^') {

                let newMap = []
                newMap = map.map(l => l.slice())

                newMap[y][x] = '#'
                let result = moveOnMap(newMap, start, heading)
                if (result == -1) possibleObstacles++
            }
        }
    }
    return possibleObstacles
}

console.log(moveOnMap(map2, { x: guard.x, y: guard.y }, guard.c))
console.log(testObstacles(map2, { x: guard.x, y: guard.y }, guard.c))
