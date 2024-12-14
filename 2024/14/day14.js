const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

let parse = (line) => {
    [p, v] = line.split(' ')
    return {
        p: p.substring(2).split(',').map(Number),
        v: v.substring(2).split(',').map(Number),
    }
}

function moveRobot(r, size) {
    np = [r.p[0] + r.v[0], r.p[1] + r.v[1]]

    if (np[0] + 1 > size[0]) np[0] = np[0] % size[0]
    if (np[1] + 1 > size[1]) np[1] = np[1] % size[1]
    if (np[0] < 0) np[0] = (size[0]) + np[0]
    if (np[1] < 0) np[1] = (size[1]) + np[1]
    return {
        p: np,
        v: r.v
    }
}

function countQuadrants(robots, size) {
    let mid = [Math.floor(size[0] / 2), Math.floor(size[1] / 2)]
    let q = [
        robots.filter(r => r.p[0] < mid[0] && r.p[1] < mid[1]).length,
        robots.filter(r => r.p[0] > mid[0] && r.p[1] < mid[1]).length,
        robots.filter(r => r.p[0] < mid[0] && r.p[1] > mid[1]).length,
        robots.filter(r => r.p[0] > mid[0] && r.p[1] > mid[1]).length,
    ]
    return q.reduce((p, c) => p * c)
}

let simulate = (robots, size, moves) => {
    let newRobots = robots
    for (let i = 0; i < moves; i++) {
        newRobots = newRobots.map(r => moveRobot(r, size))
    }
    return newRobots
}

function calculateEntropy(robots, size) {
    const positionCounts = new Map();
    const totalRobots = robots.length;

    for (const robot of robots) {
        const posKey = `${robot.p[0]},${robot.p[1]}`;
        positionCounts.set(posKey, (positionCounts.get(posKey) || 0) + 1);
    }

    const probabilities = Array.from(positionCounts.values())
        .map(count => count / totalRobots);

    const entropy = -probabilities.reduce((sum, p) =>
        sum + p * Math.log2(p), 0);

    let avgDistance = 0;
    let pairCount = 0;

    for (let i = 0; i < robots.length; i++) {
        for (let j = i + 1; j < robots.length; j++) {
            const [x1, y1] = robots[i].p;
            const [x2, y2] = robots[j].p;

            const dx = Math.min(
                Math.abs(x1 - x2),
                size[0] - Math.abs(x1 - x2)
            );
            const dy = Math.min(
                Math.abs(y1 - y2),
                size[1] - Math.abs(y1 - y2)
            );

            avgDistance += Math.sqrt(dx * dx + dy * dy);
            pairCount++;
        }
    }

    if (pairCount > 0) {
        avgDistance /= pairCount;
    }

    return entropy * avgDistance;
}


let findChristmas = (robots, size) => {

    let newRobots = robots
    let ent = []
    for (let i = 0; i < 100; i++) {
        newRobots = newRobots.map(r => moveRobot(r, size))
        ent.push(calculateEntropy(newRobots, size))
    }
    let threshold = (ent.reduce((p, c) => p + c) / ent.length) * 0.8

    let moves = 0
    let christmas = false
    newRobots = robots
    do {
        newRobots = newRobots.map(r => moveRobot(r, size))
        moves++
        if (calculateEntropy(newRobots, size) < threshold) {
            printRobots(newRobots, size)
            christmas = true
        }

    } while (!christmas)
    return moves
}

let printRobots = (robots, size) => {
    for (let y = 0; y < size[1]; y++) {
        let line = []
        for (let x = 0; x < size[0]; x++) {
            if (robots.some(r => r.p[0] == x && r.p[1] == y)) {
                line.push('x')
            } else {
                line.push('.')
            }
        }
        console.log(line.join(''))
    }
}

// input = `p=0,4 v=3,-3
// p=6,3 v=-1,-3
// p=10,3 v=-1,2
// p=2,0 v=2,-1
// p=0,0 v=1,3
// p=3,0 v=-2,-2
// p=7,6 v=-1,-3
// p=3,0 v=-1,-2
// p=9,3 v=2,3
// p=7,3 v=-1,2
// p=2,4 v=2,-3
// p=9,5 v=-3,-3`

let data = input.split('\n').map(parse)
size = [101, 103]

console.log(
    countQuadrants(
        simulate(data, size, 100), size
    )
)

console.log(
    findChristmas(data, size)
)
