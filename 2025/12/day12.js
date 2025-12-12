const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

let parts = input.split('\n\n')

let list = parts.pop().split('\n').map(r => {
    let p = r.split(' ')
    let f = p.shift()
    f = f.substring(0, f.length - 1)
    f = f.split('x').map(v => Number.parseInt(v))
    return [f, p.map(v => Number.parseInt(v))]
})

let presents = parts.map(b => {
    let r = b.split('\n')
    let id = r.shift()
    id = Number.parseInt(id.substring(0, 1))
    return [id, r.map(v => v.split(''))]
})

let ps = presents.map(p => p[1]).map(r => r.map(x => x.filter(v => v == '#').length).reduce((p, c) => p + c))

let sensibleList = list.filter(i => i[0][0] * i[0][1] >= i[1].map((v, i) => v * ps[i]).reduce((p, c) => p + c))

function matrixToCoordinates(matrix) {
    let points = []
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] == '#') points.push([x, y])
        }
    }
    return points
}

function rotate(coords) {
    return coords.map(([x, y]) => [2 - y, x])
}

function flip(coords) {
    return coords.map(([x, y]) => [2 - x, y])
}

coreShapes = presents.map(p => matrixToCoordinates(p[1]))

let shapeOptions = coreShapes.map(s =>
    [
        s, rotate(s), rotate(rotate(s)), rotate(rotate(rotate(s))),
        flip(s), rotate(flip(s)), rotate(rotate(flip(s))), rotate(rotate(rotate(flip(s))))
    ]
)

function hashShape(shape) {
    let hash = ""
    for (let y = 0; y < 3; y++) {
        let row = ''
        for (let x = 0; x < 3; x++) {
            if (shape.some(v => v[0] == x && v[1] == y)) {
                row += '#'
            } else {
                row += '.'
            }
        }
        hash += row
    }
    return hash
}

function uniqueOptions(shapeOptions) {
    let uo = []
    let hashes = new Set()
    for (const o of shapeOptions) {
        if (!hashes.has(hashShape(o))) {
            uo.push(o)
            hashes.add(hashShape(o))
        }
    }
    return uo
}

const uniqueShapeOptions = shapeOptions.map(so => uniqueOptions(so))

console.log(sensibleList.length)
