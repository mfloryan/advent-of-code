const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

const nKeypad = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    [null, '0', 'A']
]

const dKeypad = [
    [null, '^', 'A'],
    ['<', 'v', '>']
]

const around = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
]

const add = (a, b) => { return { x: a.x + b.x, y: a.y + b.y } }
const identity = m => m

function findAround(button, keyboardMap) {
    let b = keyboardMap.find(_ => _.v == button)
    let a = around.map(a => add(a, b)).map(_ => keyboardMap.find(p => p.x == _.x && p.y == _.y)).filter(identity).map(v => v.v)
    return a
}

function findShortestPaths(start, end, keyboardMap) {
    let queue = [];

    queue.push({
        b: start,
        v: new Set(start),
        p: []
    });

    let allPaths = [];

    while (queue.length > 0) {
        let button = queue.shift();

        if (button.b == end) {
            allPaths.push(button.p)
        }

        let next = findAround(button.b, keyboardMap)
            .filter(p => !button.v.has(p));

        for (const nextButton of next) {
            button.v.add(nextButton)
            queue.push({
                b: nextButton,
                p: [...button.p, nextButton],
                v: new Set([...button.v])
            });
        }
    }

    let minPath = allPaths.map(p => p.length).reduce((p, c) => Math.min(p, c))
    return allPaths.filter(p => p.length == minPath);
}

function pathToMoves(start, path, keyboardMap) {
    let moves = []
    path.reduce((p, c) => {
        let pp = keyboardMap.find(_ => _.v == p)
        let cp = keyboardMap.find(_ => _.v == c)
        let diff = { dx: cp.x - pp.x, dy: cp.y - pp.y }
        if (diff.dx == 1) moves.push('>')
        if (diff.dx == -1) moves.push('<')
        if (diff.dy == 1) moves.push('v')
        if (diff.dy == -1) moves.push('^')
        return c
    }, start)
    return moves.join('')
}


function createBigOptionSpace(keyboards) {
    let bigOptionSpace = []

    for (const k of keyboards) {
        let numKeys = k.flatMap(identity).filter(identity)
        let numKeysMap = k.flatMap((r, y) => r.map((v, x) => { return { v, x, y } })).filter(v => v.v)

        for (let i = 0; i < numKeys.length; i++) {
            for (let j = 0; j < numKeys.length; j++) {
                if (i == j) continue
                bigOptionSpace.push({
                    pair: [numKeys[i], numKeys[j]],
                    paths: findShortestPaths(numKeys[i], numKeys[j], numKeysMap).map(p => pathToMoves(numKeys[i], p, numKeysMap))
                })
            }
        }
    }

    return bigOptionSpace
}

function createOptions(start, sequence, bigOptionSpace, options, currentSequence = '') {
    if (sequence.length == 0) {
        options.push(currentSequence)
        return
    }
    if (start == sequence[0]) {
        createOptions(sequence[0], sequence.slice(1), bigOptionSpace, options, currentSequence + 'A')
    } else {
        let next = bigOptionSpace.find(v => v.pair[0] == start && v.pair[1] == sequence[0]).paths
        for (const n of next) {
            createOptions(sequence[0], sequence.slice(1), bigOptionSpace, options, currentSequence + n + 'A')
        }
    }
}

function findShortestSequnceOfMoves(code, bigOptionSpace) {
    let allPaths = new Array(4).fill(0).map(a => new Array())
    allPaths[0] = [code]

    for (let i=0; i < 3; i++) {
        for (const p of allPaths[i]) {
            createOptions('A', p, bigOptionSpace, allPaths[i+1])
        }
    }

    return allPaths[3].map(v => v.length).reduce((p, c) => Math.min(p, c))
}

// input = `029A
// 980A
// 179A
// 456A
// 379A`

let bigOptionSpace = createBigOptionSpace([nKeypad, dKeypad])
let data = input.split('\n').map(l => l.split(''))

console.log(
    data.map(i => {
        let shortest = findShortestSequnceOfMoves(i, bigOptionSpace)
        return shortest * parseInt(i.join(''))
    }
    ).reduce((p, c) => p + c)
)
