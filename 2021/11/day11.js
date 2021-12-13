const { loadLines, loadNumbers } = require('../input')
let lines = loadLines('11/input.txt')

// lines = `11111
// 19991
// 19191
// 19991
// 11111`.split('\n')

let data = lines.map(l => l.split('').map(x => Number.parseInt(x)))

function freshOctopuses(data) {
    let octopuses = [];

    for (let y = 0; y < data.length; y++) {
        for (let x = 0; x < data[y].length; x++) {
            octopuses.push({ x, y, e: data[y][x], flashed: false })
        }
    }
    return octopuses
}

const aroundMe = [
    { x: -1, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: 1, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
]

function increaseNeighbours(octopuses, octopus) {
    let around = octopuses.filter(o => 
        aroundMe
            .map(a => { return { x: a.x + octopus.x, y: a.y + octopus.y } })
            .some(ao => ao.x == o.x && ao.y == o.y) 
        && o.flashed == false)
    around.forEach(o => o.e++)
}

function simulateStep(octopuses) {
    let newOctopuses = [];
    octopuses.forEach(o => o.e++);
    while (octopuses.some(o => o.e > 9)) {
        let readyOctopus = octopuses.find(o => o.e > 9);
        readyOctopus.e = 0; readyOctopus.flashed = true;
        increaseNeighbours(octopuses, readyOctopus)
    }
    let flashes = octopuses.filter(o => o.flashed).length
    octopuses.forEach(o => o.flashed = false)
    return flashes
}

function showOs(octopuses) {
    for (let y = 0; y < 10; y++) {
        let line = [];
        for (let x = 0; x < 10; x++) {
            let o = octopuses.find(o => o.x == x && o.y == y)
            if (o) line.push(o.flashed ? "[0]" : ` ${o.e} `); else line.push(' ? ')
        }
        console.log(line.join(""))
    }
}

let octopuses = freshOctopuses(data)
let total = 0;

for (let i =0; i < 100; i++) {
    total += simulateStep(octopuses)
}

console.log(total)

octopuses = freshOctopuses(data)
let i = 0;
let flashed = 0;
do {
    i++
    flashed = simulateStep(octopuses)
} while (flashed < 100)

console.log(i)
