const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function parse(line) {
    let [a, b] = line.split(': ')
    return [a, b.split(' ')]
}

let data = input.split('\n').map(parse)

function generateDotFile(data) {
    console.log('graph f {')

    for (let c of data) {
        for (let c2 of c[1]) {
            console.log(` ${c[0]} -- ${c2}`)
        }
    }
    console.log('}')
}

let pairs = []

for (let c of data) {
    for (let c2 of c[1]) {
        pairs.push([c[0], c2])
    }
}

let g1 = new Set()
let g2 = new Set()

let cutPairs = pairs.filter(p => {
    let [p1, p2] = p
    if ((p1 == 'gzr' && p2 == 'qnz') || (p2 == 'gzr' && p1 == 'qnz')) return false;
    if ((p1 == 'hgk' && p2 == 'pgz') || (p2 == 'hgk' && p1 == 'pgz')) return false;
    if ((p1 == 'lmj' && p2 == 'xgs') || (p2 == 'lmj' && p1 == 'xgs')) return false;
    return true
})

let p1 = cutPairs.pop()
g1.add(p1[0])
g1.add(p1[1])

let cut = 0
do {
    cut = 0
    for (let [index, p] of cutPairs.entries()) {
        let [p1, p2] = p
        if (g1.has(p1)) {
            g1.add(p2)
            cut++
            cutPairs.splice(index, 1); break;
        } else if (g1.has(p2)) {
            g1.add(p1)
            cut++
            cutPairs.splice(index, 1); break;
        }
    }
} while (cut > 0)

for (let p of cutPairs) {
    let [p1, p2] = p
    g2.add(p1)
    g2.add(p2)
}

console.log(g1.size * g2.size)
