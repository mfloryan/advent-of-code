const { loadLines } = require('../input')

let lines = loadLines('16/input.txt')

function parseLine(line) {
    let [v, t] = line.split("; ")
    v = v.split(" ")
    if (t.includes("leads ")) {
        t = t.substring(22).split(', ')
    } else {
        t = t.substring(23).split(', ')
    }
    r = v[4].split('=')
    return {
        valve: { id: v[1], flow: parseInt(r[1]), open: false },
        tunnels: t,
    }
}

// lines = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
// Valve BB has flow rate=13; tunnels lead to valves CC, AA
// Valve CC has flow rate=2; tunnels lead to valves DD, BB
// Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
// Valve EE has flow rate=3; tunnels lead to valves FF, DD
// Valve FF has flow rate=0; tunnels lead to valves EE, GG
// Valve GG has flow rate=0; tunnels lead to valves FF, HH
// Valve HH has flow rate=22; tunnel leads to valve GG
// Valve II has flow rate=0; tunnels lead to valves AA, JJ
// Valve JJ has flow rate=21; tunnel leads to valve II`.split('\n')

let data = lines.map(parseLine)

let pathMemory = {}

function shortestPath(start, end) {
    let queue = [start];
    let visited = new Set();
    let predecessor = new Map();
    visited.add(start);

    while (queue.length > 0) {
        let currentNode = queue.shift();
        if (currentNode === end) {
            let path = [end];
            while (currentNode !== start) {
                path.unshift(predecessor.get(currentNode));
                currentNode = predecessor.get(currentNode);
            }
            return path;
        }

        // Add the neighbors to the queue if they have not been visited
        for (let neighbor of currentNode.next) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                predecessor.set(neighbor, currentNode);
                queue.push(neighbor);
            }
        }
    }

    return null;
}

function shortestPathWithMemory(start,end) {
    let cacheIndex = `${start.id}${end.id}`

    if (pathMemory[cacheIndex]) {
        return pathMemory[cacheIndex]
    } else {
        let result = shortestPath(start,end)
        pathMemory[cacheIndex] = result
        return result
    }
}

function exploreOptions(nodes, start, time = 30, total_preassure = 0, open = [], level = 0) {
    if (time <= 0) {
        return total_preassure
    }

    let options = nodes.filter(n => n.flow > 0).filter(n => !open.includes(n.id))
    let v = [total_preassure]
    for (const option of options) {
        let path = shortestPathWithMemory(start, option)
        let timeToOther = path.map(x => x.id).length - 1
        let newPressure = total_preassure + (time - timeToOther - 1) * option.flow
        v.push(exploreOptions(
            nodes,
            option,
            time - timeToOther - 1,
            newPressure,
            [...open, option.id],
            level + 1))
    }

    return v.reduce((p, c) => Math.max(p, c), 0)
}

let nodes = data.map(root => { return { id: root.valve.id, flow: root.valve.flow, open: root.valve.open, next: [] } })
data.forEach(n => {
    node = nodes.find(gn => gn.id == n.valve.id)
    n.tunnels.forEach(t => {
        next = nodes.find(gn => gn.id == t)
        node.next.push(next)
    })
})

let startNode = nodes.find(n => n.id == "AA")
console.log(exploreOptions(nodes, startNode))
