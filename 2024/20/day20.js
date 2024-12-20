const fs = require('fs')
const path = require('path')

function parseMapIntoList(input) {
    return input
        .split('\n')
        .flatMap(
            (l, row) => l.split('')
                .map((c, col) => { return { c: c, x: col, y: row } }))
}

const same = (a, b) => a[0] == b[0] && a[1] == b[1]
const add = (a, b) => [a[0] + b[0], a[1] + b[1]]

const around = [
    [1, 0], [0, 1], [-1, 0], [0, -1]
]

function walkMaze(maze, start, end) {
    let visited = new Set();
    let queue = [];
    let parents = new Map();

    queue.push(start);
    visited.add(`${start[0]}:${start[1]}`);

    while (queue.length > 0) {
        let point = queue.shift();

        if (same(point, end)) {
            let path = [];
            let current = point;
            while (current) {
                path.unshift(current);
                current = parents.get(`${current[0]}:${current[1]}`);
            }
            return path;
        }

        let next = around
            .map(p => add(point, p))
            .filter(p => p[0] >= 0 && p[0] < maze[0].length && p[1] >= 0 && p[1] < maze.length)
            .filter(p => maze[p[1]][p[0]] !== '#')
            .filter(p => !visited.has(`${p[0]}:${p[1]}`));

        for (const nextPoint of next) {
            queue.push(nextPoint);
            visited.add(`${nextPoint[0]}:${nextPoint[1]}`);
            parents.set(`${nextPoint[0]}:${nextPoint[1]}`, point);
        }
    }

    return [];
}

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

// input = `###############
// #...#...#.....#
// #.#.#.#.#.###.#
// #S#...#.#.#...#
// #######.#.#.###
// #######.#.#...#
// #######.#.###.#
// ###..E#...#...#
// ###.#######.###
// #...###...#...#
// #.#####.#.###.#
// #.#...#.#.#...#
// #.#.#.#.#.#.###
// #...#...#...###
// ###############`

let data = input.split('\n').map(l => l.split(''))
let list = parseMapIntoList(input)
let start = list.find(p => p.c == 'S')
let end = list.find(p => p.c == 'E')

let normalWin = walkMaze(data, [start.x, start.y], [end.x, end.y]).length - 1

let options = 0
for (let x = 1; x < data[0].length - 1; x++) {
    for (let y = 1; y < data.length - 1; y++) {
        if (data[y][x] == '#') {
            data[y][x] = '.'
            let cheatWin = walkMaze(data, [start.x, start.y], [end.x, end.y]).length - 1
            if (cheatWin < normalWin) {
                if (normalWin - cheatWin >= 100) options++
            }
            data[y][x] = '#'
        }
    }
}

console.log(options)
