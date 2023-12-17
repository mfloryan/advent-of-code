const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

const moves = {
    '>': { x: 1, y: 0 },
    'v': { x: 0, y: 1 },
    '^': { x: 0, y: -1 },
    '<': { x: -1, y: 0 },
}

const apply = (p1, p2) => { return { x: p1.x + p2.x, y: p1.y + p2.y } }

function inCity(city, point) {
    return point.x >= 0 && point.y >= 0 && point.x < city[0].length && point.y < city[0].length
}

function createGraph(city, possibleNodes) {
    let graph = new Map()

    for (const node of possibleNodes) {
        for (const direction of Object.keys(moves)) {
            if (moves[node.d].x == moves[direction].x || moves[node.d].y == moves[direction].y) continue
            let heat = 0
            let next = node
            for (let i = 0; i < 3; i++) {
                next = apply(next, moves[direction])
                if (inCity(city, next)) {
                    heat += city[next.y][next.x].c
                    let newNode = possibleNodes.find(_ => _.x == next.x && _.y == next.y && _.d == direction)
                    if (!graph.get(node)) graph.set(node, [])
                    graph.get(node).push([newNode, heat])
                }
            }
        }
    }

    return graph
}

class PriorityQueue {
    constructor() {
        this.storage = []
    }

    enqueue(node, distance) {
        this.storage.push([node, distance])
    }

    dequeue() {
        this.storage.sort((a, b) => a[1] - b[1])
        let r = this.storage.shift()
        return r[0]
    }

    size() {
        return this.storage.length
    }
}

function dijkstra(graph, start, end) {
    // Create a map for storing the distance to each node
    const distances = new Map();
    for (const node of graph.keys()) {
        distances.set(node, Infinity);
    }
    distances.set(start, 0);

    // Create a set for storing visited nodes
    const visited = new Set();

    // Create a priority queue for storing nodes to visit
    const queue = new PriorityQueue()
    queue.enqueue(start, 0);

    // While there are nodes to visit
    while (queue.size() > 0) {
        // Get the next node with the smallest distance
        const node = queue.dequeue();

        // If the node has not been visited
        if (!visited.has(node)) {
            // Mark the node as visited
            visited.add(node);

            // Visit the node's neighbors
            for (const neighbor of graph.get(node)) {
                // Calculate the distance to the neighbor
                const distance = distances.get(node) + neighbor[1];

                // If the calculated distance is smaller than the current distance
                if (distance < distances.get(neighbor[0])) {
                    // Update the distance for the neighbor
                    distances.set(neighbor[0], distance);

                    // Add the neighbor to the queue
                    queue.enqueue(neighbor[0], distance);
                }
            }
        }
    }

    // Return the distance to the end node
    return distances.get(end);
}



// input = `2413432311323
// 3215453535623
// 3255245654254
// 3446585845452
// 4546657867536
// 1438598798454
// 4457876987766
// 3637877979653
// 4654967986887
// 4564679986453
// 1224686865563
// 2546548887735
// 4322674655533`


let city = input.split('\n').map(r => r.split('').map(_ => { return { c: parseInt(_) } }))

let possibleNodes = city.flatMap((r, y) => r.flatMap((_, x) => Object.keys(moves).map(move => { return { x, y, h: _.c, d: move } })))

let graph = createGraph(city, possibleNodes)

let part1 = Infinity
for (const start of possibleNodes.filter(_ => _.x == 0 && _.y == 0)) {
    for (const end of possibleNodes.filter(_ => _.x == city[0].length - 1 && _.y == city.length - 1)) {
        part1 = Math.min(dijkstra(graph, start, end), part1)
    }
}
console.log(part1)
