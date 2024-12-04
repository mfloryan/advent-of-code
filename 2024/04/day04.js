const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

// input=`MMMSXXMASM
// MSAMXMSMSA
// AMXSXMAAMM
// MSAMASMSMX
// XMASAMXAMM
// XXAMMXXAMA
// SMSMSASXSS
// SAXAMASAAA
// MAMMMXMMMM
// MXMXAXMASX`

let map = input.split('\n').map(l => l.split(''))

function isOnMap(point, map) {
    return (point[0] >= 0 && point[1] >= 0 && point[0] < map.length && point[1] < map[0].length)
}

function collectWords(map, options) {
    return options.map(o => o.map(p => map[p[1]][p[0]])).map(w => w.join(''))
}

function testWord(map, position, configurations, word) {
    let options = configurations.map(o => o.map(p => [p[0] + position[0], p[1] + position[1]]))
    options = options.filter(o => o.every(p => isOnMap(p, map)))
    let words = collectWords(map, options)
    return words.filter(w => w == word).length    
}

function countMatches(map, configurations, word) {
    let count = 0;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            if (map[y][x] == word[0]) {
                count += testWord(map, [x, y], configurations, word)
            }
        }
    }
    return count    
}

let options = [
    [[0, 0], [1, 0], [2, 0], [3, 0]],
    [[0, 0], [-1, 0], [-2, 0], [-3, 0]],
    [[0, 0], [0, 1], [0, 2], [0, 3]],
    [[0, 0], [0, -1], [0, -2], [0, -3]],
    [[0, 0], [1, 1], [2, 2], [3, 3]],
    [[0, 0], [-1, 1], [-2, 2], [-3, 3]],
    [[0, 0], [1, -1], [2, -2], [3, -3]],
    [[0, 0], [-1, -1], [-2, -2], [-3, -3]],
]

let masOptions = [
    [[0, 0], [1, 1], [2, 2], [2, 0], [1, 1], [0, 2]],
    [[2, 2], [1, 1], [0, 0], [2, 0], [1, 1], [0, 2]],
    [[0, 0], [1, 1], [2, 2], [0, 2], [1, 1], [2, 0]],
    [[2, 2], [1, 1], [0, 0], [2, 0], [1, 1], [0, 2]],

    [[0, 0], [-1, -1], [-2, -2], [-2, 0], [-1, -1], [0, -2]],
    [[-2, -2], [-1, -1], [0, 0], [-2, 0], [-1, -1], [0, -2]],
    [[0, 0], [-1, -1], [-2, -2], [0, -2], [-1, -1], [-2, 0]],
    [[-2, -2], [-1, -1], [0, 0], [-2, 0], [-1, -1], [0, -2]],
]

console.log(countMatches(map, options, 'XMAS'))
console.log(countMatches(map, masOptions, 'MASMAS'))
