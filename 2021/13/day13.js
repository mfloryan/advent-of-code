const fs = require('fs')
const path = require('path')
var _ = require('lodash')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' }).split("\n\n")

// input = `6,10
// 0,14
// 9,10
// 0,3
// 10,4
// 4,11
// 6,0
// 6,12
// 4,1
// 0,13
// 10,12
// 3,4
// 3,0
// 8,4
// 1,10
// 2,14
// 8,10
// 9,0

// fold along y=7
// fold along x=5`.split('\n\n')

let dots = input[0].split('\n').map(l => l.split(',').map(n => Number.parseInt(n))).map(d => { return {x:d[0], y:d[1]}})
let folds = input[1].split('\n').map(l => { let x = l.split(' ')[2].split('='); return {a:x[0], v:Number.parseInt(x[1])}})

// console.log(dots)
// console.log(folds)

function fold(dots, foldLine) {
    let newDots = [];
    dots.forEach(d => {
        if (foldLine.a == 'x') {
            if (d.x > foldLine.v) newDots.push( {x: d.x + 2 * (foldLine.v - d.x), y: d.y})
            else newDots.push(d)
        } else {
            if (d.y > foldLine.v) newDots.push( {x: d.x,  y: d.y + 2 * (foldLine.v - d.y)})
            else newDots.push(d)
        }
    })
    return newDots;
}


let d2 = fold(dots, folds[0])

console.log( _.uniqWith(d2, (a,b) => a.x == b.x && a.y == b.y).length)

let code = folds.reduce( (p,c) => { return fold(p, c) }, dots)

let dim = code.reduce( (p,c) => {return {mx: Math.max(c.x, p.mx) , my: Math.max(c.y, p.my) }}, {mx:0, my:0})
console.log(dim)

let picture = []
for (let y =0; y <= dim.my; y++) {
    let line = new Array(dim.mx).fill('.')
    picture.push(line)
}

code.forEach(d => {
    picture[d.y][d.x] = '◻️'
})
console.log(picture.map(l => l.join('')).join('\n'))