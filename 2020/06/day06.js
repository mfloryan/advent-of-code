const fs = require('fs')
const path = require('path')

let groups = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' }).split("\n\n")

let p1 = groups.map(g => new Set(g.split("\n").flatMap(r => r.split(''))).size).reduce( (p,c) => p+c,0)
console.log(p1)

let p2 = groups.map(g => g.split('\n'))
    .map(gs =>
        Object.values(gs.flatMap(
        g =>  g.split(''))
        .reduce((p,c) => { if (p[c]) p[c]++; else p[c]=1; return p}, {})
    ).filter(v => v == gs.length).length)
    .reduce((p,c) => p+c, 0)

console.log(p2)
