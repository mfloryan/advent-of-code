const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function getEmptyRows(image, max) {
    let rows = []
    for (let y = 0; y <= max.y; y++) {
        if (image.filter(_ => _.y == y).every(_ => _.c == ".")) {
            rows.push(y)
        }
    }
    return rows
}

function getEmptyColumns(image, max) {
    let cols = []
    for (let x = 0; x <= max.x; x++) {
        if (image.filter(_ => _.x == x).every(_ => _.c == ".")) {
            cols.push(x)
        }
    }
    return cols
}

function expandUniverse(galaxies, emptyRows, emptyColumns, multiplier = 1) {
    let newGalaxies = []
    for (g of galaxies) {
        newGalaxies.push(
            {
                x: g.x + (emptyColumns.filter(_ => _ < g.x).length * multiplier),
                y: g.y + (emptyRows.filter(_ => _ < g.y).length * multiplier)
            }
        )
    }
    return newGalaxies
}

function getShortestPath(a, b) {
    return (Math.abs(b.x - a.x) + Math.abs(b.y - a.y))
}

function getPairs(galaxies) {
    let pairs = []
    for (let i = 0; i < galaxies.length; i++) {
        for (let j = i + 1; j < galaxies.length; j++) {
            pairs.push([galaxies[i], galaxies[j]])
        }
    }
    return pairs
}

let image = input.split('\n').flatMap((row, y) => row.split('').map((_, x) => { return { x, y, c: _ } }))
let max = image[image.length - 1]

let emptyRows = getEmptyRows(image, max)
let emptyColumns = getEmptyColumns(image, max)

let galaxies = image.filter(_ => _.c == '#')

let sum = getPairs(expandUniverse(galaxies, emptyRows, emptyColumns)).reduce((p, c) => p + getShortestPath(c[0], c[1]), 0)
console.log(sum)

let sum2 = getPairs(expandUniverse(galaxies, emptyRows, emptyColumns, 1000000 - 1)).reduce((p, c) => p + getShortestPath(c[0], c[1]), 0)
console.log(sum2)
