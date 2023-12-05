const fs = require('fs')
const path = require('path')

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })

// input = `seeds: 79 14 55 13

// seed-to-soil map:
// 50 98 2
// 52 50 48

// soil-to-fertilizer map:
// 0 15 37
// 37 52 2
// 39 0 15

// fertilizer-to-water map:
// 49 53 8
// 0 11 42
// 42 0 7
// 57 7 4

// water-to-light map:
// 88 18 7
// 18 25 70

// light-to-temperature map:
// 45 77 23
// 81 45 19
// 68 64 13

// temperature-to-humidity map:
// 0 69 1
// 1 0 69

// humidity-to-location map:
// 60 56 37
// 56 93 4`

let sections = input.split('\n\n')

function parseMap(map) {
    let rows = map.split('\n')
    let name = rows.shift().split(' ')[0]
    data = rows.map(r => r.split(' ').map(_ => parseInt(_)))
    return {
        name,
        data
    }
}

let seeds = sections.shift().substring(7).split(' ').map(_ => parseInt(_))
let maps = sections.map(parseMap)


function transformInRange(seed, range) {
    if (seed - range[1] >= 0 & (seed - range[1]) < range[2]) {
        return (seed - range[1] + range[0])
    }
    return false
}

function covertThroughCategory(seed, category) {
    for (let i = 0; i < category.data.length; i++) {
        rangeMap = category.data[i]
        let result = transformInRange(seed, rangeMap)
        if (result !== false) return result
    }
    return seed
}

let locations = seeds.map(seed => maps.reduce((p, c) => covertThroughCategory(p, c), seed))
console.log(locations.reduce((p, c) => Math.min(p, c)))

let minLocation = Infinity

for (let i = 0; i < seeds.length; i += 2) {
    for (let s = seeds[i]; s < seeds[i] + seeds[i + 1]; s++) {
        let l = maps.reduce((p, c) => covertThroughCategory(p, c), s)
        minLocation = Math.min(l, minLocation)
    }
}

console.log(minLocation)
