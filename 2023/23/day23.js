const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

const slopes = {
    '>': { x: 1, y: 0 },
    'v': { x: 0, y: 1 },
    '^': { x: 0, y: -1 },
    '<': { x: -1, y: 0 },
}

const directions = Object.values(slopes)

const apply = (p1, p2) => { return { x: p1.x + p2.x, y: p1.y + p2.y } }

function findNext(island, position) {
    if (Object.keys(slopes).includes(position.c)) {
        let next = apply(position, slopes[position.c])
        return [island[next.y][next.x]]
    }

    return directions
        .map(d => apply(d, position))
        .filter(_ => _.x >= 0 && _.y >= 0 && _.x < island[0].length && _.y < island.length)
        .filter(_ => island[_.y][_.x].c != '#')
        .map(_ => island[_.y][_.x])
}

function icyWalk(island, position, end, visited = [], paths = []) {
    if (position.x == end.x && position.y == end.y) {
        paths.push(visited.length)
        return
    }

    let next = findNext(island, position).filter(p => !visited.some(v => v.x == p.x && v.y == p.y))
    for (const n of next) {
        icyWalk(island, n, end, [...visited, position], paths)
    }
}

function findNext2(island, position) {
    return directions
        .map(d => apply(d, position))
        .filter(_ => _.x >= 0 && _.y >= 0 && _.x < island[0].length && _.y < island.length)
        .filter(_ => island[_.y][_.x].c != '#')
        .map(_ => island[_.y][_.x])
}


function createGraph(island) {
    let graph = new Map()

    for (let y = 0; y < island.length; y++) {
        for (let x = 0; x < island[0].length; x++) {
            if (island[y][x].c == '#') continue;
            let next = findNext2(island, { x, y }).map(_ => { return { p: _, d: 1 } })
            graph.set(island[y][x], next)
        }
    }

    return graph
}

function reduceGraph(g) {

    let n
    for (const key of g.keys()) {
        let next = g.get(key)
        if (next.length == 2) {
            n = key
            break
        }
    }

    if (!n) return false

    let childrenOfNodeToRemove = g.get(n)
    if (childrenOfNodeToRemove) {
        let [left, right] = childrenOfNodeToRemove;

        let leftNode = g.get(left.p)
        if (leftNode) {
            let newLeftNodeChildren = leftNode.map(_ => {
                if (_.p == n) return { p: right.p, d: _.d + right.d }
                else return _
            })
            g.set(left.p, newLeftNodeChildren)
        }

        let rightNode = g.get(right.p)
        if (rightNode) {
            let newRightNodeChildren = rightNode.map(_ => {
                if (_.p == n) return { p: left.p, d: _.d + left.d }
                else return _
            })
            g.set(right.p, newRightNodeChildren)
        }
    }
    g.delete(n)

    return true
}

function icyWalkG(graph, start, end) {
    let longest = 0
    let stack = [[start, 0, new Set([start])]]

    while (stack.length > 0) {
        let [point, steps, visited] = stack.pop();

        visited.add(point)

        if (point.x == end.x && point.y == end.y) {
            longest = Math.max(longest, steps);
            continue
        }

        graph
            .get(point)
            .filter(p => !visited.has(p.p))
            .forEach(p => stack.push([p.p, steps + p.d, new Set(visited)]))
    }

    return longest;
}

// input = `#.#####################
// #.......#########...###
// #######.#########.#.###
// ###.....#.>.>.###.#.###
// ###v#####.#v#.###.#.###
// ###.>...#.#.#.....#...#
// ###v###.#.#.#########.#
// ###...#.#.#.......#...#
// #####.#.#.#######.#.###
// #.....#.#.#.......#...#
// #.#####.#.#.#########v#
// #.#...#...#...###...>.#
// #.#.#v#######v###.###v#
// #...#.>.#...>.>.#.###.#
// #####v#.#.###v#.#.###.#
// #.....#...#...#.#.#...#
// #.#########.###.#.#.###
// #...###...#...#...#.###
// ###.###.#.###v#####v###
// #...#...#.#.>.>.#.>.###
// #.###.###.#.###.#.#v###
// #.....###...###...#...#
// #####################.#`

let island = input.split('\n').map((r, y) => r.split('').map((_, x) => { return { x, y, c: _ } }))
let flatIsland = island.flatMap(_ => _)

let start = flatIsland.find(_ => _.y == 0 && _.c == '.')
let end = flatIsland.find(_ => _.y == island.length - 1 && _.c == '.')

let paths = []
icyWalk(island, start, end, [], paths)
console.log(paths.reduce((p, c) => Math.max(p, c), -Infinity))

let g = createGraph(island)
while (reduceGraph(g)) { }
let r = icyWalkG(g, start, end)
console.log(r)
