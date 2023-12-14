const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function slideNorth(dish) {
    let moved = false

    do {
        moved = false
        for (let y = 0; y < dish.length; y++) {
            for (let x = 0; x < dish[0].length; x++) {
                let rock = dish[y][x];
                if (rock == "O") {
                    for (let ry = y; ry > 0; ry--) {
                        if (dish[ry - 1][x] == '.') {
                            dish[ry - 1][x] = 'O'
                            dish[ry][x] = '.'
                            moved = true
                        } else break
                    }
                }
            }
        }

    } while (moved)

    return dish
}

const directions = ['N', 'W', 'S', 'E']
const directionMoves = {
    'N': (x, y, dish) => {
        if (y > 0 && dish[y - 1][x] == '.') {
            dish[y - 1][x] = "O"
            dish[y][x] = "."
            return true
        }
        return false
    },
    'W': (x, y, dish) => {
        if (x > 0 && dish[y][x - 1] == '.') {
            dish[y][x - 1] = "O"
            dish[y][x] = "."
            return true
        }
        return false
    },
    'S': (x, y, dish) => {
        if (y < dish.length - 1 && dish[y + 1][x] == '.') {
            dish[y + 1][x] = "O"
            dish[y][x] = "."
            return true
        }
        return false
    },
    'E': (x, y, dish) => {
        if (x < dish[0].length - 1 && dish[y][x + 1] == '.') {
            dish[y][x + 1] = "O"
            dish[y][x] = "."
            return true
        }
        return false
    },
}

function slideDirection(dish, direction) {
    let moved = false

    do {
        moved = false
        for (let y = 0; y < dish.length; y++) {
            for (let x = 0; x < dish[0].length; x++) {
                let rock = dish[y][x]
                if (rock == "O") {
                    if (directionMoves[direction](x, y, dish)) moved = true
                }
            }
        }

    } while (moved)

    return dish
}

function countLoad(dish) {
    let load = 0;

    for (let y = 0; y < dish.length; y++) {
        for (let x = 0; x < dish[0].length; x++) {
            let rock = dish[y][x];
            if (rock == "O") {
                load += (dish.length - y)
            }
        }
    }
    return load
}

function findCycle(list) {
    let cycles = []
    for (let s = 0; s < list.length; s++) {
        for (let l = 2; l < ((list.length - s) / 2); l++) {
            let cycle = true
            for (let i = 0; i < l; i++) {
                if (list[s + i] != list[s + i + l]) {
                    cycle = false;
                    break;
                }
            }
            if (cycle == true) {
                cycles.push({ s, l })
            }
        }
    }
    return cycles
}

// input = `O....#....
// O.OO#....#
// .....##...
// OO.#O....O
// .O.....O#.
// O.#..O.#.#
// ..O..#O..O
// .......O..
// #....###..
// #OO..#....`

let dish = input.split('\n').map(row => row.split(''))

console.log(countLoad(slideNorth(dish)))

let dish2 = input.split('\n').map(row => row.split(''))

let values = []
let cycle

for (let i = 0; i < 1000000000; i++) {
    directions.forEach(d => {
        slideDirection(dish2, d)
    })
    let load = countLoad(dish2)
    values.push(load)
    let c = findCycle(values)
    if (c.length > 0) {
        cycle = { offset: c[0].s, length: c[0].l, values: values.slice(c[0].s, c[0].s + c[0].l) }
        break
    }
}

let moves = 1000000000 - 1
console.log(cycle.values[(moves - cycle.offset) % cycle.length])
