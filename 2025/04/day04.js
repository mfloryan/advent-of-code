const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

const around = [
    [-1, -1], [-1, 0], [-1, 1],
     [0, -1],           [0, 1],
     [1, -1],  [1, 0],  [1, 1],
]

function collectAround(x, y) {
    let pointAround = around.map(p => [p[0] + x, p[1] + y])
    pointAround = pointAround.filter(p => p[0] >= 0 && p[1] >= 0 && p[0] < map[0].length && p[1] < map.length)
    let collected = pointAround.map(p => map[p[1]][p[0]]).filter(p => p == '@')
    return collected.length
}

let map = input.split('\n').map(l => l.split(''))

let accessible = 0
let removed = 0
let i = 0;
do {
    i++
    removed = 0
    let newMap = structuredClone(map)
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            if (map[y][x] == '@') {
                if (collectAround(x, y) < 4) {
                    accessible++
                    newMap[y][x] = '.'
                    removed++
                }
            }
        }
    }
    map = newMap
    if (i == 1) console.log(accessible)
} while (removed > 0)

console.log(accessible)
