const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

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


let data = input.split('\n').map(l => l.split(',').map(Number))
let memory = new Array(71).fill(0).map(a => new Array(71).fill('.'))

for (let i = 0; i < 1024; i++) {
    let m = data[i]
    memory[m[1]][m[0]] = '#'
}

let mazePath = walkMaze(memory, [0, 0], [70, 70])
console.log(mazePath.length - 1)

memory = new Array(71).fill(0).map(a => new Array(71).fill('.'))

let dataFeed = [...data]
let byte
do {
    byte = dataFeed.shift()
    memory[byte[1]][byte[0]] = '#'
    mazePath = walkMaze(memory, [0, 0], [70, 70])
} while (mazePath.length != 0)

console.log(byte.join(','))
