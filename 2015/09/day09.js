const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

// input = `London to Dublin = 464
// London to Belfast = 518
// Dublin to Belfast = 141`

function parseLine(line) {
    let chunks = line.split(" ")
    return {
        from: chunks[0],
        to: chunks[2],
        distance: parseInt(chunks[4])
    }
}

let map = input.split('\n').map(line => parseLine(line))

let nodes = new Set(map.flatMap(n => [n.from, n.to]))

let adjencyMatrix = [];
for (const fromNode of nodes) {
    let nodeLine = []
    for (const toNode of nodes) {
        if (fromNode == toNode) {
            nodeLine.push(0)
            continue;
        }
        let connection = map.find(n => n.from == fromNode && n.to == toNode)
        if (connection) {
            nodeLine.push(connection.distance)
        } else {
            connection = map.find(n => n.to == fromNode && n.from == toNode)
            nodeLine.push(connection ? connection.distance : 0)
        }
    }
    adjencyMatrix.push(nodeLine)
}

function findOptimalPath(distances, shortest = true) {

    let optimalDistance = shortest?Infinity:0;
    let optimalPath = []

    let distanceTest = shortest? (a, b) => a < b: (a, b) => a > b
    let sort = shortest? (a,b) => a.d - b.d: (a,b) => b.d - a.d

    for (let i = 0; i < distances.length; i++) {
        let visited = [i]
        let path = [i]
        let distance = 0

        while (path.length < distances.length) {
            let nextCity = distances[path[path.length - 1]]
                .map((v,i) => {return {i, d:v}})
                .filter(v => !visited.includes(v.i))
                .toSorted(sort)[0]

            path.push(nextCity.i)
            visited.push(nextCity.i)
            distance += nextCity.d
        }

        if (distanceTest(distance,optimalDistance)) {
            optimalDistance = distance
            optimalPath = [...path]
        }
    }

    return { distance: optimalDistance, path: optimalPath }
}

console.log(findOptimalPath(adjencyMatrix, true))
console.log(findOptimalPath(adjencyMatrix, false))
