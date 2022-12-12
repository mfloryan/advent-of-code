const { loadLines } = require('../input')

let lines = loadLines('12/input.txt')
let map = lines.map(l => l.split(""))

let oneStepAway = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0]
]

function getPointHeight(point) {
    if (point[2] == "S") return 0;
    if (point[2] == "E") return 26;
    return point[2].charCodeAt(0) - 96;
}

function findNextStep(mapList, point) {
    let startHeight = getPointHeight(point)
    let around = oneStepAway.map(p => [p[0] + point[0], p[1] + point[1]])
    let potential =
        mapList.filter(a => around.some(b => a[0] == b[0] && a[1] == b[1]))
            .filter(p => (getPointHeight(p) - startHeight) < 2)
    return potential
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
    for (const node of graph) {
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
            for (const neighbor of findNextStep(graph, node)) {
                // Calculate the distance to the neighbor
                const distance = distances.get(node) + 1;

                // If the calculated distance is smaller than the current distance
                if (distance < distances.get(neighbor)) {
                    // Update the distance for the neighbor
                    distances.set(neighbor, distance);

                    // Add the neighbor to the queue
                    queue.enqueue(neighbor, distance);
                }
            }
        }
    }

    // Return the distance to the end node
    return distances.get(end);
}


// map = `Sabqponm
// abcryxxl
// accszExk
// acctuvwj
// abdefghi`.split('\n').map(l => l.split(''))

let mapList = map.flatMap((row, r) => row.map((p, c) => [c, r, p]))

let start = mapList.find(p => p[2] == "S")
let end = mapList.find(p => p[2] == "E")

console.log(dijkstra(mapList, start, end))

let min = Infinity
mapList.filter(p => p[2] == 'a' || p[2] == 'S').forEach(start => {
    let pathLen = dijkstra(mapList, start, end)
    min = Math.min(min, pathLen)
})
console.log(min)
