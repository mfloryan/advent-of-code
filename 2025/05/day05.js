const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

let parts = input.split('\n\n')
let db = parts[0].split('\n').map(r => r.split('-').map(v => Number.parseInt(v)))
let ingredients = parts[1].split('\n').map(v => Number.parseInt(v))

function isFresh(ingredient, database) {
    for (const range of database) {
        if (ingredient >= range[0] && ingredient <= range[1]) return true
    }
    return false
}

console.log(
    ingredients.filter(v => isFresh(v, db)).length
)


function isOverlap(r1, r2) {
    return r1[0] <= r2[1] && r2[0] <= r1[1]
}

function removeOverlap(r1, r2) {
    return [Math.min(r1[0], r2[0]), Math.max(r1[1], r2[1])]
}

ranges = db.toSorted((a, b) => a[0] - b[0])

let overlap = false

do {
    let newRanges = []
    overlap = false

    while (ranges.length > 1) {
        r1 = ranges.shift()
        r2 = ranges.shift()
        if (isOverlap(r1, r2)) {
            newRanges.push(removeOverlap(r1, r2))
            overlap = true
        } else {
            newRanges.push(r1)
            ranges.unshift(r2)
        }
    }

    if (ranges.length > 0) {
        newRanges.push(ranges.pop())
    }

    ranges = newRanges
} while (overlap)


console.log(
    ranges
        .map(r => r[1] - r[0] + 1)
        .reduce((p, c) => p + c, 0)
)
