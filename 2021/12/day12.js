const { loadLines, loadNumbers } = require('../input')
let lines = loadLines('12/input.txt')

// lines = `start-A
// start-b
// A-c
// A-b
// b-d
// A-end
// b-end`.split('\n')

function buildGraph(input) {
    let graph = [];
    for (let i = 0; i < input.length; i++) {
        [n1, n2] = input[i].split('-')
        let node1 = graph.find(n => n.name == n1);
        let node2 = graph.find(n => n.name == n2);
        if (!node1) {
            node1 = {name: n1, c: []}
            node1.big = (n1[0].toUpperCase() == n1[0]);
            graph.push(node1)
        }
        if (!node2) {
            node2 = {name: n2, c: []}
            node2.big = (n2[0].toUpperCase() == n2[0]);
            graph.push(node2)
        }
        node1.c.push(node2)
        node2.c.push(node1)
    }
    return graph
}

function canVisitAgain(allPrevious, next) {
    if (next.big) return true;
    return !allPrevious.some(n => n.name == next.name)
}

function canVisitAgainNewRules(allPrevious, next) {
    if (next.name == 'start') return false;
    if (next.big) return true;
    let p = allPrevious.filter(n => n.name == next.name)
    //is there _any_ small visited 2x
    let isDoubleSmall = Object.values(allPrevious.filter(p => p.name != 'start' && !p.big).map(n => n.name).reduce((p,c) => {
        if (p[c]) p[c]++; else p[c]=1; return p;
    }, {})).some( v => v > 1)

    return (isDoubleSmall?p.length < 1:p.length <2);
}

function findPaths(graph, start, visited, allPaths, visitingRules) {
    visited.push(start);
    if (start.name == 'end') {
        allPaths.push(visited.map(n => n.name))
        return;
    }
    start.c.forEach(n => {
        if (visitingRules(visited, n)) findPaths(graph, n, visited.slice(), allPaths, visitingRules)
    })
}

let g = buildGraph(lines);

let allPaths = []
findPaths(g, g.find(n => n.name == 'start'), [], allPaths, canVisitAgain)

console.log(allPaths.length)

let allPaths2 = []
findPaths(g, g.find(n => n.name == 'start'), [], allPaths2, canVisitAgainNewRules)
console.log(allPaths2.length)
