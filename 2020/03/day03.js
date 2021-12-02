const { loadLines } = require('../input')

let input = `..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#`

function isTree(map, position) {
    let testX = position[0] % map[0].length;
    return map[position[1]][testX] == '#'
}

function generatePositions(slope, maxY) {
    let positions = []
    let currentY = 0; let currentX = 0

    while (currentY < maxY) {
        positions.push([currentX, currentY])
        currentX += slope[0]
        currentY += slope[1]
    }

    return positions
}

let parsedMap = input.split('\n');
parsedMap = loadLines('03/input.txt')
let maxY = parsedMap.length

let slope = [3,1]
let positions = generatePositions(slope, maxY)

console.log(
    "Day 03 - part 1:",
    positions
        .map(p => isTree(parsedMap, p))
        .filter(x => x)
        .length
)

let slopes = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2]
];

console.log(
    "Day 03 - part 2:",
    slopes
        .map(s => generatePositions(s, maxY)
            .map(p => isTree(parsedMap, p))
            .filter(x => x)
            .length)
        .reduce((p,c) => p*c,1)
)