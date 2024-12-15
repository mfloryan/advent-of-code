const fs = require('fs')
const path = require('path')
const { off } = require('process')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function parseMapIntoList(input) {
    return input
        .split('\n')
        .flatMap(
            (l, row) => l.split('')
                .map((c, col) => { return { c: c, x: col, y: row } }))
}

function printMap(map, move = '@') {
    let dim = map.reduce((p, c) => [
        Math.min(p[0], c.x),
        Math.max(p[1], c.x),
        Math.min(p[2], c.y),
        Math.max(p[3], c.y)], [Infinity, -Infinity, Infinity, -Infinity])

    let mapLines = []
    for (let y = dim[2]; y <= dim[3]; y++) {
        let line = []
        for (let x = dim[0]; x <= dim[1]; x++) {
            let point = map.find(p => p.x == x && p.y == y)
            if (point) {
                line.push(point.c == '@' ? move : point.c)
            } else {
                line.push('.')
            }
        }
        mapLines.push(line.join(''))
    }
    console.log(mapLines.join('\n'))
}


const directions = {
    '>': { x: 1, y: 0 },
    '<': { x: -1, y: 0 },
    'v': { x: 0, y: 1 },
    '^': { x: 0, y: -1 },
}

function executeMoves(map, moves) {
    let robot = map.find(p => p.c == '@')
    for (const move of moves) {
        let offset = directions[move]
        let newPosition = { x: robot.x + offset.x, y: robot.y + offset.y }
        let newPositionPoint = map.find(p => p.x == newPosition.x && p.y == newPosition.y)
        if (!newPositionPoint) {
            robot.x = newPosition.x
            robot.y = newPosition.y
        } else if (newPositionPoint.c == '#') {
            continue
        } else if (newPositionPoint.c == 'O') {
            let boxes = [newPositionPoint]
            let lookAhead
            do {
                let lookAheadPos = { x: robot.x + offset.x * (boxes.length + 1), y: robot.y + offset.y * (boxes.length + 1) }
                lookAhead = map.find(p => p.x == lookAheadPos.x && p.y == lookAheadPos.y)
                if (!lookAhead || lookAhead.c != 'O') {
                    break
                }
                boxes.push(lookAhead)
            } while (true)
            if (!lookAhead) {
                for (const box of boxes) {
                    box.x += offset.x
                    box.y += offset.y
                }
                robot.x += offset.x
                robot.y += offset.y
            }
        } else {
            throw "Confused"
        }
    }

    return robot
}

function executeMoves2(map, moves) {
    let robot = map.find(p => p.c == '@')
    for (const move of moves) {
        let offset = directions[move]
        let newPosition = { x: robot.x + offset.x, y: robot.y + offset.y }
        let newPositionPoint = map.find(p => p.x == newPosition.x && p.y == newPosition.y)
        if (!newPositionPoint) {
            robot.x = newPosition.x
            robot.y = newPosition.y
        } else if (newPositionPoint.c == '#') {
            continue
        } else if (newPositionPoint.c == '[' || newPositionPoint.c == ']') {
            let boxes = []
            if (newPositionPoint.c == '[') {
                boxes.push(newPositionPoint, map.find(p => p.x == newPositionPoint.x + 1 && p.y == newPositionPoint.y && p.c == ']'))
            } else {
                boxes.push(newPositionPoint, map.find(p => p.x == newPositionPoint.x - 1 && p.y == newPositionPoint.y && p.c == '['))
            }

            if (move == '<' || move == '>') {

                let lookAhead
                do {
                    let lookAheadPos = { x: robot.x + offset.x * (boxes.length + 1), y: robot.y + offset.y * (boxes.length + 1) }
                    lookAhead = map.find(p => p.x == lookAheadPos.x && p.y == lookAheadPos.y)
                    if (!lookAhead || (lookAhead.c != '[' && lookAhead.c != ']')) {
                        break
                    }
                    boxes.push(lookAhead)
                } while (true)

                if (!lookAhead) {
                    for (const box of boxes) {
                        box.x += offset.x
                        box.y += offset.y
                    }
                    robot.x += offset.x
                    robot.y += offset.y
                }

            } else {
                // GOIN UP or DOWN and have to find boxes in a different way

                let line = newPosition.y
                let lookAhead
                do {
                    let lookAheadPosList = boxes.filter(b => b && b.y == line)
                    line += offset.y
                    lookAhead = lookAheadPosList.map(b => map.find(p => p.x == b.x && p.y == line))
                    //has only empty space or no parts of boxes
                    if (lookAhead.every(p => !p) || lookAhead.some(p => p && p.c == '#')) {
                        break
                    }
                    // add all boxes
                    let newLookAhead = []

                    for (const point of lookAhead) {
                        // add missing parts for boxes
                        newLookAhead.push(point)
                        if (point) {
                            if (point.c == '[') {
                                if (!lookAhead.find(p => p && p.x == point.x + 1 && p.c == ']')) {
                                    let boxPart = map.find(p => point.y == p.y && p.x == point.x + 1 && p.c == ']')
                                    if (!boxPart) throw `Missing box part for ${point}`
                                    newLookAhead.push(boxPart)
                                }
                            } else if (point.c == ']') {
                                if (!lookAhead.find(p => p && p.x == point.x - 1 && p.c == '[')) {
                                    let boxPart = map.find(p => point.y == p.y && p.x == point.x - 1 && p.c == '[')
                                    if (!boxPart) throw `Missing box part for ${point}`
                                    newLookAhead.push(boxPart)
                                }
                            }
                        }
                    }

                    boxes.push(...newLookAhead)
                } while (true)

                if (lookAhead.every(p => !p)) {
                    for (const box of boxes) {
                        if (box) {
                            box.x += offset.x
                            box.y += offset.y
                        }
                    }
                    robot.x += offset.x
                    robot.y += offset.y
                }

            }
        } else {
            console.log(newPositionPoint)
            throw "Confused"
        }
    }
}

function evaluateGPS(map, point = 'O') {
    return map.filter(p => p.c == point).reduce((p, c) => p + (c.x + 100 * c.y), 0)
}

// input = `#######
// #...#.#
// #.....#
// #...O.#
// #..O..#
// #..OO@#
// #..O..#
// #.....#
// #######

// <vv<<^^<<^^`

// input = `##########
// #..O..O.O#
// #......O.#
// #.OO..O.O#
// #..O@..O.#
// #O#..O...#
// #O..O..O.#
// #.OO.O.OO#
// #....O...#
// ##########

// <vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
// vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
// ><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
// <<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
// ^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
// ^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
// >^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
// <><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
// ^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
// v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`

// input = `
// ########################
// ##..............@.....##
// ##..##....[]...[].....##
// ##[]...........[].[]..##
// ##..####[]..[][][][]..##
// ##....[][]..[]....[]..##
// ######........##[][]..##
// ##............[][][]..##
// ##..[][][][]......[]..##
// ##....................##
// ########################

// vvv
// `

let [mapInput, movesInput] = input.split('\n\n')

let map = parseMapIntoList(mapInput).filter(p => p.c != '.')
let moves = movesInput.split('\n').flatMap(l => l.split(''))

executeMoves(map, moves)

console.log(
    evaluateGPS(map)
)

let expansion = {
    '#': ['#', '#'],
    '.': ['.', '.'],
    'O': ['[', ']'],
    '@': ['@', '.']
}

let newMapInput = mapInput
    .split('\n')
    .map(line => line.split('').flatMap(x => expansion[x]).join(''))
    .join('\n')

let map2 = parseMapIntoList(newMapInput).filter(p => p.c != '.')

executeMoves2(map2, moves)

console.log(
    evaluateGPS(map2, '[')
)
