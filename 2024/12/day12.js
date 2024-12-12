const fs = require('fs')
const path = require('path')
const assert = require('assert')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

function parseMapIntoList(input) {
    return input
        .split('\n')
        .flatMap(
            (l, row) => l.split('')
                .map((c, col) => { return { c: c, x: col, y: row } }))
}

const directions = {
    'E': { x: 1, y: 0 },
    'S': { x: 0, y: 1 },
    'N': { x: 0, y: -1 },
    'W': { x: -1, y: 0 }
}

function getBounds(map) {
    return map.reduce((p, c) => {
        return { x: Math.max(p.x, c.x), y: Math.max(p.y, c.y) }
    },
        { x: 0, y: 0 })
}

function checkBounds(p, bounds) {
    return p.x >= 0 && p.y >= 0 && p.x <= bounds.x && p.y <= bounds.y
}

function addPoints(a, b) {
    return { x: a.x + b.x, y: a.y + b.y }
}


function expandRegion(start, map, bounds) {
    let visited = new Set()
    let region = []
    let queue = []
    queue.push(start)
    while (queue.length > 0) {
        let current = queue.shift()
        if (visited.has(`${current.x}:${current.y}`)) continue
        region.push(current)
        visited.add(`${current.x}:${current.y}`)

        let nextSteps = Object.values(directions)
            .map(d => addPoints(d, current))
            .filter(p => checkBounds(p, bounds))
            .filter(p => !visited.has(`${p.x}:${p.y}`))
            .filter(p => map[p.y][p.x] == map[start.y][start.x])

        queue.push(...nextSteps)
    }

    return region
}

function getAllRegions(listMap, map, bounds) {
    let availablePoints = [...listMap]
    let regions = []

    while (availablePoints.length > 0) {
        let region = expandRegion(availablePoints[0], map, bounds)
        regions.push(region)
        availablePoints = availablePoints.filter(p => !region.some(ap => p.x == ap.x && p.y == ap.y))
    }

    return regions
}

function calculateFencePrice(region) {
    let peri = 0
    for (const point of region) {
        let around = Object.values(directions)
            .map(d => addPoints(d, point))
        let isEdge = around.filter(p => !region.some(rp => rp.x == p.x && rp.y == p.y)).length

        peri += isEdge
    }
    return region.length * peri
}

function printRegion(region) {
    let dim = region.reduce((p, c) => [
        Math.min(p[0], c.x),
        Math.max(p[1], c.x),
        Math.min(p[2], c.y),
        Math.max(p[3], c.y)], [Infinity, -Infinity, Infinity, -Infinity])

    console.log(dim)

    let regionPic = []
    for (let y = dim[2]; y <= dim[3]; y++) {
        let line = []
        for (let x = dim[0]; x <= dim[1]; x++) {


            if (region.some(p => p.x == x && p.y == y)) {
                line.push(region[0].c)
            } else {
                line.push(' ')
            }
        }
        regionPic.push(line.join(''))
    }
    console.log(regionPic.join('\n'))
}

function calculateDiscountedPrice(region) {

    let externalPoints = []
    for (const point of region) {
        let around = Object.keys(directions)
            .map(d => {
                x = addPoints(directions[d], point)
                x.d = d
                return x
            }
            )
        let pointAround = around.filter(p => !region.some(rp => rp.x == p.x && rp.y == p.y))
        externalPoints.push(...pointAround.map(p => { return { x: point.x, y: point.y, d: p.d } }))
    }

    let sides = []
    while (externalPoints.length > 0) {
        let point = externalPoints.shift()

        let matchingSide =
            sides
                .filter(side => side.length > 0)
                .filter(side => side[0].d == point.d)
                .filter(side =>
                    (point.d == 'N' && side.some(p => p.y == point.y && Math.abs(p.x - point.x) == 1)) ||
                    (point.d == 'S' && side.some(p => p.y == point.y && Math.abs(p.x - point.x) == 1)) ||
                    (point.d == 'E' && side.some(p => p.x == point.x && Math.abs(p.y - point.y) == 1)) ||
                    (point.d == 'W' && side.some(p => p.x == point.x && Math.abs(p.y - point.y) == 1))
                )
        if (matchingSide.length > 1) {
            matchingSide[0].push(point, ...matchingSide[1].splice(0))
        } else if (matchingSide.length == 1) {
            matchingSide[0].push(point)
        } else {
            sides.push([point])
        }
    }

    let numberOfSides = sides.filter(side => side.length > 0).length
    return region.length * numberOfSides
}


function evaluate(input) {
    let map = parseMapIntoList(input)
    let map2 = input.split('\n').map(l => l.split(''))
    let bounds = getBounds(map)

    let regions = getAllRegions(map, map2, bounds)
    return [regions.map(r => calculateFencePrice(r)).reduce((p, c) => p + c),
    regions.map(r => calculateDiscountedPrice
        (r)).reduce((p, c) => p + c)]
}


console.log(evaluate(input))

input = `AAAA
BBCD
BBCC
EEEC`

assert.deepEqual(evaluate(input), [140, 80])

input = `OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`

assert.deepEqual(evaluate(input), [772, 436])

input = `EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`
assert.deepEqual(evaluate(input), [692, 236])

input = `AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`

assert.deepEqual(evaluate(input), [1184, 368])

input = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`

assert.deepEqual(evaluate(input), [1930, 1206])
