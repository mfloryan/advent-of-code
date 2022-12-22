const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

// input = `        ...#
//         .#..
//         #...
//         ....
// ...#.......#
// ........#...
// ..#....#....
// ..........#.
//         ...#....
//         .....#..
//         .#......
//         ......#.

// 10R5L5R10L4R5L5`

let [maze, moves] = input.split("\n\n")

function parseMoves(moves) {
    let s = moves.split('')
    let newMoves = []
    let isNumber = false
    let numberCollection = []
    for (let i = 0; i < s.length; i++) {
        if (moves.charCodeAt(i) < 58) {
            if (!isNumber) {
                numberCollection = []
                isNumber = true;
            }
            numberCollection.push(s[i])
        } else {
            if (numberCollection.length > 0) {
                newMoves.push({ move: 'm', value: Number(numberCollection.join('')) })
            }
            isNumber = false
            newMoves.push({ move: 'r', value: s[i] })
        }
    }
    if (numberCollection.length > 0) {
        newMoves.push({ move: 'm', value: Number(numberCollection.join('')) })
    }

    return newMoves
}

const directions = [['>', { x: 1, y: 0 }], ['v', { x: 0, y: 1 }], ['<', { x: -1, y: 0 }], ['^', { x: 0, y: -1 }]]
const moveIndexShift = { 'L': -1, 'R': 1 }

function findWrapPoint(map, dim, start, direction) {
    if (direction[0] == '>') {
        let x = 0;
        while (true) {
            let mapPoint = map.find(p => p.x == x && p.y == start.y)
            if (mapPoint && mapPoint.c != ' ') return mapPoint
            x++
        }
    } else if (direction[0] == 'v') {
        let y = 0;
        while (true) {
            let mapPoint = map.find(p => p.x == start.x && p.y == y)
            if (mapPoint && mapPoint.c != ' ') return mapPoint
            y++
        }
    } else if (direction[0] == '<') {
        let x = dim.x;
        while (true) {
            let mapPoint = map.find(p => p.x == x && p.y == start.y)
            if (mapPoint && mapPoint.c != ' ') return mapPoint
            x--
        }
    } else if (direction[0] == '^') {
        let y = dim.y;
        while (true) {
            let mapPoint = map.find(p => p.x == start.x && p.y == y)
            if (mapPoint && mapPoint.c != ' ') return mapPoint
            y--
        }
    }
    return { c: "#" }
}

function printMap(map, dim, position, token) {
    for (let y = 0; y <= dim.y; y++) {
        let row = []
        for (let x = 0; x <= dim.x; x++) {
            if (position.x == x && position.y == y) {
                row.push(token)
            } else {
                let point = map.find(p => p.x == x && p.y == y)
                if (point) {
                    row.push(point.c)
                } else {
                    row.push(' ')
                }
            }
        }
        console.log(row.join(''))
    }
}

function traverseMaze(map, moves, start) {
    let direction = 0;
    let position = { x: start.x, y: start.y }
    let dim = map.reduce((p, c) => { return { x: Math.max(p.x, c.x), y: Math.max(p.y, c.y) } }, { x: 0, y: 0 })
    for (const move of moves) {
        if (move.move == 'r') {
            let oldDir = directions[direction][0]
            direction = (direction + moveIndexShift[move.value]) % (directions.length)
            if (direction < 0) direction = direction + (directions.length)
        }
        if (move.move == 'm') {
            // console.log(directions[direction], move.value)
            for (let i = 0; i < move.value; i++) {
                let newPosition = {
                    x: position.x + directions[direction][1].x,
                    y: position.y + directions[direction][1].y
                }

                // console.log("np", newPosition)
                let newMapPoint = map.find(p => p.x == newPosition.x && p.y == newPosition.y)
                if (newMapPoint) {
                    if (newMapPoint.c == '.') {
                        position.x = newMapPoint.x
                        position.y = newMapPoint.y
                    } else if (newMapPoint.c == '#') {
                        // console.log("wall")
                        break;
                    } else if (newMapPoint.c == ' ') {
                        wrapPoint = findWrapPoint(map, dim, position, directions[direction])
                        if (wrapPoint.c == '#') {
                            // console.log('wall');
                            break;
                        } else if (wrapPoint.c == '.') {
                            position.x = wrapPoint.x
                            position.y = wrapPoint.y
                        }
                    }
                } else {
                    wrapPoint = findWrapPoint(map, dim, position, directions[direction])
                    if (wrapPoint.c == '#') {
                        // console.log('wall');
                        break;
                    } else if (wrapPoint.c == '.') {
                        position.x = wrapPoint.x
                        position.y = wrapPoint.y
                    }
                }
            }
            // console.log(position)
        }
        // printMap(map, dim, position, directions[direction][0])
        // console.log('')
    }
    return ([direction, position])
}

let map = maze.split('\n').flatMap((v, y) => v.split('').map((c, x) => { return { x: x, y: y, c: c } }))
moves = parseMoves(moves)

let startX = map.filter(v => v.y == 0 && v.c == '.').map(v => v.x).reduce((p, c) => Math.min(p, c), Infinity)
let start = map.find(v => v.x == startX && v.y == 0)

let end = traverseMaze(map, moves, start)
console.log(1000 * (end[1].y + 1) + 4 * (end[1].x + 1) + end[0])

//50485 -- wrong