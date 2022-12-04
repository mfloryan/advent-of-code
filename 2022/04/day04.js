const { loadLines } = require('../input')

let lines = loadLines('04/input.txt')

function parseLine(line) {
    let pair = line.split(',');
    return  pair.map(r => r.split('-').map(v => parseInt(v)))
}

function hasTotalOverlap(e1, e2) {
    var longer
    var shorter
    if (e1[1]-e1[0] > e2[1]-e2[0]) {
        longer = e1
        shorter = e2
    } else {
        longer = e2
        shorter = e1
    }

    v =  shorter[0] >= longer[0] && shorter[1] <= longer[1]
    return v
}

function hasSomeOverlap(e1, e2) {
    return (e1[0] >= e2[0] && e1[0] <= e2[1]) ||
         (e1[1] >= e2[0] && e1[1] <= e2[1]) ||
         (e2[0] >= e1[0] && e2[0] <= e1[1]) ||
         (e2[1] >= e1[0] && e2[1] <= e1[1]);
}

console.log(
    lines.map(i => parseLine(i)).map(p => hasTotalOverlap(p[0],p[1])).filter(v => v).length
)

console.log(
    lines.map(i => parseLine(i)).map(p => hasSomeOverlap(p[0],p[1])).filter(v => v).length
)